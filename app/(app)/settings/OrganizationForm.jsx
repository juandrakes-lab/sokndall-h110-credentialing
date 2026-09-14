"use client";

import { useActionState, useState } from "react";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

export default function OrganizationForm({ action, org, canEdit }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [name, setName] = useState(org.name);
  const [interval, setIntervalDays] = useState(String(org.caqh_reattestation_interval_days));
  const errors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Account name" htmlFor="org-name" error={errors.name}>
          <input id="org-name" name="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} className={inputClass} />
        </Field>
        <Field
          label="CAQH re-attestation every"
          htmlFor="caqh-interval"
          error={errors.caqh_reattestation_interval_days}
          hint="Days between attestations. CAQH asks for 120."
        >
          <div className="flex items-center gap-2">
            <input
              id="caqh-interval"
              name="caqh_reattestation_interval_days"
              type="number"
              min={30}
              max={365}
              value={interval}
              onChange={(e) => setIntervalDays(e.target.value)}
              disabled={!canEdit}
              className={`${inputClass} w-28`}
            />
            <span className="text-sm text-ink-500">days</span>
          </div>
        </Field>
      </div>
      {canEdit && (
        <div>
          <SubmitButton disabled={pending} className={buttonClass("primary")}>
            {pending ? "Saving…" : "Save"}
          </SubmitButton>
        </div>
      )}
    </form>
  );
}
