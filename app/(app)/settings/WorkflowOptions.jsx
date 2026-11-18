"use client";

import { useActionState, useState } from "react";
import { buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";

// Two optional workflow steps (pedido 2026-11-17, C3 and C4). Off or at their
// defaults, nothing changes anywhere.
export default function WorkflowOptions({ action, atRiskDays, readyToBill, canEdit }) {
  const [days, setDays] = useState(atRiskDays);
  const [rtb, setRtb] = useState(readyToBill);
  const [state, formAction, pending] = useActionState(action, null);
  const changed = days !== (state?.days ?? atRiskDays) || rtb !== (state?.rtb ?? readyToBill);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-wrap items-center gap-2 text-sm text-ink-900">
        Mark a provider <span className="font-semibold">At risk</span> when an application isn&apos;t approved
        <select name="at_risk_days" value={days} onChange={(e) => setDays(Number(e.target.value))} disabled={!canEdit || pending} className="rounded-md border border-ink-200 bg-white px-2 py-1 text-sm">
          {[14, 21, 30, 45, 60, 90].map((d) => (
            <option key={d} value={d}>
              {d} days
            </option>
          ))}
        </select>
        before their scheduled start.
      </label>
      <p className="-mt-2 text-xs text-ink-500">Only for providers with a &ldquo;Scheduled to start&rdquo; date on their page.</p>
      <label className="flex items-start gap-2 text-sm text-ink-900">
        <input type="checkbox" name="ready_to_bill" checked={rtb} onChange={(e) => setRtb(e.target.checked)} disabled={!canEdit || pending} className="mt-0.5 h-4 w-4 accent-brand-700" />
        <span>
          Add a <span className="font-semibold">Ready to bill</span> step after Approved
          <span className="block text-xs text-ink-500">Approved applications then show two checks: effective date confirmed, and provider linked to the group.</span>
        </span>
      </label>
      {canEdit && (
        <SubmitButton disabled={!changed} pending={pending} pendingLabel="Saving…" className={`${buttonClass("primary", "sm")} self-start disabled:cursor-not-allowed disabled:opacity-50`}>
          Save
        </SubmitButton>
      )}
      {state?.error && <p className="text-sm text-status-expired">{state.error}</p>}
      {state?.saved && !changed && <p className="text-sm text-status-active">Saved.</p>}
    </form>
  );
}
