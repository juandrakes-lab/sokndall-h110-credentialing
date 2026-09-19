"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { fetchNppes } from "@/lib/nppes";
import { providerErrors } from "@/lib/provider-rules";
import { credentialErrors } from "@/lib/credential-rules";
import { snapshotFromLookup } from "@/lib/consistency";
import { CREDENTIAL_FIELDS, CREDENTIAL_TYPES } from "@/lib/credentials";
import { BUCKET } from "@/lib/documents";

function text(formData, key) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

function readProvider(formData) {
  return {
    first_name: text(formData, "first_name"),
    last_name: text(formData, "last_name"),
    npi: text(formData, "npi")?.replace(/\D/g, "") || null,
    caqh_id: text(formData, "caqh_id")?.replace(/\D/g, "") || null,
    taxonomy_code: text(formData, "taxonomy_code")?.toUpperCase() ?? null,
    specialty: text(formData, "specialty"),
    email: text(formData, "email")?.toLowerCase() ?? null,
    // Stored as the 10 digits; shown as (555) 201-4433.
    phone: text(formData, "phone")?.replace(/\D/g, "").replace(/^1(\d{10})$/, "$1") || null,
    start_date: text(formData, "start_date"),
    notes: text(formData, "notes"),
  };
}

// Same rules as the form, plus what only the server can see: another
// provider on the account with this NPI.
async function validateProvider(supabase, values, providerId = null) {
  const errors = providerErrors(values);
  if (values.npi && !errors.npi) {
    let q = supabase.from("cred_providers").select("id, first_name, last_name").eq("npi", values.npi).limit(1);
    if (providerId) q = q.neq("id", providerId);
    const { data: twin } = await q;
    if (twin?.[0]) errors.npi = `${twin[0].first_name} ${twin[0].last_name} already has this NPI.`;
  }
  return errors;
}

// The NPI Registry record saved with the provider, for the consistency check.
// Registry down → leave whatever snapshot was there.
async function nppesFields(npi) {
  if (!npi) return { nppes_data: null, nppes_checked_at: null };
  const snapshot = snapshotFromLookup(await fetchNppes(npi));
  return snapshot === undefined ? {} : { nppes_data: snapshot, nppes_checked_at: new Date().toISOString() };
}

export async function createProvider(_prev, formData) {
  const { supabase, org, practice } = await getAppContext();
  if (!org || !practice) redirect("/onboarding");

  const values = readProvider(formData);
  const fieldErrors = await validateProvider(supabase, values);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  if (!values.start_date) delete values.start_date;

  const { data, error } = await supabase
    .from("cred_providers")
    .insert({ ...values, practice_id: practice.id, ...(await nppesFields(values.npi)) })
    .select("id")
    .single();

  if (error) {
    // The database is what enforces the plan limit (alcance §4.3).
    if (error.message.includes("PROVIDER_LIMIT_REACHED")) return { limit: true };
    return { error: `Couldn't save the provider: ${error.message}` };
  }

  revalidatePath("/providers");
  revalidatePath("/dashboard");
  redirect(`/providers/${data.id}`);
}

export async function updateProvider(providerId, _prev, formData) {
  const { supabase } = await getAppContext();

  const values = readProvider(formData);
  const fieldErrors = await validateProvider(supabase, values, providerId);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  values.status = formData.get("status") === "inactive" ? "inactive" : "active";
  if (!values.start_date) delete values.start_date;

  const { data: current } = await supabase
    .from("cred_providers")
    .select("npi, nppes_data")
    .eq("id", providerId)
    .maybeSingle();
  if (!current) return { error: "This provider no longer exists." };

  const npiChanged = current.npi !== values.npi;
  const registry = npiChanged || !current.nppes_data ? await nppesFields(values.npi) : {};

  const { error } = await supabase
    .from("cred_providers")
    .update({ ...values, ...registry })
    .eq("id", providerId);

  if (error) {
    // Inactive providers free their seat (alcance §4.3); coming back takes one.
    if (error.message.includes("PROVIDER_LIMIT_REACHED")) {
      return { fieldErrors: { status: "Your plan has no free seat to make this provider active again. Mark another provider inactive, or upgrade." } };
    }
    return { error: `Couldn't save: ${error.message}` };
  }

  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/providers");
  revalidatePath("/dashboard");
  return { notice: "Saved." };
}

