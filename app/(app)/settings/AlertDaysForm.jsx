"use client";

import { useActionState, useState } from "react";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";

export default function AlertDaysForm({ action, initial, canEdit }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [value, setValue] = useState(initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <Field
        label="Email me this many days before a deadline"
        htmlFor="alert-days"
        error={state?.fieldErrors?.alert_days}
        hint="Separate with commas. One more email goes out when something has expired."
      >
        <input
          id="alert-days"
          name="alert_days"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!canEdit}
          className={`${inputClass} sm:max-w-xs`}
        />
      </Field>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-neutral" /> More than 30 days: heads-up</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-expiring" /> 30 days or less: act soon</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-expired" /> 14 days or less, or expired: act now</span>
      </div>
      {canEdit && (
        <div>
          <button type="submit" disabled={pending} className={buttonClass("secondary")}>
            {pending ? "Saving…" : "Save alert days"}
          </button>
        </div>
      )}
    </form>
  );
}
