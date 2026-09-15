"use client";

import { useEffect } from "react";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import { CHANNEL_LABELS } from "@/lib/enrollments";
import { REVALIDATION_CHOICES, detailsErrors, followUpErrors } from "@/lib/enrollment-rules";
import useSmartForm from "@/components/app/useSmartForm";
import SubmitButton from "@/components/app/SubmitButton";

// "Log a follow-up": one contact with the payer, and when to chase next —
// proposed a week out, editable (alcance §3.6–3.7).
export function FollowUpForm({ action, today, proposed }) {
  const blank = { contact_date: today, channel: "phone", contact_person: "", reference_number: "", outcome: "", requested: "", next_follow_up_date: proposed };
  const form = useSmartForm(action, { initial: blank, validate: followUpErrors });
  const { values, bind, errorFor, state, pending } = form;

  useEffect(() => {
    if (state?.saved) form.reset(blank);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only after a save
  }, [state?.saved]);

  return (
    <form onSubmit={form.onSubmit} onBlur={form.onBlur} noValidate className="flex flex-col gap-4">
      <FormError message={state?.error} />
      {state?.saved && <FormNotice message="Logged. The next follow-up is set." />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" htmlFor="fu-date" error={errorFor("contact_date")}>
          <input id="fu-date" name="contact_date" type="date" max={today} value={values.contact_date} onChange={bind("contact_date")} className={inputClass} />
        </Field>
        <Field label="How" htmlFor="fu-channel" error={errorFor("channel")}>
          <select id="fu-channel" name="channel" value={values.channel} onChange={bind("channel")} className={inputClass}>
            {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Who you spoke with" htmlFor="fu-person">
          <input id="fu-person" name="contact_person" maxLength={80} value={values.contact_person} onChange={bind("contact_person")} className={inputClass} placeholder="e.g. Karen, provider relations" />
        </Field>
        <Field label="Reference / ticket number" htmlFor="fu-ref" error={errorFor("reference_number")}>
          <input id="fu-ref" name="reference_number" maxLength={40} value={values.reference_number} onChange={bind("reference_number")} className={`${inputClass} font-mono`} autoComplete="off" />
        </Field>
      </div>
      <Field label="What happened" htmlFor="fu-outcome" error={errorFor("outcome")}>
        <textarea id="fu-outcome" name="outcome" rows={2} value={values.outcome} onChange={bind("outcome")} className={inputClass} placeholder="e.g. Application received, in queue for review" />
      </Field>
      <Field label="What they asked for" htmlFor="fu-requested">
        <textarea id="fu-requested" name="requested" rows={2} value={values.requested} onChange={bind("requested")} className={inputClass} placeholder="Leave empty if nothing" />
      </Field>
      <Field label="Next follow-up" htmlFor="fu-next" error={errorFor("next_follow_up_date")} hint="A week from today unless you change it.">
        <input id="fu-next" name="next_follow_up_date" type="date" min={values.contact_date || today} value={values.next_follow_up_date} onChange={bind("next_follow_up_date")} className={`${inputClass} sm:max-w-[12rem]`} />
      </Field>
      <div>
        <SubmitButton pending={pending} className={buttonClass("primary")}>
          {pending ? "Saving…" : "Log follow-up"}
        </SubmitButton>
      </div>
    </form>
  );
}

// Everything else about the application: who owns it, dates, references.
// Dates that don't apply yet stay locked: the submission date until the
// application leaves "Not started", the effective date until it's approved.
export function DetailsForm({ action, enrollment, members, ownerEmail: ownerName, payerMonths, status = "not_started" }) {
  const initial = {
    assigned_user_id: enrollment?.assigned_user_id ?? "",
    next_follow_up_date: enrollment?.next_follow_up_date ?? "",
    submitted_date: enrollment?.submitted_date ?? "",
    effective_date: enrollment?.effective_date ?? "",
    external_ref: enrollment?.external_ref ?? "",
    revalidation_months_override: enrollment?.revalidation_months_override ? String(enrollment.revalidation_months_override) : "",
    notes: enrollment?.notes ?? "",
  };
  const form = useSmartForm(action, { initial, validate: (v) => detailsErrors(v, { initial, status }) });
  const { values, bind, errorFor, state, pending } = form;
  const submittedLocked = status === "not_started" && !values.submitted_date;
  const effectiveLocked = status !== "approved" && !values.effective_date;
  const cycles = [...new Set([...REVALIDATION_CHOICES, ...(initial.revalidation_months_override ? [Number(initial.revalidation_months_override)] : [])])].sort((a, b) => a - b);

  return (
    <form onSubmit={form.onSubmit} onBlur={form.onBlur} noValidate className="flex flex-col gap-4">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Responsible" htmlFor="d-assigned">
          <select id="d-assigned" name="assigned_user_id" value={values.assigned_user_id} onChange={bind("assigned_user_id")} className={inputClass}>
            <option value="">Account owner ({ownerName})</option>
            {members
              .filter((m) => m.role !== "owner")
              .map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.name}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Next follow-up" htmlFor="d-next" error={errorFor("next_follow_up_date")}>
          <input id="d-next" name="next_follow_up_date" type="date" value={values.next_follow_up_date} onChange={bind("next_follow_up_date")} className={inputClass} />
        </Field>
        <Field
          label="Submitted on"
          htmlFor="d-submitted"
          error={errorFor("submitted_date")}
          hint={submittedLocked ? "Filled in when the status moves to Submitted." : undefined}
        >
          <input id="d-submitted" name="submitted_date" type="date" disabled={submittedLocked} value={values.submitted_date} onChange={bind("submitted_date")} className={inputClass} />
        </Field>
        <Field
          label="Effective date"
          htmlFor="d-effective"
          error={errorFor("effective_date")}
          hint={effectiveLocked ? "Available once the payer approves." : "When the payer starts paying this provider (can be retroactive)."}
        >
          <input id="d-effective" name="effective_date" type="date" disabled={effectiveLocked} value={values.effective_date} onChange={bind("effective_date")} className={inputClass} />
        </Field>
        <Field label="Application / tracking number" htmlFor="d-ref" error={errorFor("external_ref")}>
          <input id="d-ref" name="external_ref" maxLength={40} value={values.external_ref} onChange={bind("external_ref")} className={`${inputClass} font-mono`} autoComplete="off" />
        </Field>
        <Field label="Revalidate every" htmlFor="d-reval" error={errorFor("revalidation_months_override")}>
          <select id="d-reval" name="revalidation_months_override" value={values.revalidation_months_override} onChange={bind("revalidation_months_override")} className={inputClass}>
            <option value="">This payer&apos;s default ({payerMonths} months)</option>
            {cycles.map((m) => (
              <option key={m} value={m}>
                {m} months{m % 12 === 0 ? ` (${m / 12} year${m === 12 ? "" : "s"})` : ""}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Notes" htmlFor="d-notes">
        <textarea id="d-notes" name="notes" rows={2} value={values.notes} onChange={bind("notes")} className={inputClass} />
      </Field>
      <div>
        <SubmitButton pending={pending} className={buttonClass("secondary")}>
          {pending ? "Saving…" : "Save details"}
        </SubmitButton>
      </div>
    </form>
  );
}
