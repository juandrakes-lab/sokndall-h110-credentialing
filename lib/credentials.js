// The five credential types of alcance §3.3. The table has generic columns
// (state, number, issuer, coverage, issue_date, expiration_date); this is the
// one place that says which columns a type uses and what they're called.
export const CREDENTIAL_TYPES = {
  state_license: {
    label: "State license",
    fields: ["state", "number", "issue_date", "expiration_date"],
    labels: { state: "State", number: "License number", issue_date: "Issued", expiration_date: "Expires" },
    required: ["state", "number", "expiration_date"],
  },
  dea: {
    label: "DEA registration",
    fields: ["number", "state", "expiration_date"],
    labels: { number: "DEA number", state: "State", expiration_date: "Expires" },
    required: ["number", "expiration_date"],
  },
  malpractice: {
    label: "Malpractice insurance",
    fields: ["issuer", "number", "coverage", "expiration_date"],
    labels: {
      issuer: "Insurance carrier",
      number: "Policy number",
      coverage: "Coverage amount",
      expiration_date: "Expires",
    },
    placeholders: { coverage: "e.g. $1M / $3M" },
    required: ["issuer", "expiration_date"],
  },
  board_cert: {
    label: "Board certification",
    fields: ["issuer", "issue_date", "expiration_date"],
    labels: { issuer: "Certifying board", issue_date: "Certified on", expiration_date: "Recertification due" },
    required: ["issuer"],
  },
  caqh_attestation: {
    label: "CAQH attestation",
    fields: ["issue_date"],
    labels: { issue_date: "Last attested on" },
    required: ["issue_date"],
  },
};

export const CREDENTIAL_TYPE_KEYS = Object.keys(CREDENTIAL_TYPES);

export const CREDENTIAL_TYPE_LABELS = Object.fromEntries(
  CREDENTIAL_TYPE_KEYS.map((key) => [key, CREDENTIAL_TYPES[key].label])
);

export const CREDENTIAL_FIELDS = ["state", "number", "issuer", "coverage", "issue_date", "expiration_date"];

export function credentialLabel(type) {
  return CREDENTIAL_TYPES[type]?.label ?? type;
}

// One line describing the credential beyond its type: "TX · 12345".
export function credentialSummary(c) {
  return [c.state, c.issuer, c.number, c.coverage].filter(Boolean).join(" · ");
}

// "Today" is the calendar day in US Eastern time, on the server and in the
// browser alike — the same day boundary as the nightly status refresh
// (05:00 UTC), and it can't drift with the server's or the viewer's clock.
const BUSINESS_TZ = "America/New_York";

export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

// The calendar day (US Eastern) of a timestamp, as "YYYY-MM-DD".
export function businessDate(iso) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function utcDay(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

// Whole days from today to a "YYYY-MM-DD" date (negative = past). Pure
// calendar arithmetic in UTC, so no timezone or DST shift can move it a day.
export function daysUntil(dateStr) {
  return Math.round((utcDay(dateStr) - utcDay(todayISO())) / 86400000);
}

export function addDays(dateStr, days) {
  return new Date(utcDay(dateStr) + days * 86400000).toISOString().slice(0, 10);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(utcDay(dateStr)).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Dashboard buckets (alcance §3.12): expired / 30 / 60 / 90.
export const BUCKETS = [
  { key: "expired", label: "Expired" },
  { key: "d30", label: "Next 30 days" },
  { key: "d60", label: "31–60 days" },
  { key: "d90", label: "61–90 days" },
];

export function bucketFor(dateStr) {
  if (!dateStr) return null;
  const days = daysUntil(dateStr);
  if (days < 0) return "expired";
  if (days <= 30) return "d30";
  if (days <= 60) return "d60";
  if (days <= 90) return "d90";
  return null;
}

// Severity ladder of alcance §3.11, used everywhere a deadline is shown:
// 90/60 neutral, 30 amber, 14/7/expired red.
export function severityFor(days) {
  if (days <= 14) return "red";
  if (days <= 30) return "amber";
  return "neutral";
}

export function daysLabel(days) {
  if (days < 0) return `${Math.abs(days)} day${days === -1 ? "" : "s"} overdue`;
  if (days === 0) return "Expires today";
  return `${days} day${days === 1 ? "" : "s"} left`;
}

export const STATUS_LABELS = { active: "Active", expiring: "Expiring", expired: "Expired" };
export const STATUS_TONES = { active: "green", expiring: "amber", expired: "red" };
