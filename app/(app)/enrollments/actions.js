"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { todayISO } from "@/lib/credentials";
import { ENROLLMENT_STATUSES, IN_FLIGHT, proposedFollowUp } from "@/lib/enrollments";
import { REVALIDATION_CHOICES, detailsErrors, followUpErrors, requestErrors } from "@/lib/enrollment-rules";

function text(formData, key) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
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

  const fieldErrors = followUpErrors({ ...values, next_follow_up_date: nextFollowUp });
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase } = await getAppContext();
  const { enrollment, error } = await ensureEnrollment(supabase, providerId, payerId);
  if (error || !enrollment) return { error: `Couldn't open this enrollment: ${error?.message}` };

  const { error: insertError } = await supabase
    .from("cred_communications")
    .insert({ ...values, enrollment_id: enrollment.id });
  if (insertError) return { error: `Couldn't save the entry: ${insertError.message}` };

  const patch = { next_follow_up_date: nextFollowUp };
  if (values.requested && enrollment.status === "info_requested") patch.pending_request = values.requested.slice(0, 500);
  const { error: updateError } = await supabase.from("cred_enrollments").update(patch).eq("id", enrollment.id);
  if (updateError) return { error: `Saved the entry, but not the next follow-up: ${updateError.message}` };

  refresh();
  return { saved: Date.now() };
}

// The payer asked for something (alcance §3.7, rev. 2026-09-18): the
// application moves to "Info requested" with the request on it, and the
// request goes into the call log too.
export async function markInfoRequested(providerId, payerId, _prev, formData) {
  const values = { request: text(formData, "request"), channel: text(formData, "channel") };
  const fieldErrors = requestErrors(values);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase } = await getAppContext();
  const { enrollment, error } = await ensureEnrollment(supabase, providerId, payerId);
  if (error || !enrollment) return { error: `Couldn't open this enrollment: ${error?.message}` };

  const patch = { status: "info_requested", pending_request: values.request };
  if (!enrollment.next_follow_up_date) patch.next_follow_up_date = proposedFollowUp();
  const { error: updateError } = await supabase.from("cred_enrollments").update(patch).eq("id", enrollment.id);
  if (updateError) return { error: `Couldn't save: ${updateError.message}` };

  await supabase.from("cred_communications").insert({
    enrollment_id: enrollment.id,
    contact_date: todayISO(),
    channel: values.channel,
    outcome: "The payer asked for more information.",
    requested: values.request,
  });

  refresh();
  return { saved: Date.now() };
}

// The request was answered. The status stays as it is — moving it on (for
// example back to "In review") is still a separate, deliberate step.
export async function resolveRequest(providerId, payerId) {
  const { supabase } = await getAppContext();
  const { error } = await supabase
    .from("cred_enrollments")
    .update({ pending_request: null })
    .eq("provider_id", providerId)
    .eq("payer_id", payerId);
  if (error) throw new Error(error.message);
  refresh();
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

  const { supabase } = await getAppContext();
  const { data: current } = await supabase
    .from("cred_enrollments")
    .select("status, next_follow_up_date, revalidation_months_override")
    .eq("provider_id", providerId)
    .eq("payer_id", payerId)
    .maybeSingle();
  const fieldErrors = detailsErrors(values, {
    status: current?.status ?? "not_started",
    initial: {
      next_follow_up_date: current?.next_follow_up_date ?? "",
      revalidation_months_override: current?.revalidation_months_override ? String(current.revalidation_months_override) : "",
    },
  });
  if (Object.keys(fieldErrors).length) return { fieldErrors };
  if (values.revalidation_months_override) values.revalidation_months_override = Number(values.revalidation_months_override);

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

// --- The client's payer list (alcance §3.4, rev. 2026-09-18) ------------------
// Each client has its own list: a Billing Co client in Ohio doesn't get the
// New York client's payers as columns.

export async function addCatalogPayers(formData) {
  const ids = formData.getAll("payer_global_id").map(String).filter(Boolean);
  if (ids.length === 0) return;

  const { supabase, org, client } = await getAppContext();
  // The "once per client" rule is a partial unique index, which ON CONFLICT
  // can't target — so skip what's already on the list, and let the index
  // catch a double submit.
  const { data: existing } = await supabase
    .from("cred_payers_org")
    .select("payer_global_id")
    .eq("client_org_id", client.id)
    .not("payer_global_id", "is", null);
  const have = new Set((existing ?? []).map((r) => r.payer_global_id));
  const rows = ids.filter((id) => !have.has(id)).map((id) => ({ org_id: org.id, client_org_id: client.id, payer_global_id: id }));

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
  if (!REVALIDATION_CHOICES.includes(months)) fieldErrors.revalidation_months = "Choose a cycle.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase, org, client } = await getAppContext();
  const { error } = await supabase
    .from("cred_payers_org")
    .insert({ org_id: org.id, client_org_id: client.id, name, payer_type: payerType, revalidation_months: months });
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
