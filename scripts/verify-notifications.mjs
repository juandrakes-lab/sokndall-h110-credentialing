// Verification script, not part of the app runtime: runs the real alert and
// digest cron routes against a throwaway organization and checks who got
// what, that the owner is copied, that nothing is sent twice, and that a
// member only hears about the clients they can see.
//
// Recipients are Resend's test inbox (delivered+…@resend.dev), which accepts
// mail without a verified domain, so this proves delivery all the way to
// Resend. Needs the dev server running.
//
// Usage: node scripts/verify-notifications.mjs [base-url]   (default http://localhost:3100)

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const BASE = process.argv[2] ?? "http://localhost:3100";
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const run = Date.now();
const users = [];
const results = [];

function check(name, ok, detail = "") {
  results.push(ok);
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
}

// "Today" in US Eastern, like the app.
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York" }).format(new Date());
const inDays = (n) => new Date(Date.parse(today) + n * 86400000).toISOString().slice(0, 10);

async function user(tag) {
  const email = `delivered+${tag}-${run}@resend.dev`;
  const { data, error } = await admin.auth.admin.createUser({ email, password: `N-${run}-${tag}-x9`, email_confirm: true });
  if (error) throw new Error(error.message);
  users.push(data.user.id);
  return { id: data.user.id, email };
}

async function cron(path, orgId) {
  const res = await fetch(`${BASE}/api/cron/${path}?org=${orgId}`, {
    headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
  });
  return { status: res.status, body: await res.json() };
}

