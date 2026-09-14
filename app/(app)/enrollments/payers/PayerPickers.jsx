"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Field, FormError, buttonClass, inputClass } from "@/components/app/ui";
import { PAYER_TYPE_LABELS } from "@/lib/enrollments";
import SubmitButton from "@/components/app/SubmitButton";

const TYPE_ORDER = ["commercial", "medicare", "medicaid", "other"];

// Search the curated catalog and add several payers at once.
export function CatalogPicker({ action, catalog }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const [picked, setPicked] = useState(new Set());

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter(
      (p) =>
        (!type || p.payer_type === type) &&
        (!q || p.name.toLowerCase().includes(q) || (p.state ?? "").toLowerCase() === q)
    );
  }, [catalog, query, type]);

  function toggle(id) {
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <form action={action} onSubmit={() => setTimeout(() => setPicked(new Set()), 0)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="catalog-search">Search payers</label>
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or state (e.g. Aetna, TX)"
          className={inputClass}
        />
        <label className="sr-only" htmlFor="catalog-type">Type</label>
        <select id="catalog-type" value={type} onChange={(e) => setType(e.target.value)} className={`${inputClass} sm:w-48`}>
          <option value="">All types</option>
          {TYPE_ORDER.map((t) => (
            <option key={t} value={t}>
              {PAYER_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="max-h-80 overflow-y-auto rounded-lg border border-ink-200">
        {visible.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-ink-500">
            No payer in our list matches. Add it as your own payer below.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {visible.map((p) => (
              <li key={p.id}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-ink-50">
                  <input
                    type="checkbox"
                    value={p.id}
                    checked={picked.has(p.id)}
                    onChange={() => toggle(p.id)}
                    className="h-4 w-4 accent-brand-700"
                  />
                  <span className="flex-1 text-sm text-ink-900">{p.name}</span>
                  <span className="text-xs text-ink-500">
                    {PAYER_TYPE_LABELS[p.payer_type]}
                    {p.state && ` · ${p.state}`}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* The selection survives searching: what's submitted is the picked set,
          not just the checkboxes currently on screen. */}
      {[...picked].map((id) => (
        <input key={id} type="hidden" name="payer_global_id" value={id} />
      ))}
      {picked.size > 0 && (
        <p className="text-sm text-ink-700">
          Selected: {catalog.filter((p) => picked.has(p.id)).map((p) => p.name).join(", ")}
        </p>
      )}

      <div>
        <SubmitButton disabled={picked.size === 0} className={buttonClass("primary")}>
          {picked.size ? `Add ${picked.size} payer${picked.size > 1 ? "s" : ""}` : "Select payers to add"}
        </SubmitButton>
      </div>
    </form>
  );
}

export function OwnPayerForm({ action }) {
  const blank = { name: "", payer_type: "commercial", revalidation_months: "36" };
  const [state, formAction, pending] = useActionState(action, {});
  const [values, setValues] = useState(blank);
  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));
  const errors = state?.fieldErrors ?? {};

  useEffect(() => {
    if (state?.saved) setValues(blank);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only after a save
  }, [state?.saved]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormError message={state?.error} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Payer name" htmlFor="own-name" error={errors.name} className="sm:col-span-3">
          <input id="own-name" name="name" value={values.name} onChange={set("name")} className={inputClass} placeholder="e.g. Community Health Plan of Washington" />
        </Field>
        <Field label="Type" htmlFor="own-type" error={errors.payer_type}>
          <select id="own-type" name="payer_type" value={values.payer_type} onChange={set("payer_type")} className={inputClass}>
            {TYPE_ORDER.map((t) => (
              <option key={t} value={t}>
                {PAYER_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Revalidate every" htmlFor="own-months" error={errors.revalidation_months} hint="Months. Usually 36 for commercial plans.">
          <input id="own-months" name="revalidation_months" type="number" min={1} max={120} value={values.revalidation_months} onChange={set("revalidation_months")} className={inputClass} />
        </Field>
      </div>
      <div>
        <SubmitButton disabled={pending} className={buttonClass("secondary")}>
          {pending ? "Adding…" : "Add payer"}
        </SubmitButton>
      </div>
    </form>
  );
}
