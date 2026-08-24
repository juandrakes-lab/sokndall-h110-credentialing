"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ENROLLMENT_STATUSES, ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";

export default function MatrixFilters({ payers }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/enrollments?${params.toString()}`);
  }

  return (
    <div className="flex gap-3">
      <select
        defaultValue={searchParams.get("payer") ?? ""}
        onChange={(e) => updateParam("payer", e.target.value)}
        className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
      >
        <option value="">All payers</option>
        {payers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("status") ?? ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="rounded-md border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-600"
      >
        <option value="">All statuses</option>
        {ENROLLMENT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {ENROLLMENT_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}
