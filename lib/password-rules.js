// Password rules for new passwords (sign-up and reset). Length first, as NIST
// SP 800-63B recommends, plus a letter and a digit; no forced symbols, no
// forced rotation. Supabase Auth enforces the same minimum on its side
// (dashboard setting, launch checklist) so the rule holds even off this page.
export const MIN_PASSWORD = 12;

export function passwordChecks(password, { email = "", name = "" } = {}) {
  const p = String(password ?? "");
  const lower = p.toLowerCase();
  const mailbox = String(email).split("@")[0].toLowerCase();
  const firstName = String(name).trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  return [
    { key: "length", label: `At least ${MIN_PASSWORD} characters`, ok: p.length >= MIN_PASSWORD },
    { key: "letter", label: "A letter", ok: /[a-z]/i.test(p) },
    { key: "digit", label: "A number", ok: /\d/.test(p) },
    {
      key: "personal",
      label: "Not your email or name",
      ok: p.length > 0 && !(mailbox.length >= 3 && lower.includes(mailbox)) && !(firstName.length >= 3 && lower.includes(firstName)),
    },
  ];
}

export const passwordOk = (password, context) => passwordChecks(password, context).every((c) => c.ok);

// TERMS_VERSION is stamped on each sign-up with the acceptance time. It is the
// effective date of the text in lib/legal.js; bump both together whenever the
// agreement changes materially.
export const TERMS_VERSION = "2026-09-22";
