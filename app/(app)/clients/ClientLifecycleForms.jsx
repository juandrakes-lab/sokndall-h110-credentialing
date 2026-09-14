"use client";

import { useActionState, useState } from "react";
import { FormError, buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import ExportClientButton from "@/components/app/ExportClientButton";

export function RestoreClientForm({ action, clientId }) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <input type="hidden" name="client" value={clientId} />
      <SubmitButton className={buttonClass("secondary", "sm")}>Restore</SubmitButton>
      {state?.error && <p className="max-w-xs text-xs text-status-expired">{state.error}</p>}
      {state?.notice && <p className="text-xs text-status-active">{state.notice}</p>}
    </form>
  );
}

// Delete for good: export first (or say you don't need it), then type the
// client's exact name. The server checks all of it again.
export function DeleteClientForm({ action, clientId, clientName }) {
  const [state, formAction] = useActionState(action, {});
  const [exported, setExported] = useState(false);
  const [skipExport, setSkipExport] = useState(false);
  const [typed, setTyped] = useState("");
  const ready = (exported || skipExport) && typed === clientName;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-status-expired/30 bg-white p-4 text-sm">
      <div>
        <p className="font-medium text-ink-900">1. Keep a copy</p>
        <p className="mt-0.5 text-ink-500">
          Every provider, credential, enrollment, history entry, call log and document of {clientName}, as CSV files and the
          original documents in one ZIP.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <ExportClientButton clientId={clientId} onDone={() => setExported(true)} />
          {exported ? (
            <span className="text-xs text-status-active">Downloaded.</span>
          ) : (
            <label className="flex items-center gap-2 text-xs text-ink-500">
              <input type="checkbox" checked={skipExport} onChange={(e) => setSkipExport(e.target.checked)} />
              I don&apos;t need a copy
            </label>
          )}
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-2">
        <input type="hidden" name="client" value={clientId} />
        <label htmlFor={`confirm-${clientId}`} className="font-medium text-ink-900">
          2. Type <span className="font-mono">{clientName}</span> to confirm
        </label>
        <input
          id={`confirm-${clientId}`}
          name="confirm"
          autoComplete="off"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className={`${inputClass} sm:max-w-sm`}
        />
        <p className="text-xs text-ink-500">
          Deletes the client and everything in it, files included. It can&apos;t be undone; only its name, the date and who
          deleted it are kept.
        </p>
        <FormError message={state?.error} />
        <div>
          <SubmitButton disabled={!ready} className={buttonClass("danger", "sm")}>
            Delete {clientName} for good
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
