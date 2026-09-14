import { PAYER_SELECT, resolvePayer } from "@/lib/enrollments";

// Everything the alert and digest emails need for one organization, fetched
// with explicit org filters. Works with the cron's service-role client and,
// under RLS, with a signed-in owner's client (the email preview).
export async function gatherOrgData(client, orgId) {
  const [providers, credentials, enrollments, payers, clients] = await Promise.all([
    client.from("cred_providers").select("id, first_name, last_name, client_org_id, status").eq("org_id", orgId),
    client
      .from("cred_credentials")
      .select("id, provider_id, client_org_id, type, state, number, issuer, expiration_date, assigned_user_id")
      .eq("org_id", orgId)
      .not("expiration_date", "is", null),
    client
      .from("cred_enrollments")
      .select("id, provider_id, payer_id, client_org_id, status, next_follow_up_date, status_changed_at, revalidation_due_date, assigned_user_id")
      .eq("org_id", orgId),
    client.from("cred_payers_org").select(PAYER_SELECT).eq("org_id", orgId),
    client.from("cred_client_orgs").select("id, name").eq("org_id", orgId).is("archived_at", null),
  ]);

  for (const res of [providers, credentials, enrollments, payers, clients]) {
    if (res.error) throw new Error(res.error.message);
  }

  // Archived clients send nothing (the cron's service role would see them).
  const live = new Set((clients.data ?? []).map((c) => c.id));
  const isLive = (row) => live.has(row.client_org_id);
  providers.data = (providers.data ?? []).filter(isLive);
  credentials.data = (credentials.data ?? []).filter(isLive);
  enrollments.data = (enrollments.data ?? []).filter(isLive);

  const enrollmentIds = (enrollments.data ?? []).map((e) => e.id);
  const lastContact = new Map();
  if (enrollmentIds.length) {
    const { data: comms } = await client
      .from("cred_communications")
      .select("enrollment_id, contact_date, channel, reference_number, created_at")
      .eq("org_id", orgId)
      .order("contact_date", { ascending: false })
      .order("created_at", { ascending: false });
    for (const c of comms ?? []) if (!lastContact.has(c.enrollment_id)) lastContact.set(c.enrollment_id, c);
  }

  return {
    providers: new Map((providers.data ?? []).map((p) => [p.id, p])),
    credentials: credentials.data ?? [],
    enrollments: enrollments.data ?? [],
    payers: new Map((payers.data ?? []).map((p) => [p.id, resolvePayer(p)])),
    clients: new Map((clients.data ?? []).map((c) => [c.id, c.name])),
    lastContact,
  };
}
