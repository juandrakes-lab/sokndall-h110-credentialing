"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { nppesFields, readPractice, validatePractice } from "@/lib/practice-form";

// Creates the practice during onboarding, or updates it from Settings. For
// Billing Co it is the active client's practice.
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
