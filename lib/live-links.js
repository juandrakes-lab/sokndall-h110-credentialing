import { createAdminClient } from "@/lib/supabase/admin";
import { buildReportSnapshot } from "@/lib/reports";

// Live client status link (pedido 2026-11-16, punto 2): the public page
// app/status/[token] shows one client's current status, rebuilt on every
// visit. Nobody signs in, so it reads with the service role — the third
// documented exception in lib/supabase/admin.js. The token resolves to one
// client (cred_live_link_client: not revoked, client not archived, demo not
// over) and every read in buildReportSnapshot is filtered by that client's id.
export async function liveReport(token) {
  if (typeof token !== "string" || token.length < 32 || token.length > 100) return null;
  const admin = createAdminClient();
  const { data: rows } = await admin.rpc("cred_live_link_client", { p_token: token });
  const link = rows?.[0];
  if (!link) return null;

  const [{ data: client }, { data: practice }] = await Promise.all([
    admin.from("cred_client_orgs").select("id, name").eq("id", link.client_org_id).single(),
    admin.from("cred_practices").select("legal_name").eq("client_org_id", link.client_org_id).maybeSingle(),
  ]);
  if (!client) return null;
  const data = await buildReportSnapshot(admin, { client, practice });
  if (link.demo) data.demo = true;
  await admin
    .from("cred_live_links")
    .update({ last_viewed_at: new Date().toISOString() })
    .eq("client_org_id", link.client_org_id)
    .is("revoked_at", null);
  return data;
}
