import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchOrgAlertCredentials, buildAlertEmail } from "@/lib/alerts";
import { sendEmail } from "@/lib/resend";

export async function GET(request) {
  if (!isAuthorizedCronRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: orgs, error } = await admin.from("organizations").select("id, name, owner_user_id");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const results = [];

  for (const org of orgs ?? []) {
    const credentials = await fetchOrgAlertCredentials(admin, org);

    if (credentials.length === 0) {
      results.push({ org: org.name, sent: false, reason: "nothing at a threshold" });
      continue;
    }

    // Dedupe: skip if we already sent this org an alert today (protects
    // against the cron firing more than once on the same day).
    const { data: alreadySent } = await admin
      .from("notification_log")
      .select("id")
      .eq("org_id", org.id)
      .eq("type", "expiration_alert")
      .gte("sent_at", `${today}T00:00:00Z`)
      .limit(1)
      .maybeSingle();

    if (alreadySent) {
      results.push({ org: org.name, sent: false, reason: "already sent today" });
      continue;
    }

    const { data: ownerData, error: ownerError } = await admin.auth.admin.getUserById(
      org.owner_user_id
    );

    if (ownerError || !ownerData?.user?.email) {
      results.push({ org: org.name, sent: false, reason: "no owner email" });
      continue;
    }

    const { subject, html } = buildAlertEmail(org, credentials);
    await sendEmail({ to: ownerData.user.email, subject, html });

    await admin.from("notification_log").insert({
      org_id: org.id,
      type: "expiration_alert",
      payload: credentials,
    });

    results.push({ org: org.name, sent: true, count: credentials.length });
  }

  return NextResponse.json({ results });
}
