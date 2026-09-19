"use server";

import { revalidatePath } from "next/cache";
import { getAppContext, providerCount } from "@/lib/org";
import { fetchNppes } from "@/lib/nppes";
import { providerErrors } from "@/lib/provider-rules";
import { credentialErrors, normalizeCoverage } from "@/lib/credential-rules";
import { snapshotFromLookup } from "@/lib/consistency";
import { normalizeDate } from "@/lib/dates";
import { CREDENTIAL_FIELDS, CREDENTIAL_TYPES, todayISO } from "@/lib/credentials";
import { credentialTypeFrom } from "@/lib/imports";
import { US_STATES } from "@/lib/us-states";
import { PLANS, nextPlan } from "@/lib/plans";

function stateCode(value) {
  if (!value) return null;
  const v = value.trim();
  const found = US_STATES.find(([code, name]) => code.toLowerCase() === v.toLowerCase() || name.toLowerCase() === v.toLowerCase());
  return found ? found[0] : undefined;
}

// Run `fn` over `items`, at most `limit` at a time.
async function pool(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

// Rows are reported by spreadsheet line: header is line 1.
const line = (i) => `Row ${i + 2}`;

export async function importProviders(rows) {
  const { supabase, org, practice } = await getAppContext();

  const { data: existing } = await supabase.from("cred_providers").select("npi").not("npi", "is", null);
  const seenNpi = new Set((existing ?? []).map((p) => p.npi));
  const errors = [];
  const valid = [];

  rows.forEach((r, i) => {
    if (!r.first_name || !r.last_name) return errors.push(`${line(i)}: missing first or last name.`);
    const who = `${line(i)} (${r.first_name} ${r.last_name})`;

    const startDate = r.start_date ? normalizeDate(r.start_date) : null;
    if (r.start_date && !startDate) return errors.push(`${who}: start date "${r.start_date}" isn't a date (use MM/DD/YYYY).`);

    // The same rules as the provider form (lib/provider-rules.js), on the
    // cleaned values, so the database never meets a malformed row.
    const values = {
      first_name: r.first_name.trim(),
      last_name: r.last_name.trim(),
      npi: r.npi?.replace(/\D/g, "") || null,
      caqh_id: r.caqh_id?.replace(/\D/g, "") || null,
      taxonomy_code: r.taxonomy_code?.trim().toUpperCase() || null,
      email: r.email?.trim().toLowerCase() || null,
      phone: r.phone?.replace(/\D/g, "").replace(/^1(\d{10})$/, "$1") || null,
      start_date: startDate,
    };
    const problems = providerErrors(values);
    const first = Object.keys(problems)[0];
    if (first) return errors.push(`${who}: ${problems[first]}`);
    if (values.npi && seenNpi.has(values.npi)) return errors.push(`${who}: a provider with NPI ${values.npi} already exists.`);

    if (values.npi) seenNpi.add(values.npi);
    valid.push({
      ...values,
      practice_id: practice.id,
      specialty: r.specialty ?? null,
      // Every row needs every column in a bulk insert, so the default is explicit.
      start_date: startDate ?? todayISO(),
      notes: r.notes ?? null,
    });
  });

  // The database refuses anything past the plan's limit (alcance §4.3); cut
  // the batch here so the rows that fit still go in.
  const room = Math.max(0, org.provider_limit - (await providerCount(supabase, org.id)));
  const batch = valid.slice(0, room);
  const overLimit = valid.length - batch.length;

  // Check every NPI against the NPI Registry, a few at a time.
  await pool(batch, 5, async (p) => {
    if (!p.npi) return;
    const snapshot = snapshotFromLookup(await fetchNppes(p.npi));
    if (snapshot !== undefined) {
      p.nppes_data = snapshot;
      p.nppes_checked_at = new Date().toISOString();
    }
  });

  let inserted = 0;
  if (batch.length) {
    // Rows without a snapshot need the keys too, or PostgREST rejects the batch.
    const rowsToInsert = batch.map((p) => ({ nppes_data: null, nppes_checked_at: null, ...p }));
    const { error, count } = await supabase.from("cred_providers").insert(rowsToInsert, { count: "exact" });
    if (error) throw new Error(error.message);
    inserted = count ?? batch.length;
  }

  let notice;
  if (overLimit > 0) {
    const next = nextPlan(org.plan);
    notice = `${overLimit} more row${overLimit === 1 ? "" : "s"} didn't fit: your ${PLANS[org.plan].label} plan holds ${org.provider_limit} providers.${
      next ? ` ${next.label} holds ${next.providerLimit}.` : ""
    }`;
  }

  revalidatePath("/providers");
  revalidatePath("/dashboard");
  return { inserted, errors, notice };
}

export async function importCredentials(rows) {
  const { supabase } = await getAppContext();
  const { data: providers } = await supabase.from("cred_providers").select("id, first_name, last_name, npi");

  const byNpi = new Map();
  const byName = new Map();
  const lastNameOf = new Map();
  for (const p of providers ?? []) {
    if (p.npi) byNpi.set(p.npi, p.id);
    byName.set(`${p.first_name.trim().toLowerCase()}|${p.last_name.trim().toLowerCase()}`, p.id);
    lastNameOf.set(p.id, p.last_name);
  }

  const errors = [];
  const valid = [];

  rows.forEach((r, i) => {
    const who = [r.provider_first_name, r.provider_last_name].filter(Boolean).join(" ") || r.provider_npi || "unknown provider";
    const type = credentialTypeFrom(r.type);
    if (!type) return errors.push(`${line(i)} (${who}): "${r.type ?? ""}" isn't a credential type we know (license, DEA, malpractice, board certification, CAQH, state CDS, other).`);

    const npi = r.provider_npi?.replace(/\D/g, "");
    let providerId = npi ? byNpi.get(npi) : null;
    if (!providerId && r.provider_first_name && r.provider_last_name) {
      providerId = byName.get(`${r.provider_first_name.trim().toLowerCase()}|${r.provider_last_name.trim().toLowerCase()}`);
    }
    if (!providerId) return errors.push(`${line(i)} (${who}): no provider with that NPI or name. Add or import the provider first.`);

    const config = CREDENTIAL_TYPES[type];
    const values = Object.fromEntries(CREDENTIAL_FIELDS.map((f) => [f, null]));
    for (const field of config.fields) values[field] = r[field] ?? null;

    if (values.state !== null) {
      const code = stateCode(values.state);
      if (code === undefined) return errors.push(`${line(i)} (${who}): "${values.state}" isn't a U.S. state.`);
      values.state = code;
    }
    for (const field of ["issue_date", "expiration_date"]) {
      if (values[field] !== null) {
        const d = normalizeDate(values[field]);
        if (!d) return errors.push(`${line(i)} (${who}): "${values[field]}" isn't a date (use MM/DD/YYYY).`);
        values[field] = d;
      }
    }
    const missing = (config.required ?? []).filter((f) => !values[f]);
    if (missing.length) {
      return errors.push(`${line(i)} (${who}): ${config.label} needs ${missing.map((f) => config.labels[f].toLowerCase()).join(" and ")}.`);
    }
    if (type === "dea" && values.number) values.number = values.number.replace(/[\s-]/g, "").toUpperCase();
    if (values.coverage) values.coverage = normalizeCoverage(values.coverage) ?? values.coverage;
    // Everything the credential form checks (lib/credential-rules.js).
    const problems = credentialErrors(type, values, { lastName: lastNameOf.get(providerId) });
    const first = Object.keys(problems)[0];
    if (first) return errors.push(`${line(i)} (${who}): ${problems[first]}`);

    valid.push({ ...values, type, provider_id: providerId, notes: r.notes ?? null });
  });

  let inserted = 0;
  if (valid.length) {
    const { error, count } = await supabase.from("cred_credentials").insert(valid, { count: "exact" });
    if (error) throw new Error(error.message);
    inserted = count ?? valid.length;
  }

  revalidatePath("/dashboard");
  revalidatePath("/providers");
  return { inserted, errors };
}
