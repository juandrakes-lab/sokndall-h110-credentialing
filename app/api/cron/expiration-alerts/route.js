import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron";
import { createAdminClient } from "@/lib/supabase/admin";
import { runAlerts } from "@/lib/notifications/send";
import { reconcileExpiredSeats } from "@/lib/seats";
import { runTrialEndingNotices } from "@/lib/trial-emails";
import { runDemoLifecycle } from "@/lib/demo-cron";
import { reportAllExtraProviders } from "@/lib/extra-providers";

// Daily (vercel.json): deadline alerts on each organization's ladder.
export async function GET(request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ?org=<id> narrows a manual run to one organization (verification
    // scripts); Vercel Cron never passes it.
    const org = new URL(request.url).searchParams.get("org");
    const admin = createAdminClient();
    const scope = org ? { orgIds: [org] } : {};
    const results = await runAlerts(admin, scope);
    // Billing Co: unanswered invitations stop holding a paid extra user.
    const seats = await reconcileExpiredSeats(admin, scope);
    // Owners whose trial ends in 3 days (D2). Rides on this daily cron rather
    // than adding one.
    const trialEnding = await runTrialEndingNotices(admin, scope);
    // Billing Co extra providers: report the number to Polar's meter every day,
    // so a month with no change is still billed.
    const extraProviders = await reportAllExtraProviders(admin, scope);
    // Demo accounts: prepared moments, Juan's summary at the end, deletion.
    // Only on the full run — a manual ?org= run is for one real account.
    const demos = org ? null : await runDemoLifecycle(admin);
    return NextResponse.json({ sent: results.filter((r) => r.status === "sent").length, results, seats, trialEnding, extraProviders, demos });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
