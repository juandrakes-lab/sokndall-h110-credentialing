"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { askJuan, guideLogFollowUp, guideShowClient, guideSkip } from "@/lib/demo-actions";

const day = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const TONE = { request: "bg-status-expiring", stalled: "bg-status-expiring", expiring: "bg-status-expired" };

// The demo's first session (pedido 2026-11-16, demo onboarding): one line on
// what this week holds across the clients, the three things that need the
// visitor, and two guided steps — log the stalled one, then see what the
// client sees — before two ways out. Skippable, and never shown again once
// skipped. Every line fits on a phone.
export default function DemoGuide({ state, clientsCount, items, stalled, today, proposed }) {
  const [logState, logAction, logging] = useActionState(guideLogFollowUp, null);
  const step = state === "done" ? 3 : logState?.saved || state === "step2" ? 2 : 1;

  return (
    <section aria-label="Getting started" className="flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-brand-700/20 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight text-ink-900 sm:text-xl">
          This week across your {clientsCount} clients: {items.length} thing{items.length === 1 ? "" : "s"} need{items.length === 1 ? "s" : ""} you.
        </h2>
        {step < 3 && (
          <form action={guideSkip}>
            <SubmitButton className="text-sm text-ink-500 underline underline-offset-2 hover:text-ink-900" pendingLabel="…">
              Skip, I&apos;ll look around
            </SubmitButton>
          </form>
        )}
      </div>

      <ul className="flex flex-col gap-2">
        {items.map((it) => (
          <li key={it.kind} className="flex items-start gap-3 text-sm">
            <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE[it.kind]}`} aria-hidden="true" />
            <span className="min-w-0">
              <span className="font-medium text-ink-900">{it.title}</span>
              <span className="text-ink-700"> — {it.detail}</span>
              <span className="text-ink-500"> · {it.client}</span>
            </span>
          </li>
        ))}
      </ul>

      {step === 1 && stalled && (
        <div className="flex flex-col gap-3 rounded-xl bg-brand-50 p-4">
          <p className="text-sm text-ink-900">
            <span className="font-semibold">Step 1 of 2 ·</span> Log what happened on the stalled one, and when to chase it next.
          </p>
          <form action={logAction} className="flex flex-col gap-2">
            <input type="hidden" name="enrollment_id" value={stalled.enrollmentId} />
            <input type="hidden" name="contact_date" value={today} />
            <input name="outcome" required maxLength={500} placeholder="What happened? e.g. Called, still in review" className={inputClass} disabled={logging} />
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="guide-next" className="text-xs text-ink-700">
                Next follow-up
              </label>
              <input id="guide-next" type="date" name="next_follow_up_date" defaultValue={proposed} min={today} className={`${inputClass.replace("w-full ", "")} w-auto py-1.5`} disabled={logging} />
              <SubmitButton pending={logging} pendingLabel="Saving…" className={buttonClass("primary", "sm")}>
                Save
              </SubmitButton>
            </div>
            {logState?.error && <p className="text-xs text-status-expired">{logState.error}</p>}
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3 rounded-xl bg-brand-50 p-4">
          {logState?.saved && (
            <p className="text-sm font-medium text-status-active">Done. It&apos;ll come back on {day(logState.next)}; you don&apos;t have to remember it.</p>
          )}
          <p className="text-sm text-ink-900">
            <span className="font-semibold">Step 2 of 2 ·</span> See what your client sees: one link, no &ldquo;any update?&rdquo; emails.
          </p>
          <form action={guideShowClient}>
            <input type="hidden" name="client_id" value={stalled?.clientId ?? ""} />
            <SubmitButton pendingLabel="Opening…" className={buttonClass("primary", "sm")}>
              Show me {stalled?.client ? `${stalled.client}'s` : "the client"} view
            </SubmitButton>
          </form>
        </div>
      )}

      {step === 3 && <Closing />}
    </section>
  );
}

// The end of the first session: two ways out, nothing else.
function Closing() {
  const [asking, setAsking] = useState(false);
  const [state, action, pending] = useActionState(askJuan, null);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    try {
      setHidden(localStorage.getItem("sk_demo_closing") === "1");
    } catch {}
  }, []);
  if (hidden) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-brand-50 p-4">
      <p className="text-sm text-ink-900">That&apos;s the core of it. Want it with your clients?</p>
      <div className="flex flex-wrap gap-2">
        <Link href="/real-data" className={buttonClass("primary", "sm")}>
          Load my real data (we do it for you)
        </Link>
        <button type="button" onClick={() => setAsking((v) => !v)} className={buttonClass("secondary", "sm")}>
          Ask Juan a question
        </button>
        <button
          type="button"
          onClick={() => {
            try {
              localStorage.setItem("sk_demo_closing", "1");
            } catch {}
            setHidden(true);
          }}
          className="text-sm text-ink-500 underline underline-offset-2"
        >
          Close
        </button>
      </div>
      {asking && !state?.sent && (
        <form action={action} className="flex flex-col gap-2">
          <textarea name="question" required maxLength={1000} rows={3} placeholder="Your question — Juan answers himself." className={inputClass} disabled={pending} />
          <input name="email" type="email" maxLength={200} placeholder="Your email, so he can answer" className={inputClass} disabled={pending} />
          <SubmitButton pending={pending} pendingLabel="Sending…" className={`${buttonClass("primary", "sm")} self-start`}>
            Send to Juan
          </SubmitButton>
          {state?.error && <p className="text-xs text-status-expired">{state.error}</p>}
        </form>
      )}
      {state?.sent && <p className="text-sm font-medium text-status-active">Sent. Juan will answer by email.</p>}
    </div>
  );
}
