"use server";

import { cookies } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ACTIVE_CLIENT_COOKIE, getAppContext } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { nppesFields, readPractice, validatePractice } from "@/lib/practice-form";

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
