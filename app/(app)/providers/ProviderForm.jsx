"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import NpiCheck from "@/components/app/NpiCheck";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import { formatAddress, sameAddress } from "@/lib/consistency";
import { titleCase } from "@/lib/nppes";
import SubmitButton from "@/components/app/SubmitButton";

const EMPTY = {
  first_name: "",
  last_name: "",
  npi: "",
  caqh_id: "",
  taxonomy_code: "",
  specialty: "",
  email: "",
  phone: "",
  start_date: "",
  status: "active",
  notes: "",
};

export default function ProviderForm({ action, initial, submitLabel, cancelHref, editing = false, limitNotice, practiceAddress, readOnly = false }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const errors = state?.fieldErrors ?? {};

  function applyRegistry(record) {
    setValues((v) => ({
      ...v,
      first_name: titleCase(record.firstName) || v.first_name,
      last_name: titleCase(record.lastName) || v.last_name,
      taxonomy_code: record.taxonomy?.code ?? v.taxonomy_code,
      specialty: record.taxonomy?.desc ?? v.specialty,
    }));
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <fieldset disabled={readOnly} className="contents">
      <FormError message={state?.error} />
      {state?.limit && limitNotice}
      <FormNotice message={state?.notice} />

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Identity</legend>
        <Field label="NPI (individual)" htmlFor="npi" error={errors.npi} hint="10 digits. Check it against the federal NPI Registry before saving." className="sm:col-span-2">
          <div className="flex flex-col gap-3">
            <input id="npi" name="npi" inputMode="numeric" maxLength={10} value={values.npi} onChange={set("npi")} className={`${inputClass} sm:max-w-xs`} autoComplete="off" />
            <NpiCheck
              npi={values.npi}
              expect="individual"
              onApply={applyRegistry}
              compare={(r) => [
                { label: "First name", registry: r.firstName, yours: values.first_name },
                { label: "Last name", registry: r.lastName, yours: values.last_name },
                { label: "Taxonomy", registry: r.taxonomy ? `${r.taxonomy.code} — ${r.taxonomy.desc}` : "", yours: values.taxonomy_code ? `${values.taxonomy_code} — ${values.specialty}` : "", match: !r.taxonomy || (values.taxonomy_code ?? "").toUpperCase() === r.taxonomy.code },
                {
                  label: "Practice location",
                  registry: formatAddress(r.location),
                  yours: practiceAddress ? `${formatAddress(practiceAddress)} (your practice)` : "",
                  match: !practiceAddress || !r.location || sameAddress(practiceAddress, r.location),
                  info: true,
                },
              ]}
            />
          </div>
        </Field>
        <Field label="First name" htmlFor="first_name" required error={errors.first_name}>
          <input id="first_name" name="first_name" value={values.first_name} onChange={set("first_name")} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="Last name" htmlFor="last_name" required error={errors.last_name}>
          <input id="last_name" name="last_name" value={values.last_name} onChange={set("last_name")} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="CAQH ID" htmlFor="caqh_id" error={errors.caqh_id}>
          <input id="caqh_id" name="caqh_id" inputMode="numeric" value={values.caqh_id} onChange={set("caqh_id")} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="Start date" htmlFor="start_date" hint="When the provider joined the practice." error={errors.start_date}>
          <input id="start_date" name="start_date" type="date" value={values.start_date} onChange={set("start_date")} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Specialty</legend>
        <Field label="Specialty" htmlFor="specialty" error={errors.specialty}>
          <input id="specialty" name="specialty" value={values.specialty} onChange={set("specialty")} className={inputClass} placeholder="e.g. Family Medicine" />
        </Field>
        <Field label="Taxonomy code" htmlFor="taxonomy_code" hint="The NPI Registry fills this in, e.g. 207Q00000X." error={errors.taxonomy_code}>
          <input id="taxonomy_code" name="taxonomy_code" value={values.taxonomy_code} onChange={set("taxonomy_code")} className={inputClass} autoComplete="off" />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Contact</legend>
        <Field label="Email" htmlFor="email" error={errors.email}>
          <input id="email" name="email" type="email" value={values.email} onChange={set("email")} className={inputClass} />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone}>
          <input id="phone" name="phone" type="tel" value={values.phone} onChange={set("phone")} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">{editing ? "Status and notes" : "Notes"}</legend>
        {editing && (
          <Field label="Status" htmlFor="status">
            <select id="status" name="status" value={values.status} onChange={set("status")} className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive — no longer with the practice</option>
            </select>
          </Field>
        )}
        <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
          <textarea id="notes" name="notes" rows={3} value={values.notes} onChange={set("notes")} className={inputClass} />
        </Field>
      </fieldset>

      </fieldset>
      {!readOnly && (
      <div className="flex flex-wrap gap-3 border-t border-ink-100 pt-6">
        <SubmitButton disabled={pending} className={buttonClass("primary")}>
          {pending ? "Saving…" : submitLabel}
        </SubmitButton>
        {cancelHref && (
          <Link href={cancelHref} className={buttonClass("secondary")}>
            Cancel
          </Link>
        )}
      </div>
      )}
    </form>
  );
}
