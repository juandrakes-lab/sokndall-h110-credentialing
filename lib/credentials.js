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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
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

export const STATUS_STYLES = {
  active: "bg-status-active-bg text-status-active",
  expiring: "bg-status-expiring-bg text-status-expiring",
  expired: "bg-status-expired-bg text-status-expired",
};
