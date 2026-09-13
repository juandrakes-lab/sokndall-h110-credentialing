"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { inputClass } from "@/components/app/ui";

// Filters live in the URL, so a filtered dashboard can be bookmarked and the
// page itself stays a server render.
export default function DashboardFilters({ providers, types }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function update(key, value) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const active = params.get("provider") || params.get("type") || params.get("bucket");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor="filter-provider">Provider</label>
      <select
        id="filter-provider"
        value={params.get("provider") ?? ""}
        onChange={(e) => update("provider", e.target.value)}
        className={`${inputClass} sm:w-56`}
      >
        <option value="">All providers</option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.last_name}, {p.first_name}
          </option>
        ))}
      </select>

      <label className="sr-only" htmlFor="filter-type">Credential type</label>
      <select
        id="filter-type"
        value={params.get("type") ?? ""}
        onChange={(e) => update("type", e.target.value)}
        className={`${inputClass} sm:w-56`}
      >
        <option value="">All credential types</option>
        {types.map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

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
