"use server";

import { getAppContext } from "@/lib/org";
import { PAYER_SELECT, resolvePayer } from "@/lib/enrollments";
import { DOCUMENT_CATEGORIES } from "@/lib/documents";

// Everything the top-bar search can find, fetched once and filtered in the
// browser as each letter is typed — a practice's providers, payers and file
// names are a few hundred short strings, so there's no reason to ask the server
// on every keystroke. Read through the user's own session, so RLS decides
// what's in it exactly as it does on the pages.
export async function getSearchIndex() {
  const { supabase, user, clients, multiClient } = await getAppContext();
  if (!user) return null;

  const [{ data: providers }, { data: payerRows }, { data: docs }] = await Promise.all([
    supabase.from("cred_providers").select("id, first_name, last_name, npi, caqh_id, specialty, status, photo_url").order("last_name"),
    supabase.from("cred_payers_org").select(PAYER_SELECT),
    supabase
      .from("cred_documents")
      .select("id, file_name, category, provider_id, cred_providers(first_name, last_name)")
      .order("created_at", { ascending: false })
      .limit(3000),
  ]);

  return {
    providers: (providers ?? []).map((p) => ({
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      photo: p.photo_url,
      detail: [p.specialty, p.npi && `NPI ${p.npi}`, p.status === "inactive" && "Inactive"].filter(Boolean).join(" · "),
      terms: [p.first_name, p.last_name, p.npi, p.caqh_id, p.specialty].filter(Boolean).join(" "),
    })),
    payers: (payerRows ?? []).map(resolvePayer).map((p) => ({ id: p.id, name: p.name, terms: p.name })),
    documents: (docs ?? []).map((d) => {
      const who = d.cred_providers ? `${d.cred_providers.first_name} ${d.cred_providers.last_name}` : "";
      return {
        id: d.id,
        name: d.file_name,
        providerId: d.provider_id,
        detail: [DOCUMENT_CATEGORIES[d.category], who].filter(Boolean).join(" · "),
        terms: `${d.file_name} ${who} ${DOCUMENT_CATEGORIES[d.category] ?? ""}`,
      };
    }),
    clients: multiClient ? clients.map((c) => ({ id: c.id, name: c.name, terms: c.name })) : [],
  };
}
