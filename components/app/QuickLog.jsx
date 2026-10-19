"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { CHANNEL_LABELS } from "@/lib/enrollments";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

// "Log call" right on a follow-up row (pedido 2026-10-19, función 3): what
// happened and when to chase next, without opening the side panel. The same
// action as the panel's "Log a follow-up", which still has every field.
export default function QuickLog({ action, today, proposed, label }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, null);
  const box = useRef(null);

  useEffect(() => {
    if (open) box.current?.focus();
  }, [open]);
  useEffect(() => {
    if (state?.saved) setOpen(false);
  }, [state?.saved]);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={`${buttonClass("secondary", "sm")} shrink-0`} aria-label={`Log a call: ${label}`}>
        Log call
      </button>
    );
  }

  const err = state?.error ?? Object.values(state?.fieldErrors ?? {})[0];
  return (
    <form action={formAction} className="flex w-full flex-col gap-2 rounded-xl bg-ink-50 p-3 ring-1 ring-inset ring-ink-100">
      <input type="hidden" name="contact_date" value={today} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <input ref={box} name="outcome" required maxLength={500} placeholder="What happened? e.g. Still in review, committee next week" className={`${inputClass} flex-1`} disabled={pending} />
        <select name="channel" defaultValue="phone" className={`${inputClass.replace("w-full ", "")} sm:w-32`} disabled={pending} aria-label="How">
          {Object.entries(CHANNEL_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-xs text-ink-700" htmlFor={`ql-next-${label}`}>
          Next follow-up
        </label>
        <input id={`ql-next-${label}`} type="date" name="next_follow_up_date" defaultValue={proposed} min={today} className={`${inputClass.replace("w-full ", "")} w-auto py-1.5`} disabled={pending} />
        <SubmitButton pending={pending} className={buttonClass("primary", "sm")} pendingLabel="Saving…">
          Save
        </SubmitButton>
        <button type="button" onClick={() => setOpen(false)} className={buttonClass("ghost", "sm")} disabled={pending}>
          Cancel
        </button>
        {err && <span className="text-xs text-status-expired">{err}</span>}
      </div>
    </form>
  );
}
