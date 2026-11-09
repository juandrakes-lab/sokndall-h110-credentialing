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
export const dynamic = "force-dynamic";

const DAY = 86400000;

export async function GET(request, { params }) {
  const { code } = await params;
  const origin = new URL(request.url).origin;
  const ended = (why) => NextResponse.redirect(`${origin}/demo-ended?why=${why}`);

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
  return NextResponse.redirect(`${origin}/dashboard`);
}
