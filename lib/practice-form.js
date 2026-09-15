import { fetchNppes } from "@/lib/nppes";
import { practiceErrors } from "@/lib/practice-rules";
import { snapshotFromLookup } from "@/lib/consistency";

// Reading and checking the practice form — shared by onboarding, Settings and
// "Add client" (Billing Co), where every client is a practice.

function text(formData, key) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

export function readPractice(formData) {
  const v = {
    legal_name: text(formData, "legal_name"),
    group_npi: text(formData, "group_npi")?.replace(/\D/g, "") || null,
    tin: text(formData, "tin")?.replace(/\D/g, "") || null,
  };
  for (const kind of ["service", "billing"]) {
    v[`${kind}_address_line1`] = text(formData, `${kind}_address_line1`);
    v[`${kind}_address_line2`] = text(formData, `${kind}_address_line2`);
    v[`${kind}_city`] = text(formData, `${kind}_city`);
    v[`${kind}_state`] = text(formData, `${kind}_state`)?.toUpperCase() ?? null;
    v[`${kind}_zip`] = text(formData, `${kind}_zip`)?.replace(/\D/g, "") || null;
  }
  if (formData.get("billing_same")) {
    for (const f of ["address_line1", "address_line2", "city", "state", "zip"]) {
      v[`billing_${f}`] = v[`service_${f}`];
    }
  }
  return v;
}

// The form's rules again (lib/practice-rules.js); the pay-to address was
// already copied from the service address when "same" is ticked.
export function validatePractice(v) {
  return practiceErrors({ ...v, billing_same: true, ...billingOnly(v) });
}

function billingOnly(v) {
  const same = ["address_line1", "address_line2", "city", "state", "zip"].every((f) => (v[`billing_${f}`] ?? null) === (v[`service_${f}`] ?? null));
  return same ? {} : { billing_same: false };
}

export async function nppesFields(npi) {
  if (!npi) return { nppes_data: null, nppes_checked_at: null };
  const snapshot = snapshotFromLookup(await fetchNppes(npi));
  return snapshot === undefined ? {} : { nppes_data: snapshot, nppes_checked_at: new Date().toISOString() };
}
