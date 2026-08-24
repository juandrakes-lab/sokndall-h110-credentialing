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
    .select("org_id, role, organizations(id, name, plan, provider_limit)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return null;

  return { ...membership.organizations, role: membership.role };
}
