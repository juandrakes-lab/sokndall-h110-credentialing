"use client";

import { useState, useTransition } from "react";
import { lookupNpi } from "@/lib/nppes-actions";
import { isValidNpi } from "@/lib/nppes";
import { buttonClass } from "@/components/app/ui";

function same(a, b) {
  return (a ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "") === (b ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

// "Check NPI Registry" button + the comparison it opens. The registry only
// proposes: nothing changes in the form until the user presses "Use these".
//
//   npi       the NPI currently typed in the form
//   compare   (record) => [{ label, registry, yours, match?, info? }] rows to show
//   onApply   (record) => void, fills the form from the record
//   expect    "individual" | "organization" — warns when the NPI is the other kind
export default function NpiCheck({ npi, compare, onApply, expect, onRecord }) {
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();
  // Only a well-formed NPI (10 digits, valid check digit) can be looked up.
  const ready = isValidNpi(npi ?? "");

  function check() {
    startTransition(async () => {
      const r = await lookupNpi(npi);
      setResult(r);
      if (r?.ok) onRecord?.(r.record);
    });
  }

  const record = result?.ok ? result.record : null;
  const wrongKind = record && expect && record.kind !== expect;
  const rows = record && !wrongKind ? compare(record) : [];
  const matches = (r) => r.match ?? (!r.registry || same(r.registry, r.yours));
  // "info" rows (e.g. an address the form can't change) show a mismatch but
  // don't hold back "Everything matches".
  const allMatch = rows.length > 0 && rows.filter((r) => !r.info).every(matches);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <button
          type="button"
          onClick={check}
          disabled={!ready || pending}
          className={buttonClass("secondary", "sm")}
        >
          {pending ? "Checking…" : "Check NPI Registry"}
        </button>
      </div>

      {result && !result.ok && (
        <p className="rounded-lg bg-status-expired-bg px-3 py-2 text-sm text-status-expired">{result.message}</p>
      )}

      {wrongKind && (
        <p className="rounded-lg bg-status-expired-bg px-3 py-2 text-sm text-status-expired">
          {expect === "individual"
            ? `This NPI belongs to an organization (${record.organizationName}). Enter the provider's own individual NPI.`
            : `This NPI belongs to an individual (${record.firstName} ${record.lastName}). Enter the practice's organization NPI.`}
        </p>
      )}

      {record && !wrongKind && (
        <div className="overflow-hidden rounded-lg border border-brand-100 bg-brand-50/60">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-100 px-4 py-2.5">
            <p className="text-sm font-medium text-brand-700">
              NPI Registry record{!record.active && " — deactivated"}
            </p>
            {allMatch ? (
              <span className="text-xs font-medium text-status-active">Everything matches</span>
            ) : (
              <button type="button" onClick={() => onApply(record)} className={buttonClass("primary", "sm")}>
                Use these values
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-ink-500">
                <tr>
                  <th className="px-4 py-2 font-medium" />
                  <th className="px-4 py-2 font-medium">NPI Registry</th>
                  <th className="px-4 py-2 font-medium">You entered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {rows.map((row) => {
                  const match = matches(row);
                  // Empty = not typed yet, not a conflict; an "info" row
                  // differing is a warning, not an error.
                  const tone = !row.yours || match
                    ? "text-ink-700"
                    : row.info
                      ? "font-medium text-status-expiring"
                      : "font-medium text-status-expired";
                  return (
                    <tr key={row.label}>
                      <td className="whitespace-nowrap px-4 py-2 text-ink-500">{row.label}</td>
                      <td className="px-4 py-2 text-ink-900">{row.registry || "—"}</td>
                      <td className={`px-4 py-2 ${tone}`}>
                        {row.yours || <span className="text-ink-500">Not entered</span>}
                        {row.yours && !match && " ≠"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
