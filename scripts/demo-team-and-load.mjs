// Helpers for scripts/demo.mjs (pedido 2026-11-17):
//
//   addTeam    two fictitious teammates on the demo, applications spread
//              across them (and some unassigned), a follow-up rhythm on three
//              payers, and one provider scheduled to start soon with
//              applications still open — so "All clients", "Team member",
//              "Follow up every N days" and "At risk" show something.
//   loadList   a prospect's own list (CSV or Excel, columns as they come)
//              into a demo, as a new client or replacing one. Providers,
//              payers and where each application stands. Sample-data rules
//              stay: no patient data is read from the file — only provider,
//              payer and status columns are used.
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { parseCsv } from "../lib/csv.js";
import { readWorkbook, excelDate } from "../lib/xlsx.js";

const must = async (p) => {
  const { data, error } = await p;
  if (error) throw new Error(error.message);
  return data;
};

export const TEAM = [
  { first: "Ana", last: "Torres" },
  { first: "Ben", last: "Lowe" },
];

export async function addTeam(db, org) {
  const { data: owner } = await db.from("cred_organizations").select("owner_user_id").eq("id", org).single();
  const existing = await must(db.from("cred_org_members").select("user_id").eq("org_id", org).eq("role", "member"));
  const ids = existing.map((m) => m.user_id);
  if (!ids.length) {
    for (const t of TEAM) {
      const { data, error } = await db.auth.admin.createUser({
        email: `demo-${randomBytes(4).toString("hex")}-${t.first.toLowerCase()}@example.com`,
        email_confirm: true,
        password: randomBytes(24).toString("base64url"),
        user_metadata: { full_name: `${t.first} ${t.last}`, first_name: t.first, last_name: t.last },
      });
      if (error) throw error;
      await must(db.from("cred_org_members").insert({ org_id: org, user_id: data.user.id, role: "member" }));
      ids.push(data.user.id);
    }
  }
  // Owner, Ana, Ben, nobody — in turn, over the applications still in play.
  const who = [owner.owner_user_id, ids[0], ids[1], ids[0], null, ids[1]];
  const apps = await must(db.from("cred_enrollments").select("id, status").eq("org_id", org).neq("status", "approved").order("created_at"));
  let i = 0;
  for (const a of apps) await must(db.from("cred_enrollments").update({ assigned_user_id: who[i++ % who.length] }).eq("id", a.id));

  // A rhythm on three payers in every client.
  const payers = await must(db.from("cred_payers_org").select("id, cred_payers_global(name)").eq("org_id", org));
  const rhythm = { Aetna: 15, UnitedHealthcare: 20, "New York Medicaid": 30 };
  for (const p of payers) {
    const n = rhythm[p.cred_payers_global?.name];
    if (n) await must(db.from("cred_payers_org").update({ follow_up_every_days: n }).eq("id", p.id));
  }

  // One provider starting in three weeks with applications still open.
  const target = await must(db.from("cred_providers").select("id").eq("org_id", org).eq("last_name", "Durand").limit(1));
  const fallback = target.length ? target : await must(db.from("cred_providers").select("id").eq("org_id", org).limit(1));
  if (fallback[0]) {
    const t = new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10);
    await must(db.from("cred_providers").update({ go_live_date: t }).eq("id", fallback[0].id));
  }
  return { teammates: ids.length, assigned: apps.length };
}

// Free-form column names → what they hold.
const COLUMNS = {
  name: ["provider", "provider name", "name", "full name", "clinician"],
  first: ["first", "first name", "firstname", "given name"],
  last: ["last", "last name", "lastname", "surname", "family name"],
  npi: ["npi", "npi number", "individual npi", "type 1 npi"],
  specialty: ["specialty", "speciality", "taxonomy", "provider type", "credential"],
  payer: ["payer", "insurance", "plan", "carrier", "payer name", "insurance company", "health plan"],
  status: ["status", "enrollment status", "credentialing status", "stage", "state of application"],
  submitted: ["submitted", "submitted date", "date submitted", "application date", "sent"],
  client: ["client", "practice", "group", "facility", "location"],
};
const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();

export function mapColumns(header) {
  const map = {};
  header.forEach((h, i) => {
    const n = norm(h);
    for (const [key, names] of Object.entries(COLUMNS)) {
      if (map[key] === undefined && names.some((x) => n === x || n.startsWith(`${x} `) || n.endsWith(` ${x}`))) map[key] = i;
    }
  });
  return map;
}

export function statusOf(text) {
  const s = norm(text);
  if (!s) return "not_started";
  if (/approv|active|par\b|participat|complete|credentialed|effective|loaded/.test(s)) return "approved";
  if (/den|reject|declin|closed/.test(s)) return "denied";
  if (/info|request|missing|need|pending doc|waiting on/.test(s)) return "info_requested";
  if (/review|process|pending|progress|received/.test(s)) return "in_review";
  if (/submit|sent|applied|filed/.test(s)) return "submitted";
  return "not_started";
}

function readRows(path) {
  const buf = readFileSync(path);
  if (/\.xlsx$/i.test(path)) {
    const sheets = Object.values(readWorkbook(buf)).map((rows) => Array.from(rows, (r) => Array.from(r ?? [], (c) => (c === null || c === undefined ? "" : String(c)))));
    return sheets.find((rows) => rows.some((r) => r.some((c) => c.trim()))) ?? [];
  }
  const { headers, rows } = parseCsv(buf.toString("utf8"));
  return [headers, ...rows];
}

