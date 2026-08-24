"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";
import { CREDENTIAL_TYPES } from "@/lib/credentials";
import { normalizeDate } from "@/lib/dates";

export async function importCredentials(rows) {
  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  const supabase = await createClient();
  const { data: providers, error: providersError } = await supabase
    .from("providers")
    .select("id, first_name, last_name, npi")
    .eq("org_id", org.id);

  if (providersError) throw new Error(providersError.message);

  const byNpi = new Map();
  const byName = new Map();
  for (const p of providers ?? []) {
    if (p.npi) byNpi.set(p.npi.trim(), p.id);
    byName.set(`${p.first_name.trim().toLowerCase()}|${p.last_name.trim().toLowerCase()}`, p.id);
  }

  const errors = [];
  const valid = [];

  rows.forEach((row, i) => {
    const rowNum = i + 2;

    if (!row.type || !CREDENTIAL_TYPES.includes(row.type)) {
      errors.push(`Row ${rowNum}: unrecognized credential type "${row.type ?? ""}".`);
      return;
    }

    let providerId = row.provider_npi ? byNpi.get(row.provider_npi.trim()) : null;
    if (!providerId && row.provider_first_name && row.provider_last_name) {
      providerId = byName.get(
        `${row.provider_first_name.trim().toLowerCase()}|${row.provider_last_name.trim().toLowerCase()}`
      );
    }

    if (!providerId) {
      errors.push(`Row ${rowNum}: couldn't match a provider by NPI or name.`);
      return;
    }

    valid.push({
      provider_id: providerId,
      type: row.type,
      identifier: row.identifier ?? null,
      state: row.state ?? null,
      issue_date: normalizeDate(row.issue_date),
      expiration_date: normalizeDate(row.expiration_date),
      notes: row.notes ?? null,
    });
  });

  let inserted = 0;
  if (valid.length > 0) {
    const { error, count } = await supabase.from("credentials").insert(valid, { count: "exact" });
    if (error) throw new Error(error.message);
    inserted = count ?? valid.length;
  }

  revalidatePath("/dashboard");
  revalidatePath("/providers");
  return { inserted, errors };
}
