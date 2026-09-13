import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Everything a signed-in request needs to know about "where am I": the user,
// their organization and plan, the active client and its practice. Cached per
// request, so the layout and the page share one lookup.
//
// Every query goes through the user's own session — RLS decides what comes
// back. There is one client per Solo/Practice organization; Billing Co's
// client switcher (multi-client phase) will pick among several here.
export const getAppContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, org: null };

  const { data: membership } = await supabase
    .from("cred_org_members")
    .select(
      "role, client_ids, cred_organizations(id, name, plan, provider_limit, user_limit, storage_limit_mb, caqh_reattestation_interval_days)"
    )
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return { supabase, user, org: null };

  const org = membership.cred_organizations;

  const { data: clients } = await supabase
    .from("cred_client_orgs")
    .select("id, name, cred_practices(*)")
    .eq("org_id", org.id)
    .order("created_at", { ascending: true });

  const client = clients?.[0] ?? null;
  const practices = client?.cred_practices;
  const practice = Array.isArray(practices) ? practices[0] ?? null : practices ?? null;

  return { supabase, user, org, role: membership.role, client, practice };
});

// Kept for the pre-v3 billing actions until the billing phase replaces them.
export async function getCurrentOrg() {
  const { org, role } = await getAppContext();
  return org ? { ...org, role } : null;
}

export async function providerCount(supabase, orgId) {
  const { count } = await supabase
    .from("cred_providers")
    .select("id", { count: "exact", head: true })
    .eq("org_id", orgId);
  return count ?? 0;
}
