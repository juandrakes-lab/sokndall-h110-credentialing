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
// KEEP=1 leaves the fixtures in place and prints their ids, for checks that
// need SQL (the storage quota); run `node scripts/verify-rls.mjs --cleanup
// <user-id>...` afterwards.
const keep = {};

if (process.argv[2] === "--cleanup") {
  for (const id of process.argv.slice(3)) {
    // Storage files first: deleting the organization doesn't remove them.
    const { data: orgs } = await admin.from("cred_organizations").select("id").eq("owner_user_id", id);
    for (const org of orgs ?? []) await removeOrgFiles(org.id);
    await admin.auth.admin.deleteUser(id);
  }
  console.log("cleaned up");
  process.exit(0);
}

async function removeOrgFiles(orgId) {
  const { data: docs } = await admin.from("cred_documents").select("storage_path").eq("org_id", orgId);
  const paths = (docs ?? []).map((d) => d.storage_path);
  if (paths.length) await admin.storage.from("cred-documents").remove(paths);
}

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

  // --- Fase 2: payers, enrollments, history, communications ---------------
  const { data: aetna } = await admin.from("cred_payers_global").select("id, revalidation_months").eq("name", "Aetna").single();
  const payerFor = async (user, orgId) =>
    (await user.client.from("cred_payers_org").insert({ org_id: orgId, payer_global_id: aetna.id }).select("id").single()).data;
  const payerA = await payerFor(a, A.orgId);
  const payerB = await payerFor(b, B.orgId);
  check("Each organization can put a catalog payer on its list", !!payerA && !!payerB);

  {
    const { error } = await a.client.from("cred_payers_global").insert({ name: "Fake payer", payer_type: "other", revalidation_months: 12 });
    check("Customers cannot edit the payer catalog", !!error, error?.message);
  }
  {
    const { error } = await a.client.from("cred_payers_org").insert({ org_id: B.orgId, payer_global_id: aetna.id });
    check("A cannot add payers to B's list", !!error, error?.message);
  }

  const { data: enrA, error: enrErr } = await a.client
    .from("cred_enrollments")
    .insert({ provider_id: A.providerId, payer_id: payerA.id, status: "submitted", next_follow_up_date: "2026-09-20" })
    .select("id")
    .single();
  const { data: enrB } = await b.client
    .from("cred_enrollments")
    .insert({ provider_id: B.providerId, payer_id: payerB.id, status: "submitted" })
    .select("id")
    .single();
  check("A enrolls its provider with its payer", !enrErr && !!enrA, enrErr?.message);

  {
    const { data: events } = await a.client.from("cred_enrollment_events").select("to_status, changed_by").eq("enrollment_id", enrA.id);
    check("Opening an enrollment writes history automatically, with who did it", events?.length === 1 && events[0].changed_by === a.id);
    await a.client.from("cred_enrollments").update({ status: "in_review" }).eq("id", enrA.id);
    const { data: after } = await a.client.from("cred_enrollment_events").select("from_status, to_status").eq("enrollment_id", enrA.id);
    check("A status change adds a from → to history row", after?.some((e) => e.from_status === "submitted" && e.to_status === "in_review"));
  }
  {
    const { error } = await a.client
      .from("cred_enrollment_events")
      .insert({ org_id: A.orgId, client_org_id: A.clientId, enrollment_id: enrA.id, to_status: "approved" });
    check("Nobody can write or forge history rows directly", !!error, error?.message);
  }
  {
    const { error } = await a.client.from("cred_enrollments").insert({ provider_id: A.providerId, payer_id: payerB.id });
    check("A cannot enroll against a payer from B's list", !!error, error?.message);
  }
  {
    const { error } = await a.client.from("cred_enrollments").update({ assigned_user_id: b.id }).eq("id", enrA.id);
    check("An enrollment can't be assigned to someone outside the account", !!error, error?.message);
  }
  {
    const { error } = await a.client
      .from("cred_communications")
      .insert({ enrollment_id: enrB.id, channel: "phone", outcome: "snooping" });
    check("A cannot log calls on B's enrollment", !!error, error?.message);
    const { error: ownErr } = await a.client
      .from("cred_communications")
      .insert({ enrollment_id: enrA.id, channel: "phone", reference_number: "REF-1" });
    check("A logs a call on its own enrollment", !ownErr, ownErr?.message);
  }
  for (const table of ["cred_payers_org", "cred_enrollments", "cred_enrollment_events", "cred_communications"]) {
    const { data } = await a.client.from(table).select("org_id");
    check(`A lists ${table} and sees nothing of B`, (data ?? []).length > 0 && data.every((r) => r.org_id === A.orgId));
  }
  {
    const { data } = await a.client
      .from("cred_enrollments")
      .update({ effective_date: "2026-01-15", status: "approved" })
      .eq("id", enrA.id)
      .select("revalidation_due_date, next_follow_up_date")
      .single();
    check("Revalidation due = effective date + the payer's cycle (36 months)", data?.revalidation_due_date === "2029-01-15", data?.revalidation_due_date);
    check("Approving clears the follow-up date", data?.next_follow_up_date === null);
  }
  {
    const { error } = await a.client.from("cred_payers_org").delete().eq("id", payerA.id);
    const { data: still } = await admin.from("cred_payers_org").select("id").eq("id", payerA.id);
    check("A payer with enrollments can't be deleted (no silent cascade)", !!error && still?.length === 1, error?.message);
  }
  {
    const { data } = await a.client.rpc("cred_org_directory");
    check("The member directory lists only A's own people", data?.length === 1 && data[0].user_id === a.id);
  }

  // --- Fase 3: documents in private storage ---------------------------------
  {
    const pdf = Buffer.from("%PDF-1.4\n% verify-rls test document\n%%EOF\n");
    const pathFor = (T, name) => `${T.orgId}/${T.clientId}/${T.providerId}/${run}-${name}`;
    const bucket = (user) => user.client.storage.from("cred-documents");

    const aPath = pathFor(A, "license.pdf");
    const { error: upErr } = await bucket(a).upload(aPath, pdf, { contentType: "application/pdf" });
    check("A uploads a document under its own provider", !upErr, upErr?.message);

    const { data: doc, error: docErr } = await a.client
      .from("cred_documents")
      .insert({ provider_id: A.providerId, category: "license", file_name: "license.pdf", storage_path: aPath, size_bytes: 1 })
      .select("id, size_bytes, uploaded_by")
      .single();
    check("The document's size comes from storage, not from the app", !docErr && doc?.size_bytes === pdf.length, docErr?.message ?? String(doc?.size_bytes));
    check("The uploader is recorded by the database", doc?.uploaded_by === a.id);

    const bPath = pathFor(B, "w9.pdf");
    await bucket(b).upload(bPath, pdf, { contentType: "application/pdf" });
    await b.client.from("cred_documents").insert({ provider_id: B.providerId, category: "w9", file_name: "w9.pdf", storage_path: bPath, size_bytes: 1 });

    const { error: crossUp } = await bucket(a).upload(`${B.orgId}/${B.clientId}/${B.providerId}/${run}-evil.pdf`, pdf, { contentType: "application/pdf" });
    check("A cannot upload into B's folder", !!crossUp, crossUp?.message);

    const { data: signed } = await bucket(a).createSignedUrl(bPath, 60);
    check("A cannot get a download link for B's file", !signed?.signedUrl);

    const { data: anonSigned } = await createClient(URL_, ANON, opts).storage.from("cred-documents").createSignedUrl(aPath, 60);
    check("Anonymous visitors cannot get a download link", !anonSigned?.signedUrl);

    const { data: ownSigned } = await bucket(a).createSignedUrl(aPath, 60);
    const fetched = ownSigned?.signedUrl ? await fetch(ownSigned.signedUrl) : null;
    check("A downloads its own file through a signed link", fetched?.ok && (await fetched.text()).includes("verify-rls"));

    const { data: usedB } = await a.client.rpc("cred_storage_used_bytes", { p_org_id: B.orgId });
    const { data: usedA } = await a.client.rpc("cred_storage_used_bytes", { p_org_id: A.orgId });
    check("A sees its own storage use, not B's", usedA === pdf.length && usedB === null, `${usedA} / ${usedB}`);

    const { data: aDocs } = await a.client.from("cred_documents").select("org_id");
    check("A lists documents and sees nothing of B", aDocs?.length === 1 && aDocs[0].org_id === A.orgId);

    const { error: hijack } = await a.client
      .from("cred_documents")
      .insert({ provider_id: A.providerId, category: "w9", file_name: "w9.pdf", storage_path: bPath, size_bytes: 1 });
    check("A cannot register B's file as its own document", !!hijack, hijack?.message);

    const { error: ghost } = await a.client
      .from("cred_documents")
      .insert({ provider_id: A.providerId, category: "cv", file_name: "cv.pdf", storage_path: pathFor(A, "never-uploaded.pdf"), size_bytes: 1 });
    check("A document row needs a real uploaded file", !!ghost, ghost?.message);

    await bucket(b).remove([bPath]);
    const { data: stillThere } = await bucket(b).list(`${B.orgId}/${B.clientId}/${B.providerId}`);
    await bucket(a).remove([bPath]);
    check("B can delete its own file", !(stillThere ?? []).some((o) => bPath.endsWith(o.name)));

    const { error: bigErr } = await bucket(a).upload(pathFor(A, "big.pdf"), Buffer.alloc(10 * 1024 * 1024 + 1, 1), { contentType: "application/pdf" });
    check("Files over 10 MB are refused by storage", !!bigErr, bigErr?.message);

    const { error: typeErr } = await bucket(a).upload(pathFor(A, "script.html"), Buffer.from("<script>"), { contentType: "text/html" });
    check("Only document and image file types are accepted", !!typeErr, typeErr?.message);

    keep.A = { ...A, userId: a.id, docPath: aPath };
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

    const { data: enr2 } = await b.client
      .from("cred_enrollments")
      .insert({ provider_id: provider2.id, payer_id: payerB.id, status: "submitted" })
      .select("id")
      .single();
    const { data: mEnr } = await m.client.from("cred_enrollments").select("id");
    const mIds = (mEnr ?? []).map((r) => r.id);
    check("Restricted member sees their client's enrollment, not the other client's", mIds.includes(enrB.id) && !mIds.includes(enr2.id));
    const { error: mComm } = await m.client.from("cred_communications").insert({ enrollment_id: enr2.id, channel: "email", outcome: "x" });
    check("Restricted member cannot log calls on the other client's enrollment", !!mComm, mComm?.message);
    const { data: mDir } = await m.client.rpc("cred_org_directory");
    check("A member can see who is on the account (for assignment)", (mDir ?? []).length === 2);
  }
}

try {
  await main();
} catch (err) {
  check("script ran to completion", false, err.message);
} finally {
  if (process.env.KEEP) {
    console.log(`\nKEEP: fixtures left in place — ${JSON.stringify(keep)}`);
    console.log(`clean up with: node scripts/verify-rls.mjs --cleanup ${createdUsers.join(" ")}`);
    const failed = results.filter((r) => !r.ok).length;
    console.log(`${results.length - failed}/${results.length} checks passed`);
    process.exit(failed ? 1 : 0);
  }
  // Storage files first (they don't cascade), then the users: organizations
  // cascade from their owner, members from their user.
  const { data: orgs } = await admin
    .from("cred_organizations")
    .select("id")
    .in("owner_user_id", createdUsers.length ? createdUsers : ["00000000-0000-0000-0000-000000000000"]);
  for (const org of orgs ?? []) await removeOrgFiles(org.id);
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
