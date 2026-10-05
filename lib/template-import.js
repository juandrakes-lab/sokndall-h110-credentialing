import { excelDate } from "@/lib/xlsx";
import { normalizeDate } from "@/lib/dates";
import { US_STATES } from "@/lib/us-states";

// The free Sokndall template (Google Sheet 1oB5qRAY…, the file the template
// email links to) → rows the app can write. Pure: no database here; the
// Server Action in app/(app)/import-export/template does the writing.
//
// Mapping (H110_EMBUDO_LEADS.md "PEDIDO AL AGENTE DESARROLLADOR" + D4 of
// H110_CONVERSION_PEDIDO_DEV_1.md). The dropdown values below are the ones in
// the template's own data validations, read from the .xlsx on 2026-10-05.
// Nothing in a row is dropped silently: what has no field goes to notes, and
// what can't be read is reported with its tab and row.

const EXAMPLE_NOTE = "example row - delete me";
const EXAMPLE_NPI = "1234567890";

// Credentials → "Credential Type" dropdown.
const CREDENTIAL_TYPES = {
  "state medical license": { type: "state_license" },
  "dea registration": { type: "dea" },
  "state controlled substance registration": { type: "cds" },
  "malpractice insurance (coi)": { type: "malpractice" },
  "board certification": { type: "board_cert" },
  "caqh reattestation": { type: "caqh_attestation" },
  // No dedicated type in the app: kept as "Other", named as in the sheet.
  "medicare revalidation": { type: "other", name: "Medicare revalidation" },
  "medicaid revalidation": { type: "other", name: "Medicaid revalidation" },
  "bls/acls": { type: "other", name: "BLS/ACLS" },
  "hospital privileges": { type: "other", name: "Hospital privileges" },
  "business license": { type: "other", name: "Business license" },
  other: { type: "other", name: "Other" },
};

// Payer Enrollment → "Status" dropdown → the app's six states. "Withdrawn"
// has no state of its own: Not started, with the sheet's word in notes.
const ENROLLMENT_STATUSES = {
  "not started": "not_started",
  submitted: "submitted",
  "in review": "in_review",
  "info requested": "info_requested",
  approved: "approved",
  denied: "denied",
};

// Payer Enrollment → "Submitted Via" → the follow-up log's channel (phone,
// portal, email). Fax, mail, clearinghouse and rosters have no channel of
// their own; they log as Portal with the real one written in the entry.
const CHANNELS = {
  "caqh / payer portal": "portal",
  pecos: "portal",
  email: "email",
  fax: "portal",
  mail: "portal",
  clearinghouse: "portal",
  "delegated roster": "portal",
};

const low = (v) => (v === null || v === undefined ? "" : String(v).trim().toLowerCase());
const str = (v) => {
  if (v === null || v === undefined) return null;
  const s = typeof v === "number" ? String(v) : String(v).trim();
  return s ? s : null;
};

// A date cell: an Excel serial, or text the app's own parser understands.
function dateOf(v) {
  if (v === null || v === undefined || v === "") return { value: null };
  if (typeof v === "number") {
    const d = excelDate(v);
    return d ? { value: d } : { bad: String(v) };
  }
  const d = normalizeDate(String(v).trim());
  return d ? { value: d } : { bad: String(v) };
}

function stateCode(v) {
  const s = str(v);
  if (!s) return null;
  const found = US_STATES.find(([code, name]) => code.toLowerCase() === s.toLowerCase() || name.toLowerCase() === s.toLowerCase());
  return found ? found[0] : null;
}

// "Alvarez, Maria" → { last: "Alvarez", first: "Maria" }. Without a comma,
// the last word is the last name ("Maria Alvarez").
export function splitName(value) {
  const s = str(value);
  if (!s) return null;
  if (s.includes(",")) {
    const [last, ...rest] = s.split(",");
    const first = rest.join(",").trim();
    return last.trim() && first ? { last: last.trim(), first } : null;
  }
  const parts = s.split(/\s+/);
  return parts.length >= 2 ? { last: parts.pop(), first: parts.join(" ") } : null;
}

export const nameKey = (n) => `${n.first.trim().toLowerCase()}|${n.last.trim().toLowerCase()}`;

// The header row → { normalized header: column index }.
function columns(headerRow = []) {
  const map = {};
  headerRow.forEach((h, i) => {
    const k = low(h).replace(/\s+/g, " ");
    if (k) map[k] = i;
  });
  return map;
}

function sheetRows(sheet) {
  if (!sheet?.length) return { cols: {}, rows: [] };
  const cols = columns(sheet[0]);
  const rows = [];
  for (let i = 1; i < sheet.length; i++) {
    const r = sheet[i];
    if (!r) continue;
    rows.push({ line: i + 1, cells: r });
  }
  return { cols, rows };
}

const cell = (row, cols, header) => {
  const i = cols[header];
  return i === undefined ? null : row.cells[i] ?? null;
};

