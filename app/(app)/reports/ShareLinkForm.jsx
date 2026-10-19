"use client";

import { useActionState, useState } from "react";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { SHARE_DAYS, SHARE_DEFAULT_DAYS } from "@/lib/reports";

// Creates (or replaces) a report's read-only link and shows it once: only a
// hash of it is kept, so it can't be shown again later — make a new one.
export default function ShareLinkForm({ action, replacing }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [copied, setCopied] = useState(false);

  if (state?.url) {
    return (
      <div className="flex flex-col gap-2 rounded-xl bg-brand-50 p-3 ring-1 ring-inset ring-brand-100">
        <p className="text-xs font-semibold text-brand-700">Read-only link, valid {state.days} days. Copy it now: it won&apos;t be shown again.</p>
        <div className="flex flex-wrap gap-2">
          <input readOnly value={state.url} onFocus={(e) => e.target.select()} className={`${inputClass} min-w-0 flex-1 font-mono text-xs`} />
          <button
            type="button"
            className={buttonClass("primary", "sm")}
            onClick={async () => {
              await navigator.clipboard.writeText(state.url);
              setCopied(true);
            }}
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <label htmlFor="share-days" className="text-xs text-ink-700">
        Link lasts
      </label>
      <select id="share-days" name="days" defaultValue={SHARE_DEFAULT_DAYS} className={`${inputClass.replace("w-full ", "")} w-auto py-1.5 text-sm`} disabled={pending}>
        {SHARE_DAYS.map((d) => (
          <option key={d} value={d}>
            {d} days
          </option>
        ))}
      </select>
      <SubmitButton pending={pending} className={buttonClass("secondary", "sm")} pendingLabel="Creating…">
        {replacing ? "Replace link" : "Create read-only link"}
      </SubmitButton>
      {state?.error && <p className="w-full text-xs text-status-expired">{state.error}</p>}
    </form>
  );
}
