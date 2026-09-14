"use client";

import { useActionState, useEffect, useState } from "react";
import { CREDENTIAL_FIELDS, CREDENTIAL_TYPES, CREDENTIAL_TYPE_KEYS } from "@/lib/credentials";
import { US_STATES } from "@/lib/us-states";
import { Field, FormError, buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

function blank(initial) {
  return Object.fromEntries([...CREDENTIAL_FIELDS, "notes", "assigned_user_id"].map((f) => [f, initial?.[f] ?? ""]));
}

// Add or edit one credential. The fields shown follow the chosen type — a DEA
// registration has no carrier, a malpractice policy has no state. Inputs are
// controlled so a validation error never wipes what was typed.
//
//   caqhIntervalDays  shown next to the CAQH date so the computed due date is
//                     never a surprise
//   onDone            called after a successful save (the edit panel closes)
export default function CredentialForm({ action, initial, caqhIntervalDays, submitLabel, onDone, members = [] }) {
  const [state, formAction, pending] = useActionState(action, {});
  const editing = Boolean(initial?.type);
  const [type, setType] = useState(initial?.type ?? "state_license");
  const [values, setValues] = useState(() => blank(initial));
  const config = CREDENTIAL_TYPES[type];
  const errors = state?.fieldErrors ?? {};
  const idFor = (field) => `${field}-${initial?.id ?? "new"}`;
  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }));

  useEffect(() => {
    if (!state?.saved) return;
    if (onDone) onDone();
    else setValues(blank(null));
  }, [state?.saved, onDone]);

  const input = (field) => {
    const common = { id: idFor(field), name: field, value: values[field], onChange: set(field), className: inputClass };
    if (field === "state") {
      return (
        <select {...common}>
          <option value="">Choose a state</option>
          {US_STATES.map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      );
    }
    if (field.endsWith("_date")) return <input type="date" {...common} />;
    return <input {...common} placeholder={config.placeholders?.[field]} autoComplete="off" />;
  };

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state?.error} />

      {!editing && (
        <Field label="Credential type" htmlFor="type-new">
          <select
            id="type-new"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={`${inputClass} sm:max-w-xs`}
          >
            {CREDENTIAL_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {CREDENTIAL_TYPES[key].label}
              </option>
            ))}
          </select>
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {config.fields.map((field) => (
          <Field
            key={field}
            label={config.labels[field]}
            htmlFor={idFor(field)}
            required={config.required?.includes(field)}
            error={errors[field]}
            hint={
              type === "caqh_attestation" && field === "issue_date"
                ? `The next attestation is due ${caqhIntervalDays} days after this date — calculated for you.`
                : undefined
            }
            className={type === "caqh_attestation" ? "sm:col-span-2" : ""}
          >
            {input(field)}
          </Field>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Notes" htmlFor={idFor("notes")} className={members.length > 1 ? "" : "sm:col-span-2"}>
          <input id={idFor("notes")} name="notes" value={values.notes} onChange={set("notes")} className={inputClass} />
        </Field>
        {/* Only worth asking once there's more than one person on the account. */}
        {members.length > 1 && (
          <Field label="Responsible" htmlFor={idFor("assigned_user_id")} hint="Gets the renewal alerts. The account owner is always copied.">
            <select id={idFor("assigned_user_id")} name="assigned_user_id" value={values.assigned_user_id} onChange={set("assigned_user_id")} className={inputClass}>
              <option value="">Account owner</option>
              {members.filter((m) => m.role !== "owner").map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.email}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <div>
        <SubmitButton disabled={pending} className={buttonClass("primary")}>
          {pending ? "Saving…" : submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
