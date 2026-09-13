"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { todayISO } from "@/lib/credentials";
import { CHANNEL_LABELS, ENROLLMENT_STATUSES, IN_FLIGHT, proposedFollowUp } from "@/lib/enrollments";

function text(formData, key) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

function isDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");
}

function refresh() {
  revalidatePath("/enrollments");
  revalidatePath("/follow-ups");
  revalidatePath("/dashboard");
}

// A cell with no row yet is "Not started"; the row is created by the first
// thing anyone records on it. RLS decides whether this user may.
async function ensureEnrollment(supabase, providerId, payerId) {
  const { data: existing } = await supabase
    .from("cred_enrollments")
    .select("id, status, submitted_date, next_follow_up_date")
    .eq("provider_id", providerId)
    .eq("payer_id", payerId)
    .maybeSingle();
  if (existing) return { enrollment: existing };

  const { data, error } = await supabase
    .from("cred_enrollments")
    .insert({ provider_id: providerId, payer_id: payerId })
    .select("id, status, submitted_date, next_follow_up_date")
    .single();
  return { enrollment: data, error };
}

// Status is always changed by hand (alcance §6). Two conveniences, both only
// filling blanks: moving to Submitted stamps today's submission date, and an
// application with the payer and no follow-up date gets one a week out.
export async function setEnrollmentStatus(providerId, payerId, formData) {
  const status = formData.get("status")?.toString();
  if (!ENROLLMENT_STATUSES.includes(status)) return;

  const { supabase } = await getAppContext();
  const { data: enrollment } = await supabase
    .from("cred_enrollments")
    .select("id, submitted_date, next_follow_up_date")
    .eq("provider_id", providerId)
    .eq("payer_id", payerId)
    .maybeSingle();

  const patch = { status };
  if (status === "submitted" && !enrollment?.submitted_date) patch.submitted_date = todayISO();
  if (IN_FLIGHT.includes(status) && !enrollment?.next_follow_up_date) patch.next_follow_up_date = proposedFollowUp();

  // First touch on an empty cell: create it straight in the chosen status, so
  // the history reads "Opened as Submitted" rather than two entries.
  const { error } = enrollment
    ? await supabase.from("cred_enrollments").update(patch).eq("id", enrollment.id)
    : await supabase.from("cred_enrollments").insert({ provider_id: providerId, payer_id: payerId, ...patch });
  if (error) throw new Error(error.message);
  refresh();
}

