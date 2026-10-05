"use client";

import Link from "next/link";
import { useActionState } from "react";
import { buttonClass } from "@/components/app/ui";
import { importTemplate } from "./actions";

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export default function TemplateImportForm() {
  const [state, action, pending] = useActionState(importTemplate, null);

  if (state?.done) {
    const r = state.report;
    const lines = [
      r.providers ? `${plural(r.providers, "provider")} added` : null,
      r.providersExisting ? `${plural(r.providersExisting, "provider")} already in Sokndall, linked rather than duplicated` : null,
      r.credentials ? `${plural(r.credentials, "credential")} (including CAQH attestations)` : null,
      r.credentialsExisting ? `${plural(r.credentialsExisting, "credential")} already in Sokndall, skipped` : null,
      r.caqh ? `${plural(r.caqh, "CAQH ID")} saved on providers` : null,
      r.payersAdded ? `${plural(r.payersAdded, "payer")} added to your list` : null,
      r.enrollments ? `${plural(r.enrollments, "payer application")}` : null,
      r.followUps ? `${plural(r.followUps, "last follow-up")} logged` : null,
    ].filter(Boolean);

    return (
      <div className="flex flex-col gap-5 px-5 py-5">
        <div>
          <p className="text-base font-semibold text-ink-900">Imported into {state.clientName}</p>
          {lines.length ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-ink-700">
              {lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-ink-700">Nothing new was in the file.</p>
          )}
        </div>

        {state.limit ? (
          <div className="rounded-lg border border-status-expiring/40 bg-status-expiring/5 p-4 text-sm text-ink-900">
            <p>{state.limit.message}</p>
            <ul className="mt-2 list-disc pl-5">
              {state.limit.names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <p className="mt-2">
              {state.limit.upgrade ? `${state.limit.upgrade} ` : null}
              <Link href="/settings?tab=billing#billing" className="font-semibold underline">
                Change plan
              </Link>
              , then upload the same file again: what&apos;s already in is linked, not duplicated.
            </p>
          </div>
        ) : null}

        {state.problems.length ? (
          <div className="text-sm">
            <p className="font-semibold text-ink-900">
              {plural(state.problems.length, "row")} didn&apos;t go in. Fix them in the sheet and upload it again, or add them by hand:
            </p>
            <ul className="mt-2 list-disc pl-5 text-ink-700">
              {state.problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className={buttonClass("primary")}>
            Go to the dashboard
          </Link>
          <Link href="/follow-ups" className={buttonClass("secondary")}>
            See this week&apos;s follow-ups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4 px-5 py-5">
      <label className="flex flex-col gap-2 text-sm text-ink-900">
        <span className="font-semibold">Your filled-in template (.xlsx, up to 5 MB)</span>
        <input
          type="file"
          name="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          required
          disabled={pending}
          className="text-sm file:mr-3 file:rounded-md file:border file:border-ink-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-semibold"
        />
      </label>
      <p className="text-xs text-ink-500">
        The file is read once and not kept. The grey example row is skipped if it&apos;s still there.
      </p>
      {state?.error ? <p className="text-sm text-status-expired">{state.error}</p> : null}
      <div className="flex items-center gap-3">
        <button type="submit" className={buttonClass("primary")} disabled={pending} aria-busy={pending}>
          {pending ? "Importing…" : "Import the template"}
        </button>
        {pending ? (
          <span className="text-sm text-ink-500" role="status">
            Reading the four tabs and checking each NPI against the NPI Registry. This can take a minute.
          </span>
        ) : null}
      </div>
    </form>
  );
}
