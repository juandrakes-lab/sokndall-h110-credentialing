// What the enrollment side panel's two forms must satisfy — used live in the
// browser and again by the server actions.
import { todayISO } from "@/lib/credentials";
import { CHANNEL_LABELS } from "@/lib/enrollments";
import { collect, dateError, orderError } from "@/lib/validation";

// Revalidation cycles payers actually use (Medicare 5 years, Medicaid and most
// commercial plans 3), offered instead of a free number.
export const REVALIDATION_CHOICES = [12, 24, 36, 48, 60];

const future = (v, label) => (v && v < todayISO() ? `${label} can't be in the past.` : null);

export function followUpErrors(v) {
  return collect({
    channel: () => (!CHANNEL_LABELS[v.channel] ? "Choose how you contacted the payer." : null),
    contact_date: () => (!v.contact_date ? "Enter the date of the contact." : dateError(v.contact_date, { notFuture: true })),
    outcome: () => (!String(v.outcome ?? "").trim() && !String(v.reference_number ?? "").trim() ? "Write what happened, or at least the reference number." : null),
    reference_number: () => (String(v.reference_number ?? "").length > 40 ? "That reference is too long." : null),
    next_follow_up_date: () =>
      v.next_follow_up_date
        ? dateError(v.next_follow_up_date, { maxYearsAhead: 1 }) ??
          orderError(v.contact_date, v.next_follow_up_date, "The next follow-up can't be before this contact.") ??
          future(v.next_follow_up_date, "The next follow-up")
        : null,
  });
}

// A payer's request (alcance §3.7, rev. 2026-09-18): what they asked for and
// how they asked. Kept until someone marks it resolved.
export const REQUEST_MAX = 500;

export function requestErrors(v) {
  const request = String(v.request ?? "").trim();
  return collect({
    request: () =>
      !request
        ? "Write what the payer asked for — it stays on the application until it's resolved."
        : request.length < 3
          ? "Say a little more about what they asked for."
          : request.length > REQUEST_MAX
            ? `Keep it under ${REQUEST_MAX} characters.`
            : null,
    channel: () => (!CHANNEL_LABELS[v.channel] ? "Choose how the payer asked." : null),
  });
}

// `initial` lets an old date stay as it is: a follow-up date that has since
// passed doesn't block saving the other fields.
export function detailsErrors(v, { initial = {}, status } = {}) {
  const changed = (f) => (v[f] ?? "") !== (initial[f] ?? "");
  return collect({
    next_follow_up_date: () =>
      v.next_follow_up_date && changed("next_follow_up_date")
        ? dateError(v.next_follow_up_date, { maxYearsAhead: 1 }) ?? future(v.next_follow_up_date, "The next follow-up")
        : null,
    submitted_date: () => (v.submitted_date ? dateError(v.submitted_date, { notFuture: true }) : null),
    // Effective dates are often retroactive, so no order against submission.
    effective_date: () =>
      v.effective_date
        ? status && status !== "approved"
          ? "An effective date only applies once the payer has approved."
          : dateError(v.effective_date, { maxYearsAhead: 2 })
        : null,
    external_ref: () => (String(v.external_ref ?? "").length > 40 ? "That number is too long." : null),
    revalidation_months_override: () =>
      v.revalidation_months_override && changed("revalidation_months_override") && !REVALIDATION_CHOICES.includes(Number(v.revalidation_months_override))
        ? "Choose one of the listed cycles."
        : null,
  });
}
