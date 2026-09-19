"use client";

import { useEffect, useState } from "react";
import { CREDENTIAL_FIELDS, CREDENTIAL_TYPES, CREDENTIAL_TYPE_KEYS } from "@/lib/credentials";
import { US_STATES } from "@/lib/us-states";
import { CERTIFYING_BOARDS, COVERAGE_LIMITS, credentialErrors, joinCoverage, splitCoverage } from "@/lib/credential-rules";
import { Field, FormError, buttonClass, inputClass } from "@/components/app/ui";
import useSmartForm from "@/components/app/useSmartForm";
import SubmitButton from "@/components/app/SubmitButton";

const OTHER_BOARD = "__other";

function blank(initial) {
  return Object.fromEntries([...CREDENTIAL_FIELDS, "notes", "assigned_user_id"].map((f) => [f, initial?.[f] ?? ""]));
}

// Add or edit one credential. The fields shown follow the chosen type — a DEA
// registration has no carrier, a malpractice policy has no state — and each
// one follows lib/credential-rules.js as it's typed.
//
//   caqhIntervalDays  shown next to the CAQH date so the computed due date is
//                     never a surprise
//   lastName          the provider's, for the DEA number check
//   registryLicenses  [{ state, license, desc }] the provider declared in the
//                     NPI Registry — proposed, and compared with what's typed
//   onDone            called after a successful save (the edit panel closes)
export default function CredentialForm({ action, initial, caqhIntervalDays, submitLabel, onDone, members = [], lastName, registryLicenses = [] }) {
  const editing = Boolean(initial?.type);
  const [type, setType] = useState(initial?.type ?? "state_license");
  const form = useSmartForm(action, {
    initial: blank(initial),
    validate: (v) => credentialErrors(type, v, { lastName }),
  });
  const { values, setValue, bind, errorFor, state, pending } = form;
  const config = CREDENTIAL_TYPES[type];
  const idFor = (field) => `${field}-${initial?.id ?? "new"}`;

  const coverage = splitCoverage(values.coverage);
  const boardIsListed = !values.issuer || CERTIFYING_BOARDS.includes(values.issuer);
  const [otherBoard, setOtherBoard] = useState(!boardIsListed);

  const declared = type === "state_license" && values.state ? registryLicenses.find((l) => l.state === values.state && l.license) : null;
  const clean = (s) => String(s ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const differs = declared && values.number && clean(values.number) !== clean(declared.license);

  useEffect(() => {
    if (!state?.saved) return;
    if (onDone) onDone();
    else form.reset(blank(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once per save
  }, [state?.saved]);

  const input = (field) => {
    const common = { id: idFor(field), name: field, value: values[field], onChange: bind(field), className: inputClass };
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
    if (field === "number" && type === "dea") {
      return (
        <input
          {...common}
          onChange={bind("number", (v) => v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 9))}
          maxLength={9}
          placeholder="AB1234563"
          className={`${inputClass} font-mono`}
          autoComplete="off"
        />
      );
    }
    if (field === "coverage") {
      return (
        <div className="flex items-center gap-2">
          <select aria-label="Per claim" value={coverage.perClaim} onChange={(e) => setValue("coverage", joinCoverage(e.target.value, coverage.aggregate) || `${e.target.value} /`)} className={inputClass}>
            <option value="">Per claim</option>
            {COVERAGE_LIMITS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <span className="text-ink-500">/</span>
          <select aria-label="Aggregate" value={coverage.aggregate} onChange={(e) => setValue("coverage", joinCoverage(coverage.perClaim, e.target.value) || `/ ${e.target.value}`)} className={inputClass}>
            <option value="">Aggregate</option>
            {COVERAGE_LIMITS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <input type="hidden" name="coverage" value={joinCoverage(coverage.perClaim, coverage.aggregate)} />
        </div>
      );
    }
    if (field === "issuer" && type === "board_cert") {
      return (
        <div className="flex flex-col gap-2">
          <select
            id={idFor("issuer")}
            value={otherBoard ? OTHER_BOARD : values.issuer}
            onChange={(e) => {
              const other = e.target.value === OTHER_BOARD;
              setOtherBoard(other);
              setValue("issuer", other ? "" : e.target.value);
            }}
            className={inputClass}
          >
            <option value="">Choose the board</option>
            {CERTIFYING_BOARDS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
            <option value={OTHER_BOARD}>Another board…</option>
          </select>
          {otherBoard ? (
            <input name="issuer" value={values.issuer} onChange={bind("issuer")} placeholder="Name of the certifying board" className={inputClass} />
          ) : (
            <input type="hidden" name="issuer" value={values.issuer} />
          )}
        </div>
      );
    }
    return <input {...common} placeholder={config.placeholders?.[field]} maxLength={field === "custom_name" ? 80 : undefined} autoComplete="off" />;
  };

  return (
    <form onSubmit={form.onSubmit} onBlur={form.onBlur} noValidate className="flex flex-col gap-5">
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
            label={field === "coverage" ? "Coverage (per claim / aggregate)" : config.labels[field]}
            htmlFor={idFor(field)}
            required={config.required?.includes(field)}
            error={errorFor(field)}
            hint={
              type === "caqh_attestation" && field === "issue_date"
                ? `The next attestation is due ${caqhIntervalDays} days after this date — calculated for you.`
                : type === "dea" && field === "number"
                  ? "2 letters + 7 digits. The second letter is the provider's last-name initial."
                  : undefined
            }
            className={type === "caqh_attestation" || field === "coverage" || (field === "issuer" && type === "board_cert") ? "sm:col-span-2" : ""}
          >
            {input(field)}
          </Field>
        ))}
      </div>

      {declared && (
        <div className={`rounded-lg px-4 py-3 text-sm ${differs ? "bg-status-expiring-bg text-ink-900" : "bg-brand-50/60 text-ink-700"}`}>
          {differs ? (
            <>
              <strong>Doesn&apos;t match the NPI Registry.</strong> The provider declared license {declared.license} in {values.state}.{" "}
              <button type="button" onClick={() => setValue("number", declared.license)} className="font-medium text-brand-600 hover:underline">
                Use {declared.license}
              </button>
            </>
          ) : values.number ? (
            <>Matches the license the provider declared in the NPI Registry.</>
          ) : (
            <>
              The NPI Registry lists license {declared.license} in {values.state}.{" "}
              <button type="button" onClick={() => setValue("number", declared.license)} className="font-medium text-brand-600 hover:underline">
                Use it
              </button>
            </>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Notes" htmlFor={idFor("notes")} className={members.length > 1 ? "" : "sm:col-span-2"}>
          <input id={idFor("notes")} name="notes" value={values.notes} onChange={bind("notes")} className={inputClass} />
        </Field>
        {/* Only worth asking once there's more than one person on the account. */}
        {members.length > 1 && (
          <Field label="Responsible" htmlFor={idFor("assigned_user_id")} hint="Gets the renewal alerts. The account owner is always copied.">
            <select id={idFor("assigned_user_id")} name="assigned_user_id" value={values.assigned_user_id} onChange={bind("assigned_user_id")} className={inputClass}>
              <option value="">Account owner</option>
              {members.filter((m) => m.role !== "owner").map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <div>
        <SubmitButton pending={pending} className={buttonClass("primary")}>
          {pending ? "Saving…" : submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
