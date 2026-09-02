// /payer-enrollment/cigna — structured content for the article. Running
// prose lives in page.jsx.
//
// V2 update: the copywriter's review converted both the week 3–24 playbook
// and the closing error list into flowing prose (the "encabezado en negrita
// + explicación" pattern was the dominant AI-writing tell across this page),
// so PLAYBOOK and ERRORS no longer exist as data here — that copy is inline
// in page.jsx. MEDICAL_STAGES and EVERNORTH_STEPS are unchanged; those stay
// lists because they are sequences someone follows in order, not a set of
// parallel explanations.
//
// Terminology: payer, provider, effective date, re-credentialing (never
// renewal), CAQH Provider Data Portal.

export const CONTENTS = [
  { id: "process", label: "The process, in order" },
  { id: "timelines", label: "Stated and observed" },
  { id: "closed", label: "When you are told the network is closed" },
  { id: "playbook", label: "What to do during the wait" },
  { id: "errors", label: "What sends you back" },
];

// The medical/dental path: four stages people often stop tracking after the
// first one clears.
export const MEDICAL_STAGES = [
  "CAQH Provider Data Portal complete and attested, application submitted through the portal or ProviderSource",
  "Credentialing",
  "Contracting",
  "Directory listing, then EFT/ERA setup",
];

export const EVERNORTH_STEPS = [
  {
    b: "Confirm the network is open",
    t: "for your license type and location by calling Evernorth directly before applying.",
  },
  {
    b: "CAQH profile fully attested within 120 days",
    t: "and set to authorize Evernorth.",
  },
  {
    b: "Submit the Evernorth-specific application",
    t: "with CV, state license, malpractice certificate, W-9, NPI and tax ID, matching the CAQH profile exactly.",
  },
  { b: "Primary source verification.", t: "" },
  { b: "Sign the provider agreement.", t: "" },
  { b: "Receive a confirmed participation effective date.", t: "" },
];
