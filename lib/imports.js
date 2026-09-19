// Column definitions for the CSV importers (alcance §3.14). `aliases` are the
// header spellings people's spreadsheets actually use.

export const PROVIDER_IMPORT_FIELDS = [
  { key: "first_name", label: "First name", required: true, aliases: ["first", "given name", "firstname", "provider first name", "provider first"] },
  { key: "last_name", label: "Last name", required: true, aliases: ["last", "surname", "family name", "lastname", "provider last name", "provider last"] },
  { key: "npi", label: "NPI", aliases: ["npi number", "individual npi", "npi #"] },
  { key: "caqh_id", label: "CAQH ID", aliases: ["caqh", "caqh number", "caqh #"] },
  { key: "specialty", label: "Specialty", aliases: ["speciality"] },
  { key: "taxonomy_code", label: "Taxonomy code", aliases: ["taxonomy"] },
  { key: "email", label: "Email", aliases: ["e-mail", "email address"] },
  { key: "phone", label: "Phone", aliases: ["phone number", "telephone"] },
  { key: "start_date", label: "Start date", aliases: ["hire date", "date hired", "start"] },
  { key: "notes", label: "Notes", aliases: ["comments"] },
];

export const CREDENTIAL_IMPORT_FIELDS = [
  { key: "provider_npi", label: "Provider NPI", aliases: ["npi"] },
  { key: "provider_first_name", label: "Provider first name", aliases: ["first name", "first"] },
  { key: "provider_last_name", label: "Provider last name", aliases: ["last name", "last", "surname"] },
  { key: "type", label: "Credential type", required: true, aliases: ["credential", "type of credential", "document type"] },
  { key: "custom_name", label: "Credential name (for Other)", aliases: ["credential name", "certification", "certification name", "name of credential"] },
  { key: "state", label: "State", aliases: ["license state", "st"] },
  { key: "number", label: "Number", aliases: ["license number", "license #", "dea number", "policy number", "certificate number"] },
  { key: "issuer", label: "Carrier / board", aliases: ["carrier", "insurance carrier", "board", "certifying board", "issuer"] },
  { key: "coverage", label: "Coverage amount", aliases: ["coverage", "limits"] },
  { key: "issue_date", label: "Issued / attested on", aliases: ["issue date", "issued", "attestation date", "certified on", "effective date"] },
  { key: "expiration_date", label: "Expires", aliases: ["expiration", "expiration date", "exp date", "expiry", "expires on", "renewal date"] },
  { key: "notes", label: "Notes", aliases: ["comments"] },
];

const TYPE_ALIASES = {
  state_license: ["state license", "license", "medical license", "professional license", "statelicense"],
  dea: ["dea", "dea registration", "dea license"],
  malpractice: ["malpractice", "malpractice insurance", "liability", "professional liability", "coi", "certificate of insurance"],
  board_cert: ["board certification", "board", "board cert", "boardcert", "specialty board"],
  caqh_attestation: ["caqh", "caqh attestation", "caqh reattestation", "caqh re-attestation"],
  cds: ["cds", "state cds", "cds registration", "controlled substance", "controlled substances registration", "state controlled substance"],
  other: ["other"],
};

const norm = (s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");

export function credentialTypeFrom(value) {
  const v = norm(value);
  if (!v) return null;
  for (const [key, aliases] of Object.entries(TYPE_ALIASES)) {
    if (norm(key) === v || aliases.some((a) => norm(a) === v)) return key;
  }
  return null;
}
