import { addDays, daysUntil, todayISO } from "@/lib/credentials";

// Enrollment states of alcance §3.5, in the order an application moves.
export const ENROLLMENT_STATUSES = [
  "not_started",
  "submitted",
  "in_review",
  "info_requested",
  "approved",
  "denied",
];

export const ENROLLMENT_STATUS_LABELS = {
  not_started: "Not started",
  submitted: "Submitted",
  in_review: "In review",
  info_requested: "Info requested",
  approved: "Approved",
  denied: "Denied",
};

export const ENROLLMENT_STATUS_TONES = {
  not_started: "neutral",
  submitted: "violet",
  in_review: "blue",
  info_requested: "amber",
  approved: "green",
  denied: "red",
};

// Statuses where the application is with the payer and someone has to chase it.
export const IN_FLIGHT = ["submitted", "in_review", "info_requested"];

export const STALLED_AFTER_DAYS = 30;

export const CHANNEL_LABELS = { phone: "Phone", portal: "Portal", email: "Email" };

export const PAYER_TYPE_LABELS = {
  commercial: "Commercial",
  medicare: "Medicare",
  medicaid: "Medicaid",
  other: "Other",
};

export const FOLLOW_UP_DEFAULT_DAYS = 7;

export function proposedFollowUp() {
  return addDays(todayISO(), FOLLOW_UP_DEFAULT_DAYS);
}

// Sunday that closes the current week (weeks run Monday–Sunday).
export function weekEndISO() {
  const today = todayISO();
  const [y, m, d] = today.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday
  return addDays(today, weekday === 0 ? 0 : 7 - weekday);
}

// An org payer row is either a pick from the catalog (details live there) or
// the organization's own payer (details on the row).
export function resolvePayer(row) {
  const g = row.cred_payers_global;
  return {
    id: row.id,
    name: g?.name ?? row.name,
    payer_type: g?.payer_type ?? row.payer_type,
    revalidation_months: row.revalidation_months ?? g?.revalidation_months,
    state: g?.state ?? null,
    fromCatalog: Boolean(row.payer_global_id),
  };
}

export const PAYER_SELECT =
  "id, payer_global_id, name, payer_type, revalidation_months, cred_payers_global(name, payer_type, revalidation_months, state)";

export function sortPayers(payers) {
  return [...payers].sort((a, b) => a.name.localeCompare(b.name));
}

// Stalled (alcance §3.6): with the payer, and no status change in 30+ days.
export function stalledDays(enrollment) {
  if (!IN_FLIGHT.includes(enrollment.status)) return null;
  const changed = enrollment.status_changed_at.slice(0, 10);
  const days = -daysUntil(changed);
  return days > STALLED_AFTER_DAYS ? days : null;
}

export function followUpLabel(dateStr) {
  const days = daysUntil(dateStr);
  if (days < 0) return { text: `${-days} day${days === -1 ? "" : "s"} overdue`, tone: "red" };
  if (days === 0) return { text: "Today", tone: "amber" };
  if (days === 1) return { text: "Tomorrow", tone: "neutral" };
  return { text: `In ${days} days`, tone: "neutral" };
}

// The URL value that opens one provider × payer cell in the side panel.
export function cellKey(providerId, payerId) {
  return `${providerId}.${payerId}`;
}

export function parseCellKey(value) {
  if (typeof value !== "string") return null;
  const [providerId, payerId] = value.split(".");
  const uuid = /^[0-9a-f-]{36}$/i;
  return uuid.test(providerId ?? "") && uuid.test(payerId ?? "") ? { providerId, payerId } : null;
}
