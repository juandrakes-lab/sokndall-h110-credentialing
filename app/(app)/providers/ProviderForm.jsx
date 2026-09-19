"use client";

import Link from "next/link";
import { useState } from "react";
import NpiCheck from "@/components/app/NpiCheck";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import { formatAddress, sameAddress } from "@/lib/consistency";
import { titleCase } from "@/lib/nppes";
import { digits, formatPhone } from "@/lib/validation";
import { providerErrors } from "@/lib/provider-rules";
import useSmartForm from "@/components/app/useSmartForm";
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

const onlyDigits = (max) => (v) => digits(v).slice(0, max);

// Add or edit a provider. Every field follows lib/provider-rules.js as it's
// typed; the specialty comes from the taxonomies the provider registered in
// the NPI Registry (a closed list), and is typed by hand only when there's no
// registry record to choose from.
export default function ProviderForm({ action, initial, submitLabel, cancelHref, editing = false, limitNotice, practiceAddress, readOnly = false, registry: storedRecord = null }) {
  const start = { ...EMPTY, ...Object.fromEntries(Object.entries(initial ?? {}).map(([k, v]) => [k, v ?? ""])) };
  if (start.phone) start.phone = formatPhone(start.phone);
  const form = useSmartForm(action, { initial: start, validate: providerErrors });
  const { values, setValues, bind, errorFor, state, pending } = form;
  const [record, setRecord] = useState(storedRecord);

  // The registry's taxonomies, primary first — the only specialties offered.
  const taxonomies = (record?.taxonomies?.length ? record.taxonomies : record?.taxonomy ? [{ ...record.taxonomy, primary: true }] : [])
    .slice()
    .sort((a, b) => Number(b.primary) - Number(a.primary));
  const fromRegistry = taxonomies.length > 0 && String(record?.npi ?? "") === values.npi;

  function applyRegistry(r) {
    const primary = r.taxonomies?.find((t) => t.primary) ?? r.taxonomy;
    setValues((v) => ({
      ...v,
      first_name: titleCase(r.firstName) || v.first_name,
      last_name: titleCase(r.lastName) || v.last_name,
      taxonomy_code: primary?.code ?? v.taxonomy_code,
      specialty: primary?.desc ?? v.specialty,
    }));
  }

  function chooseTaxonomy(code) {
    const t = taxonomies.find((x) => x.code === code);
    setValues((v) => ({ ...v, taxonomy_code: code, specialty: t?.desc ?? "" }));
  }

  return (
    <form onSubmit={form.onSubmit} onBlur={form.onBlur} noValidate className="flex flex-col gap-8">
      <fieldset disabled={readOnly} className="contents">
      <FormError message={state?.error} />
      {state?.limit && limitNotice}
      <FormNotice message={state?.notice} />

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Identity</legend>
        <Field label="NPI (individual)" htmlFor="npi" error={errorFor("npi")} hint="10 digits. Check it against the federal NPI Registry — it fills in the name and specialty." className="sm:col-span-2">
          <div className="flex flex-col gap-3">
            <input id="npi" name="npi" inputMode="numeric" maxLength={10} value={values.npi} onChange={bind("npi", onlyDigits(10))} className={`${inputClass} font-mono sm:max-w-xs`} autoComplete="off" placeholder="1234567893" />
            <NpiCheck
              npi={values.npi}
              expect="individual"
              onApply={applyRegistry}
              onRecord={setRecord}
              compare={(r) => [
                { label: "First name", registry: r.firstName, yours: values.first_name },
                { label: "Last name", registry: r.lastName, yours: values.last_name },
                { label: "Taxonomy", registry: r.taxonomy ? `${r.taxonomy.code} — ${r.taxonomy.desc}` : "", yours: values.taxonomy_code ? `${values.taxonomy_code} — ${values.specialty}` : "", match: !r.taxonomy || (values.taxonomy_code ?? "").toUpperCase() === r.taxonomy.code || (r.taxonomies ?? []).some((t) => t.code === (values.taxonomy_code ?? "").toUpperCase()) },
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
        <Field label="First name" htmlFor="first_name" required error={errorFor("first_name")}>
          <input id="first_name" name="first_name" value={values.first_name} onChange={bind("first_name")} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="Last name" htmlFor="last_name" required error={errorFor("last_name")}>
          <input id="last_name" name="last_name" value={values.last_name} onChange={bind("last_name")} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="CAQH ID" htmlFor="caqh_id" error={errorFor("caqh_id")} hint="Digits only — the provider's CAQH ProView number.">
          <input id="caqh_id" name="caqh_id" inputMode="numeric" maxLength={10} value={values.caqh_id} onChange={bind("caqh_id", onlyDigits(10))} className={`${inputClass} font-mono`} autoComplete="off" />
        </Field>
        <Field label="Start date" htmlFor="start_date" hint="When the provider joined the practice." error={errorFor("start_date")}>
          <input id="start_date" name="start_date" type="date" value={values.start_date} onChange={bind("start_date")} className={inputClass} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Specialty</legend>
        {fromRegistry ? (
          <Field label="Specialty (taxonomy)" htmlFor="taxonomy_code" error={errorFor("taxonomy_code")} hint="The taxonomies this provider registered in the NPI Registry. Payers compare against these." className="sm:col-span-2">
            <select id="taxonomy_code" name="taxonomy_code" value={values.taxonomy_code} onChange={(e) => chooseTaxonomy(e.target.value)} className={inputClass}>
              <option value="">Choose a specialty</option>
              {taxonomies.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.desc} — {t.code}
                  {t.primary ? " (primary)" : ""}
                </option>
              ))}
            </select>
            <input type="hidden" name="specialty" value={values.specialty} />
          </Field>
        ) : (
          <>
            <Field label="Taxonomy code" htmlFor="taxonomy_code" hint="Check the NPI to choose it from the registry — or type it, e.g. 207Q00000X." error={errorFor("taxonomy_code")}>
              <input id="taxonomy_code" name="taxonomy_code" maxLength={10} value={values.taxonomy_code} onChange={bind("taxonomy_code", (v) => v.toUpperCase().replace(/[^0-9A-Z]/g, ""))} className={`${inputClass} font-mono`} autoComplete="off" />
            </Field>
            <Field label="Specialty" htmlFor="specialty" error={errorFor("specialty")}>
              <input id="specialty" name="specialty" value={values.specialty} onChange={bind("specialty")} className={inputClass} placeholder="e.g. Family Medicine" />
            </Field>
          </>
        )}
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Contact</legend>
        <Field label="Email" htmlFor="email" error={errorFor("email")}>
          <input id="email" name="email" type="email" value={values.email} onChange={bind("email", (v) => v.trim())} className={inputClass} autoComplete="off" />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errorFor("phone")}>
          <input id="phone" name="phone" type="tel" inputMode="tel" value={values.phone} onChange={bind("phone", formatPhone)} className={inputClass} placeholder="(555) 201-4433" />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">{editing ? "Status and notes" : "Notes"}</legend>
        {editing && (
          <Field label="Status" htmlFor="status" error={errorFor("status")} hint="Inactive providers keep their history, get no alerts and don't take a seat on your plan.">
            <select id="status" name="status" value={values.status} onChange={bind("status")} className={inputClass}>
              <option value="active">Active</option>
              <option value="inactive">Inactive — no longer with the practice</option>
            </select>
          </Field>
        )}
        <Field label="Notes" htmlFor="notes" className="sm:col-span-2">
          <textarea id="notes" name="notes" rows={3} value={values.notes} onChange={bind("notes")} className={inputClass} />
        </Field>
      </fieldset>

      </fieldset>
      {!readOnly && (
      <div className="flex flex-wrap gap-3 border-t border-ink-100 pt-6">
        <SubmitButton pending={pending} className={buttonClass("primary")}>
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
