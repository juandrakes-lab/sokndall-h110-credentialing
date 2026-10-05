"use server";

import { revalidatePath } from "next/cache";
import { getAppContext, providerCount } from "@/lib/org";
import { fetchNppes } from "@/lib/nppes";
import { providerErrors } from "@/lib/provider-rules";
import { credentialErrors } from "@/lib/credential-rules";
import { snapshotFromLookup } from "@/lib/consistency";
import { CREDENTIAL_FIELDS, CREDENTIAL_TYPES, todayISO } from "@/lib/credentials";
import { PAYER_SELECT, resolvePayer } from "@/lib/enrollments";
import { PLANS, nextPlan } from "@/lib/plans";
import { readWorkbook, XlsxError } from "@/lib/xlsx";
import { parseTemplate } from "@/lib/template-import";

// Upload the free Sokndall template as is (D4). The file is read in memory
// and never stored: only the rows are written, with the signed-in user's
// client (RLS), into the active client. Everything that didn't go in is
// listed — by tab and row, and the providers past the plan by name.

// 5 MB; the page says so. (Not exported: a "use server" file exports only
// actions.)
const MAX_TEMPLATE_BYTES = 5 * 1024 * 1024;

const norm = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

async function pool(items, limit, fn) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) await fn(items[next++]);
    })
  );
}

// "Aetna" → the catalog's "Aetna"; "Cigna" → "Cigna Healthcare" when that is
// the only catalog name that starts with it. Otherwise null (own payer).
function catalogMatch(catalog, name) {
  const n = norm(name);
  const exact = catalog.find((p) => norm(p.name) === n);
  if (exact) return exact;
  const starts = catalog.filter((p) => norm(p.name).startsWith(n));
  return starts.length === 1 ? starts[0] : null;
}

function guessPayerType(name) {
  const n = name.toLowerCase();
  if (n.includes("medicare")) return "medicare";
  if (n.includes("medicaid")) return "medicaid";
  return "commercial";
}

