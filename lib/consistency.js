// Data consistency checks (alcance §3.9): name, NPI, address and TIN
// mismatches between what the user entered and the NPI Registry, and between
// providers and their practice. Mismatches on these fields are a documented
// cause of payers rejecting an application and restarting it.
//
// Works off the NPPES snapshot stored with each record (nppes_data), so a
// page render never waits on the registry.

import { isValidNpi } from "@/lib/nppes";

const ABBREVIATIONS = {
  STREET: "ST", AVENUE: "AVE", ROAD: "RD", DRIVE: "DR", BOULEVARD: "BLVD",
  SUITE: "STE", LANE: "LN", COURT: "CT", PLACE: "PL", HIGHWAY: "HWY",
  ROUTE: "RT", RTE: "RT", PARKWAY: "PKWY", CIRCLE: "CIR", TERRACE: "TER",
  CENTER: "CTR", FLOOR: "FL", BUILDING: "BLDG", NORTH: "N", SOUTH: "S",
  EAST: "E", WEST: "W",
};

function normLine(value) {
  return (value ?? "")
    .toUpperCase()
    .replace(/[.,#]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ABBREVIATIONS[word] ?? word)
    .join(" ");
}

function normName(value) {
  return (value ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function formatAddress(a) {
  if (!a) return "";
  return [a.line1, a.line2, [a.city, a.state].filter(Boolean).join(", "), a.zip]
    .filter(Boolean)
    .join(", ");
}

export function practiceServiceAddress(practice) {
  if (!practice?.service_address_line1) return null;
  return {
    line1: practice.service_address_line1,
    line2: practice.service_address_line2 ?? "",
    city: practice.service_city ?? "",
    state: practice.service_state ?? "",
    zip: practice.service_zip ?? "",
  };
}

export function sameAddress(a, b) {
  return normLine(a.line1) === normLine(b.line1) && (a.zip ?? "").slice(0, 5) === (b.zip ?? "").slice(0, 5);
}

const error = (title, detail) => ({ severity: "error", title, detail });
const warning = (title, detail) => ({ severity: "warning", title, detail });

function registryRecord(row) {
  return row?.nppes_data?.status === "found" ? row.nppes_data.record : null;
}

// `credentials` (optional): the provider's credentials, to compare each state
// license number with the one declared in the NPI Registry (alcance §3.9,
// rev. 2026-09-18).
export function providerIssues(provider, practice, siblings = [], credentials = []) {
  const issues = [];
  const npi = provider.npi;

  if (!npi) {
    issues.push(warning("No NPI on file", "Payers reject enrollment applications without the provider's individual NPI."));
    return issues;
  }
  if (!isValidNpi(npi)) {
    issues.push(error("NPI fails its check digit", `${npi} can't be a real NPI — one of the digits is mistyped.`));
    return issues;
  }
  if (practice?.group_npi && npi === practice.group_npi) {
    issues.push(error("This is the practice's group NPI", "Enter the provider's own individual (Type 1) NPI here."));
  }
  const twin = siblings.find((s) => s.id !== provider.id && s.npi === npi);
  if (twin) {
    issues.push(error("Duplicate NPI", `${twin.first_name} ${twin.last_name} has the same NPI.`));
  }

  if (!provider.nppes_data) {
    issues.push(warning("Not checked against the NPI Registry yet", "Use “Check again” to compare this provider with the federal record."));
    return issues;
  }
  if (provider.nppes_data.status === "not_found") {
    issues.push(error("NPI not found in the NPI Registry", `No federal record exists for ${npi}.`));
    return issues;
  }

  const rec = registryRecord(provider);
  if (!rec) return issues;

  if (rec.kind === "organization") {
    issues.push(error("This NPI belongs to an organization", `The NPI Registry lists ${npi} as ${rec.organizationName}, a Type 2 NPI.`));
    return issues;
  }
  if (!rec.active) {
    issues.push(error("NPI is deactivated", "The NPI Registry lists this NPI as inactive."));
  }
  if (normName(provider.last_name) !== normName(rec.lastName)) {
    issues.push(error("Last name doesn't match the NPI Registry", `You have “${provider.last_name}”; the registry has “${rec.lastName}”.`));
  }
  if (normName(provider.first_name) !== normName(rec.firstName)) {
    issues.push(error("First name doesn't match the NPI Registry", `You have “${provider.first_name}”; the registry has “${rec.firstName}”.`));
  }
  if (provider.taxonomy_code && rec.taxonomy && provider.taxonomy_code.toUpperCase() !== rec.taxonomy.code) {
    issues.push(warning("Taxonomy differs from the NPI Registry", `You have ${provider.taxonomy_code}; the registry's primary taxonomy is ${rec.taxonomy.code} (${rec.taxonomy.desc}).`));
  }
  const service = practiceServiceAddress(practice);
  if (service && rec.location && !sameAddress(service, rec.location)) {
    issues.push(warning("Practice location differs from your service address", `NPI Registry: ${formatAddress(rec.location)}. Your practice: ${formatAddress(service)}.`));
  }

  // State license numbers against what the provider declared per state.
  const declared = (provider.nppes_data?.record?.taxonomies ?? [provider.nppes_data?.record?.taxonomy].filter(Boolean)).filter((t) => t?.state && t?.license);
  const clean = (v) => String(v ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  for (const c of credentials.filter((x) => x.type === "state_license" && x.state && x.number)) {
    const inState = declared.filter((t) => t.state === c.state);
    if (inState.length && !inState.some((t) => clean(t.license) === clean(c.number))) {
      issues.push(
        error(
          `${c.state} license number doesn't match the NPI Registry`,
          `On file: ${c.number}. The provider declared ${inState.map((t) => t.license).join(" or ")} for ${c.state} in the NPI Registry.`
        )
      );
    }
  }

  return issues;
}

export function practiceIssues(practice) {
  const issues = [];
  if (!practice) return issues;

  if (!practice.tin) {
    issues.push(warning("No TIN on file", "Every enrollment application asks for the practice's tax ID."));
  }
  if (!practice.service_address_line1) {
    issues.push(warning("No service address on file", "Payers match the service address against the NPI Registry."));
  }

  const npi = practice.group_npi;
  if (!npi) {
    issues.push(warning("No group NPI on file", "If this practice bills as a group, payers need its Type 2 (organization) NPI."));
    return issues;
  }
  if (!isValidNpi(npi)) {
    issues.push(error("Group NPI fails its check digit", `${npi} can't be a real NPI — one of the digits is mistyped.`));
    return issues;
  }
  if (!practice.nppes_data) {
    issues.push(warning("Not checked against the NPI Registry yet", "Use “Check again” to compare the practice with the federal record."));
    return issues;
  }
  if (practice.nppes_data.status === "not_found") {
    issues.push(error("Group NPI not found in the NPI Registry", `No federal record exists for ${npi}.`));
    return issues;
  }

  const rec = registryRecord(practice);
  if (!rec) return issues;

  if (rec.kind === "individual") {
    issues.push(error("This NPI belongs to an individual", `The NPI Registry lists ${npi} as ${rec.firstName} ${rec.lastName}, a Type 1 NPI. The practice needs its organization NPI.`));
    return issues;
  }
  if (!rec.active) {
    issues.push(error("Group NPI is deactivated", "The NPI Registry lists this NPI as inactive."));
  }
  if (normName(practice.legal_name) !== normName(rec.organizationName)) {
    issues.push(error("Legal name doesn't match the NPI Registry", `You have “${practice.legal_name}”; the registry has “${rec.organizationName}”.`));
  }
  const service = practiceServiceAddress(practice);
  if (service && rec.location && !sameAddress(service, rec.location)) {
    issues.push(error("Service address doesn't match the NPI Registry", `NPI Registry: ${formatAddress(rec.location)}. Yours: ${formatAddress(service)}.`));
  }

  return issues;
}

// What to store in nppes_data after a lookup, or undefined to leave the
// previous snapshot alone (registry unreachable, or no NPI to check).
export function snapshotFromLookup(result) {
  if (result.ok) return { status: "found", record: result.record };
  if (result.reason === "not_found") return { status: "not_found" };
  return undefined;
}
