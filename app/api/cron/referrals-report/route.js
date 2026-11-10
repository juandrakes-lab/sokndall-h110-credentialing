import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPolarClient } from "@/lib/polar";
import { sendEmail } from "@/lib/resend";
import { JUAN_EMAIL, demoEmail } from "@/lib/demo";
import { buildReferralReport, referralReportEmail } from "@/lib/referrals";

// The 1st of each month (vercel.json): the partners' report for the month that
// just ended, to Juan. ?month=YYYY-MM reruns a given month; ?dry=1 returns it
// without sending.
export async function GET(request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const q = new URL(request.url).searchParams;
    const report = await buildReferralReport(createAdminClient(), createPolarClient(), { month: q.get("month") ?? undefined });
    const lines = referralReportEmail(report);
    if (q.get("dry") !== "1") {
      await sendEmail({ to: JUAN_EMAIL, ...demoEmail(`Sokndall referrals — ${report.month}`, lines) });
    }
    return NextResponse.json({ sent: q.get("dry") !== "1", report });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
