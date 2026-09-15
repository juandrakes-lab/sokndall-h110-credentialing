"use client";

import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import useSmartForm from "@/components/app/useSmartForm";
import SubmitButton from "@/components/app/SubmitButton";

const rules = (v) => {
  const e = {};
  if (!v.first_name.trim()) e.first_name = "Enter your first name.";
  if (!v.last_name.trim()) e.last_name = "Enter your last name.";
  return e;
};

// Your own name — how the rest of the team sees you (responsible, history).
export default function ProfileForm({ action, firstName, lastName, email }) {
  const form = useSmartForm(action, { initial: { first_name: firstName ?? "", last_name: lastName ?? "" }, validate: rules });
  const { values, bind, errorFor, state, pending } = form;
  return (
    <form onSubmit={form.onSubmit} onBlur={form.onBlur} noValidate className="flex flex-col gap-5">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="First name" htmlFor="me-first" error={errorFor("first_name")}>
          <input id="me-first" name="first_name" value={values.first_name} onChange={bind("first_name")} autoComplete="given-name" className={inputClass} />
        </Field>
        <Field label="Last name" htmlFor="me-last" error={errorFor("last_name")}>
          <input id="me-last" name="last_name" value={values.last_name} onChange={bind("last_name")} autoComplete="family-name" className={inputClass} />
        </Field>
        <Field label="Email" htmlFor="me-email" hint="Your sign-in email.">
          <input id="me-email" value={email} disabled className={inputClass} />
        </Field>
      </div>
      <div>
        <SubmitButton pending={pending} className={buttonClass("secondary")}>
          {pending ? "Saving…" : "Save name"}
        </SubmitButton>
      </div>
    </form>
  );
}
