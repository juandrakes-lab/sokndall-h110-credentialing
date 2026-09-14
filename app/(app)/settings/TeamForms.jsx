"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Field, FormError, buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

// Billing Co: all clients (including ones added later) or a chosen few.
function ClientAccessFields({ clients, initial, error, disabled, idPrefix }) {
  const [some, setSome] = useState(Boolean(initial));
  const [chosen, setChosen] = useState(() => new Set(initial ?? []));

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-2 text-sm">
      <legend className="mb-1 font-medium text-ink-900">Clients they can work on</legend>
      <label className="flex items-center gap-2">
        <input type="radio" name="access" value="all" checked={!some} onChange={() => setSome(false)} />
        All clients, including ones you add later
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="access" value="some" checked={some} onChange={() => setSome(true)} />
        Only these clients
      </label>
      {some && (
        <div className="ml-6 flex flex-col gap-1.5">
          {clients.map((c) => (
            <label key={c.id} htmlFor={`${idPrefix}-${c.id}`} className="flex items-center gap-2">
              <input
                id={`${idPrefix}-${c.id}`}
                type="checkbox"
                name="client_ids"
                value={c.id}
                checked={chosen.has(c.id)}
                onChange={(e) => {
                  const next = new Set(chosen);
                  if (e.target.checked) next.add(c.id);
                  else next.delete(c.id);
                  setChosen(next);
                }}
              />
              {c.name}
            </label>
          ))}
        </div>
      )}
      {error && <p className="text-xs text-status-expired">{error}</p>}
    </fieldset>
  );
}

export function MemberAccessForm({ action, clients, initial, disabled, idPrefix }) {
  const [state, formAction] = useActionState(action, {});
  return (
    <form action={formAction} className="mt-3 flex flex-col gap-3">
      <ClientAccessFields
        key={state?.saved ?? "initial"}
        clients={clients}
        initial={initial}
        error={state?.fieldErrors?.client_ids}
        disabled={disabled}
        idPrefix={idPrefix}
      />
      <FormError message={state?.error} />
      {state?.notice && <p className="text-sm text-status-active">{state.notice}</p>}
      <div>
        <SubmitButton disabled={disabled} className={buttonClass("secondary", "sm")}>
          Save access
        </SubmitButton>
      </div>
    </form>
  );
}

export function InviteForm({ action, seatReady, disabled, clients }) {
  const [state, formAction, pending] = useActionState(action, {});
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.saved) setEmail("");
    setCopied(false);
  }, [state?.saved]);

  const extra = state?.needsExtraSeat;
  const waitingFor = state?.waitingForSeat;
  const [gaveUp, setGaveUp] = useState(false);

  // Billing Co, a user beyond the plan: Polar is adding the seat. Poll until
  // the new limit lands, then send the invitation by submitting again.
  useEffect(() => {
    if (!waitingFor) return;
    setGaveUp(false);
    const started = Date.now();
    let stopped = false;
    async function tick() {
      if (stopped) return;
      await fetch("/api/billing/sync", { method: "POST" }).catch(() => {});
      const ready = await seatReady(waitingFor).catch(() => false);
      if (stopped) return;
      if (ready) {
        formRef.current?.requestSubmit();
        return;
      }
      if (Date.now() - started > 90000) {
        setGaveUp(true);
        return;
      }
      setTimeout(tick, 3000);
    }
    tick();
    return () => {
      stopped = true;
    };
  }, [waitingFor, seatReady]);

  const busy = pending || (waitingFor && !gaveUp);

  return (
    <div className="flex flex-col gap-3">
      <form
        ref={formRef}
        // Not `action={formAction}`: React resets a form after each action, and
        // the extra-user flow submits this one up to three times (cost, confirm,
        // send) with the same email and clients.
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget, e.nativeEvent.submitter ?? undefined);
          startTransition(() => formAction(data));
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Invite by email" htmlFor="invite-email" error={state?.fieldErrors?.email} className="flex-1">
            <input
              id="invite-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={disabled}
              readOnly={busy}
              className={inputClass}
              placeholder="name@practice.com"
            />
          </Field>
          {!extra && !waitingFor && (
            <SubmitButton disabled={disabled} pending={pending} className={buttonClass("primary")}>
              {pending ? "Inviting…" : "Send invitation"}
            </SubmitButton>
          )}
        </div>
        {extra && !waitingFor && (
          <div className="flex flex-col gap-3 rounded-lg border border-status-expiring/30 bg-status-expiring-bg px-4 py-3 text-sm text-ink-900">
            <p>
              <strong>This adds ${extra.price}/month to your plan.</strong> All the users on your plan are taken or invited;
              user {extra.users} takes your plan from ${extra.from} to ${extra.to} a month, charged by Polar on the same
              subscription. Remove someone later and it goes back down at your next renewal.
            </p>
            <div className="flex flex-wrap gap-2">
              <SubmitButton name="confirm_extra" value="1" pending={pending} className={buttonClass("primary", "sm")}>
                Add user (${extra.price}/month) and invite
              </SubmitButton>
              <button type="button" onClick={() => location.reload()} className={buttonClass("secondary", "sm")}>
                Cancel
              </button>
            </div>
          </div>
        )}
        {waitingFor && (
          <p role="status" className="flex items-center gap-2 text-sm text-ink-700">
            {!gaveUp && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-100 border-t-brand-600" aria-hidden="true" />
            )}
            {gaveUp
              ? "Polar hasn't confirmed the new user yet, so the invitation wasn't sent. Reload this page in a minute and invite again — you won't be charged twice."
              : "Adding the user to your plan, then sending the invitation…"}
          </p>
        )}
        {clients && (
          <ClientAccessFields
            key={state?.saved ?? "initial"}
            clients={clients}
            error={state?.fieldErrors?.client_ids}
            disabled={disabled}
            idPrefix="invite"
          />
        )}
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
