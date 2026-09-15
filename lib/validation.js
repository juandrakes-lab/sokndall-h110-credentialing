// Field rules, shared by the browser (live, as you type) and the server
// (again, on save) — and mirrored by CHECK constraints in the database, so a
// value that breaks a rule can't be stored whichever way it arrives.
//
// Each rule takes the raw value (and sometimes context) and returns an error
// message, or null when the value is acceptable. Empty values are the
// caller's business (required vs optional); rules only judge what's there.

import { isValidNpi } from "@/lib/nppes";
import { todayISO } from "@/lib/credentials";

export const digits = (v) => String(v ?? "").replace(/\D/g, "");

// NPI: 10 digits whose last one is a check digit (Luhn with the 80840 prefix).
export function npiError(v) {
  const d = digits(v);
  if (d.length !== 10) return "An NPI has exactly 10 digits.";
  if (!isValidNpi(d)) return "That isn't a real NPI — the last digit doesn't check out. One of the digits is mistyped.";
  return null;
}

// DEA registration number (21 CFR 1301): two letters and seven digits. The
// first letter is the registrant type; for a practitioner the second is the
// first letter of their last name (or 9 when registered under a business).
// The seventh digit is a check digit: (d1+d3+d5) + 2×(d2+d4+d6), last digit.
const DEA_TYPES = "ABCDEFGHJKLMPRSTUX";
export function deaError(v, lastName) {
  const s = String(v ?? "").trim().toUpperCase();
  if (!/^[A-Z][A-Z9]\d{7}$/.test(s)) return "A DEA number is 2 letters followed by 7 digits, e.g. AB1234563.";
  if (!DEA_TYPES.includes(s[0])) return `A DEA number can't start with ${s[0]}.`;
  const n = s.slice(2).split("").map(Number);
  const check = (n[0] + n[2] + n[4] + 2 * (n[1] + n[3] + n[5])) % 10;
  if (check !== n[6]) return "That isn't a real DEA number — the last digit doesn't check out. One of the digits is mistyped.";
  const initial = String(lastName ?? "").trim().toUpperCase()[0];
  if (initial && /[A-Z]/.test(initial) && s[1] !== "9" && s[1] !== initial) {
    return `The second letter of a DEA number is the first letter of the provider's last name (${initial}) — this one has ${s[1]}.`;
  }
  return null;
}

// Federal tax ID (EIN): 9 digits. The first two (the IRS "prefix") are never
// 00, 07–09, 17–19, 28–29, 49, 69–70, 78–79 or 89.
const BAD_EIN_PREFIX = new Set(["00", "07", "08", "09", "17", "18", "19", "28", "29", "49", "69", "70", "78", "79", "89"]);
export function tinError(v) {
  const d = digits(v);
  if (d.length !== 9) return "A TIN has 9 digits, e.g. 12-3456789.";
  if (BAD_EIN_PREFIX.has(d.slice(0, 2))) return `No EIN starts with ${d.slice(0, 2)} — check the first two digits.`;
  return null;
}

// CAQH ProView provider ID: digits only, up to 10.
export function caqhError(v) {
  const s = String(v ?? "").trim();
  if (!/^\d{1,10}$/.test(s)) return "A CAQH ID is only digits (usually 8).";
  return null;
}

// Health care provider taxonomy code: 10 characters, the last one X.
export function taxonomyError(v) {
  const s = String(v ?? "").trim().toUpperCase();
  if (!/^[0-9]{3}[0-9A-Z]{6}X$/.test(s)) return "A taxonomy code is 10 characters ending in X, e.g. 207Q00000X.";
  return null;
}

export function zipError(v) {
  const d = digits(v);
  if (d.length !== 5 && d.length !== 9) return "A ZIP code is 5 digits (or 9 with ZIP+4).";
  return null;
}

// US phone: 10 digits, area code and exchange never starting with 0 or 1.
export function phoneError(v) {
  let d = digits(v);
  if (d.length === 11 && d[0] === "1") d = d.slice(1);
  if (d.length !== 10) return "A US phone number has 10 digits, e.g. (555) 201-4433.";
  if (/[01]/.test(d[0]) || /[01]/.test(d[3])) return "That isn't a valid US phone number — check the area code.";
  return null;
}

export function emailError(v) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v ?? "").trim())) return "That email address doesn't look right.";
  return null;
}

// A license/policy number: letters, digits and the usual separators.
export function referenceError(v, label = "number") {
  const s = String(v ?? "").trim();
  if (s.length > 30) return `That ${label} is too long.`;
  if (!/^[A-Za-z0-9][A-Za-z0-9 .\-/]*$/.test(s)) return `A ${label} has only letters, digits, spaces, dots, dashes and slashes.`;
  return null;
}

export function isDate(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v ?? "")) return false;
  const [y, m, d] = v.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d && y >= 1900 && y <= 2100;
}

// Dates: `notFuture` for things that already happened (issued, submitted,
// contacted); expirations stay within a sane horizon.
export function dateError(v, { notFuture = false, maxYearsAhead = 15 } = {}) {
  if (!isDate(v)) return "Enter a real date.";
  const today = todayISO();
  if (notFuture && v > today) return "That's in the future — this date should have already happened.";
  const [y] = today.split("-").map(Number);
  if (v > `${y + maxYearsAhead}${today.slice(4)}`) return `That's more than ${maxYearsAhead} years away — check the year.`;
  return null;
}

export function orderError(earlier, later, message) {
  return isDate(earlier) && isDate(later) && later < earlier ? message : null;
}

// Display masks: what the input shows while the stored value stays digits.
export function formatTin(v) {
  const d = digits(v).slice(0, 9);
  return d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d;
}

export function formatPhone(v) {
  let d = digits(v);
  if (d.length === 11 && d[0] === "1") d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function formatZip(v) {
  const d = digits(v).slice(0, 9);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

// Collects the errors of a set of rules: { field: () => message | null }.
export function collect(rules) {
  const errors = {};
  for (const [field, rule] of Object.entries(rules)) {
    const message = rule();
    if (message) errors[field] = message;
  }
  return errors;
}