export async function importTemplate(_prev, formData) {
  const file = formData.get("file");
  if (!file || typeof file === "string" || !file.size) return { error: "Choose the template file first." };
  if (file.size > MAX_TEMPLATE_BYTES) return { error: "That file is over 5 MB. The template is far smaller — check it's the right file." };
  if (!/\.xlsx$/i.test(file.name ?? "")) {
    return { error: "Upload the .xlsx file. In Google Sheets: File › Download › Microsoft Excel (.xlsx)." };
  }

  let parsed;
  try {
    parsed = parseTemplate(readWorkbook(await file.arrayBuffer()));
  } catch (err) {
    if (err instanceof XlsxError) return { error: err.message };
    throw err;
  }
  if (parsed.notTemplate) return { error: parsed.problems[0] };

  const { supabase, org, client, practice } = await getAppContext();
  if (!practice) return { error: "Finish setting up your practice first (Settings), then import." };

  const problems = [...parsed.problems];
  const report = { providers: 0, providersExisting: 0, credentials: 0, caqh: 0, payersAdded: 0, enrollments: 0, followUps: 0 };

  // --- Providers -----------------------------------------------------------
  const { data: existing } = await supabase.from("cred_providers").select("id, first_name, last_name, npi, caqh_id");
  const byKey = new Map();
  const byNpi = new Map();
  const caqhIdOf = new Map();
  for (const p of existing ?? []) {
    byKey.set(`${p.first_name.trim().toLowerCase()}|${p.last_name.trim().toLowerCase()}`, p.id);
    if (p.npi) byNpi.set(p.npi, p.id);
    caqhIdOf.set(p.id, p.caqh_id);
  }

  const toInsert = [];
  for (const p of parsed.providers) {
    const known = (p.npi && byNpi.get(p.npi)) || byKey.get(p.key);
    if (known) {
      // Already in Sokndall (a second import, or added by hand): linked, not duplicated.
      byKey.set(p.key, known);
      report.providersExisting++;
      continue;
    }
    const values = { first_name: p.first_name, last_name: p.last_name, npi: p.npi };
    const issues = providerErrors(values);
    const first = Object.keys(issues)[0];
    if (first) {
      problems.push(`Providers, row ${p.line} (${p.first_name} ${p.last_name}): ${issues[first]}`);
      continue;
    }
    toInsert.push(p);
  }

  // The plan's limit counts active providers; inactive ones always fit.
  const room = Math.max(0, org.provider_limit - (await providerCount(supabase, org.id)));
  const active = toInsert.filter((p) => p.status === "active");
  const fits = new Set(active.slice(0, room));
  const leftOut = active.slice(room);
  const batch = toInsert.filter((p) => p.status === "inactive" || fits.has(p));

  await pool(batch.filter((p) => p.npi), 5, async (p) => {
    const snapshot = snapshotFromLookup(await fetchNppes(p.npi));
    if (snapshot !== undefined) {
      p.nppes_data = snapshot;
      p.nppes_checked_at = new Date().toISOString();
    }
  });

  if (batch.length) {
    const rows = batch.map((p) => ({
      practice_id: practice.id,
      first_name: p.first_name,
      last_name: p.last_name,
      npi: p.npi,
      specialty: p.specialty,
      start_date: p.start_date ?? todayISO(),
      status: p.status,
      notes: p.notes,
      nppes_data: p.nppes_data ?? null,
      nppes_checked_at: p.nppes_checked_at ?? null,
    }));
    const { data: inserted, error } = await supabase.from("cred_providers").insert(rows).select("id, first_name, last_name");
    if (error) return { error: `Nothing was imported: ${error.message}` };
    for (const p of inserted) byKey.set(`${p.first_name.trim().toLowerCase()}|${p.last_name.trim().toLowerCase()}`, p.id);
    report.providers = inserted.length;
  }

  const leftOutKeys = new Set(leftOut.map((p) => p.key));
  const providerFor = (row, tab) => {
    const id = byKey.get(row.key);
    if (id) return id;
    if (!leftOutKeys.has(row.key)) problems.push(`${tab}, row ${row.line} (${row.who}): no provider by that name on the Providers tab.`);
    return null;
  };

  // --- CAQH tab ------------------------------------------------------------
  const credentialRows = [];
  for (const c of parsed.caqh) {
    const providerId = providerFor(c, "CAQH");
    if (!providerId) continue;
    if (c.caqh_id && !caqhIdOf.get(providerId)) {
      const { error } = await supabase.from("cred_providers").update({ caqh_id: c.caqh_id }).eq("id", providerId);
      if (error) problems.push(`CAQH, row ${c.line} (${c.who}): the CAQH ID "${c.caqh_id}" wasn't saved (${error.message}).`);
      else report.caqh++;
    }
    if (c.issue_date) {
      credentialRows.push({
        line: c.line,
        tab: "CAQH",
        who: c.who,
        values: { ...Object.fromEntries(CREDENTIAL_FIELDS.map((f) => [f, null])), issue_date: c.issue_date },
        type: "caqh_attestation",
        provider_id: providerId,
        notes: c.notes,
      });
    }
  }

  // --- Credentials tab -----------------------------------------------------
  for (const c of parsed.credentials) {
    const providerId = providerFor(c, "Credentials");
    if (!providerId) continue;
    const config = CREDENTIAL_TYPES[c.type];
    const values = Object.fromEntries(CREDENTIAL_FIELDS.map((f) => [f, null]));
    const extra = [];
    const uses = (f) => config.fields.includes(f);

    if (uses("custom_name")) values.custom_name = c.custom_name;
    // "State / Issuing Body": a state where the type takes one, the carrier
    // or board where it takes an issuer, otherwise kept in notes.
    if (c.stateOrBody) {
      if (uses("state") && c.state) values.state = c.state;
      else if (uses("issuer")) values.issuer = c.stateOrBody;
      else extra.push(`State / issuing body: ${c.stateOrBody}`);
    }
    if (c.number) {
      if (uses("number")) values.number = c.type === "dea" ? c.number.replace(/[\s-]/g, "").toUpperCase() : c.number;
      else extra.push(`ID / number: ${c.number}`);
    }
    if (c.issue_date) {
      if (uses("issue_date")) values.issue_date = c.issue_date;
      else extra.push(`Issued: ${c.issue_date}`);
    }
    if (c.expiration_date) values.expiration_date = c.expiration_date;

    credentialRows.push({
      line: c.line,
      tab: "Credentials",
      who: c.who,
      values,
      type: c.type,
      provider_id: providerId,
      notes: [extra.join("\n"), c.notes].filter(Boolean).join("\n") || null,
    });
  }

  const { data: lastNames } = await supabase.from("cred_providers").select("id, last_name");
  const lastNameOf = new Map((lastNames ?? []).map((p) => [p.id, p.last_name]));
  // Uploading the same file again (after a plan change, say) must not
  // duplicate: a credential with the same provider, type, number and dates
  // is already in.
  const { data: haveCredentials } = await supabase
    .from("cred_credentials")
    .select("provider_id, type, custom_name, number, issue_date, expiration_date");
  // A CAQH attestation's expiry is worked out by the database, so it is
  // matched on the attestation date alone.
  const credentialKey = (c) =>
    [c.provider_id, c.type, c.custom_name ?? "", c.number ?? "", c.issue_date ?? "", c.type === "caqh_attestation" ? "" : c.expiration_date ?? ""].join("|");
  const seenCredentials = new Set((haveCredentials ?? []).map(credentialKey));
  const validCredentials = [];
  for (const c of credentialRows) {
    if (seenCredentials.has(credentialKey({ ...c.values, type: c.type, provider_id: c.provider_id }))) {
      report.credentialsExisting = (report.credentialsExisting ?? 0) + 1;
      continue;
    }
    const config = CREDENTIAL_TYPES[c.type];
    const missing = (config.required ?? []).filter((f) => !c.values[f]);
    if (missing.length) {
      problems.push(`${c.tab}, row ${c.line} (${c.who}): ${config.label} needs ${missing.map((f) => config.labels[f].toLowerCase()).join(" and ")}.`);
      continue;
    }
    const issues = credentialErrors(c.type, c.values, { lastName: lastNameOf.get(c.provider_id) });
    const first = Object.keys(issues)[0];
    if (first) {
      problems.push(`${c.tab}, row ${c.line} (${c.who}): ${issues[first]}`);
      continue;
    }
    validCredentials.push({ ...c.values, type: c.type, provider_id: c.provider_id, notes: c.notes });
  }
  if (validCredentials.length) {
    const { error, count } = await supabase.from("cred_credentials").insert(validCredentials, { count: "exact" });
    if (error) problems.push(`Credentials: none were saved (${error.message}).`);
    else report.credentials = count ?? validCredentials.length;
  }

  // --- Payers and enrollments ------------------------------------------------
  const enrollmentRows = parsed.enrollments.map((e) => ({ ...e, provider_id: providerFor(e, "Payer Enrollment") })).filter((e) => e.provider_id);
  if (enrollmentRows.length) {
    const [{ data: own }, { data: catalog }] = await Promise.all([
      supabase.from("cred_payers_org").select(PAYER_SELECT).eq("client_org_id", client.id),
      supabase.from("cred_payers_global").select("id, name"),
    ]);
    // resolvePayer drops payer_global_id, which the catalog match needs.
    const list = (own ?? []).map((row) => ({ ...resolvePayer(row), payer_global_id: row.payer_global_id }));
    const payerIdFor = new Map();

    for (const name of [...new Set(enrollmentRows.map((e) => e.payer))]) {
      const onList = list.find((p) => norm(p.name) === norm(name));
      if (onList) {
        payerIdFor.set(name, onList.id);
        continue;
      }
      const match = catalogMatch(catalog ?? [], name);
      const already = match && list.find((p) => p.payer_global_id === match.id);
      if (already) {
        payerIdFor.set(name, already.id);
        continue;
      }
      const type = guessPayerType(name);
      const row = match
        ? { org_id: org.id, client_org_id: client.id, payer_global_id: match.id }
        : { org_id: org.id, client_org_id: client.id, name, payer_type: type, revalidation_months: type === "commercial" ? 36 : 60 };
      const { data: created, error } = await supabase.from("cred_payers_org").insert(row).select("id").single();
      if (error) {
        problems.push(`Payer Enrollment: the payer "${name}" couldn't be added (${error.message}).`);
        continue;
      }
      payerIdFor.set(name, created.id);
      list.push({ id: created.id, name: match?.name ?? name, payer_global_id: match?.id ?? null });
      report.payersAdded++;
    }

    const seenPair = new Set();
    for (const e of enrollmentRows) {
      const payerId = payerIdFor.get(e.payer);
      if (!payerId) continue;
      const pair = `${e.provider_id}|${payerId}`;
      if (seenPair.has(pair)) {
        problems.push(`Payer Enrollment, row ${e.line} (${e.who}): ${e.payer} appears twice for this provider; only the first row was imported.`);
        continue;
      }
      seenPair.add(pair);

      const fields = {
        status: e.status,
        submitted_date: e.submitted_date,
        effective_date: e.effective_date,
        next_follow_up_date: e.next_follow_up_date,
        external_ref: e.external_ref,
        notes: e.notes,
      };
      const { data: current } = await supabase
        .from("cred_enrollments")
        .select("id")
        .eq("provider_id", e.provider_id)
        .eq("payer_id", payerId)
        .maybeSingle();
      const { data: saved, error } = current
        ? await supabase.from("cred_enrollments").update(fields).eq("id", current.id).select("id").single()
        : await supabase.from("cred_enrollments").insert({ provider_id: e.provider_id, payer_id: payerId, ...fields }).select("id").single();
      if (error) {
        problems.push(`Payer Enrollment, row ${e.line} (${e.who}, ${e.payer}): not saved (${error.message}).`);
        continue;
      }
      report.enrollments++;

      if (e.followUp) {
        // Same date already logged on this application: a re-upload, not a new call.
        const { count: logged } = await supabase
          .from("cred_communications")
          .select("id", { count: "exact", head: true })
          .eq("enrollment_id", saved.id)
          .eq("contact_date", e.followUp.contact_date);
        if (logged) continue;
        const { error: logError } = await supabase.from("cred_communications").insert({ enrollment_id: saved.id, ...e.followUp });
        if (logError) problems.push(`Payer Enrollment, row ${e.line} (${e.who}, ${e.payer}): the last follow-up wasn't logged (${logError.message}).`);
        else report.followUps++;
      }
    }
  }

  let limit = null;
  if (leftOut.length) {
    const next = nextPlan(org.plan);
    limit = {
      message: `Your sheet has ${active.length + report.providersExisting} active providers. ${PLANS[org.plan].label} covers ${org.provider_limit}. ${
        leftOut.length === 1 ? "This one wasn't imported" : `These ${leftOut.length} weren't imported`
      }, and neither were their credentials and applications:`,
      names: leftOut.map((p) => `${p.first_name} ${p.last_name}`),
      upgrade: next ? `${next.label} covers ${next.providerLimit}.` : null,
    };
  }

  for (const path of ["/providers", "/dashboard", "/enrollments", "/follow-ups"]) revalidatePath(path);
  return { done: true, clientName: client.name, report, problems, limit, missingTabs: parsed.missingTabs };
}
