"use client";

import { useState } from "react";
import { FormError, FormNotice, buttonClass } from "@/components/app/ui";
import useSmartForm from "@/components/app/useSmartForm";
import SubmitButton from "@/components/app/SubmitButton";

// The alert ladder of alcance §3.11 (90/60/30/14/7) plus the usual in-betweens.
const CHOICES = [120, 90, 60, 45, 30, 21, 14, 7, 3, 1];
const MAX = 8;

const tone = (d) => (d <= 14 ? "bg-status-expired" : d <= 30 ? "bg-status-expiring" : "bg-status-neutral");

// Days before a deadline when an alert goes out — chosen, not typed.
export default function AlertDaysForm({ action, initial, canEdit }) {
  const current = String(initial).split(/[\s,]+/).map(Number).filter(Boolean);
  // A day set before this list existed stays offered, so nothing is lost.
  const [options] = useState(() => [...new Set([...CHOICES, ...current])].sort((a, b) => b - a));
  const form = useSmartForm(action, {
    initial: { alert_days: current },
    validate: (v) =>
      v.alert_days.length === 0
        ? { alert_days: "Choose at least one day." }
        : v.alert_days.length > MAX
          ? { alert_days: `Up to ${MAX} alert days.` }
          : {},
  });
  const { values, setValue, errorFor, state, pending } = form;
  const chosen = new Set(values.alert_days);

  function toggle(day) {
    const next = new Set(chosen);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    setValue("alert_days", [...next].sort((a, b) => b - a));
  }

  return (
    <form onSubmit={form.onSubmit} noValidate className="flex flex-col gap-4">
      <FormError message={state?.error} />
      <FormNotice message={state?.notice} />
      <fieldset disabled={!canEdit} className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium text-ink-700">Email me this many days before a deadline</legend>
        <div className="flex flex-wrap gap-2">
          {options.map((d) => (
            <label
              key={d}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                chosen.has(d) ? "border-brand-600 bg-brand-50 text-brand-700" : "border-ink-200 bg-white text-ink-700 hover:border-ink-500"
              }`}
            >
              <input type="checkbox" name="alert_days" value={d} checked={chosen.has(d)} onChange={() => toggle(d)} className="sr-only" />
              <span className={`h-2 w-2 rounded-full ${tone(d)}`} aria-hidden="true" />
              {d} {d === 1 ? "day" : "days"}
            </label>
          ))}
        </div>
        {errorFor("alert_days") ? (
          <p role="alert" className="text-xs text-status-expired">{errorFor("alert_days")}</p>
        ) : (
          <p className="text-xs text-ink-500">One more email always goes out when something has expired. Up to {MAX} days.</p>
        )}
      </fieldset>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-ink-500">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-neutral" /> More than 30 days: heads-up</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-expiring" /> 30 days or less: act soon</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-status-expired" /> 14 days or less, or expired: act now</span>
      </div>
      {canEdit && (
        <div>
          <SubmitButton pending={pending} className={buttonClass("secondary")}>
            {pending ? "Saving…" : "Save alert days"}
          </SubmitButton>
        </div>
      )}
    </form>
  );
}
