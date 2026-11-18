"use client";

import { useOptimistic, useTransition } from "react";

// "Ready to bill" (pedido 2026-11-17, C4): on an approved application, when the
// account turned the step on — the effective date confirmed with the payer,
// and the provider linked to the group. Each box saves as it's ticked.
export default function ReadyToBill({ effective, linked, action, readOnly }) {
  const [pending, start] = useTransition();
  const [state, set] = useOptimistic({ effective_confirmed: effective, linked_to_group: linked }, (s, [k, v]) => ({ ...s, [k]: v }));
  const ready = state.effective_confirmed && state.linked_to_group;
  const box = (key, label) => (
    <label className="flex items-center gap-2 text-sm text-ink-900">
      <input
        type="checkbox"
        checked={state[key]}
        disabled={readOnly || pending}
        onChange={(e) => {
          const v = e.target.checked;
          start(async () => {
            set([key, v]);
            await action(key, v);
          });
        }}
        className="h-4 w-4 accent-brand-700"
      />
      {label}
    </label>
  );
  return (
    <section className={`rounded-2xl px-5 py-4 ring-1 ring-inset ${ready ? "bg-status-active-bg ring-status-active/25" : "bg-ink-50 ring-ink-100"}`}>
      <p className="text-xs font-semibold text-ink-700">{ready ? "Ready to bill" : "Approved · not ready to bill yet"}</p>
      <div className="mt-2 flex flex-col gap-1.5">
        {box("effective_confirmed", "Effective date confirmed with the payer")}
        {box("linked_to_group", "Provider linked to the group")}
      </div>
      {pending && <p className="mt-1 text-xs text-ink-500">Saving…</p>}
    </section>
  );
}
