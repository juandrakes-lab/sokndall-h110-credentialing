// What a provider record must satisfy — used live by ProviderForm and again by
// the server actions before saving.
import { caqhError, collect, dateError, digits, emailError, npiError, phoneError, taxonomyError } from "@/lib/validation";

export function providerErrors(v) {
  return collect({
    first_name: () => (!v.first_name?.trim() ? "Enter a first name." : null),
    last_name: () => (!v.last_name?.trim() ? "Enter a last name." : null),
    npi: () => (v.npi ? npiError(v.npi) : null),
    caqh_id: () => (v.caqh_id ? caqhError(v.caqh_id) : null),
    taxonomy_code: () => (v.taxonomy_code ? taxonomyError(v.taxonomy_code) : null),
    email: () => (v.email ? emailError(v.email) : null),
    phone: () => (v.phone && digits(v.phone) ? phoneError(v.phone) : null),
    start_date: () => (v.start_date ? dateError(v.start_date, { maxYearsAhead: 1 }) : null),
  });
}
