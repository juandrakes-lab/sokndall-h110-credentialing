"use server";

import { getAppContext } from "@/lib/org";
import { PAYER_SELECT, resolvePayer } from "@/lib/enrollments";
import { DOCUMENT_CATEGORIES } from "@/lib/documents";

const LIMIT = 6;

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Every word of the query has to appear somewhere in the text.
function matches(text, words) {
  const hay = norm(text);
  return words.every((w) => hay.includes(w));
}

// The search box in the app's top bar: providers (name, NPI, CAQH ID,
// specialty), payers, documents by file name and — for Billing Co — clients.
// Everything goes through the user's own session, so RLS decides what comes
// back exactly as it does on the pages themselves.
export async function searchApp(query) {
  const q = String(query ?? "").trim().slice(0, 80);
  if (q.length < 2) return { providers: [], payers: [], documents: [], clients: [] };
  const words = norm(q).split(/\s+/).filter(Boolean);

  const { supabase, user, clients, multiClient } = await getAppContext();
  if (!user) return { providers: [], payers: [], documents: [], clients: [] };

  const safe = q.replace(/[%_,()]/g, " ").trim();
  const [{ data: providers }, { data: payerRows }, { data: docs }] = await Promise.all([
    supabase.from("cred_providers").select("id, first_name, last_name, npi, caqh_id, specialty, status").order("last_name"),
    supabase.from("cred_payers_org").select(PAYER_SELECT),
    supabase
      .from("cred_documents")
      .select("id, file_name, category, provider_id, cred_providers(first_name, last_name)")
      .ilike("file_name", `%${safe.split(/\s+/)[0] ?? ""}%`)
      .order("created_at", { ascending: false })
      .limit(40),
  ]);

  return {
    providers: (providers ?? [])
      .filter((p) => matches(`${p.first_name} ${p.last_name} ${p.npi ?? ""} ${p.caqh_id ?? ""} ${p.specialty ?? ""}`, words))
      .slice(0, LIMIT)
      .map((p) => ({ id: p.id, name: `${p.first_name} ${p.last_name}`, detail: [p.specialty, p.npi && `NPI ${p.npi}`, p.status === "inactive" && "Inactive"].filter(Boolean).join(" · ") })),
    payers: (payerRows ?? [])
      .map(resolvePayer)
      .filter((p) => matches(p.name, words))
      .slice(0, LIMIT)
      .map((p) => ({ id: p.id, name: p.name })),
    documents: (docs ?? [])
      .filter((d) => matches(`${d.file_name} ${d.cred_providers?.first_name ?? ""} ${d.cred_providers?.last_name ?? ""}`, words))
      .slice(0, LIMIT)
      .map((d) => ({
        id: d.id,
        name: d.file_name,
        providerId: d.provider_id,
        detail: [DOCUMENT_CATEGORIES[d.category], d.cred_providers && `${d.cred_providers.first_name} ${d.cred_providers.last_name}`].filter(Boolean).join(" · "),
      })),
    clients: multiClient ? clients.filter((c) => matches(c.name, words)).slice(0, LIMIT).map((c) => ({ id: c.id, name: c.name })) : [],
  };
}
