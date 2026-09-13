// Verification script, not part of the app runtime: proves the cred_* RLS
// and the database-side plan rules against the real Supabase project.
//
// Creates throwaway users and organizations, signs in as each one with the
// public anon key (exactly what the app does), tries to read and write the
// other tenant's data, and deletes everything it created at the end.
//
// Usage: node scripts/verify-rls.mjs
// Reads NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY /
// SUPABASE_SERVICE_ROLE_KEY from .env.local (no dotenv dependency).

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

const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(URL_, env.SUPABASE_SERVICE_ROLE_KEY, opts);

const run = Date.now();
const createdUsers = [];
const results = [];

function check(name, ok, detail = "") {
  results.push({ name, ok });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  — ${detail}` : ""}`);
}

async function newUser(tag) {
  const email = `rls-${tag}-${run}@example.com`;
  const password = `Rls-${run}-${Math.random().toString(36).slice(2)}`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(`createUser ${tag}: ${error.message}`);
  createdUsers.push(data.user.id);

  const client = createClient(URL_, ANON, opts);
  const { error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (signInError) throw new Error(`signIn ${tag}: ${signInError.message}`);
  return { id: data.user.id, client };
}

// Bootstraps an org (temporary Fase 1 path) plus its practice, a provider and
// a credential, all as that user through RLS.
async function seedTenant(user, name) {
  const { data: orgId, error } = await user.client.rpc("cred_bootstrap_organization", {
    p_name: name,
  });
  if (error) throw new Error(`bootstrap ${name}: ${error.message}`);

  const { data: client } = await user.client
    .from("cred_client_orgs")
    .select("id")
    .eq("org_id", orgId)
    .single();

  const { data: practice, error: pErr } = await user.client
    .from("cred_practices")
    .insert({ client_org_id: client.id, legal_name: `${name} LLC`, tin: "123456789" })
    .select("id")
    .single();
  if (pErr) throw new Error(`practice ${name}: ${pErr.message}`);

  const { data: provider, error: provErr } = await user.client
    .from("cred_providers")
    .insert({ practice_id: practice.id, first_name: "Test", last_name: name })
    .select("id")
    .single();
  if (provErr) throw new Error(`provider ${name}: ${provErr.message}`);

  const { data: credential, error: cErr } = await user.client
    .from("cred_credentials")
    .insert({ provider_id: provider.id, type: "dea", number: "AB1234567", expiration_date: "2027-01-01" })
    .select("id")
    .single();
  if (cErr) throw new Error(`credential ${name}: ${cErr.message}`);

  return { orgId, clientId: client.id, practiceId: practice.id, providerId: provider.id, credentialId: credential.id };
}

async function main() {
  const a = await newUser("a");
  const b = await newUser("b");
  const A = await seedTenant(a, "Org A");
  const B = await seedTenant(b, "Org B");

  // --- Tenant isolation: A reading B -------------------------------------
  for (const table of ["cred_organizations", "cred_org_members", "cred_client_orgs", "cred_practices", "cred_providers", "cred_credentials"]) {
    const { data, error } = await a.client.from(table).select("*");
    const foreign = (data ?? []).filter((row) => (row.org_id ?? row.id) === B.orgId);
    check(`A lists ${table} and sees nothing of B`, !error && foreign.length === 0 && data.length > 0, error?.message);
  }

  {
    const { data } = await a.client.from("cred_providers").select("id").eq("id", B.providerId);
    check("A fetching B's provider by id gets nothing", data?.length === 0);
  }
  {
    const { data } = await a.client
      .from("cred_providers")
      .update({ last_name: "Hacked" })
      .eq("id", B.providerId)
      .select("id");
    const { data: still } = await admin.from("cred_providers").select("last_name").eq("id", B.providerId).single();
    check("A cannot update B's provider", data?.length === 0 && still.last_name === "Org B");
  }
  {
    await a.client.from("cred_credentials").delete().eq("id", B.credentialId);
    const { data } = await admin.from("cred_credentials").select("id").eq("id", B.credentialId);
    check("A cannot delete B's credential", data?.length === 1);
  }
  {
    const { error } = await a.client
      .from("cred_providers")
      .insert({ practice_id: B.practiceId, first_name: "Intruder", last_name: "X" });
    check("A cannot insert a provider into B's practice", !!error, error?.message);
  }
  {
    const { error } = await a.client
      .from("cred_credentials")
      .insert({ provider_id: B.providerId, type: "dea" });
    check("A cannot attach a credential to B's provider", !!error, error?.message);
  }
  {
    const { data, error } = await a.client
      .from("cred_providers")
      .update({ practice_id: B.practiceId })
      .eq("id", A.providerId)
      .select("id");
    check("A cannot move its own provider into B's practice", !!error || data?.length === 0, error?.message);
  }
  {
    const { data } = await b.client.from("cred_credentials").select("id");
    check("B still sees exactly its own credential", data?.length === 1 && data[0].id === B.credentialId);
  }

  // --- Plan columns are not writable by the customer ----------------------
  {
    const { error } = await a.client.from("cred_organizations").update({ plan: "billing_co" }).eq("id", A.orgId);
    check("Owner cannot change their own plan", !!error, error?.message);
  }
  {
    const { error } = await a.client.from("cred_organizations").update({ provider_limit: 999 }).eq("id", A.orgId);
    check("Owner cannot raise their own provider limit", !!error, error?.message);
  }
  {
    const { error } = await a.client.from("cred_organizations").update({ name: "Org A renamed" }).eq("id", A.orgId);
    check("Owner can rename their organization", !error, error?.message);
  }
  {
    const { error } = await a.client
      .from("cred_org_members")
      .insert({ org_id: B.orgId, user_id: a.id, role: "member" });
    check("A cannot add itself as a member of B", !!error, error?.message);
  }

  // --- Anonymous visitors see nothing -------------------------------------
  {
    const anon = createClient(URL_, ANON, opts);
    const { data, error } = await anon.from("cred_providers").select("id");
    check("Anonymous request reads no providers", !!error || data?.length === 0, error?.message);
  }

  // --- Provider limit is a hard stop in the database (Solo = 3) -----------
  {
    for (const n of [2, 3]) {
      await a.client.from("cred_providers").insert({ practice_id: A.practiceId, first_name: "P", last_name: `${n}` });
    }
    const { error } = await a.client
      .from("cred_providers")
      .insert({ practice_id: A.practiceId, first_name: "P", last_name: "4" });
    const { count } = await admin.from("cred_providers").select("id", { count: "exact", head: true }).eq("org_id", A.orgId);
    check("Solo plan: 4th provider is refused by the database", !!error && count === 3, error?.message);
  }

  // --- One practice per Solo/Practice organization -------------------------
  {
    const { error } = await admin.from("cred_client_orgs").insert({ org_id: A.orgId, name: "Second practice" });
    check("Solo plan: a second practice is refused even with the service key", !!error, error?.message);
  }

  // --- CAQH due date = last attestation + org interval ---------------------
  {
    const { data: caqh } = await a.client
      .from("cred_credentials")
      .insert({ provider_id: A.providerId, type: "caqh_attestation", issue_date: "2026-09-01" })
      .select("id, expiration_date")
      .single();
    check("CAQH next due = attestation + 120 days", caqh?.expiration_date === "2026-12-30", caqh?.expiration_date);

    await a.client.from("cred_organizations").update({ caqh_reattestation_interval_days: 90 }).eq("id", A.orgId);
    const { data: after } = await a.client.from("cred_credentials").select("expiration_date").eq("id", caqh.id).single();
    check("Changing the org's CAQH interval re-derives the due date", after?.expiration_date === "2026-11-30", after?.expiration_date);
  }
  {
    const { data } = await a.client
      .from("cred_credentials")
      .insert({ provider_id: A.providerId, type: "state_license", state: "TX", expiration_date: "2020-01-01", status: "active" })
      .select("status")
      .single();
    check("Credential status is derived, not taken from the app", data?.status === "expired", data?.status);
  }

  // --- Billing Co: a member limited to one client sees only that client -----
  {
    await admin.from("cred_organizations").update({ plan: "billing_co" }).eq("id", B.orgId);
    const { data: org } = await admin.from("cred_organizations").select("provider_limit, user_limit, storage_limit_mb").eq("id", B.orgId).single();
    check("Plan change sets Billing Co limits (50 / 10 / 20 GB)", org.provider_limit === 50 && org.user_limit === 10 && org.storage_limit_mb === 20480);

    const { data: client2, error: c2Err } = await admin
      .from("cred_client_orgs")
      .insert({ org_id: B.orgId, name: "Client two" })
      .select("id")
      .single();
    check("Billing Co can hold a second client", !c2Err, c2Err?.message);

    const { data: practice2 } = await admin
      .from("cred_practices")
      .insert({ client_org_id: client2.id, legal_name: "Client two PLLC" })
      .select("id")
      .single();
    const { data: provider2 } = await admin
      .from("cred_providers")
      .insert({ practice_id: practice2.id, first_name: "Other", last_name: "Client" })
      .select("id")
      .single();

    const m = await newUser("m");
    await admin.from("cred_org_members").insert({ org_id: B.orgId, user_id: m.id, role: "member", client_ids: [B.clientId] });

    const { data: seen } = await m.client.from("cred_providers").select("id");
    const ids = (seen ?? []).map((r) => r.id);
    check("Restricted member sees their client's provider", ids.includes(B.providerId));
    check("Restricted member does not see the other client's provider", !ids.includes(provider2.id));

    const { data: seenClients } = await m.client.from("cred_client_orgs").select("id");
    check("Restricted member lists only their one client", seenClients?.length === 1 && seenClients[0].id === B.clientId);

    const { error: insErr } = await m.client
      .from("cred_providers")
      .insert({ practice_id: practice2.id, first_name: "Sneaky", last_name: "Member" });
    check("Restricted member cannot write into the other client", !!insErr, insErr?.message);

    const { data: bSeen } = await b.client.from("cred_providers").select("id");
    check("The owner sees every client", (bSeen ?? []).some((r) => r.id === provider2.id) && bSeen.some((r) => r.id === B.providerId));
  }
}

try {
  await main();
} catch (err) {
  check("script ran to completion", false, err.message);
} finally {
  // Organizations cascade from their owner; members from their user.
  for (const id of createdUsers) await admin.auth.admin.deleteUser(id);
  const { count } = await admin
    .from("cred_organizations")
    .select("id", { count: "exact", head: true })
    .in("owner_user_id", createdUsers.length ? createdUsers : ["00000000-0000-0000-0000-000000000000"]);
  console.log(`\ncleanup: ${createdUsers.length} test users deleted, ${count ?? 0} test orgs left`);

  const failed = results.filter((r) => !r.ok).length;
  console.log(`${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
}
