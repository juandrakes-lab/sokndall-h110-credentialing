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
  return { id: data.user.id, email, client };
}

// What the Polar webhook does on subscription.created (service role only).
async function subscribe(userId, { plan = "solo", status = "trialing", subscriptionId, name = "Test", modifiedAt = new Date().toISOString(), periodEnd = null } = {}) {
  const { data, error } = await admin.rpc("cred_sync_subscription", {
    p_user_id: userId,
    p_account_name: name,
    p_customer_id: `cus_${userId.slice(0, 8)}`,
    p_subscription_id: subscriptionId ?? `sub_${userId}`,
    p_plan: plan,
    p_status: status,
    p_trial_ends_at: null,
    p_current_period_end: periodEnd,
    p_cancel_at_period_end: false,
    p_modified_at: modifiedAt,
  });
  if (error) throw new Error(`subscribe: ${error.message}`);
  return data;
}

// An org as the webhook creates it, plus its practice, a provider and a
// credential, all written as that user through RLS.
async function seedTenant(user, name) {
  const orgId = await subscribe(user.id, { name });

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

  // --- Fase 4: the email log is written only by the cron --------------------
  {
    const { error: claimErr } = await a.client.rpc("cred_claim_notifications", {
      p_rows: [{ org_id: A.orgId, kind: "alert", subject_key: "forged", recipient: "x@example.com" }],
    });
    check("Users cannot claim or forge notification rows", !!claimErr, claimErr?.message);
    const { error: logErr } = await a.client
      .from("cred_notification_log")
      .insert({ org_id: A.orgId, kind: "alert", subject_key: "forged", recipient: "x@example.com", status: "sent" });
    check("Users cannot write the email log", !!logErr, logErr?.message);
    const { error: daysErr } = await a.client.from("cred_organizations").update({ alert_days: [45, 15] }).eq("id", A.orgId);
    check("The owner can set the alert days", !daysErr, daysErr?.message);
    const { error: badDays } = await a.client.from("cred_organizations").update({ alert_days: [0, 900] }).eq("id", A.orgId);
    check("Alert days outside 1–365 are refused", !!badDays, badDays?.message);
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

    // --- Fase 6: active client, clients created by the owner, subsets --------
    // The app sends the active client in x-cred-client; reads narrow to it.
    const scoped = async (user, clientId) => {
      const { data: s } = await user.client.auth.getSession();
      return createClient(URL_, ANON, {
        ...opts,
        global: { headers: { Authorization: `Bearer ${s.session.access_token}`, "x-cred-client": clientId } },
      });
    };
    const bOnTwo = await scoped(b, client2.id);
    const { data: twoOnly } = await bOnTwo.from("cred_providers").select("id");
    check("With client two active, the owner reads only client two's providers", twoOnly?.length === 1 && twoOnly[0].id === provider2.id);
    const { data: twoEnr } = await bOnTwo.from("cred_enrollments").select("id");
    check("…and only client two's enrollments", (twoEnr ?? []).length === 1 && twoEnr[0].id === enr2.id);
    const { data: allClients } = await bOnTwo.from("cred_client_orgs").select("id");
    check("…while the client selector still lists every client", (allClients ?? []).length === 2);

    const bOnForeign = await scoped(b, A.clientId);
    const { data: foreign } = await bOnForeign.from("cred_providers").select("id");
    check("Naming another account's client as active shows nothing at all", (foreign ?? []).length === 0);
    const mOnTwo = await scoped(m, client2.id);
    const { data: mTwo } = await mOnTwo.from("cred_providers").select("id");
    check("A limited member naming a client they can't reach sees nothing", (mTwo ?? []).length === 0);

    const { data: usage } = await m.client.rpc("cred_provider_usage", { p_org_id: B.orgId });
    check("The plan's provider count spans every client, even for a limited member", usage?.[0]?.provider_count === 2, JSON.stringify(usage));
    const { data: noUsage } = await a.client.rpc("cred_provider_usage", { p_org_id: B.orgId });
    check("Another account can't read the provider count", (noUsage ?? []).length === 0);

    const { data: client3, error: c3Err } = await b.client.from("cred_client_orgs").insert({ org_id: B.orgId, name: "Client three" }).select("id").single();
    check("A Billing Co owner adds a client", !c3Err && !!client3, c3Err?.message);
    const { error: mAdd } = await m.client.from("cred_client_orgs").insert({ org_id: B.orgId, name: "Member's client" });
    check("A member cannot add clients", !!mAdd, mAdd?.message);
    const { error: aAdd } = await a.client.from("cred_client_orgs").insert({ org_id: A.orgId, name: "Second practice" });
    check("A Solo/Practice owner cannot add a second client", !!aAdd, aAdd?.message);
    const { error: crossAdd } = await a.client.from("cred_client_orgs").insert({ org_id: B.orgId, name: "Planted" });
    check("Nobody can add a client to another account", !!crossAdd, crossAdd?.message);

    const { error: setErr } = await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [client2.id] });
    const { data: nowSees } = await m.client.from("cred_providers").select("id");
    check("The owner moves a member to another client", !setErr && nowSees?.length === 1 && nowSees[0].id === provider2.id, setErr?.message);
    const { error: emptyErr } = await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [] });
    check("A member can't be left with no clients", !!emptyErr, emptyErr?.message);
    const { error: foreignErr } = await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [A.clientId] });
    check("A member can't be given another account's client", !!foreignErr, foreignErr?.message);
    const { error: selfErr } = await m.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: null });
    check("A member can't widen their own access", !!selfErr, selfErr?.message);
    await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: null });
    const { data: allAgain } = await m.client.from("cred_providers").select("id");
    check("…and access to all clients includes ones added later", (allAgain ?? []).length === 2);
    await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [B.clientId] });

    const { createHash: ch } = await import("node:crypto");
    const { error: subsetInv } = await b.client
      .from("cred_invitations")
      .insert({ org_id: B.orgId, email: `subset-${run}@example.com`, token_hash: ch("sha256").update(`t-${run}`).digest("hex"), client_ids: [client3.id] });
    check("An invitation can be limited to some clients", !subsetInv, subsetInv?.message);
    const { error: badInv } = await b.client
      .from("cred_invitations")
      .insert({ org_id: B.orgId, email: `bad-${run}@example.com`, token_hash: ch("sha256").update(`u-${run}`).digest("hex"), client_ids: [A.clientId] });
    check("An invitation can't name another account's client", !!badInv, badInv?.message);
    const { data: forged, error: forgedErr } = await b.client
      .from("cred_invitations")
      .insert({ org_id: B.orgId, email: `forge-${run}@example.com`, token_hash: ch("sha256").update(`v-${run}`).digest("hex"), role: "owner", expires_at: "2099-01-01", accepted_at: new Date().toISOString() })
      .select("role, expires_at, accepted_at")
      .single();
    check(
      "An invitation always makes a member, lasts 14 days and starts unaccepted",
      !forgedErr && forged.role === "member" && !forged.accepted_at && new Date(forged.expires_at) < new Date(Date.now() + 15 * 86400000),
      forgedErr?.message ?? JSON.stringify(forged)
    );

    // --- Archived and deleted clients (founder decision 2026-09-14) ---------
    const usageOf = async () => (await b.client.rpc("cred_provider_usage", { p_org_id: B.orgId })).data?.[0]?.provider_count;
    const docPath = `${B.orgId}/${client2.id}/${provider2.id}/${run}-w9.pdf`;
    const { error: upErr2 } = await b.client.storage.from("cred-documents").upload(docPath, Buffer.from("%PDF-1.4\n%%EOF\n"), { contentType: "application/pdf" });
    await b.client.from("cred_documents").insert({ provider_id: provider2.id, category: "w9", file_name: "w9.pdf", storage_path: docPath, size_bytes: 1 });
    await b.client.from("cred_credentials").insert({ provider_id: provider2.id, type: "dea", number: "Z9", expiration_date: "2027-03-01" });
    await b.client.from("cred_communications").insert({ enrollment_id: enr2.id, channel: "phone", outcome: "called" });
    check("(fixture) client two has a file, credential, enrollment and call log", !upErr2, upErr2?.message);

    await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [B.clientId, client2.id] });
    const before = await usageOf();
    const bytesOf = async () => (await b.client.rpc("cred_storage_used_bytes", { p_org_id: B.orgId })).data;
    const bytesBefore = await bytesOf();
    const { error: archErr } = await b.client.rpc("cred_archive_client", { p_client_id: client2.id });
    check("The owner archives a client", !archErr, archErr?.message);
    check("An archived client's providers stop counting toward the limit", (await usageOf()) === before - 1, `${before} → ${await usageOf()}`);
    const bytesAfter = await bytesOf();
    check("…and its files stop counting toward storage", bytesBefore > 0 && bytesAfter < bytesBefore, `${bytesBefore} → ${bytesAfter}`);

    const { data: mAfter } = await m.client.from("cred_providers").select("id");
    check("A member no longer sees an archived client's providers", !(mAfter ?? []).some((r) => r.id === provider2.id));
    const { data: mClients } = await m.client.from("cred_client_orgs").select("id");
    check("…nor the archived client itself", !(mClients ?? []).some((c) => c.id === client2.id));
    const mOnArchived = await scoped(m, client2.id);
    const { data: mNamed } = await mOnArchived.from("cred_credentials").select("id");
    check("…not even naming it as the active client", (mNamed ?? []).length === 0);
    const { data: mFile } = await m.client.storage.from("cred-documents").download(docPath);
    check("…nor download its files", !mFile);

    const { data: bAll } = await b.client.from("cred_providers").select("id");
    check("Everyday (unscoped) reads leave archived clients out, owner included", !(bAll ?? []).some((r) => r.id === provider2.id));
    const bOnArchived = await scoped(b, client2.id);
    const { data: bNamed } = await bOnArchived.from("cred_providers").select("id");
    check("The owner reads an archived client only by naming it (its export)", bNamed?.length === 1 && bNamed[0].id === provider2.id);
    const { error: bWrite } = await b.client.from("cred_providers").insert({ practice_id: practice2.id, first_name: "Late", last_name: "Add" });
    check("Nothing can be added to an archived client, by the owner either", !!bWrite, bWrite?.message);
    const { error: subsetArchived } = await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [client2.id] });
    check("A member can't be given an archived client", !!subsetArchived, subsetArchived?.message);
    const { error: mArchive } = await m.client.rpc("cred_archive_client", { p_client_id: client3.id });
    const { error: mRestore } = await m.client.rpc("cred_restore_client", { p_client_id: client2.id });
    check("Members can't archive or restore clients", !!mArchive && !!mRestore);

    // The restore is refused when it would go over the provider limit.
    await admin.from("cred_organizations").update({ plan: "practice" }).eq("id", B.orgId); // limit 15
    const { data: bPractice } = await admin.from("cred_practices").select("id").eq("client_org_id", B.clientId).single();
    const filler = [];
    for (let n = 0; n < 15 - (await usageOf()); n++) filler.push({ practice_id: bPractice.id, first_name: "Fill", last_name: `${n}` });
    const { data: filled } = await admin.from("cred_providers").insert(filler).select("id");
    const { error: overErr } = await b.client.rpc("cred_restore_client", { p_client_id: client2.id });
    check("Restoring is refused when it would pass the provider limit, saying by how many", !!overErr && /1 too many/.test(overErr.message), overErr?.message);
    await admin.from("cred_providers").delete().in("id", (filled ?? []).map((r) => r.id));
    await admin.from("cred_organizations").update({ plan: "billing_co" }).eq("id", B.orgId);

    const { error: restoreErr } = await b.client.rpc("cred_restore_client", { p_client_id: client2.id });
    const { data: mBack } = await m.client.from("cred_providers").select("id");
    check("Restoring brings the client back, for members too", !restoreErr && (mBack ?? []).some((r) => r.id === provider2.id), restoreErr?.message);
    check("…and its providers count again", (await usageOf()) === before, String(await usageOf()));

    // Last active client and an emptied member.
    await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [client3.id] });
    await b.client.rpc("cred_archive_client", { p_client_id: client3.id });
    const { data: mNone, error: mNoneErr } = await m.client.from("cred_client_orgs").select("id");
    const { data: mNoProv, error: mNoProvErr } = await m.client.from("cred_providers").select("id");
    check("A member whose only client is archived gets empty lists, not errors", !mNoneErr && !mNoProvErr && (mNone ?? []).length === 0 && (mNoProv ?? []).length === 0);
    await b.client.rpc("cred_archive_client", { p_client_id: client2.id });
    const { error: lastErr } = await b.client.rpc("cred_archive_client", { p_client_id: B.clientId });
    check("The last active client can't be archived", !!lastErr && lastErr.message.includes("LAST_CLIENT"), lastErr?.message);

    // Delete for good: only archived, exact name, files first — then nothing left.
    await b.client.rpc("cred_restore_client", { p_client_id: client3.id });
    await b.client.rpc("cred_set_member_clients", { p_user_id: m.id, p_client_ids: [B.clientId, client3.id] });
    const { error: notArchived } = await b.client.rpc("cred_delete_client", { p_client_id: client3.id, p_confirm_name: "Client three" });
    check("Only an archived client can be deleted", !!notArchived && notArchived.message.includes("NOT_ARCHIVED"), notArchived?.message);
    const { data: two } = await admin.from("cred_client_orgs").select("name").eq("id", client2.id).single();
    const { error: wrongName } = await b.client.rpc("cred_delete_client", { p_client_id: client2.id, p_confirm_name: "client two" });
    check("Deleting needs the client's exact name", !!wrongName && wrongName.message.includes("NAME_MISMATCH"), wrongName?.message);
    const { error: filesLeft } = await b.client.rpc("cred_delete_client", { p_client_id: client2.id, p_confirm_name: two.name });
    check("Deleting is refused while the client's files are still in Storage", !!filesLeft && filesLeft.message.includes("FILES_REMAIN"), filesLeft?.message);
    const { error: mDelete } = await m.client.rpc("cred_delete_client", { p_client_id: client2.id, p_confirm_name: two.name });
    check("Members can't delete clients", !!mDelete, mDelete?.message);

    const { error: rmErr } = await b.client.storage.from("cred-documents").remove([docPath]);
    const { error: delErr } = await b.client.rpc("cred_delete_client", { p_client_id: client2.id, p_confirm_name: two.name });
    check("The owner deletes the archived client once its files are gone", !rmErr && !delErr, (rmErr ?? delErr)?.message);
    const leftovers = {};
    for (const t of ["cred_client_orgs", "cred_practices", "cred_providers", "cred_credentials", "cred_enrollments", "cred_enrollment_events", "cred_communications", "cred_documents"]) {
      const col = t === "cred_client_orgs" ? "id" : "client_org_id";
      const { count } = await admin.from(t).select("id", { count: "exact", head: true }).eq(col, client2.id);
      if (count) leftovers[t] = count;
    }
    const { data: objs } = await admin.storage.from("cred-documents").list(`${B.orgId}/${client2.id}/${provider2.id}`);
    check("…leaving no rows in any table and no files", Object.keys(leftovers).length === 0 && (objs ?? []).length === 0, JSON.stringify({ leftovers, files: objs?.length }));
    const { data: trace } = await b.client.from("cred_client_deletions").select("*").eq("org_id", B.orgId);
    check(
      "…and only a minimal record: name, date and who",
      trace?.length === 1 && trace[0].client_name === two.name && trace[0].deleted_by === b.id && Object.keys(trace[0]).sort().join() === "client_name,deleted_at,deleted_by,id,org_id",
      JSON.stringify(trace)
    );
    const { data: mTrace } = await m.client.from("cred_client_deletions").select("id");
    check("Members can't read the deletion record", (mTrace ?? []).length === 0);
    const { data: mRow } = await admin.from("cred_org_members").select("client_ids").eq("user_id", m.id).single();
    check("A deleted client disappears from members' client lists", !(mRow.client_ids ?? []).includes(client2.id), JSON.stringify(mRow.client_ids));
  }

  // --- Fase 5: subscriptions, read-only states, seats ------------------------
  {
    const c = await newUser("c");
    const { error: forgeErr } = await c.client.rpc("cred_sync_subscription", {
      p_user_id: c.id, p_account_name: "Free ride", p_customer_id: null, p_subscription_id: "sub_forged",
      p_plan: "billing_co", p_status: "active", p_trial_ends_at: null, p_current_period_end: null,
      p_cancel_at_period_end: false, p_modified_at: null,
    });
    check("Nobody can create an account without a subscription", !!forgeErr, forgeErr?.message);

    const t0 = Date.now();
    const at = (s) => new Date(t0 + s * 1000).toISOString();
    const C = await subscribe(c.id, { plan: "practice", name: "Org C", subscriptionId: `sub_c_${run}`, modifiedAt: at(0) });
    const { data: cOrg } = await admin.from("cred_organizations").select("plan, provider_limit, user_limit").eq("id", C).single();
    check("A new subscription creates the account with its plan's limits", cOrg.plan === "practice" && cOrg.provider_limit === 15 && cOrg.user_limit === 3);

    const { data: cClient } = await c.client.from("cred_client_orgs").select("id").eq("org_id", C).single();
    const { data: cPractice } = await c.client.from("cred_practices").insert({ client_org_id: cClient.id, legal_name: "Org C PLLC" }).select("id").single();
    const provIds = [];
    for (const n of [1, 2, 3, 4]) {
      const { data } = await c.client.from("cred_providers").insert({ practice_id: cPractice.id, first_name: "P", last_name: `C${n}` }).select("id").single();
      provIds.push(data.id);
      await new Promise((r) => setTimeout(r, 20)); // distinct created_at
    }

    // Seats: Practice = 3 users (owner + 2 invitations).
    const { createHash, randomBytes } = await import("node:crypto");
    const token = () => randomBytes(18).toString("base64url");
    const hash = (t) => createHash("sha256").update(t).digest("hex");
    const x = await newUser("x");
    const tokX = token();
    const { error: inv1 } = await c.client.from("cred_invitations").insert({ org_id: C, email: x.email, token_hash: hash(tokX) });
    const { error: inv2 } = await c.client.from("cred_invitations").insert({ org_id: C, email: `other-${run}@example.com`, token_hash: hash(token()) });
    const { error: inv3 } = await c.client.from("cred_invitations").insert({ org_id: C, email: `third-${run}@example.com`, token_hash: hash(token()) });
    check("Practice: owner can invite up to the 3-user limit", !inv1 && !inv2, inv1?.message ?? inv2?.message);
    check("Practice: the 4th user is refused", !!inv3 && inv3.message.includes("USER_LIMIT_REACHED"), inv3?.message);

    const { data: preview } = await createClient(URL_, ANON, opts).rpc("cred_invitation_preview", { p_token: tokX });
    check("An invitation link shows its account name before signing in", preview?.[0]?.org_name === "Org C PLLC" && preview?.[0]?.status === "pending");

    const y = await newUser("y");
    const { error: wrongEmail } = await y.client.rpc("cred_accept_invitation", { p_token: tokX });
    check("An invitation can't be accepted by a different login", !!wrongEmail && wrongEmail.message.includes("INVITATION_OTHER_EMAIL"), wrongEmail?.message);
    const { error: acceptErr } = await x.client.rpc("cred_accept_invitation", { p_token: tokX });
    check("The invited person joins as a member", !acceptErr, acceptErr?.message);
    const { error: again } = await x.client.rpc("cred_accept_invitation", { p_token: tokX });
    check("An invitation works once", !!again, again?.message);

    const { data: xSees } = await x.client.from("cred_providers").select("id");
    check("The new member sees the account's providers", (xSees ?? []).length === 4);
    const { error: memberInvite } = await x.client.from("cred_invitations").insert({ org_id: C, email: `nope-${run}@example.com`, token_hash: hash(token()) });
    check("Members cannot invite people", !!memberInvite, memberInvite?.message);
    const { error: memberRemove } = await x.client.rpc("cred_remove_member", { p_user_id: c.id });
    check("Members cannot remove people", !!memberRemove, memberRemove?.message);
    const { data: memberSeesLog } = await x.client.from("cred_invitations").select("id");
    check("Members cannot see invitations", (memberSeesLog ?? []).length === 0);

    // Downgrade to Solo: 3 providers; the most recent (4th) turns read-only.
    await subscribe(c.id, { plan: "solo", subscriptionId: `sub_c_${run}`, modifiedAt: at(10) });
    const { data: first, error: firstErr } = await c.client.from("cred_providers").update({ notes: "still editable" }).eq("id", provIds[0]).select("id");
    check("After a downgrade, providers within the limit stay editable", !firstErr && first?.length === 1, firstErr?.message);
    const { error: fourthErr } = await c.client.from("cred_providers").update({ notes: "should fail" }).eq("id", provIds[3]);
    check("After a downgrade, the newest provider over the limit is read-only", !!fourthErr, fourthErr?.message);
    const { error: credErr } = await c.client.from("cred_credentials").insert({ provider_id: provIds[3], type: "dea", number: "X1", expiration_date: "2027-01-01" });
    check("…including adding credentials to it", !!credErr, credErr?.message);
    const { data: seeAll } = await c.client.from("cred_providers").select("id");
    check("…but it's still visible", (seeAll ?? []).length === 4);

    // A late, older webhook must not undo the downgrade.
    await subscribe(c.id, { plan: "practice", subscriptionId: `sub_c_${run}`, modifiedAt: at(5) });
    const { data: stillSolo } = await admin.from("cred_organizations").select("plan").eq("id", C).single();
    check("An out-of-order older webhook is ignored", stillSolo.plan === "solo", stillSolo.plan);

    const { error: delFourth } = await c.client.from("cred_providers").delete().eq("id", provIds[3]);
    const { count: leftCount } = await admin.from("cred_providers").select("id", { count: "exact", head: true }).eq("org_id", C);
    check("A read-only provider can still be deleted to get under the limit", !delFourth && leftCount === 3, delFourth?.message);

    // Canceled: writable until the paid period ends, read-only after.
    await subscribe(c.id, { plan: "solo", status: "canceled", subscriptionId: `sub_c_${run}`, modifiedAt: at(20), periodEnd: new Date(Date.now() + 5 * 86400000).toISOString() });
    const { error: cancelWrite } = await c.client.from("cred_providers").update({ notes: "canceled but paid" }).eq("id", provIds[0]);
    check("Canceled: still writable until the end of the paid period", !cancelWrite, cancelWrite?.message);
    const cFile = `${C}/${cClient.id}/${provIds[0]}/${run}-cv.pdf`;
    const { error: cUpErr } = await c.client.storage.from("cred-documents").upload(cFile, Buffer.from("%PDF-1.4\n%%EOF\n"), { contentType: "application/pdf" });
    check("(fixture) the owner stores a file before the account ends", !cUpErr, cUpErr?.message);

    await subscribe(c.id, { plan: "solo", status: "revoked", subscriptionId: `sub_c_${run}`, modifiedAt: at(30) });
    const { error: revokedWrite } = await c.client.from("cred_providers").update({ notes: "after revoke" }).eq("id", provIds[0]);
    const { error: revokedPayer } = await c.client.from("cred_payers_org").insert({ org_id: C, name: "Late payer", payer_type: "other", revalidation_months: 12 });
    const { error: revokedDelete } = await c.client.from("cred_providers").delete().eq("id", provIds[0]);
    const { data: revokedRead } = await c.client.from("cred_providers").select("id, cred_credentials(id)");
    check("Revoked: nothing can be edited", !!revokedWrite && !!revokedPayer, revokedWrite?.message);
    check("Revoked: nothing can be deleted either", (await admin.from("cred_providers").select("id").eq("id", provIds[0])).data?.length === 1, revokedDelete?.message);
    check("Revoked: everything can still be read (and exported)", (revokedRead ?? []).length === 3);

    // Deleting a read-only account must take its files with it.
    const fileExists = async () =>
      ((await admin.storage.from("cred-documents").list(`${C}/${cClient.id}/${provIds[0]}`)).data ?? []).some((f) => cFile.endsWith(f.name));
    await x.client.storage.from("cred-documents").remove([cFile]);
    check("Revoked: a member cannot delete the account's files", await fileExists());
    const { error: ownerFileErr } = await c.client.storage.from("cred-documents").remove([cFile]);
    check("Revoked: the owner can still remove the files (account deletion)", !ownerFileErr && !(await fileExists()), ownerFileErr?.message);

    const { error: memberDelete } = await x.client.rpc("cred_delete_organization");
    check("Members cannot delete the account", !!memberDelete, memberDelete?.message);
    const { error: ownerDelete } = await c.client.rpc("cred_delete_organization");
    const { data: gone } = await admin.from("cred_organizations").select("id").eq("id", C);
    check("The owner can delete the account, and everything goes with it", !ownerDelete && gone?.length === 0, ownerDelete?.message);
    const { data: tomb } = await admin.from("cred_ended_subscriptions").select("subscription_id").eq("subscription_id", `sub_c_${run}`);
    const back = await admin.rpc("cred_sync_subscription", {
      p_user_id: c.id, p_account_name: "Zombie", p_customer_id: null, p_subscription_id: `sub_c_${run}`,
      p_plan: "solo", p_status: "active", p_trial_ends_at: null, p_current_period_end: null,
      p_cancel_at_period_end: false, p_modified_at: new Date().toISOString(),
    });
    const { data: zombie } = await admin.from("cred_organizations").select("id").eq("owner_user_id", c.id);
    check("A deleted account's subscription can never bring it back", tomb?.length === 1 && !back.error && (zombie ?? []).length === 0, back.error?.message);
    await admin.from("cred_ended_subscriptions").delete().eq("subscription_id", `sub_c_${run}`);
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