// Record a contact with the payer and set when to chase next (alcance §3.6–3.7).
export async function logFollowUp(providerId, payerId, _prev, formData) {
  const values = {
    contact_date: text(formData, "contact_date") ?? todayISO(),
    channel: text(formData, "channel"),
    contact_person: text(formData, "contact_person"),
    reference_number: text(formData, "reference_number"),
    outcome: text(formData, "outcome"),
    requested: text(formData, "requested"),
  };
  const nextFollowUp = text(formData, "next_follow_up_date");

  const fieldErrors = {};
  if (!CHANNEL_LABELS[values.channel]) fieldErrors.channel = "Choose how you contacted the payer.";
  if (!isDate(values.contact_date)) fieldErrors.contact_date = "Enter the date of the contact.";
  if (values.contact_date > todayISO()) fieldErrors.contact_date = "The contact can't be in the future.";
  if (!values.outcome && !values.reference_number) {
    fieldErrors.outcome = "Write what happened, or at least the reference number.";
  }
  if (nextFollowUp && !isDate(nextFollowUp)) fieldErrors.next_follow_up_date = "Enter a date.";
  else if (nextFollowUp && isDate(values.contact_date) && nextFollowUp < values.contact_date) {
    fieldErrors.next_follow_up_date = "The next follow-up can't be before this contact.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase } = await getAppContext();
  const { enrollment, error } = await ensureEnrollment(supabase, providerId, payerId);
  if (error || !enrollment) return { error: `Couldn't open this enrollment: ${error?.message}` };

  const { error: insertError } = await supabase
    .from("cred_communications")
    .insert({ ...values, enrollment_id: enrollment.id });
  if (insertError) return { error: `Couldn't save the entry: ${insertError.message}` };

  const { error: updateError } = await supabase
    .from("cred_enrollments")
    .update({ next_follow_up_date: nextFollowUp })
    .eq("id", enrollment.id);
  if (updateError) return { error: `Saved the entry, but not the next follow-up: ${updateError.message}` };

  refresh();
  return { saved: Date.now() };
}

export async function updateEnrollmentDetails(providerId, payerId, _prev, formData) {
  const values = {
    assigned_user_id: text(formData, "assigned_user_id"),
    next_follow_up_date: text(formData, "next_follow_up_date"),
    submitted_date: text(formData, "submitted_date"),
    effective_date: text(formData, "effective_date"),
    external_ref: text(formData, "external_ref"),
    notes: text(formData, "notes"),
    revalidation_months_override: text(formData, "revalidation_months_override"),
  };

  const fieldErrors = {};
  for (const key of ["next_follow_up_date", "submitted_date", "effective_date"]) {
    if (values[key] && !isDate(values[key])) fieldErrors[key] = "Enter a date.";
  }
  if (values.revalidation_months_override) {
    const months = Number(values.revalidation_months_override);
    if (!Number.isInteger(months) || months < 1 || months > 120) {
      fieldErrors.revalidation_months_override = "Enter a number of months between 1 and 120.";
    } else {
      values.revalidation_months_override = months;
    }
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase } = await getAppContext();
  const { enrollment, error } = await ensureEnrollment(supabase, providerId, payerId);
  if (error || !enrollment) return { error: `Couldn't open this enrollment: ${error?.message}` };

  const { error: updateError } = await supabase.from("cred_enrollments").update(values).eq("id", enrollment.id);
  if (updateError) {
    if (updateError.message.includes("ASSIGNEE_NOT_MEMBER")) return { error: "That person isn't on this account." };
    return { error: `Couldn't save: ${updateError.message}` };
  }

  refresh();
  return { notice: "Saved." };
}

export async function deleteCommunication(communicationId) {
  const { supabase } = await getAppContext();
  const { error } = await supabase.from("cred_communications").delete().eq("id", communicationId);
  if (error) throw new Error(error.message);
  refresh();
}

// --- The organization's payer list -----------------------------------------

export async function addCatalogPayers(formData) {
  const ids = formData.getAll("payer_global_id").map(String).filter(Boolean);
  if (ids.length === 0) return;

  const { supabase, org } = await getAppContext();
  // The "once per org" rule is a partial unique index, which ON CONFLICT
  // can't target — so skip what's already on the list, and let the index
  // catch a double submit.
  const { data: existing } = await supabase
    .from("cred_payers_org")
    .select("payer_global_id")
    .eq("org_id", org.id)
    .not("payer_global_id", "is", null);
  const have = new Set((existing ?? []).map((r) => r.payer_global_id));
  const rows = ids.filter((id) => !have.has(id)).map((id) => ({ org_id: org.id, payer_global_id: id }));

  if (rows.length) {
    const { error } = await supabase.from("cred_payers_org").insert(rows);
    if (error && error.code !== "23505") throw new Error(error.message);
  }
  revalidatePath("/enrollments/payers");
  refresh();
}

export async function addOwnPayer(_prev, formData) {
  const name = text(formData, "name");
  const payerType = text(formData, "payer_type");
  const months = Number(formData.get("revalidation_months"));

  const fieldErrors = {};
  if (!name) fieldErrors.name = "Enter the payer's name.";
  if (!["commercial", "medicare", "medicaid", "other"].includes(payerType)) fieldErrors.payer_type = "Choose a type.";
  if (!Number.isInteger(months) || months < 1 || months > 120) {
    fieldErrors.revalidation_months = "Enter a number of months between 1 and 120.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase, org } = await getAppContext();
  const { error } = await supabase
    .from("cred_payers_org")
    .insert({ org_id: org.id, name, payer_type: payerType, revalidation_months: months });
  if (error) {
    if (error.code === "23505") return { fieldErrors: { name: "You already have a payer with this name." } };
    return { error: `Couldn't add the payer: ${error.message}` };
  }

  revalidatePath("/enrollments/payers");
  refresh();
  return { saved: Date.now() };
}

export async function removePayer(payerId) {
  const { supabase } = await getAppContext();
  const { count } = await supabase
    .from("cred_enrollments")
    .select("id", { count: "exact", head: true })
    .eq("payer_id", payerId);
  // The database refuses too (no cascade on enrollments.payer_id); this just
  // keeps the page from showing a raw error.
  if (count) return;

  const { error } = await supabase.from("cred_payers_org").delete().eq("id", payerId);
  if (error) throw new Error(error.message);
  revalidatePath("/enrollments/payers");
  refresh();
}