const isExample = (notes) => low(notes) === EXAMPLE_NOTE;

// The template carries footnotes in the name column below the data rows
// (CAQH row 42: "ASSUMPTION: 'Next Attestation Due' = …"). A provider name
// never has a colon or runs to a sentence, so such a row is skipped quietly.
const isFootnote = (rawName) => {
  const s = str(rawName);
  return !!s && (s.includes(":") || s.length > 80);
};

// Notes built from labelled pieces, skipping the empty ones.
const notesFrom = (pairs) =>
  pairs
    .filter(([, v]) => str(v))
    .map(([label, v]) => (label ? `${label}: ${str(v)}` : str(v)))
    .join("\n") || null;

const TABS = ["Providers", "Credentials", "Payer Enrollment", "CAQH"];

// workbook (readWorkbook) → everything to write, plus the problems found.
export function parseTemplate(workbook) {
  const problems = [];
  const missingTabs = TABS.filter((t) => !workbook[t]);
  if (missingTabs.length === TABS.length) {
    return { notTemplate: true, problems: ["This doesn't look like the Sokndall template: none of its tabs (Providers, Credentials, Payer Enrollment, CAQH) are in the file."] };
  }

  const exampleNames = new Set();

  // --- Providers ---------------------------------------------------------
  const providers = [];
  {
    const { cols, rows } = sheetRows(workbook.Providers);
    for (const row of rows) {
      const rawName = cell(row, cols, "provider name (last, first)");
      if (!str(rawName) || isFootnote(rawName)) continue;
      const notes = cell(row, cols, "notes");
      const npi = str(cell(row, cols, "npi"))?.replace(/\D/g, "") || null;
      const name = splitName(rawName);
      if (isExample(notes) || npi === EXAMPLE_NPI) {
        if (name) exampleNames.add(nameKey(name));
        continue;
      }
      const where = `Providers, row ${row.line}`;
      if (!name) {
        problems.push(`${where}: "${str(rawName)}" isn't a name we can split. Write it "Last, First".`);
        continue;
      }
      const start = dateOf(cell(row, cols, "start date"));
      if (start.bad) problems.push(`${where} (${name.first} ${name.last}): start date "${start.bad}" isn't a date; it was left as today.`);
      const employment = low(cell(row, cols, "employment status"));
      // Active and Pending Start → active (Pending Start keeps its start
      // date); Leave stays active, noted; Terminated → inactive, which takes
      // no place on the plan (alcance §4.3).
      const status = employment === "terminated" || employment === "inactive" ? "inactive" : "active";
      providers.push({
        line: row.line,
        key: nameKey(name),
        first_name: name.first,
        last_name: name.last,
        npi,
        specialty: str(cell(row, cols, "specialty")),
        start_date: start.value,
        status,
        notes: notesFrom([
          ["Credential", cell(row, cols, "credential")],
          ["Location / Site", cell(row, cols, "location / site")],
          [null, employment === "leave" ? "On leave (from the spreadsheet)" : null],
          [null, notes],
        ]),
      });
    }
  }

  // --- CAQH --------------------------------------------------------------
  // One row per provider: the CAQH ID goes on the provider; the last
  // attestation date becomes a CAQH attestation credential (the database
  // works out the next due date from the account's interval).
  const caqh = [];
  {
    const { cols, rows } = sheetRows(workbook.CAQH);
    for (const row of rows) {
      const rawName = cell(row, cols, "provider name");
      if (!str(rawName) || isFootnote(rawName)) continue;
      const notes = cell(row, cols, "notes");
      const name = splitName(rawName);
      if (isExample(notes) || (name && exampleNames.has(nameKey(name)))) continue;
      const where = `CAQH, row ${row.line}`;
      if (!name) {
        problems.push(`${where}: "${str(rawName)}" isn't a name we can split. Write it "Last, First".`);
        continue;
      }
      const attested = dateOf(cell(row, cols, "last attestation date"));
      if (attested.bad) problems.push(`${where} (${name.first} ${name.last}): last attestation date "${attested.bad}" isn't a date.`);
      caqh.push({
        line: row.line,
        key: nameKey(name),
        who: `${name.first} ${name.last}`,
        caqh_id: str(cell(row, cols, "caqh provider id"))?.replace(/\D/g, "") || null,
        issue_date: attested.value,
        notes: notesFrom([
          ["Profile complete", cell(row, cols, "profile complete?")],
          ["Docs expiring in profile", cell(row, cols, "docs expiring in profile")],
          [null, notes],
        ]),
      });
    }
  }
  const caqhFromTab = new Set(caqh.filter((c) => c.issue_date).map((c) => c.key));

  // --- Credentials -------------------------------------------------------
  const credentials = [];
  {
    const { cols, rows } = sheetRows(workbook.Credentials);
    for (const row of rows) {
      const rawName = cell(row, cols, "provider name");
      const rawType = cell(row, cols, "credential type");
      if ((!str(rawName) && !str(rawType)) || isFootnote(rawName)) continue;
      const notes = cell(row, cols, "notes");
      const name = splitName(rawName);
      if (isExample(notes) || (name && exampleNames.has(nameKey(name)))) continue;
      const where = `Credentials, row ${row.line}`;
      if (!name) {
        problems.push(`${where}: "${str(rawName) ?? ""}" isn't a name we can split. Write it "Last, First".`);
        continue;
      }
      const who = `${name.first} ${name.last}`;
      const mapped = CREDENTIAL_TYPES[low(rawType)];
      if (!mapped) {
        problems.push(`${where} (${who}): "${str(rawType) ?? ""}" isn't one of the template's credential types.`);
        continue;
      }
      // The CAQH tab is the source for attestations when it has the provider.
      if (mapped.type === "caqh_attestation" && caqhFromTab.has(nameKey(name))) continue;

      const issue = dateOf(cell(row, cols, "issue date"));
      const expiry = dateOf(cell(row, cols, "expiration date"));
      for (const [label, d] of [["issue date", issue], ["expiration date", expiry]]) {
        if (d.bad) problems.push(`${where} (${who}): ${label} "${d.bad}" isn't a date.`);
      }
      const body = str(cell(row, cols, "state / issuing body"));
      credentials.push({
        line: row.line,
        key: nameKey(name),
        who,
        type: mapped.type,
        custom_name: mapped.name ?? null,
        // "State / Issuing Body" holds a state for licenses and registrations,
        // a carrier or board for malpractice and board certification. The
        // action places it by what the type uses.
        stateOrBody: body,
        state: stateCode(body),
        number: str(cell(row, cols, "id / number")),
        issue_date: issue.value,
        expiration_date: expiry.value,
        notes: notesFrom([
          ["Responsible person", cell(row, cols, "responsible person")],
          ["Renewal started", cell(row, cols, "renewal started?")],
          [null, notes],
        ]),
      });
    }
  }

  // --- Payer Enrollment --------------------------------------------------
  const enrollments = [];
  {
    const { cols, rows } = sheetRows(workbook["Payer Enrollment"]);
    for (const row of rows) {
      const rawName = cell(row, cols, "provider name");
      const payer = str(cell(row, cols, "payer"));
      if ((!str(rawName) && !payer) || isFootnote(rawName)) continue;
      const notes = cell(row, cols, "notes");
      const name = splitName(rawName);
      if (isExample(notes) || (name && exampleNames.has(nameKey(name)))) continue;
      const where = `Payer Enrollment, row ${row.line}`;
      if (!name) {
        problems.push(`${where}: "${str(rawName) ?? ""}" isn't a name we can split. Write it "Last, First".`);
        continue;
      }
      const who = `${name.first} ${name.last}`;
      if (!payer) {
        problems.push(`${where} (${who}): the Payer column is empty.`);
        continue;
      }
      const rawStatus = str(cell(row, cols, "status"));
      const status = ENROLLMENT_STATUSES[low(rawStatus)] ?? "not_started";
      const unknownStatus = rawStatus && !ENROLLMENT_STATUSES[low(rawStatus)];

      const dates = {};
      for (const [field, header] of [
        ["submitted_date", "submitted date"],
        ["effective_date", "effective date"],
        ["last_follow_up", "last follow-up"],
        ["next_follow_up_date", "next follow-up due"],
      ]) {
        const d = dateOf(cell(row, cols, header));
        if (d.bad) problems.push(`${where} (${who}): ${header} "${d.bad}" isn't a date.`);
        dates[field] = d.value;
      }
      const via = str(cell(row, cols, "submitted via"));
      enrollments.push({
        line: row.line,
        key: nameKey(name),
        who,
        payer,
        status,
        submitted_date: dates.submitted_date,
        effective_date: dates.effective_date,
        next_follow_up_date: dates.next_follow_up_date,
        external_ref: str(cell(row, cols, "confirmation / tracking #")),
        followUp: dates.last_follow_up
          ? {
              contact_date: dates.last_follow_up,
              channel: CHANNELS[low(via)] ?? "portal",
              contact_person: str(cell(row, cols, "payer contact")),
              outcome: `Imported from the spreadsheet${via ? ` (submitted via ${via})` : ""}.`,
            }
          : null,
        notes: notesFrom([
          [null, unknownStatus ? `Status in the spreadsheet: ${rawStatus}` : null],
          ["Plan / product / network", cell(row, cols, "plan / product / network")],
          ["Request type", cell(row, cols, "request type")],
          ["Submitted via", !dates.last_follow_up ? via : null],
          ["Payer provider ID / PTAN", cell(row, cols, "payer provider id / ptan")],
          ["Linked to group TIN", cell(row, cols, "linked to group tin?")],
          ["Claims being held", cell(row, cols, "claims being held?")],
          [null, notes],
        ]),
      });
    }
  }

  return { providers, credentials, caqh, enrollments, problems, missingTabs };
}
