"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import { CHANNEL_LABELS } from "@/lib/enrollments";
import SubmitButton from "@/components/app/SubmitButton";

// "Log a follow-up": one contact with the payer, and when to chase next —
// proposed a week out, editable (alcance §3.6–3.7).
export function FollowUpForm({ action, today, proposed }) {
  const blank = { contact_date: today, channel: "phone", contact_person: "", reference_number: "", outcome: "", requested: "", next_follow_up_date: proposed };
  const [state, formAction, pending] = useActionState(action, {});
  const [values, setValues] = useState(blank);
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const errors = state?.fieldErrors ?? {};

  useEffect(() => {
    if (state?.saved) setValues(blank);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only after a save
  }, [state?.saved]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormError message={state?.error} />
      {state?.saved && <FormNotice message="Logged. The next follow-up is set." />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" htmlFor="fu-date" error={errors.contact_date}>
          <input id="fu-date" name="contact_date" type="date" max={today} value={values.contact_date} onChange={set("contact_date")} className={inputClass} />
        </Field>
        <Field label="How" htmlFor="fu-channel" error={errors.channel}>
          <select id="fu-channel" name="channel" value={values.channel} onChange={set("channel")} className={inputClass}>
            {Object.entries(CHANNEL_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Who you spoke with" htmlFor="fu-person">
          <input id="fu-person" name="contact_person" value={values.contact_person} onChange={set("contact_person")} className={inputClass} placeholder="e.g. Karen, provider relations" />
        </Field>
        <Field label="Reference / ticket number" htmlFor="fu-ref">
          <input id="fu-ref" name="reference_number" value={values.reference_number} onChange={set("reference_number")} className={inputClass} autoComplete="off" />
        </Field>
      </div>
      <Field label="What happened" htmlFor="fu-outcome" error={errors.outcome}>
        <textarea id="fu-outcome" name="outcome" rows={2} value={values.outcome} onChange={set("outcome")} className={inputClass} placeholder="e.g. Application received, in queue for review" />
      </Field>
      <Field label="What they asked for" htmlFor="fu-requested">
        <textarea id="fu-requested" name="requested" rows={2} value={values.requested} onChange={set("requested")} className={inputClass} placeholder="Leave empty if nothing" />
      </Field>
      <Field label="Next follow-up" htmlFor="fu-next" error={errors.next_follow_up_date} hint="A week from today unless you change it.">
        <input id="fu-next" name="next_follow_up_date" type="date" value={values.next_follow_up_date} onChange={set("next_follow_up_date")} className={`${inputClass} sm:max-w-[12rem]`} />
      </Field>
      <div>
        <SubmitButton disabled={pending} className={buttonClass("primary")}>
          {pending ? "Saving…" : "Log follow-up"}
        </SubmitButton>
      </div>
    </form>
  );
}

// Everything else about the application: who owns it, dates, references.
export function DetailsForm({ action, enrollment, members, ownerEmail, payerMonths }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [values, setValues] = useState({
    assigned_user_id: enrollment?.assigned_user_id ?? "",
    next_follow_up_date: enrollment?.next_follow_up_date ?? "",
    submitted_date: enrollment?.submitted_date ?? "",
    effective_date: enrollment?.effective_date ?? "",
    external_ref: enrollment?.external_ref ?? "",
    revalidation_months_override: enrollment?.revalidation_months_override ?? "",
    notes: enrollment?.notes ?? "",
  });
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Responsible" htmlFor="d-assigned">
          <select id="d-assigned" name="assigned_user_id" value={values.assigned_user_id} onChange={set("assigned_user_id")} className={inputClass}>
            <option value="">Account owner ({ownerEmail})</option>
            {members
              .filter((m) => m.role !== "owner")
              .map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.email}
                </option>
              ))}
          </select>
        </Field>
        <Field label="Next follow-up" htmlFor="d-next" error={errors.next_follow_up_date}>
          <input id="d-next" name="next_follow_up_date" type="date" value={values.next_follow_up_date} onChange={set("next_follow_up_date")} className={inputClass} />
        </Field>
        <Field label="Submitted on" htmlFor="d-submitted" error={errors.submitted_date}>
          <input id="d-submitted" name="submitted_date" type="date" value={values.submitted_date} onChange={set("submitted_date")} className={inputClass} />
        </Field>
        <Field label="Effective date" htmlFor="d-effective" error={errors.effective_date} hint="When the payer starts paying this provider.">
          <input id="d-effective" name="effective_date" type="date" value={values.effective_date} onChange={set("effective_date")} className={inputClass} />
        </Field>
        <Field label="Application / tracking number" htmlFor="d-ref">
          <input id="d-ref" name="external_ref" value={values.external_ref} onChange={set("external_ref")} className={inputClass} autoComplete="off" />
        </Field>
        <Field
          label="Revalidate every"
          htmlFor="d-reval"
          error={errors.revalidation_months_override}
          hint={`Leave empty to use this payer's ${payerMonths} months.`}
        >
          <div className="flex items-center gap-2">
            <input id="d-reval" name="revalidation_months_override" type="number" min={1} max={120} value={values.revalidation_months_override} onChange={set("revalidation_months_override")} className={`${inputClass} w-24`} placeholder={String(payerMonths)} />
            <span className="text-sm text-ink-500">months</span>
          </div>
        </Field>
      </div>
      <Field label="Notes" htmlFor="d-notes">
        <textarea id="d-notes" name="notes" rows={2} value={values.notes} onChange={set("notes")} className={inputClass} />
      </Field>
      <div>
        <SubmitButton disabled={pending} className={buttonClass("secondary")}>
          {pending ? "Saving…" : "Save details"}
        </SubmitButton>
      </div>
    </form>
  );
}
