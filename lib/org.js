import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const ACTIVE_CLIENT_COOKIE = "cred_client";

// Everything a signed-in request needs to know about "where am I": the user,
// their organization and plan, the clients they can reach, the active client
// and its practice. Cached per request, so the layout and the page share one
// lookup.
//
// Every query goes through the user's own session — RLS decides what comes
// back. `supabase` is scoped to the active client whenever the user can reach
// more than one (Billing Co), so every page shows one client's data without
// filtering by hand; `supabaseAll` spans all of the user's clients (the
// Clients panel, the email preview).
export const getAppContext = cache(async () => {
  const supabaseAll = await createClient();
  const {
    data: { user },
  } = await supabaseAll.auth.getUser();

  if (!user) return { supabase: supabaseAll, supabaseAll, user: null, org: null, clients: [] };

  const { data: membership } = await supabaseAll
    .from("cred_org_members")
    .select(
      "role, client_ids, cred_organizations(id, name, plan, provider_limit, user_limit, storage_limit_mb, caqh_reattestation_interval_days, alert_days, subscription_status, trial_ends_at, current_period_end, cancel_at_period_end, polar_subscription_id)"
    )
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return { supabase: supabaseAll, supabaseAll, user, org: null, clients: [] };

  const org = membership.cred_organizations;

  // Only the clients this person can reach (RLS: all for the owner, a subset
  // for a limited member), each with its practice.
  const { data: rows } = await supabaseAll
    .from("cred_client_orgs")
    .select("id, name, created_at, cred_practices(*)")
    .eq("org_id", org.id)
    .order("created_at", { ascending: true });
  const clients = (rows ?? []).map(({ cred_practices: p, ...c }) => ({
    ...c,
    practice: Array.isArray(p) ? p[0] ?? null : p ?? null,
  }));

  const chosen = (await cookies()).get(ACTIVE_CLIENT_COOKIE)?.value;
  const client = clients.find((c) => c.id === chosen) ?? clients[0] ?? null;
  const supabase = clients.length > 1 && client ? await createClient({ clientOrgId: client.id }) : supabaseAll;

  return {
    supabase,
    supabaseAll,
    user,
    org,
    role: membership.role,
    clientIds: membership.client_ids,
    clients,
    client,
    practice: client?.practice ?? null,
    multiClient: org.plan === "billing_co",
  };
});

// Whether a person on the team (a cred_org_directory row) can work on a
// client — the same rule as cred_can_access_client.
export function canReach(member, clientId) {
  return member.role === "owner" || !member.client_ids || member.client_ids.includes(clientId);
}

// Account-wide, whatever client is active or which clients a member can see:
// the plan's provider limit counts every client.
export async function providerUsage(supabase, orgId) {
  const { data } = await supabase.rpc("cred_provider_usage", { p_org_id: orgId });
  const row = data?.[0];
  return { count: row?.provider_count ?? 0, overLimit: new Set(row?.over_limit_ids ?? []) };
}

export async function providerCount(supabase, orgId) {
  return (await providerUsage(supabase, orgId)).count;
}
