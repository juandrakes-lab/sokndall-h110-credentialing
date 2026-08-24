import { createClient } from "@/lib/supabase/server";

// Returns the caller's organization (MVP: one org per user) or null if the
// user hasn't created one yet.
export async function getCurrentOrg() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: membership } = await supabase
    .from("org_members")
    .select(
      "org_id, role, organizations(id, name, plan, provider_limit, polar_customer_id, subscription_status)"
    )
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  return { ...membership.organizations, role: membership.role };
}

// Providers remaining before hitting the org's plan limit. Never negative
// in the "how many more can I add" sense — a caller adding N providers
// should insert at most this many.
export async function remainingProviderSlots(supabase, org) {
  const { count } = await supabase
    .from("providers")
    .select("id", { count: "exact", head: true })
    .eq("org_id", org.id);

  return Math.max(0, org.provider_limit - (count ?? 0));
}
