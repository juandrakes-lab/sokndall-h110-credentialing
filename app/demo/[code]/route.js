import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";
import { DEMO_HOURS, DEMO_KEEP_DAYS, DEMO_UNOPENED_DAYS, JUAN_EMAIL, demoEmail, hashDemoCode } from "@/lib/demo";

// The demo link (pedido 2026-11-08): /demo/<code> signs the visitor into that
// demo account, no password. The one route outside the crons and the webhook
// that uses the service role (decision 2026-11-08): it can only ever open an
// account that has a cred_demos row — sample data, never a real customer — and
// only while that demo is live. The code is stored hashed.
//
// Opening is a POST. Opening the link (GET) only shows a page with an "Open
// the demo" button: link-preview bots (LinkedIn, Slack, email scanners) fetch
// links on their own, and a GET that opened the demo would start its 72 h and
// tell Juan it was opened before the lead ever saw it. Bots read pages; they
// don't press buttons.
export const dynamic = "force-dynamic";

const DAY = 86400000;

const page = (code) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Your Sokndall demo</title>
<meta property="og:title" content="Your Sokndall demo">
<meta property="og:description" content="A credentialing and payer-enrollment workspace loaded with sample data, yours for 3 days from when you open it.">
<meta property="og:image" content="https://sokndall.com/opengraph-image.png">
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:Arial,Helvetica,sans-serif;background:#f3f5f4;color:#0e2a2e;padding:20px;box-sizing:border-box}
main{max-width:420px;text-align:center}h1{font-size:22px;margin:18px 0 8px}p{font-size:15px;line-height:1.5;color:#45605f;margin:0 0 8px}
button{margin-top:18px;border:0;border-radius:999px;background:#0e4a52;color:#fff;font-size:15px;font-weight:600;padding:12px 26px;cursor:pointer}</style></head>
<body><main><p style="font-weight:700;color:#0e4a52;letter-spacing:.02em">SOKNDALL</p>
<h1>Your demo is ready</h1>
<p>A workspace loaded with a sample billing firm: clients, providers, payer applications and follow-ups.</p>
<p>It's yours for 3 days from when you open it. No password, no card.</p>
<form method="post" action="/demo/${encodeURIComponent(code)}"><button type="submit">Open the demo</button></form>
</main></body></html>`;

export async function GET(_request, { params }) {
  const { code } = await params;
  return new Response(page(code), { headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex, nofollow", "cache-control": "no-store" } });
}

export async function POST(request, { params }) {
  const { code } = await params;
  const origin = new URL(request.url).origin;
  const ended = (why) => NextResponse.redirect(`${origin}/demo-ended?why=${why}`, 303);

  const admin = createAdminClient();
  const { data: demo } = await admin.from("cred_demos").select("*").eq("link_hash", hashDemoCode(code)).maybeSingle();
  if (!demo || demo.revoked_at) return ended("unknown");

  const now = Date.now();
  let opened = demo;
  if (!demo.first_opened_at) {
    if (now - new Date(demo.created_at).getTime() > DEMO_UNOPENED_DAYS * DAY) return ended("unopened");
    // The seed was dated relative to the day it was created; move it to today
    // so the prepared moments land relative to this first open.
    const shift = Math.round((now - new Date(demo.seeded_at).getTime()) / DAY);
    if (shift !== 0) await admin.rpc("cred_demo_shift", { p_org: demo.org_id, p_days: shift });
    const { data: updated } = await admin
      .from("cred_demos")
      .update({ first_opened_at: new Date(now).toISOString(), expires_at: new Date(now + DEMO_HOURS * 3600000).toISOString(), last_seen_at: new Date(now).toISOString() })
      .eq("org_id", demo.org_id)
      .is("first_opened_at", null)
      .select("*")
      .maybeSingle();
    if (updated) {
      opened = updated;
      // "{Firm} opened its demo" — never in the visitor's way.
      sendEmail({
        to: JUAN_EMAIL,
        ...demoEmail(`${demo.firm} opened its Sokndall demo`, [
          `${demo.lead_name ?? "The lead"} (${demo.firm}) opened the demo just now.`,
          `It runs until ${new Date(updated.expires_at).toUTCString()}.`,
        ]),
      }).catch(() => {});
    } else {
      opened = (await admin.from("cred_demos").select("*").eq("org_id", demo.org_id).single()).data;
    }
  } else if (now > new Date(demo.expires_at).getTime() + DEMO_KEEP_DAYS * DAY) {
    return ended("deleted");
  }

  // Sign in as the demo's own user (created by scripts/demo.mjs, sample data).
  const { data: org } = await admin.from("cred_organizations").select("owner_user_id").eq("id", opened.org_id).single();
  const { data: owner } = await admin.auth.admin.getUserById(org.owner_user_id);
  const { data: link, error } = await admin.auth.admin.generateLink({ type: "magiclink", email: owner.user.email });
  if (error) return ended("error");
  const supabase = await createClient();
  await supabase.auth.signOut().catch(() => {});
  const { error: otpError } = await supabase.auth.verifyOtp({ type: "magiclink", token_hash: link.properties.hashed_token });
  if (otpError) return ended("error");

  await admin.from("cred_demo_activity").insert({ org_id: opened.org_id, kind: "open" });
  await admin.from("cred_demos").update({ last_seen_at: new Date().toISOString() }).eq("org_id", opened.org_id);
  return NextResponse.redirect(`${origin}/dashboard`, 303);
}
