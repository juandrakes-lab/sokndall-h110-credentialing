"use client";

import { useRef, useTransition } from "react";
import { STALL_CHOICES } from "@/lib/enrollments";

// Per payer: after how many days with the payer an application shows as
// Stalled. Saves on change, and says so while it does.
export default function StallSelect({ action, value }) {
  const form = useRef(null);
  const [pending, start] = useTransition();
  return (
    <form ref={form} action={action} className="flex items-center gap-2 text-xs text-ink-500">
      <label>
        Stalled after{" "}
        <select
          name="days"
          defaultValue={value}
          disabled={pending}
          onChange={() => start(() => form.current.requestSubmit())}
          className="rounded-md border border-ink-200 bg-white px-1.5 py-1 text-xs text-ink-900"
        >
          {STALL_CHOICES.map((d) => (
            <option key={d} value={d}>
              {d} days
            </option>
          ))}
        </select>
      </label>
      {pending && <span aria-live="polite">Saving…</span>}
    </form>
  );
}