async function main() {
  const owner = await user("owner");
  const member = await user("member");

  const { data: org } = await admin
    .from("cred_organizations")
    .insert({ name: `Notify test ${run}`, owner_user_id: owner.id, plan: "practice" })
    .select("id")
    .single();
  await admin.from("cred_org_members").insert([
    { org_id: org.id, user_id: owner.id, role: "owner" },
    { org_id: org.id, user_id: member.id, role: "member" },
  ]);
  const { data: client } = await admin.from("cred_client_orgs").insert({ org_id: org.id, name: "Clinic" }).select("id").single();
  const { data: practice } = await admin.from("cred_practices").insert({ client_org_id: client.id, legal_name: "Clinic LLC" }).select("id").single();
  const { data: provs } = await admin
    .from("cred_providers")
    .insert([
      { practice_id: practice.id, first_name: "Alma", last_name: "Ruiz" },
      { practice_id: practice.id, first_name: "Omar", last_name: "Diaz" },
    ])
    .select("id, first_name");
  const [alma, omar] = provs;

  await admin.from("cred_credentials").insert([
    { provider_id: alma.id, type: "state_license", state: "TX", number: "L-10", expiration_date: inDays(10), assigned_user_id: member.id },
    { provider_id: alma.id, type: "dea", number: "AR1234563", expiration_date: inDays(25) },
    { provider_id: omar.id, type: "malpractice", issuer: "MedPro", expiration_date: inDays(-3) },
    { provider_id: omar.id, type: "state_license", state: "TX", number: "L-200", expiration_date: inDays(200) },
  ]);

  const { data: aetna } = await admin.from("cred_payers_global").select("id").eq("name", "Aetna").single();
  const { data: payer } = await admin.from("cred_payers_org").insert({ org_id: org.id, payer_global_id: aetna.id }).select("id").single();
  const { data: medicare } = await admin.from("cred_payers_global").select("id").eq("name", "Medicare Part B (Original Medicare)").single();
  const { data: payer2 } = await admin.from("cred_payers_org").insert({ org_id: org.id, payer_global_id: medicare.id }).select("id").single();

  // Approved 36 months ago (+50 days): revalidation due in 50 days.
  const effective = new Date(Date.parse(inDays(50)));
  effective.setUTCFullYear(effective.getUTCFullYear() - 3);
  await admin.from("cred_enrollments").insert([
    { provider_id: alma.id, payer_id: payer.id, status: "approved", effective_date: effective.toISOString().slice(0, 10) },
    { provider_id: omar.id, payer_id: payer.id, status: "submitted", next_follow_up_date: inDays(-1) },
  ]);
  const { data: stuck } = await admin
    .from("cred_enrollments")
    .insert({ provider_id: omar.id, payer_id: payer2.id, status: "in_review" })
    .select("id")
    .single();
  await admin.from("cred_enrollments").update({ status_changed_at: new Date(Date.now() - 40 * 86400000).toISOString() }).eq("id", stuck.id);

  // --- Alerts ----------------------------------------------------------------
  const first = await cron("expiration-alerts", org.id);
  check("Alert cron runs", first.status === 200, JSON.stringify(first.body).slice(0, 200));

  const { data: log } = await admin.from("cred_notification_log").select("*").eq("org_id", org.id).eq("kind", "alert");
  const toMember = log.filter((r) => r.recipient === member.email);
  const toOwner = log.filter((r) => r.recipient === owner.email);

  check("The member gets the license assigned to them (14-day rung)", toMember.length === 1 && toMember[0].subject_key.endsWith(`:${inDays(10)}:14`), toMember.map((r) => r.subject_key).join());
  check("…with the owner in copy", toMember[0]?.cc === owner.email);
  check(
    "The owner gets the unassigned items: 30-day DEA, the expired policy, the 60-day revalidation",
    toOwner.length === 3 &&
      toOwner.some((r) => r.subject_key.endsWith(":30")) &&
      toOwner.some((r) => r.subject_key.endsWith(":expired")) &&
      toOwner.some((r) => r.subject_key.startsWith("revalidation:") && r.subject_key.endsWith(":60")),
    toOwner.map((r) => r.subject_key.split(":").slice(-1)[0]).join(", ")
  );
  check("Nothing for a credential 200 days out", !log.some((r) => r.subject_key.includes(inDays(200))));
  check("Resend accepted every alert", log.length > 0 && log.every((r) => r.status === "sent"), log.map((r) => r.error).filter(Boolean).join(" | "));
  check("Two emails in total (one per responsible person)", first.body.results?.filter((r) => r.status === "sent").length === 2);

  const second = await cron("expiration-alerts", org.id);
  check("Running the alert cron again sends nothing", second.status === 200 && second.body.sent === 0, JSON.stringify(second.body).slice(0, 200));

  // --- Digest ----------------------------------------------------------------
  const digest = await cron("weekly-digest", org.id);
  const { data: dlog } = await admin.from("cred_notification_log").select("*").eq("org_id", org.id).eq("kind", "digest");
  check("Weekly digest goes to owner and member", digest.status === 200 && dlog.length === 2 && dlog.every((r) => r.status === "sent"), JSON.stringify(digest.body).slice(0, 200));

  const again = await cron("weekly-digest", org.id);
  check("Running the digest again the same week sends nothing", again.body.sent === 0);

  // A member limited to no clients at all hears nothing about them.
  const { data: other } = await user("restricted").then(async (u) => {
    await admin.from("cred_org_members").insert({ org_id: org.id, user_id: u.id, role: "member", client_ids: [] });
    return { data: u };
  });
  await cron("weekly-digest", org.id);
  const { data: rlog } = await admin.from("cred_notification_log").select("id").eq("org_id", org.id).eq("recipient", other.email);
  check("A member with no clients gets no digest", (rlog ?? []).length === 0);

  // --- The cron routes refuse callers without the secret ---------------------
  const anon = await fetch(`${BASE}/api/cron/expiration-alerts`);
  check("Cron routes refuse requests without CRON_SECRET", anon.status === 401);
}

try {
  await main();
} catch (err) {
  check("script ran to completion", false, err.message);
} finally {
  for (const id of users) {
    const { data: orgs } = await admin.from("cred_organizations").select("id").eq("owner_user_id", id);
    for (const o of orgs ?? []) await admin.from("cred_organizations").delete().eq("id", o.id);
    await admin.auth.admin.deleteUser(id);
  }
  const failed = results.filter((r) => !r).length;
  console.log(`\ncleanup: ${users.length} test users deleted\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}
