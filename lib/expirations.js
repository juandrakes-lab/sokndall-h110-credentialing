import { addDays, credentialLabel, credentialSummary, todayISO } from "@/lib/credentials";
import { cellKey } from "@/lib/enrollments";
import { loadRevalidations } from "@/lib/follow-ups";

export const REVALIDATION = "revalidation";

// Everything due in the next 90 days (or already past): credential
// expirations plus approved enrollments' payer revalidations. Shared by the
// dashboard and its CSV export so both always show the same rows.
//
// Credentials belong to no payer or enrollment, so a payer or enrollment
// status filter shows only matching payer revalidations (which exist only for
// approved enrollments); a credential-type filter hides revalidations.
export async function loadExpirations(supabase, filters = {}) {
  const wantCredentials = !filters.payer && !filters.status && filters.type !== REVALIDATION;
  const wantRevalidations =
    (!filters.type || filters.type === REVALIDATION) && (!filters.status || filters.status === "approved");

  let credQuery = supabase
    .from("cred_credentials")
    .select("id, type, state, number, issuer, coverage, expiration_date, provider_id, cred_providers!inner(id, first_name, last_name, npi, status)")
    // Providers marked inactive have left the practice; their renewals aren't work.
    .eq("cred_providers.status", "active")
    .not("expiration_date", "is", null)
    .lte("expiration_date", addDays(todayISO(), 90));
  if (filters.provider) credQuery = credQuery.eq("provider_id", filters.provider);
  if (filters.type && filters.type !== REVALIDATION) credQuery = credQuery.eq("type", filters.type);

  const [{ data: credentials, error }, revalidations] = await Promise.all([
    wantCredentials ? credQuery : Promise.resolve({ data: [] }),
    wantRevalidations ? loadRevalidations(supabase, filters) : Promise.resolve([]),
  ]);
  if (error) throw new Error(error.message);

  return [
    ...(credentials ?? []).map((c) => ({
      id: `c-${c.id}`,
      kind: credentialLabel(c.type),
      date: c.expiration_date,
      provider: c.cred_providers,
      who: `${c.cred_providers.first_name} ${c.cred_providers.last_name}`,
      what: [credentialLabel(c.type), credentialSummary(c)].filter(Boolean).join(" · "),
      detail: credentialSummary(c),
      href: `/providers/${c.provider_id}`,
    })),
    ...revalidations.map((e) => ({
      id: `r-${e.id}`,
      kind: "Payer revalidation",
      date: e.revalidation_due_date,
      provider: e.provider,
      who: `${e.provider.first_name} ${e.provider.last_name}`,
      what: `Payer revalidation · ${e.payer.name}`,
      detail: e.payer.name,
      cell: cellKey(e.provider_id, e.payer_id),
    })),
  ].sort((a, b) => a.date.localeCompare(b.date));
}
