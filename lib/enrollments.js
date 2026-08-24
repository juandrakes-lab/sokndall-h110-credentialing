export const PAYER_TYPE_LABELS = {
  commercial: "Commercial",
  medicare: "Medicare",
  medicaid: "Medicaid",
  other: "Other",
};

export const PAYER_TYPES = Object.keys(PAYER_TYPE_LABELS);

export const ENROLLMENT_STATUS_LABELS = {
  not_started: "Not started",
  submitted: "Submitted",
  in_review: "In review",
  info_requested: "Info requested",
  approved: "Approved",
  denied: "Denied",
  revalidation_due: "Revalidation due",
};

export const ENROLLMENT_STATUSES = Object.keys(ENROLLMENT_STATUS_LABELS);

export const ENROLLMENT_STATUS_STYLES = {
  not_started: "bg-ink-100 text-ink-500",
  submitted: "bg-brand-50 text-brand-600",
  in_review: "bg-status-expiring-bg text-status-expiring",
  info_requested: "bg-enroll-purple-bg text-enroll-purple",
  approved: "bg-status-active-bg text-status-active",
  denied: "bg-status-expired-bg text-status-expired",
  revalidation_due: "bg-enroll-orange-bg text-enroll-orange",
};
