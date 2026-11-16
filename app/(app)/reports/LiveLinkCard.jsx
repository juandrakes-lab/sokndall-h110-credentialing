"use client";

import { useActionState, useState } from "react";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

// The client's live link (pedido 2026-11-16, punto 2). The address is shown
// once, right after it is made: only a hash is kept. Losing it means making a
// new one, which turns the old one off.
export default function LiveLinkCard({ clientName, link, createAction, revokeAction }) {
  const [state, formAction, pending] = useActionState(createAction, null);
  const [copied, setCopied] = useState(false);
  const fresh = state?.url;

  return (
    <div className="flex flex-col gap-3 px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink-900">Live status link for {clientName}</p>
          <p className="text-sm text-ink-500">
            Your client opens it anytime and sees the current status — no sign-in, no expiry, read-only, only this client. Turn it off whenever you want.
          </p>
          {link && !fresh && (
            <p className="mt-1 text-xs text-ink-500">
              On since {link.since}
              {link.lastViewed ? ` · last opened ${link.lastViewed}` : " · not opened yet"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <form action={formAction}>
            <SubmitButton pending={pending} pendingLabel="Creating…" className={buttonClass(link || fresh ? "secondary" : "primary", "sm")}>
              {link || fresh ? "Replace link" : "Create live link"}
            </SubmitButton>
          </form>
          {(link || fresh) && (
            <form action={revokeAction}>
              <SubmitButton pendingLabel="Turning off…" className={buttonClass("ghost", "sm")}>
                Turn off
              </SubmitButton>
            </form>
          )}
        </div>
      </div>
      {fresh && (
        <div className="flex flex-col gap-2 rounded-xl bg-brand-50 p-3 ring-1 ring-inset ring-brand-100">
          <p className="text-xs font-semibold text-brand-700">Copy it now and send it to your client: it won&apos;t be shown again. A new link turns this one off.</p>
          <div className="flex flex-wrap gap-2">
            <input readOnly value={fresh} onFocus={(e) => e.target.select()} className={`${inputClass} min-w-0 flex-1 font-mono text-xs`} />
            <button
              type="button"
              className={buttonClass("primary", "sm")}
              onClick={async () => {
                await navigator.clipboard.writeText(fresh);
                setCopied(true);
              }}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      )}
      {state?.error && <p className="text-sm text-status-expired">{state.error}</p>}
    </div>
  );
}
