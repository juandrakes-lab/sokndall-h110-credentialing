import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchOrgDigestData, buildDigestEmail } from "@/lib/digest";
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

  const results = [];

  for (const org of orgs ?? []) {
    const digestData = await fetchOrgDigestData(admin, org);

    if (digestData.expiringCredentials.length === 0 && digestData.staleEnrollments.length === 0) {
      results.push({ org: org.name, sent: false, reason: "nothing to report" });
      continue;
    }

    const { data: ownerData, error: ownerError } = await admin.auth.admin.getUserById(
      org.owner_user_id
    );

    if (ownerError || !ownerData?.user?.email) {
      results.push({ org: org.name, sent: false, reason: "no owner email" });
      continue;
    }

    const { subject, html } = buildDigestEmail(org, digestData);
    await sendEmail({ to: ownerData.user.email, subject, html });

    await admin.from("notification_log").insert({
      org_id: org.id,
      type: "weekly_digest",
      payload: digestData,
    });

    results.push({ org: org.name, sent: true });
  }

  return NextResponse.json({ results });
}