export async function recheckProviderNppes(providerId) {
  const { supabase } = await getAppContext();
  const { data: provider } = await supabase
    .from("cred_providers")
    .select("npi")
    .eq("id", providerId)
    .maybeSingle();
  if (!provider?.npi) return;

  const registry = await nppesFields(provider.npi);
  if (Object.keys(registry).length) {
    await supabase.from("cred_providers").update(registry).eq("id", providerId);
  }
  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/providers");
}

export async function deleteProvider(providerId, _prev, formData) {
  const { supabase } = await getAppContext();

  // The typed name is checked here too, not only in the browser.
  const { data: provider } = await supabase.from("cred_providers").select("first_name, last_name").eq("id", providerId).maybeSingle();
  if (!provider) return { error: "This provider no longer exists." };
  const typed = formData?.get("confirm")?.toString().trim().toLowerCase() ?? "";
  if (typed !== `${provider.first_name} ${provider.last_name}`.trim().toLowerCase()) {
    return { error: "Type the provider's full name exactly to delete them." };
  }

  // Stored files don't cascade with the provider row, so they go first.
  const { data: docs } = await supabase.from("cred_documents").select("storage_path").eq("provider_id", providerId);
  const paths = (docs ?? []).map((d) => d.storage_path);
  if (paths.length) {
    const { error: storageError } = await supabase.storage.from(BUCKET).remove(paths);
    if (storageError) throw new Error(storageError.message);
  }

  const { error } = await supabase.from("cred_providers").delete().eq("id", providerId);
  if (error) throw new Error(error.message);

  revalidatePath("/providers");
  revalidatePath("/dashboard");
  redirect("/providers");
}

// --- Credentials ------------------------------------------------------------

function readCredential(type, formData) {
  const config = CREDENTIAL_TYPES[type];
  const values = Object.fromEntries(CREDENTIAL_FIELDS.map((f) => [f, null]));
  for (const field of config.fields) values[field] = text(formData, field);
  if (values.state) values.state = values.state.toUpperCase();
  if (type === "dea" && values.number) values.number = values.number.replace(/\s/g, "").toUpperCase();
  values.notes = text(formData, "notes");
  // Only sent when the account has more than one person (the field is hidden otherwise).
  if (formData.has("assigned_user_id")) values.assigned_user_id = text(formData, "assigned_user_id");
  return values;
}

// The form's rules again — a DEA number is checked against the provider's
// last name, which only the database knows for sure.
async function validateCredential(supabase, type, values, providerId) {
  const { data: provider } = await supabase.from("cred_providers").select("last_name").eq("id", providerId).maybeSingle();
  return credentialErrors(type, values, { lastName: provider?.last_name });
}

export async function createCredential(providerId, _prev, formData) {
  const type = formData.get("type")?.toString();
  if (!CREDENTIAL_TYPES[type]) return { error: "Choose a credential type." };

  const { supabase } = await getAppContext();
  const values = readCredential(type, formData);
  const fieldErrors = await validateCredential(supabase, type, values, providerId);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { error } = await supabase
    .from("cred_credentials")
    .insert({ ...values, type, provider_id: providerId });

  if (error) {
    if (error.message.includes("ASSIGNEE_NOT_MEMBER")) return { error: "That person can't see this provider." };
    return { error: `Couldn't save the credential: ${error.message}` };
  }

  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/providers");
  revalidatePath("/dashboard");
  return { saved: Date.now() };
}

export async function updateCredential(credentialId, providerId, _prev, formData) {
  const { supabase } = await getAppContext();
  const { data: current } = await supabase
    .from("cred_credentials")
    .select("type")
    .eq("id", credentialId)
    .maybeSingle();
  if (!current) return { error: "This credential no longer exists." };

  const values = readCredential(current.type, formData);
  const fieldErrors = await validateCredential(supabase, current.type, values, providerId);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { error } = await supabase.from("cred_credentials").update(values).eq("id", credentialId);
  if (error) return { error: `Couldn't save: ${error.message}` };

  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/providers");
  revalidatePath("/dashboard");
  return { saved: Date.now() };
}

export async function deleteCredential(credentialId, providerId) {
  const { supabase } = await getAppContext();
  const { error } = await supabase.from("cred_credentials").delete().eq("id", credentialId);
  if (error) throw new Error(error.message);

  revalidatePath(`/providers/${providerId}`);
  revalidatePath("/providers");
  revalidatePath("/dashboard");
}
