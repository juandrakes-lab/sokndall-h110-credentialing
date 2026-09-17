"use client";

import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ICONS, PageHeader, buttonClass, inputClass } from "@/components/app/ui";

// The dashboard's header with its filters folded behind a button. Filters live
// in the URL, so a filtered dashboard can be bookmarked and the page itself
// stays a server render; while the new results load, the button spins.
export default function DashboardHeader({ title, description, exportHref, selects, filterKeys }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();

  const count = filterKeys.filter((k) => params.get(k)).length;
  const [open, setOpen] = useState(count > 0);

  function go(next) {
    next.delete("open");
    const qs = next.toString();
    startTransition(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }));
  }

  function update(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    go(next);
  }

  function clear() {
    const next = new URLSearchParams(params.toString());
    filterKeys.forEach((k) => next.delete(k));
    go(next);
  }

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="dashboard-filters"
              className={`${buttonClass("secondary")} ${open ? "bg-ink-50" : ""}`}
            >
              {pending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className="h-4 w-4 text-ink-500" aria-hidden="true">
                  <path d={ICONS.filter} />
                </svg>
              )}
              Filters
              {count > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[0.6875rem] font-semibold text-white">
                  {count}
                </span>
              )}
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page */}
            <a href={exportHref} className={buttonClass("secondary")}>
              Export CSV
            </a>
          </>
        }
      />

      {open && (
        <div id="dashboard-filters" className="-mt-2 flex flex-col flex-wrap gap-3 rounded-2xl bg-ink-50 p-3 ring-1 ring-inset ring-ink-100 sm:flex-row sm:items-center">
          {selects.map((s) => (
            <div key={s.key}>
              <label className="sr-only" htmlFor={`filter-${s.key}`}>
                {s.label}
              </label>
              <select
                id={`filter-${s.key}`}
                value={params.get(s.key) ?? ""}
                onChange={(e) => update(s.key, e.target.value)}
                disabled={pending}
                className={`${inputClass} sm:w-52`}
              >
                <option value="">{s.all}</option>
                {s.options.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {count > 0 && (
            <button type="button" onClick={clear} disabled={pending} className="px-2 text-sm font-medium text-brand-600 hover:underline">
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
