"use client";

import { useFormStatus } from "react-dom";

// Every submit button in the app: while its form's action runs (a save, a
// redirect to Polar, a delete) it is disabled and shows a spinner, so a click
// never looks like it did nothing. `pending` lets forms that track their own
// state (useActionState, uploads) force the busy look.
export default function SubmitButton({ children, className, disabled, pending: forced, pendingLabel, ...rest }) {
  const { pending: submitting } = useFormStatus();
  const busy = submitting || forced;
  return (
    <button
      type="submit"
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={`${className ?? ""} inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60`}
      {...rest}
    >
      {busy && (
        <span
          className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      )}
      {busy && pendingLabel ? pendingLabel : children}
    </button>
  );
}
