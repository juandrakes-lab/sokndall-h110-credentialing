"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import { switchClient } from "@/lib/client-actions";

// Billing Co: which client the whole app is showing (alcance §4.4). Changing
// it keeps the user signed in and on the same section.
export default function ClientSwitcher({ clients, activeId }) {
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-500">Client</span>
      <span className="relative mt-1 block">
        <select
          value={activeId}
          disabled={pending}
          onChange={(e) => {
            const id = e.target.value;
            startTransition(() => switchClient(id, pathname));
          }}
          className="w-full appearance-none truncate rounded-lg border border-ink-200 bg-white py-2 pl-3 pr-8 text-sm font-medium text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:opacity-60"
        >
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-ink-500" aria-hidden="true">
          {pending ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M5.5 7.5l4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          )}
        </span>
      </span>
    </label>
  );
}
