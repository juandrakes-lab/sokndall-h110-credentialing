"use client";

import { useFormStatus } from "react-dom";

// One of the status buttons in the enrollment panel. They share a form, so
// only the one that was clicked shows the spinner; all wait while it saves.
export default function StatusChip({ value, active, className, children }) {
  const { pending, data } = useFormStatus();
  const mine = pending && data?.get("status") === value;
  return (
    <button
      type="submit"
      name="status"
      value={value}
      aria-pressed={active}
      aria-busy={mine || undefined}
      disabled={pending}
      className={`${className} inline-flex items-center gap-2 disabled:cursor-wait`}
    >
      {mine && (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
