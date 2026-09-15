"use client";

import { useState } from "react";
import NpiCheck from "@/components/app/NpiCheck";
import { Field, FormError, FormNotice, buttonClass, inputClass } from "@/components/app/ui";
import { formatAddress, sameAddress } from "@/lib/consistency";
import { US_STATES } from "@/lib/us-states";
import { digits, formatTin, formatZip } from "@/lib/validation";
import { practiceErrors } from "@/lib/practice-rules";
import useSmartForm from "@/components/app/useSmartForm";
import SubmitButton from "@/components/app/SubmitButton";

const ADDRESS_FIELDS = ["address_line1", "address_line2", "city", "state", "zip"];

function initialValues(p) {
  const v = { legal_name: p?.legal_name ?? "", group_npi: p?.group_npi ?? "", tin: formatTin(p?.tin ?? "") };
  for (const kind of ["service", "billing"]) {
    for (const f of ADDRESS_FIELDS) v[`${kind}_${f}`] = p?.[`${kind}_${f}`] ?? "";
    v[`${kind}_zip`] = formatZip(v[`${kind}_zip`]);
  }
  return v;
}

function addressOf(values, kind) {
  return {
    line1: values[`${kind}_address_line1`],
    line2: values[`${kind}_address_line2`],
    city: values[`${kind}_city`],
    state: values[`${kind}_state`],
    zip: values[`${kind}_zip`],
  };
}

function AddressFields({ kind, values, bind, errorFor }) {
  const id = (f) => `${kind}_${f}`;
  return (
    <div className="grid gap-5 sm:grid-cols-6">
      <Field label="Street address" htmlFor={id("address_line1")} error={errorFor(id("address_line1"))} className="sm:col-span-4">
        <input id={id("address_line1")} name={id("address_line1")} value={values[id("address_line1")]} onChange={bind(id("address_line1"))} className={inputClass} autoComplete="off" />
      </Field>
      <Field label="Suite / unit" htmlFor={id("address_line2")} className="sm:col-span-2">
        <input id={id("address_line2")} name={id("address_line2")} value={values[id("address_line2")]} onChange={bind(id("address_line2"))} className={inputClass} autoComplete="off" />
      </Field>
      <Field label="City" htmlFor={id("city")} error={errorFor(id("city"))} className="sm:col-span-3">
        <input id={id("city")} name={id("city")} value={values[id("city")]} onChange={bind(id("city"))} className={inputClass} autoComplete="off" />
      </Field>
      <Field label="State" htmlFor={id("state")} error={errorFor(id("state"))} className="sm:col-span-1">
        <select id={id("state")} name={id("state")} value={values[id("state")]} onChange={bind(id("state"))} className={inputClass}>
          <option value="">—</option>
          {US_STATES.map(([code]) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </Field>
      <Field label="ZIP" htmlFor={id("zip")} error={errorFor(id("zip"))} className="sm:col-span-2">
        <input id={id("zip")} name={id("zip")} inputMode="numeric" maxLength={10} value={values[id("zip")]} onChange={bind(id("zip"), formatZip)} className={`${inputClass} font-mono`} autoComplete="off" placeholder="10001" />
      </Field>
    </div>
  );
}

// The practice record (alcance §3.1): legal name, group NPI, TIN, service and
// pay-to addresses. Used by onboarding and by Settings.
export default function PracticeForm({ action, practice, submitLabel }) {
  const [billingSame, setBillingSame] = useState(
    () => !practice?.billing_address_line1 || sameAddress(addressOf(initialValues(practice), "service"), addressOf(initialValues(practice), "billing"))
  );
  const form = useSmartForm(action, {
    initial: initialValues(practice),
    validate: (v) => practiceErrors({ ...v, billing_same: billingSame }),
  });
  const { values, setValues, bind, errorFor, state, pending } = form;

  function applyRegistry(record) {
    setValues((v) => ({
      ...v,
      legal_name: record.organizationName ?? v.legal_name,
      ...(record.location
        ? {
            service_address_line1: record.location.line1,
            service_address_line2: record.location.line2,
            service_city: record.location.city,
            service_state: record.location.state,
            service_zip: record.location.zip,
          }
        : {}),
    }));
  }

  return (
    <form onSubmit={form.onSubmit} onBlur={form.onBlur} noValidate className="flex flex-col gap-8">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Practice</legend>
        <Field label="Group NPI (Type 2)" htmlFor="group_npi" error={errorFor("group_npi")} hint="Leave empty if the practice has no organization NPI. Checking it fills in the legal name and address." className="sm:col-span-2">
          <div className="flex flex-col gap-3">
            <input id="group_npi" name="group_npi" inputMode="numeric" maxLength={10} value={values.group_npi} onChange={bind("group_npi", (v) => digits(v).slice(0, 10))} className={`${inputClass} font-mono sm:max-w-xs`} autoComplete="off" />
            <NpiCheck
              npi={values.group_npi}
              expect="organization"
              onApply={applyRegistry}
              compare={(r) => [
                { label: "Legal name", registry: r.organizationName, yours: values.legal_name },
                {
                  label: "Service address",
                  registry: formatAddress(r.location),
                  yours: formatAddress(addressOf(values, "service")),
                  match: !r.location || sameAddress(addressOf(values, "service"), r.location),
                },
              ]}
            />
          </div>
        </Field>
        <Field label="Legal name" htmlFor="legal_name" required error={errorFor("legal_name")} hint="Exactly as registered with the IRS and the NPI Registry.">
          <input id="legal_name" name="legal_name" value={values.legal_name} onChange={bind("legal_name")} className={inputClass} autoComplete="organization" />
        </Field>
        <Field label="TIN" htmlFor="tin" error={errorFor("tin")} hint="The practice's federal tax ID (EIN), 9 digits.">
          <input id="tin" name="tin" inputMode="numeric" maxLength={10} value={values.tin} onChange={bind("tin", formatTin)} className={`${inputClass} font-mono`} autoComplete="off" placeholder="12-3456789" />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Service address</legend>
        <AddressFields kind="service" values={values} bind={bind} errorFor={errorFor} />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 text-sm font-semibold text-ink-900">Pay-to address</legend>
        <label className="flex items-center gap-2 text-sm text-ink-700">
          <input
            type="checkbox"
            name="billing_same"
            checked={billingSame}
            onChange={(e) => setBillingSame(e.target.checked)}
            className="h-4 w-4 rounded border-ink-200 accent-brand-700"
          />
          Same as the service address
        </label>
        {!billingSame && <AddressFields kind="billing" values={values} bind={bind} errorFor={errorFor} />}
      </fieldset>

      <div className="border-t border-ink-100 pt-6">
        <SubmitButton pending={pending} className={buttonClass("primary")}>
          {pending ? "Saving…" : submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
