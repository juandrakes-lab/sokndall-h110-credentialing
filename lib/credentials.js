export const CREDENTIAL_TYPE_LABELS = {
  state_license: "State license",
  dea: "DEA",
  malpractice: "Malpractice insurance",
  board_cert: "Board certification",
  caqh_attestation: "CAQH attestation",
  bls_acls: "BLS/ACLS",
  other: "Other",
};

export const CREDENTIAL_TYPES = Object.keys(CREDENTIAL_TYPE_LABELS);

export function daysUntil(dateStr) {
  // Build the target date from its Y/M/D components in local time. Passing
  // the "YYYY-MM-DD" string straight to `new Date()` parses it as UTC
  // midnight, which then lands on the wrong local day in any timezone
  // behind UTC once `setHours` normalizes it — a day off in the dashboard
  // buckets and the alert thresholds.
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round((target - today) / 86400000);
}

export function bucketFor(dateStr) {
  const days = daysUntil(dateStr);
  if (days < 0) return "overdue";
  if (days <= 30) return "due_30";
  if (days <= 60) return "due_60";
  if (days <= 90) return "due_90";
  return null;
}

export const CREDENTIAL_IMPORT_FIELDS = [
  { key: "provider_npi", label: "Provider NPI" },
  { key: "provider_first_name", label: "Provider first name" },
  { key: "provider_last_name", label: "Provider last name" },
  { key: "type", label: "Credential type", required: true },
  { key: "identifier", label: "Identifier / license #" },
  { key: "state", label: "State" },
  { key: "issue_date", label: "Issue date" },
  { key: "expiration_date", label: "Expiration date" },
  { key: "notes", label: "Notes" },
];

export const STATUS_STYLES = {
  active: "bg-status-active-bg text-status-active",
  expiring: "bg-status-expiring-bg text-status-expiring",
  expired: "bg-status-expired-bg text-status-expired",
};
