// What each credential type must satisfy — used live by CredentialForm and
// again by the server before saving.
import { CREDENTIAL_TYPES } from "@/lib/credentials";
import { US_STATE_CODES } from "@/lib/us-states";
import { collect, dateError, deaError, orderError, referenceError } from "@/lib/validation";

// The 24 ABMS member boards plus the AOA's specialty boards, as payers list
// them. "Other" keeps a free-text board for the rare rest.
export const CERTIFYING_BOARDS = [
  "American Board of Allergy and Immunology",
  "American Board of Anesthesiology",
  "American Board of Colon and Rectal Surgery",
  "American Board of Dermatology",
  "American Board of Emergency Medicine",
  "American Board of Family Medicine",
  "American Board of Internal Medicine",
  "American Board of Medical Genetics and Genomics",
  "American Board of Neurological Surgery",
  "American Board of Nuclear Medicine",
  "American Board of Obstetrics and Gynecology",
  "American Board of Ophthalmology",
  "American Board of Orthopaedic Surgery",
  "American Board of Otolaryngology – Head and Neck Surgery",
  "American Board of Pathology",
  "American Board of Pediatrics",
  "American Board of Physical Medicine and Rehabilitation",
  "American Board of Plastic Surgery",
  "American Board of Preventive Medicine",
  "American Board of Psychiatry and Neurology",
  "American Board of Radiology",
  "American Board of Surgery",
  "American Board of Thoracic Surgery",
  "American Board of Urology",
  "American Osteopathic Board (AOA)",
  "American Academy of Nurse Practitioners Certification Board (AANPCB)",
  "American Nurses Credentialing Center (ANCC)",
  "National Commission on Certification of Physician Assistants (NCCPA)",
];

// Malpractice limits as payers ask for them: per claim / aggregate.
export const COVERAGE_LIMITS = ["$100K", "$200K", "$250K", "$500K", "$1M", "$2M", "$3M", "$4M", "$5M", "$6M"];
const LIMIT_VALUE = Object.fromEntries(COVERAGE_LIMITS.map((l) => [l, Number(l.replace(/[$KM]/g, "")) * (l.endsWith("M") ? 1e6 : 1e3)]));

export function splitCoverage(coverage) {
  const [perClaim = "", aggregate = ""] = String(coverage ?? "").split("/").map((s) => s.trim());
  return { perClaim: COVERAGE_LIMITS.includes(perClaim) ? perClaim : "", aggregate: COVERAGE_LIMITS.includes(aggregate) ? aggregate : "" };
}

// CSV coverage as people write it — "$1M/$3M", "1,000,000 / 3,000,000",
// "1M-3M" — to the form's "$1M / $3M"; null when it isn't two listed limits.
export function normalizeCoverage(raw) {
  const parts = String(raw ?? "").split(/\s*(?:\/|-|–|to)\s*/i).filter(Boolean);
  if (parts.length !== 2) return null;
  const label = (s) => {
    const m = s.replace(/[$,\s]/g, "").toUpperCase().match(/^(\d+(?:\.\d+)?)(K|M)?$/);
    if (!m) return null;
    const value = Number(m[1]) * (m[2] === "M" ? 1e6 : m[2] === "K" ? 1e3 : 1);
    return COVERAGE_LIMITS.find((l) => LIMIT_VALUE[l] === value) ?? null;
  };
  const [a, b] = parts.map(label);
  return a && b ? `${a} / ${b}` : null;
}

export function joinCoverage(perClaim, aggregate) {
  return perClaim && aggregate ? `${perClaim} / ${aggregate}` : "";
}

export function credentialErrors(type, v, { lastName } = {}) {
  const config = CREDENTIAL_TYPES[type];
  if (!config) return { type: "Choose a credential type." };
  const uses = (f) => config.fields.includes(f);
  const required = (f) => config.required?.includes(f);
  const label = (f) => config.labels[f];

  return collect({
    custom_name: () => {
      if (!uses("custom_name")) return null;
      const name = v.custom_name?.trim() ?? "";
      if (!name) return "Say what this credential is.";
      if (name.length < 2 || name.length > 80) return "Between 2 and 80 characters.";
      return null;
    },
    state: () =>
      uses("state") && (v.state ? (!US_STATE_CODES.includes(v.state) ? "Choose a state from the list." : null) : required("state") ? `Choose the ${label("state").toLowerCase()}.` : null),
    number: () => {
      if (!uses("number")) return null;
      if (!v.number?.trim()) return required("number") ? `Enter the ${label("number").toLowerCase()}.` : null;
      return type === "dea" ? deaError(v.number, lastName) : referenceError(v.number, label("number").toLowerCase());
    },
    issuer: () => (uses("issuer") && required("issuer") && !v.issuer?.trim() ? `Enter the ${label("issuer").toLowerCase()}.` : null),
    coverage: () => {
      if (!uses("coverage") || !v.coverage) return null;
      const { perClaim, aggregate } = splitCoverage(v.coverage);
      if (!perClaim || !aggregate) return "Choose both limits — per claim and aggregate.";
      if (LIMIT_VALUE[aggregate] < LIMIT_VALUE[perClaim]) return "The aggregate limit can't be lower than the per-claim limit.";
      return null;
    },
    issue_date: () => {
      if (!uses("issue_date")) return null;
      if (!v.issue_date) return required("issue_date") ? `Enter the ${label("issue_date").toLowerCase()} date.` : null;
      return dateError(v.issue_date, { notFuture: true });
    },
    expiration_date: () => {
      if (!uses("expiration_date")) return null;
      if (!v.expiration_date) return required("expiration_date") ? `Enter the ${label("expiration_date").toLowerCase()} date.` : null;
      return (
        dateError(v.expiration_date) ??
        orderError(v.issue_date, v.expiration_date, `${label("expiration_date")} can't be before ${label("issue_date")?.toLowerCase()}.`)
      );
    },
  });
}
