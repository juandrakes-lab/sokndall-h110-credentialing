"use server";

import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ACTIVE_CLIENT_COOKIE, getAppContext } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { nppesFields, readPractice, validatePractice } from "@/lib/practice-form";
import { BUCKET } from "@/lib/documents";

const SECTIONS = ["/dashboard", "/clients", "/follow-ups", "/providers", "/enrollments", "/documents", "/import-export", "/settings"];

async function setActiveClient(id) {
  (await cookies()).set(ACTIVE_CLIENT_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

// The client selector (alcance §4.4). Stays on the same section; a detail page
// (one provider, one enrollment) belongs to the old client, so it goes to its
// list instead.
export async function switchClient(clientId, pathname) {
  const { user, clients } = await getAppContext();
  if (!user) redirect("/login");
  if (!clients.some((c) => c.id === clientId)) forbidden();

  await setActiveClient(clientId);
  const section = SECTIONS.find((s) => pathname === s || pathname?.startsWith(s + "/")) ?? "/dashboard";
  revalidatePath("/", "layout");
  redirect(section);
}

// Opens a client from the Clients panel.
export async function openClient(formData) {
  await switchClient(formData.get("client")?.toString(), formData.get("to")?.toString() ?? "/dashboard");
}

const friendly = (error) => error.message.replace(/^[A-Z_]+: /, "");

async function ownerContext() {
  const ctx = await getAppContext();
  if (!ctx.user) redirect("/login");
  if (!ctx.org || ctx.org.plan !== "billing_co") forbidden();
  if (ctx.role !== "owner") forbidden();
  return ctx;
}

// Archive: out of the selector, the panel, the provider and storage counts,
// and out of every member's reach. Nothing is deleted.
export async function archiveClient(formData) {
  const { supabaseAll } = await ownerContext();
  const id = formData.get("client")?.toString();
  const { error } = await supabaseAll.rpc("cred_archive_client", { p_client_id: id });
  revalidatePath("/", "layout");
  redirect(error ? `/clients?problem=${encodeURIComponent(friendly(error))}` : "/clients?archived=1");
}

export async function restoreClient(_prev, formData) {
  const { supabaseAll } = await ownerContext();
  const id = formData.get("client")?.toString();
  const { error } = await supabaseAll.rpc("cred_restore_client", { p_client_id: id });
  if (error) return { error: friendly(error) };
  revalidatePath("/", "layout");
  return { notice: "Restored — it's back in the client selector." };
}

// Delete for good, only once archived: its files first (Storage doesn't
// cascade), then the client and everything under it. cred_delete_client
// refuses while any file remains, and keeps only name, date and who.
export async function deleteClient(_prev, formData) {
  const { archivedClients } = await ownerContext();
  const id = formData.get("client")?.toString();
  const client = archivedClients.find((c) => c.id === id);
  if (!client) return { error: "Only an archived client can be deleted." };
  if (formData.get("confirm")?.toString() !== client.name) {
    return { error: `Type the client's name exactly — ${client.name} — to confirm.` };
  }

  const scoped = await createClient({ clientOrgId: id });
  const { data: providers } = await scoped.from("cred_providers").select("id, org_id").eq("client_org_id", id);
  const { data: docs } = await scoped.from("cred_documents").select("storage_path").eq("client_org_id", id);
  const paths = new Set((docs ?? []).map((d) => d.storage_path));
  // Anything in the client's folders, even a file whose record is gone.
  for (const p of providers ?? []) {
    const { data: objects } = await scoped.storage.from(BUCKET).list(`${p.org_id}/${id}/${p.id}`, { limit: 1000 });
    for (const o of objects ?? []) paths.add(`${p.org_id}/${id}/${p.id}/${o.name}`);
  }
  const list = [...paths];
  for (let i = 0; i < list.length; i += 100) {
    const { error } = await scoped.storage.from(BUCKET).remove(list.slice(i, i + 100));
    if (error) return { error: `Couldn't remove the client's files, so nothing was deleted: ${error.message}` };
  }

  const { error } = await scoped.rpc("cred_delete_client", { p_client_id: id, p_confirm_name: formData.get("confirm")?.toString() });
  if (error) return { error: friendly(error) };
  revalidatePath("/", "layout");
  redirect("/clients?deleted=1");
}

// Billing Co: the owner adds a client — its practice, filled in like at
// onboarding — and lands inside it. The database refuses a second client on
// any other plan (cred_enforce_single_client), whatever this code does.
export async function addClient(_prev, formData) {
  const { supabaseAll, user, org, role } = await getAppContext();
  if (!user) redirect("/login");
  if (!org || org.plan !== "billing_co") forbidden();
  if (role !== "owner") return { error: "Only the account owner can add clients." };

  const values = readPractice(formData);
  const fieldErrors = validatePractice(values);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { data: created, error } = await supabaseAll
    .from("cred_client_orgs")
    .insert({ org_id: org.id, name: values.legal_name })
    .select("id")
    .single();
  if (error) {
    return {
      error: error.message.includes("row-level security")
        ? "This account is read-only, so no clients can be added."
        : `Couldn't add the client: ${error.message}`,
    };
  }

  // Straight into the new client, so an interrupted save finishes at onboarding.
  await setActiveClient(created.id);
  const scoped = await createClient({ clientOrgId: created.id });
  const { error: practiceError } = await scoped
    .from("cred_practices")
    .insert({ ...values, ...(await nppesFields(values.group_npi)), client_org_id: created.id });
  if (practiceError) redirect("/onboarding");

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
