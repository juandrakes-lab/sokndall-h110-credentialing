// /payer-enrollment/aetna — structured content for the article.
// Running prose lives in page.jsx.
// Terminology: payer, provider, effective date, re-credentialing (never
// renewal), CAQH Provider Data Portal.

export const CONTENTS = [
  { id: "process", label: "The process, in order" },
  { id: "documents", label: "What Aetna needs from you" },
  { id: "timelines", label: "Stated and observed" },
  { id: "npi-mismatch", label: "The NPI mismatch" },
  { id: "playbook", label: "What to do while it is in review" },
  { id: "errors", label: "Other things that stop an Aetna application" },
];

export const STEPS = [
  {
    b: "CAQH profile complete and current,",
    t: "with Aetna designated as an authorized health plan so its credentialing system can pull your data. Without that authorization, nothing moves — the application sits until the CAQH side is fixed.",
  },
  {
    b: "A submitted Request for Participation form,",
    t: "available on Aetna's provider site, specific to your provider type (medical, behavioral health, or dental has its own path).",
  },
  {
    b: "Aetna reviews the request for network need",
    t: "in your specialty and geography, and typically responds within 45 days on whether you can proceed. This is a separate gate from credentialing itself, and it is the point where “the network is closed” gets said, accurately or not.",
    linkHref: "/payer-enrollment/cigna#closed",
    linkText: "Cigna's guide covers what that phrase can actually mean, and how to get a real answer in writing.",
  },
  {
    b: "Once cleared to proceed, contracting and credentialing run in parallel-but-separate tracks.",
    t: "Aetna pulls your CAQH profile for primary source verification (licensure, malpractice, board status). Credentialing itself commonly takes 60 to 90 days after a complete, clean packet is received — longer if anything is missing. Contracting is a separate legal step; you need both finished, and an effective date confirmed, before billing.",
  },
];

// The check that catches a wrongly loaded record in week one. A small table,
// because it is a set of combinations and a result for each.
export const COMBOS = [
  { cb: "Group NPI (Type 2) + group TIN", result: "Nothing returned" },
  { cb: "Individual NPI (Type 1) + group TIN", result: "Benefits returned" },
  { cb: "Individual NPI (Type 1) + individual TIN", result: "Nothing returned" },
];

export const PLAYBOOK = [
  {
    lb: "Week 2",
    b: "Confirm receipt.",
    t: "Record the reference number and the name of the person who gave it to you.",
  },
  {
    lb: "Weeks 3 – 8",
    b: "Contact every three to four weeks.",
    t: "Ask what is outstanding, not whether it is approved.",
  },
  {
    lb: "At a dead end by phone",
    b: "Escalate in writing, to every channel at once.",
    t: "That is what has worked for practices who got stuck: a single written escalation across fax, email, PO box and portal, referencing every prior attempt by date.",
  },
  { lb: "Throughout", b: "Log everything.", t: "Date, name, reference, what they said." },
  {
    lb: "On approval",
    b: "Verify the loaded record",
    t: "against every NPI/TIN combination before you rely on it.",
  },
];

export const ERRORS = [
  { b: "Name mismatch", t: "across license, W-9, CAQH profile and application." },
  { b: "CAQH profile not attested,", t: "or Aetna not authorized to view it." },
  { b: "A service location", t: "in the application not matching the CAQH profile." },
  {
    b: "Panel capacity.",
    t: "Some specialties and geographies are closed to new participation, and a provider who bought a practice from a departing participating provider does not automatically inherit that spot — providers have been declined on capacity grounds after assuming they would.",
  },
];
