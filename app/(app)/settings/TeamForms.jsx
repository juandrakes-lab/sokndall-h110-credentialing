"use client";

import { useActionState, useEffect, useState } from "react";
import { Field, FormError, buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

export function InviteForm({ action, disabled }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (state?.saved) setEmail("");
    setCopied(false);
  }, [state?.saved]);

  return (
    <div className="flex flex-col gap-3">
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Field label="Invite by email" htmlFor="invite-email" error={state?.fieldErrors?.email} className="flex-1">
          <input
            id="invite-email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={disabled}
            className={inputClass}
            placeholder="name@practice.com"
          />
        </Field>
        <SubmitButton disabled={disabled || pending} className={buttonClass("primary")}>
          {pending ? "Inviting…" : "Send invitation"}
        </SubmitButton>
      </form>
      <FormError message={state?.error} />
      {state?.link && (
        <div className="rounded-lg border border-status-active/30 bg-status-active-bg px-4 py-3 text-sm text-ink-900">
          <p>
            {state.emailed
              ? `Invitation sent to ${state.email}. You can also share this link:`
              : `Invitation created for ${state.email}, but the email didn't go out. Share this link with them:`}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded bg-white px-2 py-1 text-xs">{state.link}</code>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(state.link).then(() => setCopied(true))}
              className={buttonClass("secondary", "sm")}
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DeleteAccountForm({ action, orgName }) {
  const [state, formAction, pending] = useActionState(action, {});
  return (
    <form action={formAction} className="flex flex-col gap-3">
      <FormError message={state?.error} />
      <p className="text-sm text-ink-700">
        This ends your subscription today, deletes every provider, credential, enrollment, document and log, and can&apos;t
        be undone. Export anything you want to keep first (Import / Export).
      </p>
      <Field label={`Type ${orgName} to confirm`} htmlFor="delete-confirm">
        <input id="delete-confirm" name="confirm" autoComplete="off" className={`${inputClass} sm:max-w-sm`} />
      </Field>
      <div>
        <SubmitButton disabled={pending} className={buttonClass("danger")}>
          {pending ? "Deleting…" : "Delete account permanently"}
        </SubmitButton>
      </div>
    </form>
  );
}
