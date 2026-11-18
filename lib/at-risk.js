import { daysUntil } from "@/lib/credentials";

// "At risk" (pedido 2026-11-17, C3): a provider scheduled to start seeing
// patients (go_live_date) with an application still not approved within the
// account's at_risk_days of that date — or past it. Optional: no date, no flag.
export function atRisk(provider, enrollments, days = 30) {
  if (!provider?.go_live_date) return null;
  const left = daysUntil(provider.go_live_date);
  if (left > days) return null;
  const open = enrollments.filter((e) => e.provider_id === provider.id && e.status !== "approved" && e.status !== "denied");
  if (!open.length) return null;
  return { daysLeft: left, open: open.length };
}

export function atRiskLabel(r) {
  if (!r) return null;
  return r.daysLeft < 0
    ? `At risk · started ${-r.daysLeft} day${r.daysLeft === -1 ? "" : "s"} ago, ${r.open} not approved`
    : `At risk · starts in ${r.daysLeft} day${r.daysLeft === 1 ? "" : "s"}, ${r.open} not approved`;
}
