"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { fetchNppes, isValidNpi } from "@/lib/nppes";
import { snapshotFromLookup } from "@/lib/consistency";

function text(formData, key) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

function readPractice(formData) {
  const v = {
    legal_name: text(formData, "legal_name"),
    group_npi: text(formData, "group_npi")?.replace(/\D/g, "") || null,
    tin: text(formData, "tin")?.replace(/\D/g, "") || null,
  };
  for (const kind of ["service", "billing"]) {
    v[`${kind}_address_line1`] = text(formData, `${kind}_address_line1`);
    v[`${kind}_address_line2`] = text(formData, `${kind}_address_line2`);
    v[`${kind}_city`] = text(formData, `${kind}_city`);
    v[`${kind}_state`] = text(formData, `${kind}_state`)?.toUpperCase() ?? null;
    v[`${kind}_zip`] = text(formData, `${kind}_zip`)?.replace(/\D/g, "") || null;
  }
  if (formData.get("billing_same")) {
    for (const f of ["address_line1", "address_line2", "city", "state", "zip"]) {
      v[`billing_${f}`] = v[`service_${f}`];
    }
  }
  return v;
}

function validatePractice(v) {
  const errors = {};
  if (!v.legal_name) errors.legal_name = "Enter the practice's legal name.";
  if (v.group_npi && !isValidNpi(v.group_npi)) {
    errors.group_npi = "That isn't a valid NPI — it must be 10 digits and pass the NPI check digit.";
  }
  if (v.tin && v.tin.length !== 9) errors.tin = "A TIN has 9 digits.";
  for (const kind of ["service", "billing"]) {
    if (v[`${kind}_zip`] && ![5, 9].includes(v[`${kind}_zip`].length)) {
      errors[`${kind}_zip`] = "ZIP is 5 or 9 digits.";
    }
  }
  return errors;
}

async function nppesFields(npi) {
  if (!npi) return { nppes_data: null, nppes_checked_at: null };
  const snapshot = snapshotFromLookup(await fetchNppes(npi));
  return snapshot === undefined ? {} : { nppes_data: snapshot, nppes_checked_at: new Date().toISOString() };
}

// Creates the practice during onboarding, or updates it from Settings.
export async function savePractice(_prev, formData) {
  const { supabase, user, org, client, practice } = await getAppContext();
  if (!user) redirect("/login");
  // Accounts are only created by a confirmed subscription (alcance §10.1).
  if (!org || !client) redirect("/start");

  const values = readPractice(formData);
  const fieldErrors = validatePractice(values);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const npiChanged = !practice || practice.group_npi !== values.group_npi || !practice.nppes_data;
  const registry = npiChanged ? await nppesFields(values.group_npi) : {};

  if (!practice) {
    const { error } = await supabase
      .from("cred_practices")
      .insert({ ...values, ...registry, client_org_id: client.id });
    if (error) return { error: `Couldn't save the practice: ${error.message}` };
    redirect("/dashboard");
  }

  const { error } = await supabase
    .from("cred_practices")
    .update({ ...values, ...registry })
    .eq("id", practice.id);
  if (error) return { error: `Couldn't save: ${error.message}` };

  revalidatePath("/", "layout");
  return { notice: "Practice saved." };
}

export async function recheckPracticeNppes() {
  const { supabase, practice } = await getAppContext();
  if (!practice?.group_npi) return;
  const registry = await nppesFields(practice.group_npi);
  if (Object.keys(registry).length) {
    await supabase.from("cred_practices").update(registry).eq("id", practice.id);
  }
  revalidatePath("/settings");
  revalidatePath("/providers");
}
