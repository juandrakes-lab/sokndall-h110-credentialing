// Extra providers — the rules and the arithmetic, safe for the browser.
// The Polar side is lib/extra-providers.js.

export const EXTRA = {
  practice: { included: 15, max: 30, price: 25, billing: "now" },
  billing_co: { included: 50, max: null, price: 15, billing: "next_invoice" },
};

export const EXTRA_PROVIDERS_EVENT = "extra_providers";

// Practice from 28 providers costs $624+; Billing Co is $699 with 50.
export const PRACTICE_NUDGE_FROM = 28;

export const extraOf = (org) =>
  org.plan === "practice" ? Math.max(0, (org.provider_limit ?? 15) - 15) : org.plan === "billing_co" ? org.extra_providers ?? 0 : 0;

// The prorated charge Polar makes now for `added` Practice seats: the share
// of the billing period still ahead. Polar prorates by the second, so this is
// its figure to the cent within a minute of the click.
export function proratedNow(added, periodStart, periodEnd, now = new Date()) {
  if (added <= 0 || !periodStart || !periodEnd) return 0;
  const total = new Date(periodEnd) - new Date(periodStart);
  const left = Math.max(0, new Date(periodEnd) - now);
  return Math.floor(added * EXTRA.practice.price * 100 * Math.min(1, left / total)) / 100;
}

