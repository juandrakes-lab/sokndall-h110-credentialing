"use client";

import { useState, useTransition } from "react";
import { ENROLLMENT_STATUSES, ENROLLMENT_STATUS_LABELS, ENROLLMENT_STATUS_STYLES } from "@/lib/enrollments";
import { setEnrollmentStatus } from "./actions";

export default function StatusCell({ providerId, payerId, status }) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const next = e.target.value;
    setValue(next);
    startTransition(async () => {
      await setEnrollmentStatus(providerId, payerId, next);
    });
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      disabled={isPending}
      className={`w-full rounded-full border-0 px-2 py-1 text-xs font-medium outline-none disabled:opacity-60 ${ENROLLMENT_STATUS_STYLES[value]}`}
    >
      {ENROLLMENT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {ENROLLMENT_STATUS_LABELS[s]}
        </option>
      ))}
    </select>
  );
}
