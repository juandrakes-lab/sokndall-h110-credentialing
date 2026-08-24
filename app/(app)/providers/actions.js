"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";

function fieldOrNull(formData, key) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

export async function createProvider(formData) {
  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  const supabase = await createClient();
  const { error } = await supabase.from("providers").insert({
    org_id: org.id,
    first_name: formData.get("first_name")?.toString().trim(),
    last_name: formData.get("last_name")?.toString().trim(),
    npi: fieldOrNull(formData, "npi"),
    caqh_id: fieldOrNull(formData, "caqh_id"),
    specialty: fieldOrNull(formData, "specialty"),
    email: fieldOrNull(formData, "email"),
    notes: fieldOrNull(formData, "notes"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/providers");
  redirect("/providers");
}

export async function updateProvider(providerId, formData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("providers")
    .update({
      first_name: formData.get("first_name")?.toString().trim(),
      last_name: formData.get("last_name")?.toString().trim(),
      npi: fieldOrNull(formData, "npi"),
      caqh_id: fieldOrNull(formData, "caqh_id"),
      specialty: fieldOrNull(formData, "specialty"),
      email: fieldOrNull(formData, "email"),
      status: formData.get("status")?.toString(),
      notes: fieldOrNull(formData, "notes"),
    })
    .eq("id", providerId);

  if (error) throw new Error(error.message);

  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/providers");
}

export async function deleteProvider(providerId) {
  const supabase = await createClient();
  const { error } = await supabase.from("providers").delete().eq("id", providerId);
  if (error) throw new Error(error.message);

  revalidatePath("/providers");
  redirect("/providers");
}

export async function createCredential(providerId, formData) {
  const supabase = await createClient();
  const { error } = await supabase.from("credentials").insert({
    provider_id: providerId,
    type: formData.get("type")?.toString(),
    identifier: fieldOrNull(formData, "identifier"),
    state: fieldOrNull(formData, "state"),
    issue_date: fieldOrNull(formData, "issue_date"),
    expiration_date: fieldOrNull(formData, "expiration_date"),
    notes: fieldOrNull(formData, "notes"),
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/dashboard");
}

export async function deleteCredential(providerId, credentialId) {
  const supabase = await createClient();
  const { error } = await supabase.from("credentials").delete().eq("id", credentialId);
  if (error) throw new Error(error.message);

  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/dashboard");
}

export async function importProviders(rows) {
  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  const errors = [];
  const valid = [];

  rows.forEach((row, i) => {
    if (!row.first_name || !row.last_name) {
      errors.push(`Row ${i + 2}: missing first or last name.`);
      return;
    }
    valid.push({
      org_id: org.id,
      first_name: row.first_name,
      last_name: row.last_name,
      npi: row.npi ?? null,
      caqh_id: row.caqh_id ?? null,
      specialty: row.specialty ?? null,
      email: row.email ?? null,
      notes: row.notes ?? null,
    });
  });

  let inserted = 0;
  if (valid.length > 0) {
    const supabase = await createClient();
    const { error, count } = await supabase
      .from("providers")
      .insert(valid, { count: "exact" });

    if (error) throw new Error(error.message);
    inserted = count ?? valid.length;
  }

  revalidatePath("/providers");
  return { inserted, errors };
}