export async function loadList(db, org, path, { clientName, replace } = {}) {
  const rows = readRows(path).filter((r) => r.some((c) => String(c).trim()));
  const headerAt = rows.findIndex((r) => Object.keys(mapColumns(r)).length >= 2);
  if (headerAt < 0) throw new Error("Couldn't find a header row with at least a provider and a payer column.");
  const map = mapColumns(rows[headerAt]);
  if (map.name === undefined && map.last === undefined) throw new Error("No provider name column found.");
  const body = rows.slice(headerAt + 1);

  const name = clientName ?? (map.client !== undefined ? body.find((r) => r[map.client])?.[map.client] : null) ?? "Your client";
  if (replace) {
    const old = await must(db.from("cred_client_orgs").select("id").eq("org_id", org).ilike("name", replace));
    for (const c of old) await must(db.from("cred_client_orgs").delete().eq("id", c.id));
  }
  const client = (await must(db.from("cred_client_orgs").insert({ org_id: org, name }).select("id").single())).id;
  const practice = (await must(db.from("cred_practices").insert({ org_id: org, client_org_id: client, legal_name: name }).select("id").single())).id;

  const globals = await must(db.from("cred_payers_global").select("id, name"));
  const payerIds = new Map();
  async function payerId(raw) {
    const key = norm(raw);
    if (!key) return null;
    if (payerIds.has(key)) return payerIds.get(key);
    const g = globals.find((x) => norm(x.name) === key) ?? globals.find((x) => norm(x.name).startsWith(key) || key.startsWith(norm(x.name)));
    const row = g
      ? { org_id: org, client_org_id: client, payer_global_id: g.id }
      : { org_id: org, client_org_id: client, name: String(raw).trim().slice(0, 120), payer_type: "commercial", revalidation_months: 36 };
    const existing = g ? await must(db.from("cred_payers_org").select("id").eq("client_org_id", client).eq("payer_global_id", g.id)) : [];
    const id = existing[0]?.id ?? (await must(db.from("cred_payers_org").insert(row).select("id").single())).id;
    payerIds.set(key, id);
    return id;
  }

  const providers = new Map();
  let apps = 0;
  for (const r of body) {
    // "Quinn, Avery MD" or "Riley Moss NP": the degrees come off first.
    const DEGREE = /[,\s]+(md|do|np|pa|pa-c|lcsw|lpc|lmft|phd|psyd|dpt|rn|aprn|fnp|fnp-c|pmhnp|dds|od)\.?$/i;
    let full = map.name !== undefined ? String(r[map.name] ?? "").trim() : "";
    while (DEGREE.test(full)) full = full.replace(DEGREE, "").trim();
    let first = map.first !== undefined ? String(r[map.first] ?? "").trim() : "";
    let last = map.last !== undefined ? String(r[map.last] ?? "").trim() : "";
    if (!last && full) {
      if (full.includes(",")) {
        const [l, ...f] = full.split(",").map((s) => s.trim());
        last = l;
        first = f.join(" ");
      } else {
        const parts = full.split(/\s+/);
        last = parts.length > 1 ? parts.slice(1).join(" ") : parts[0];
        first = parts.length > 1 ? parts[0] : "";
      }
    }
    if (!last) continue;
    const npi = map.npi !== undefined ? String(r[map.npi] ?? "").replace(/\D/g, "") : "";
    const pkey = npi || `${first} ${last}`.toLowerCase();
    if (!providers.has(pkey)) {
      const p = await must(
        db
          .from("cred_providers")
          .insert({
            practice_id: practice,
            first_name: first || "—",
            last_name: last,
            npi: npi.length === 10 ? npi : null,
            specialty: map.specialty !== undefined ? String(r[map.specialty] ?? "").trim() || null : null,
            status: "active",
            start_date: new Date().toISOString().slice(0, 10),
          })
          .select("id")
          .single()
      );
      providers.set(pkey, p.id);
    }
    const payer = map.payer !== undefined ? await payerId(r[map.payer]) : null;
    if (!payer) continue;
    const status = statusOf(map.status !== undefined ? r[map.status] : "");
    const sub = map.submitted !== undefined ? r[map.submitted] : "";
    const submitted = /^\d+(\.\d+)?$/.test(String(sub)) ? excelDate(Number(sub)) : /^\d{4}-\d{2}-\d{2}/.test(String(sub)) ? String(sub).slice(0, 10) : null;
    const { error } = await db.from("cred_enrollments").upsert(
      { provider_id: providers.get(pkey), payer_id: payer, status, ...(submitted && status !== "not_started" ? { submitted_date: submitted } : {}) },
      { onConflict: "provider_id,payer_id" }
    );
    if (!error) {
      apps++;
      // Days in status count from the list's submitted date, not from today.
      if (["submitted", "in_review", "info_requested"].includes(status)) {
        // The next call: the payer's rhythm (or 14 days) after the submission,
        // never before today — so the list lands in Follow-ups right away.
        const today = new Date().toISOString().slice(0, 10);
        const base = submitted ?? today;
        const next = new Date(`${base}T12:00:00Z`);
        next.setUTCDate(next.getUTCDate() + 14);
        const due = next.toISOString().slice(0, 10) < today ? today : next.toISOString().slice(0, 10);
        await db
          .from("cred_enrollments")
          .update({ next_follow_up_date: due, ...(submitted ? { status_changed_at: `${submitted}T12:00:00Z` } : {}) })
          .eq("provider_id", providers.get(pkey))
          .eq("payer_id", payer);
      }
    }
  }
  // The visitor keeps their own three new providers.
  await must(db.from("cred_demos").update({ seeded_at: new Date().toISOString() }).eq("org_id", org));
  return { client: name, providers: providers.size, payers: payerIds.size, applications: apps, columns: map };
}
