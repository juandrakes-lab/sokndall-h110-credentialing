// NPI Registry (NPPES) lookups — CMS's official public API: no auth, free,
// updated daily (alcance §3.9). Used to propose and to cross-check what the
// user typed; it never overwrites a stored value on its own.

const ENDPOINT = "https://npiregistry.cms.hhs.gov/api/";

// NPI check digit: Luhn over "80840" + the first nine digits.
export function isValidNpi(npi) {
  if (!/^\d{10}$/.test(npi ?? "")) return false;
  const digits = `80840${npi.slice(0, 9)}`;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10 === Number(npi[9]);
}

function normalizeAddress(a) {
  if (!a) return null;
  return {
    line1: a.address_1 || "",
    line2: a.address_2 || "",
    city: a.city || "",
    state: a.state || "",
    zip: (a.postal_code || "").slice(0, 5),
  };
}

function normalize(result) {
  const basic = result.basic ?? {};
  const primary =
    (result.taxonomies ?? []).find((t) => t.primary) ?? (result.taxonomies ?? [])[0] ?? null;
  const addresses = result.addresses ?? [];

  return {
    npi: String(result.number),
    kind: result.enumeration_type === "NPI-2" ? "organization" : "individual",
    firstName: basic.first_name ?? null,
    lastName: basic.last_name ?? null,
    organizationName: basic.organization_name ?? null,
    active: (basic.status ?? "A") === "A",
    taxonomy: primary
      ? { code: primary.code, desc: primary.desc, state: primary.state ?? null, license: primary.license ?? null }
      : null,
    // Every taxonomy the provider registered, each with the state license
    // they declared for it — what payers compare against.
    taxonomies: (result.taxonomies ?? []).map((t) => ({
      code: t.code,
      desc: t.desc,
      primary: Boolean(t.primary),
      state: t.state || null,
      license: t.license || null,
    })),
    location: normalizeAddress(addresses.find((a) => a.address_purpose === "LOCATION")),
    mailing: normalizeAddress(addresses.find((a) => a.address_purpose === "MAILING")),
    fetchedAt: new Date().toISOString(),
  };
}

// → { ok: true, record } | { ok: false, reason: "invalid" | "not_found" | "unavailable" }
export async function fetchNppes(npi) {
  const clean = (npi ?? "").replace(/\D/g, "");
  if (!isValidNpi(clean)) return { ok: false, reason: "invalid" };

  try {
    const res = await fetch(`${ENDPOINT}?version=2.1&number=${clean}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { ok: false, reason: "unavailable" };
    const json = await res.json();
    if (!json.result_count || !json.results?.length) return { ok: false, reason: "not_found" };
    return { ok: true, record: normalize(json.results[0]) };
  } catch {
    return { ok: false, reason: "unavailable" };
  }
}

export const NPPES_FAILURE_MESSAGES = {
  invalid: "That isn't a valid NPI — an NPI is 10 digits and the last one is a check digit.",
  not_found: "No record with this NPI in the NPI Registry.",
  unavailable: "The NPI Registry didn't respond. Try again in a minute.",
};

// NPPES stores names in capitals; for proposing a value, "JUDY" -> "Judy".
export function titleCase(value) {
  if (!value) return "";
  return value
    .toLowerCase()
    .replace(/(^|[\s\-'])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
}
