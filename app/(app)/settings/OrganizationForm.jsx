"use client";

import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import useSmartForm from "@/components/app/useSmartForm";
import SubmitButton from "@/components/app/SubmitButton";

const orgErrors = (only) => (v) => {
  const errors = {};
  if (only === "name" && !String(v.name ?? "").trim()) errors.name = "Enter a name.";
  const n = Number(v.caqh_reattestation_interval_days);
  if (only === "caqh" && (!Number.isInteger(n) || n < 30 || n > 365)) errors.caqh_reattestation_interval_days = "Between 30 and 365 days.";
  return errors;
};

//   only  "name" — the company name on invoices and emails
//         "caqh" — how often CAQH attestations come due
export default function OrganizationForm({ action, org, canEdit, only }) {
  const form = useSmartForm(action, {
    initial: { name: org.name, caqh_reattestation_interval_days: String(org.caqh_reattestation_interval_days) },
    validate: orgErrors(only),
  });
  const { values, bind, errorFor, state, pending } = form;
  const interval = values.caqh_reattestation_interval_days;

  return (
    <form onSubmit={form.onSubmit} onBlur={form.onBlur} noValidate className="flex flex-col gap-5">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <div className="grid gap-5 sm:grid-cols-2">
        {only === "name" && (
        <Field label="Company name" htmlFor="org-name" error={errorFor("name")} hint="Your business, as it appears on invoices and emails — not a person's name.">
          <input id="org-name" name="name" value={values.name} onChange={bind("name")} disabled={!canEdit} className={inputClass} />
        </Field>
        )}
        {only === "caqh" && (
        <Field
          label="CAQH re-attestation every"
          htmlFor="caqh-interval"
          error={errorFor("caqh_reattestation_interval_days")}
          hint={interval === "120" ? "Days between attestations — 120 is what CAQH asks for." : "CAQH asks for 120 days; use another interval only if a payer requires it."}
        >
          <div className="flex items-center gap-2">
            <input
              id="caqh-interval"
              name="caqh_reattestation_interval_days"
              inputMode="numeric"
              maxLength={3}
              value={interval}
              onChange={bind("caqh_reattestation_interval_days", (v) => v.replace(/\D/g, "").slice(0, 3))}
              disabled={!canEdit}
              className={`${inputClass} w-24 font-mono`}
            />
            <span className="text-sm text-ink-500">days</span>
          </div>
        </Field>
        )}
      </div>
      {canEdit && (
        <div>
          <SubmitButton pending={pending} className={buttonClass("primary")}>
            {pending ? "Saving…" : "Save"}
          </SubmitButton>
        </div>
      )}
    </form>
  );
}
