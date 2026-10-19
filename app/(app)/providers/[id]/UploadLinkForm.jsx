"use client";

import { useActionState, useState } from "react";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

// Creates an upload link and shows it once (only its hash is kept).
export function UploadLinkForm({ action, firstName }) {
  const [state, formAction, pending] = useActionState(action, null);
  const [copied, setCopied] = useState(false);
  if (state?.url) {
    return (
      <div className="flex flex-col gap-2 rounded-xl bg-brand-50 p-3 ring-1 ring-inset ring-brand-100">
        <p className="text-xs font-semibold text-brand-700">
          Send this to {firstName}. It works for {state.days} days and only lets them upload. Copy it now: it won&apos;t be shown again.
        </p>
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
      <label htmlFor="ul-days" className="text-xs text-ink-700">
        Link lasts
      </label>
      <select id="ul-days" name="days" defaultValue={7} disabled={pending} className={`${inputClass.replace("w-full ", "")} w-auto py-1.5 text-sm`}>
        {[3, 7, 14].map((d) => (
          <option key={d} value={d}>
            {d} days
          </option>
        ))}
      </select>
      <SubmitButton pending={pending} className={buttonClass("secondary", "sm")} pendingLabel="Creating…">
        Create upload link
      </SubmitButton>
      {state?.error && <p className="w-full text-xs text-status-expired">{state.error}</p>}
    </form>
  );
}

// Opens a pending upload for the reviewer through a one-minute signed link.
export function PreviewButton({ action }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className={buttonClass("ghost", "sm")}
      onClick={async () => {
        setBusy(true);
        const r = await action();
        setBusy(false);
        if (r?.url) window.open(r.url, "_blank", "noopener");
      }}
    >
      {busy ? "Opening…" : "Download to check"}
    </button>
  );
}
