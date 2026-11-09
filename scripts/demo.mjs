// Demo accounts (pedido 2026-11-08). Run from the repo root; reads .env.local.
//
//   node scripts/demo.mjs create "Lead Name" "Firm Name"   → prints the demo link
//   node scripts/demo.mjs list
//   node scripts/demo.mjs extend <firm or org id>           → +72 h, once
//   node scripts/demo.mjs revoke <firm or org id>           → the link stops working now
//   node scripts/demo.mjs delete <firm or org id>           → deletes it now
//
// The demo is a fictitious billing firm — "Northline Billing Group": 4 clients,
// 20 providers, 7 payers, applications in every state, follow-ups and
// credentials expiring — sample data only (@example.com, made-up NPIs). It
// never touches Polar. Its dates are set relative to today and shifted to the
// first open by /demo/<code>.
import { readFileSync } from "node:fs";
import { createHash, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const must = async (p) => { const { data, error } = await p; if (error) throw new Error(error.message); return data; };
const ORIGIN = process.env.DEMO_ORIGIN ?? "https://sokndall.com";
const [cmd, ...args] = process.argv.slice(2);

async function findDemo(key) {
  const demos = await must(db.from("cred_demos").select("*"));
  const hit = demos.filter((d) => d.org_id === key || d.firm.toLowerCase() === String(key).toLowerCase());
  if (hit.length !== 1) throw new Error(hit.length ? `More than one demo matches "${key}"; use the org id.` : `No demo matches "${key}".`);
  return hit[0];
}

// Returns instead of process.exit(): on Windows, exiting with fetch handles
// still open trips a libuv assertion.
async function main() {
  if (cmd === "list") {
    const demos = await must(db.from("cred_demos").select("org_id, firm, lead_name, created_at, first_opened_at, expires_at, extended, revoked_at, contact_email, last_seen_at").order("created_at"));
    for (const d of demos) {
      const state = d.revoked_at ? "revoked" : !d.first_opened_at ? "not opened" : new Date(d.expires_at) > new Date() ? "live" : "ended";
      console.log(`${d.firm} · ${d.lead_name ?? "-"} · ${state} · opened ${d.first_opened_at ?? "-"} · ends ${d.expires_at ?? "-"} · last seen ${d.last_seen_at ?? "-"} · email ${d.contact_email ? "yes" : "no"} · ${d.org_id}`);
    }
    if (!demos.length) console.log("No demos.");
    return;
  }

  if (cmd === "extend") {
    const d = await findDemo(args[0]);
    if (d.extended) throw new Error("This demo was already extended once.");
    if (!d.expires_at) throw new Error("Not opened yet: nothing to extend (the 72 h start at the first open).");
    const base = Math.max(Date.now(), new Date(d.expires_at).getTime());
    await must(db.from("cred_demos").update({ expires_at: new Date(base + 72 * 3600000).toISOString(), extended: true, summary_sent_at: null }).eq("org_id", d.org_id));
    console.log(`Extended: ${d.firm} now ends ${new Date(base + 72 * 3600000).toUTCString()}.`);
    return;
  }

  if (cmd === "revoke") {
    const d = await findDemo(args[0]);
    await must(db.from("cred_demos").update({ revoked_at: new Date().toISOString() }).eq("org_id", d.org_id));
    console.log(`Revoked: ${d.firm}. The link no longer works; the data is deleted by the daily job in 7 days, or now with "delete".`);
    return;
  }

  if (cmd === "delete") {
    const d = await findDemo(args[0]);
    const org = await must(db.from("cred_organizations").select("owner_user_id").eq("id", d.org_id).single());
    const { error } = await db.auth.admin.deleteUser(org.owner_user_id);
    if (error) throw error;
    console.log(`Deleted: ${d.firm} and all its sample data.`);
    return;
  }

  if (cmd !== "create") {
    console.log('Usage: node scripts/demo.mjs create "Lead Name" "Firm Name" | list | extend <firm> | revoke <firm> | delete <firm>');
    process.exitCode = 1;
    return;
  }

  // --- create -----------------------------------------------------------------
  const [leadName, firm] = args;
  if (!leadName || !firm) throw new Error('Give the lead and the firm: create "Lead Name" "Firm Name"');

  const tag = randomBytes(4).toString("hex");
  const { data: u, error: ue } = await db.auth.admin.createUser({
    email: `demo-${tag}@example.com`, email_confirm: true, password: randomBytes(24).toString("base64url"),
    user_metadata: { full_name: "Jordan Ellis", first_name: "Jordan", last_name: "Ellis" },
  });
  if (ue) throw ue;
  const OWNER = u.user.id;
  const ORG = (await must(db.from("cred_organizations").insert({ name: "Northline Billing Group", owner_user_id: OWNER, plan: "billing_co", seats: 10, subscription_status: "active" }).select("id").single())).id;
  await must(db.from("cred_org_members").insert({ org_id: ORG, user_id: OWNER, role: "owner" }));

  const today = new Date().toISOString().slice(0, 10);
  const d = (n) => { const t = new Date(today + "T12:00:00Z"); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };
  const ago = (n) => new Date(Date.now() - n * 86400000).toISOString();

  const PAYERS = ["Aetna", "Cigna Healthcare", "UnitedHealthcare", "Medicare Part B (Original Medicare)", "New York Medicaid", "Anthem Blue Cross Blue Shield", "Humana"];
  const globals = await must(db.from("cred_payers_global").select("id, name").in("name", PAYERS));
  if (globals.length !== PAYERS.length) throw new Error("missing payer: " + PAYERS.filter((p) => !globals.find((g) => g.name === p)));

  let npiSeed = 4200000 + Math.floor(Math.random() * 500000);
  const npi = () => { const b = "80840" + String(npiSeed++).padStart(9, "0"); let sum = 0; for (let i = 0; i < b.length; i++) { let n = +b[b.length - 1 - i]; if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; } sum += n; } return b.slice(5) + ((10 - (sum % 10)) % 10); };

  // Grid per payer (Aetna, Cigna, UHC, Medicare, Medicaid, Anthem, Humana):
  // A approved · R in review · S submitted · I info requested · D denied · N not started · - none
  const BOOK = {
    "Clearwater Behavioral Health": [
      ["Lena", "Fischer", "Clinical Social Work (LCSW)", "AARAASN"], ["Omar", "Haddad", "Psychiatric NP (PMHNP)", "ARR-AIS"],
      ["Tess", "Calloway", "Counseling (LPC)", "SAA-ARA"], ["Victor", "Ruiz", "Clinical Psychology (PsyD)", "AAAARAR"],
      ["Nadia", "Petrov", "Marriage & Family Therapy", "RSN-AI-"], ["Grace", "Whitfield", "Clinical Social Work (LCSW)", "ADRA-SN"]],
    "Maple Street Pediatrics": [
      ["Maya", "Chen", "Pediatrics", "AARAAAS"], ["Daniel", "Okafor", "Pediatrics", "ASAAARA"], ["Ethan", "Brooks", "Pediatric Cardiology", "RAN-SAN"],
      ["Lauren", "Mitchell", "Pediatric Nurse Practitioner", "ARAD-AR"], ["Samuel", "Park", "Pediatrics", "SNR-ISA"]],
    "Harbor Physical Therapy": [
      ["Iris", "Monroe", "Physical Therapy (DPT)", "AARSA-N"], ["Caleb", "Torres", "Physical Therapy (DPT)", "RASAANR"],
      ["Priya", "Natarajan", "Occupational Therapy (OTR)", "SARN-AA"], ["Hugo", "Lindqvist", "Physical Therapy (DPT)", "AAAARS-"],
      ["Mara", "Delgado", "Physical Therapist Assistant", "NSA-RAI"], ["Jonah", "Becker", "Physical Therapy (DPT)", "ARA-SAA"],
      ["Elise", "Durand", "Speech-Language Pathology", "RAAN-SA"]],
    "Dr. Alan Reeves, Dermatology": [["Alan", "Reeves", "Dermatology", "ARASAIA"], ["Sofia", "Reeves", "Dermatology PA", "SAN-RAA"]],
  };
  // Days in the current status, cycled per letter. The first in-review is 30
  // (stalls the day after the first open: day 1); others are already past it.
  const DAYS = { R: [30, 6, 12, 18, 24, 38, 47, 33, 15, 9], S: [3, 5, 9, 14, 4, 11], I: [4, 8, 11, 6], D: [60] };
  const STATUS = { A: "approved", R: "in_review", S: "submitted", I: "info_requested", D: "denied", N: "not_started" };
  const REQUESTS = ["Signed W-9 dated this year", "Updated malpractice certificate", "Copy of board certificate", "Work history gap explanation"];
  const FU = [-4, -2, 0, 1, 3, 5, 8, 10, -6, 2, 0, 1];
  // Credential expirations (days from today): some soon, most later.
  const OFFS = [-6, 18, 34, 47, 66, 82, 101, 118, 190, 260, 400, 29, 55, 92, 140, 300];

  let ci = 0, credI = 0, fuI = 0, reqI = 0, caqhDone = false;
  const cnt = { R: 0, S: 0, I: 0, D: 0 };
  for (const [clientName, people] of Object.entries(BOOK)) {
    const client = (await must(db.from("cred_client_orgs").insert({ org_id: ORG, name: clientName }).select("id").single())).id;
    const practice = (await must(db.from("cred_practices").insert({ org_id: ORG, client_org_id: client, legal_name: clientName, service_state: "NY" }).select("id").single())).id;
    ci++;
    const payerIds = [];
    for (const name of PAYERS) payerIds.push((await must(db.from("cred_payers_org").insert({ org_id: ORG, client_org_id: client, payer_global_id: globals.find((g) => g.name === name).id }).select("id").single())).id);

    for (const [first, last, specialty, grid] of people) {
      const p = await must(db.from("cred_providers").insert({ practice_id: practice, first_name: first, last_name: last, specialty, npi: npi(), start_date: d(-900), status: "active", email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com` }).select("id").single());
      for (const [type, extra] of [["state_license", { state: "NY", number: `NY-${100000 + credI * 37}` }], ["dea", { state: "NY", number: `DX${1000000 + credI * 91}` }], ["malpractice", { issuer: "Demo Mutual Insurance", number: `POL-${5000 + credI * 13}`, coverage: "$1M / $3M" }], ["caqh_attestation", {}]]) {
        const off = OFFS[credI++ % OFFS.length];
        const row = { org_id: ORG, client_org_id: client, provider_id: p.id, type, ...extra };
        if (type === "caqh_attestation") {
          // One re-attestation due in 33 days: it enters the 30-day alert on day 3.
          row.issue_date = caqhDone ? d(off - 120) : d(33 - 120);
          caqhDone = true;
        } else {
          row.issue_date = d(off - 700);
          row.expiration_date = d(off);
        }
        await must(db.from("cred_credentials").insert(row));
      }
      for (let k = 0; k < PAYERS.length; k++) {
        const L = grid[k];
        if (!L || L === "-") continue;
        const row = { provider_id: p.id, payer_id: payerIds[k], status: STATUS[L], assigned_user_id: OWNER };
        if (L !== "N") row.submitted_date = d(L === "A" || L === "D" ? -400 : -40);
        if (L === "A") row.effective_date = d(-300);
        if (L !== "A" && L !== "N") row.next_follow_up_date = d(FU[fuI++ % FU.length]);
        if (L === "D") row.notes = "Panel closed for this specialty in the service area.";
        const e = await must(db.from("cred_enrollments").insert(row).select("id").single());
        if (L === "A" || L === "N") continue;
        const days = DAYS[L][cnt[L]++ % DAYS[L].length];
        const upd = { status_changed_at: ago(days) };
        if (L === "I") { upd.pending_request = REQUESTS[reqI++ % REQUESTS.length]; upd.pending_request_at = ago(days); }
        await must(db.from("cred_enrollments").update(upd).eq("id", e.id));
        if (L !== "D") await must(db.from("cred_communications").insert({ enrollment_id: e.id, contact_date: d(-Math.max(1, Math.min(days, 9))), channel: "phone", contact_person: "Provider relations", outcome: "Application in queue for credentialing review.", requested: L === "I" ? upd.pending_request : null }));
      }
    }
  }

  const code = randomBytes(18).toString("base64url");
  await must(db.from("cred_demos").insert({
    org_id: ORG, firm, lead_name: leadName, link_hash: createHash("sha256").update(code).digest("hex"), seeded_at: new Date().toISOString(),
  }));
  console.log(`Demo for ${firm} (${leadName}) is ready.`);
  console.log(`Link (valid 7 days until first opened, then 72 h): ${ORIGIN}/demo/${code}`);
  console.log(`Org id: ${ORG}`);

}
await main();
