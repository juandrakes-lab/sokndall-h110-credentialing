import { NextResponse, after } from "next/server";
import { createClient } from "@supabase/supabase-js";

// /r/<step>: the pricing link in the template follow-up emails (D3). Counts
// one click for (today, step) and sends the reader on to /pricing with the
// UTM tags, so the sk_attr cookie still records where an account came from.
//
// Nothing about the person is read or kept — not the IP, not the user agent
// beyond the bot check below, not who the email went to. Link scanners
// (Outlook Safe Links, Proofpoint, Mimecast…) and previews open these links
// on their own, so they are redirected without counting, as are HEAD
// requests and unknown steps.

export const dynamic = "force-dynamic";

const STEPS = new Set(["e3", "e3b", "e5", "e6", "e7", "e8", "e9", "e10"]);
const BOTS = /bot|crawl|spider|preview|scan|safelinks|proofpoint|mimecast|barracuda|slack|facebookexternalhit/i;

const destination = (step) =>
  `https://sokndall.com/pricing?utm_source=nurture&utm_medium=email&utm_campaign=template_seq&utm_content=${encodeURIComponent(step)}`;

const redirect = (step) =>
  NextResponse.redirect(destination(step), { status: 302, headers: { "Cache-Control": "no-store" } });

export async function GET(request, { params }) {
  const { step } = await params;
  const ua = request.headers.get("user-agent") ?? "";
  if (STEPS.has(step) && !BOTS.test(ua)) {
    // After the response: the redirect never waits on the count, and a failed
    // count never blocks it.
    after(async () => {
      try {
        const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { error } = await anon.rpc("count_nurture_click", { p_step: step });
        if (error) console.error(`nurture click not counted: ${error.message}`);
      } catch (err) {
        console.error(`nurture click not counted: ${err.message}`);
      }
    });
  }
  return redirect(STEPS.has(step) ? step : "unknown");
}

export async function HEAD(_request, { params }) {
  const { step } = await params;
  return redirect(STEPS.has(step) ? step : "unknown");
}
