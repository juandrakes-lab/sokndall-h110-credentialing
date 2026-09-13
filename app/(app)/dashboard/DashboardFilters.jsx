"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { inputClass } from "@/components/app/ui";

// Filters live in the URL, so a filtered dashboard can be bookmarked and the
// page itself stays a server render.
export default function DashboardFilters({ selects }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("open");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const active = ["provider", "payer", "type", "status", "bucket"].some((k) => params.get(k));

  return (
    <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
      {selects.map((s) => (
        <div key={s.key}>
          <label className="sr-only" htmlFor={`filter-${s.key}`}>
            {s.label}
          </label>
          <select
            id={`filter-${s.key}`}
            value={params.get(s.key) ?? ""}
            onChange={(e) => update(s.key, e.target.value)}
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

      {active && (
        <button
          type="button"
          onClick={() => router.replace(pathname, { scroll: false })}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
