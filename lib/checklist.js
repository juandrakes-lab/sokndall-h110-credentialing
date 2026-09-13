import { daysUntil } from "@/lib/credentials";

// What every payer asks for before an application can go out (alcance
// §3.10). Each item is worked out from what's already on file — nobody ticks
// boxes by hand.
export function checklistFor(provider, credentials, documents) {
  const hasDoc = (category) => documents.some((d) => d.category === category);
  const registry = provider.nppes_data?.status === "found" ? provider.nppes_data.record : null;
  const caqh = credentials.find(
    (c) => c.type === "caqh_attestation" && c.expiration_date && daysUntil(c.expiration_date) >= 0
  );

  return [
    { key: "license", label: "State license copy", done: hasDoc("license"), todo: "Upload a copy of the state license." },
    {
      key: "npi",
      label: "NPI verified",
      done: Boolean(provider.npi && registry && registry.kind === "individual"),
      todo: "Enter the provider's NPI and check it against the NPI Registry.",
    },
    { key: "w9", label: "W-9", done: hasDoc("w9"), todo: "Upload the W-9." },
    { key: "malpractice", label: "Malpractice certificate", done: hasDoc("malpractice"), todo: "Upload the certificate of insurance." },
    {
      key: "caqh",
      label: "CAQH attestation current",
      done: Boolean(caqh),
      todo: "Add the CAQH attestation date under Credentials (it must not be overdue).",
    },
    { key: "cv", label: "CV / work history", done: hasDoc("cv"), todo: "Upload the CV or work history." },
  ];
}
