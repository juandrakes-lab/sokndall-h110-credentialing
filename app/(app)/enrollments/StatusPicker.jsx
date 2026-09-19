"use client";

import { useState } from "react";
import { ENROLLMENT_STATUSES, ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";
import StatusChip from "./StatusChip";
import { RequestForm } from "./EnrollmentForms";

const ACTIVE_STATUS = {
  not_started: "border-ink-500 bg-ink-100 text-ink-900",
  submitted: "border-enroll-purple bg-enroll-purple-bg text-enroll-purple",
  in_review: "border-sky-600 bg-sky-50 text-sky-800",
  info_requested: "border-status-expiring bg-status-expiring-bg text-status-expiring",
  approved: "border-status-active bg-status-active-bg text-status-active",
  denied: "border-status-expired bg-status-expired-bg text-status-expired",
};

// The status buttons. Every status saves on click, except "Info requested":
// that one first asks what the payer wants (alcance §3.7, rev. 2026-09-18).
export default function StatusPicker({ status, statusAction, requestAction, readOnly }) {
  const [asking, setAsking] = useState(false);
  const chip = (s) =>
    `rounded-full border px-3 py-1.5 text-sm font-medium transition ${s === status ? ACTIVE_STATUS[s] : "border-ink-200 bg-white text-ink-700 hover:border-ink-500"}`;

  return (
    <div className="flex flex-col gap-3">
      <form action={statusAction} className="flex flex-wrap gap-2">
        <fieldset disabled={readOnly} className="contents">
          {ENROLLMENT_STATUSES.map((s) =>
            s === "info_requested" && status !== "info_requested" ? (
              <button key={s} type="button" onClick={() => setAsking((v) => !v)} aria-expanded={asking} className={`${chip(s)} inline-flex items-center gap-2`}>
                {ENROLLMENT_STATUS_LABELS[s]}…
              </button>
            ) : (
              <StatusChip key={s} value={s} active={s === status} className={chip(s)}>
                {ENROLLMENT_STATUS_LABELS[s]}
              </StatusChip>
            )
          )}
        </fieldset>
      </form>
      {asking && !readOnly && <RequestForm action={requestAction} onCancel={() => setAsking(false)} />}
    </div>
  );
}
