import { daysUntil } from "@/lib/credentials";

// What every payer asks for before an application can go out (alcance
// §3.10). Each item is worked out from what's already on file — nobody ticks
// boxes by hand.
//
// rev. 2026-09-18: a credential-backed item is ready only if the credential is
// current AND its copy was uploaded after the latest renewal. A license PDF
// on file doesn't make an expired license acceptable, and the copy of last
// year's policy isn't the copy of this year's.
//
//   credentials  [{ type, expiration_date, renewed_at }]
//   documents    [{ category, created_at }]
export function checklistFor(provider, credentials, documents) {
  const docsOf = (category) => documents.filter((d) => d.category === category);
  const hasDoc = (category) => docsOf(category).length > 0;
  const registry = provider.nppes_data?.status === "found" ? provider.nppes_data.record : null;

  const current = (c) => !c.expiration_date || daysUntil(c.expiration_date) >= 0;
  // A copy counts for a credential when it was uploaded after its last renewal.
  const copyAfter = (category, credential) =>
    docsOf(category).some((d) => !credential?.renewed_at || new Date(d.created_at) >= new Date(credential.renewed_at));

  // One item backed by a credential of `type` and a document of `category`.
  function backed({ key, label, type, category, noun }) {
    const ofType = credentials.filter((c) => c.type === type);
    const live = ofType.filter(current);
    if (ofType.length === 0) {
      return { key, label, done: false, todo: `Add the ${noun} under Credentials, then upload its copy.` };
    }
    if (live.length === 0) {
      return { key, label, done: false, warn: true, todo: `The ${noun} on file is expired. Renew it — enter the new expiration date — and upload the new copy.` };
    }
    if (!hasDoc(category)) {
      return { key, label, done: false, todo: `Upload a copy of the ${noun}.` };
    }
    if (!live.some((c) => copyAfter(category, c))) {
      return { key, label, done: false, warn: true, todo: `The ${noun} was renewed — upload the new copy. The one on file is the old one.` };
    }
    return { key, label, done: true };
  }

  const caqhOnFile = credentials.some((c) => c.type === "caqh_attestation");
  const caqh = credentials.find((c) => c.type === "caqh_attestation" && c.expiration_date && daysUntil(c.expiration_date) >= 0);

  return [
    backed({ key: "license", label: "State license, current", type: "state_license", category: "license", noun: "state license" }),
    {
      key: "npi",
      label: "NPI verified",
      done: Boolean(provider.npi && registry && registry.kind === "individual"),
      todo: "Enter the provider's NPI and check it against the NPI Registry.",
    },
    { key: "w9", label: "W-9", done: hasDoc("w9"), todo: "Upload the W-9." },
    backed({ key: "malpractice", label: "Malpractice insurance, current", type: "malpractice", category: "malpractice", noun: "malpractice policy" }),
    {
      key: "caqh",
      label: "CAQH attestation current",
      done: Boolean(caqh),
      warn: caqhOnFile && !caqh,
      todo: caqhOnFile ? "The CAQH attestation is overdue. Re-attest in CAQH, then update the date under Credentials." : "Add the CAQH attestation date under Credentials.",
    },
    { key: "cv", label: "CV / work history", done: hasDoc("cv"), todo: "Upload the CV or work history." },
  ];
}
