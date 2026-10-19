"use client";

import { createContext, useContext, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ENROLLMENT_STATUSES, ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";
import { buttonClass } from "@/components/app/ui";
import { setStatusForCells } from "./actions";

// Changing several matrix cells at once (pedido 2026-10-19, función 3). A
// shortcut on top of the matrix: with "Select cells" off, every cell is the
// same link to its side panel as always; on, a click ticks the cell instead,
// and one status button applies to all ticked cells.
const Ctx = createContext(null);
const BULK_STATUSES = ENROLLMENT_STATUSES.filter((s) => s !== "info_requested");

export function MatrixSelection({ children, readOnly }) {
  const [on, setOn] = useState(false);
  const [picked, setPicked] = useState(() => new Set());
  const [message, setMessage] = useState(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const toggle = (key) =>
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  const stop = () => {
    setOn(false);
    setPicked(new Set());
  };
  const apply = (status) =>
    start(async () => {
      setMessage(null);
      const r = await setStatusForCells([...picked], status);
      if (r?.error && !r.done) return setMessage({ tone: "red", text: r.error });
      setMessage({ tone: r.error ? "amber" : "green", text: r.error ?? `${r.done} ${r.done === 1 ? "application" : "applications"} moved to ${ENROLLMENT_STATUS_LABELS[status]}.` });
      setPicked(new Set());
      router.refresh();
    });

  return (
    <Ctx.Provider value={{ on, picked, toggle }}>
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => (on ? stop() : setOn(true))} aria-pressed={on} className={buttonClass(on ? "primary" : "secondary", "sm")}>
            {on ? "Done selecting" : "Select cells"}
          </button>
          {on && <span className="text-sm text-ink-500">Click the cells to change, then pick a status.</span>}
          {message && (
            <span role="status" className={`text-sm ${message.tone === "red" ? "text-status-expired" : message.tone === "amber" ? "text-status-expiring" : "text-status-active"}`}>
              {message.text}
            </span>
          )}
        </div>
      )}
      {children}
      {on && picked.size > 0 && (
        <div className="sticky bottom-4 z-20 mx-auto flex w-full max-w-4xl flex-wrap items-center gap-2 rounded-2xl bg-brand-700 px-4 py-3 text-white shadow-[0_12px_32px_rgba(14,42,46,0.35)]">
          <span className="mr-1 text-sm font-semibold">
            {picked.size} selected · Set to
          </span>
          {BULK_STATUSES.map((s) => (
            <button key={s} type="button" disabled={pending} onClick={() => apply(s)} className="rounded-full bg-white/12 px-3 py-1.5 text-sm font-medium ring-1 ring-inset ring-white/25 transition hover:bg-white/20 disabled:opacity-60">
              {ENROLLMENT_STATUS_LABELS[s]}
            </button>
          ))}
          {pending && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-label="Saving" />}
          <button type="button" onClick={() => setPicked(new Set())} disabled={pending} className="ml-auto text-sm text-white/80 underline-offset-2 hover:underline">
            Clear
          </button>
        </div>
      )}
    </Ctx.Provider>
  );
}

// One matrix cell: the usual link to its panel, or a tick box while selecting.
export function MatrixCell({ href, cellKey, className, children }) {
  const ctx = useContext(Ctx);
  if (!ctx?.on) {
    return (
      <Link href={href} scroll={false} className={className}>
        {children}
      </Link>
    );
  }
  const picked = ctx.picked.has(cellKey);
  return (
    <button
      type="button"
      onClick={() => ctx.toggle(cellKey)}
      aria-pressed={picked}
      className={`${className} w-full ${picked ? "ring-2 ring-brand-600 ring-offset-1" : "opacity-80"}`}
    >
      {children}
    </button>
  );
}
