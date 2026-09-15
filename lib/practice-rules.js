// What a practice record must satisfy — used live by PracticeForm and again
// on save (lib/practice-form.js).
import { US_STATE_CODES } from "@/lib/us-states";
import { collect, npiError, tinError, zipError } from "@/lib/validation";

const ADDRESS = ["address_line1", "city", "state", "zip"];

// An address is optional, but once started it has to be complete — a payer
// can't use a street without a ZIP.
function addressRules(v, kind) {
  const f = (name) => v[`${kind}_${name}`];
  const started = [...ADDRESS, "address_line2"].some((name) => String(f(name) ?? "").trim());
  const need = (name, message) => () => (started && !String(f(name) ?? "").trim() ? message : null);
  return {
    [`${kind}_address_line1`]: need("address_line1", "Enter the street address."),
    [`${kind}_city`]: need("city", "Enter the city."),
    [`${kind}_state`]: () =>
      started && !f("state") ? "Choose the state." : f("state") && !US_STATE_CODES.includes(f("state")) ? "Choose a state from the list." : null,
    [`${kind}_zip`]: () => (started && !f("zip") ? "Enter the ZIP code." : f("zip") ? zipError(f("zip")) : null),
  };
}

export function practiceErrors(v) {
  return collect({
    legal_name: () => (!String(v.legal_name ?? "").trim() ? "Enter the practice's legal name." : null),
    group_npi: () => (v.group_npi ? npiError(v.group_npi) : null),
    tin: () => (v.tin ? tinError(v.tin) : null),
    ...addressRules(v, "service"),
    ...(v.billing_same ? {} : addressRules(v, "billing")),
  });
}
