// /payer-enrollment/ — the cluster hub, as an article. V2 copy (full rewrite,
// ~2,100 words vs the original ~550): every section now contains at least one
// thing the reader could not have worked out on their own.
//
// Terminology is locked across the cluster: payer (not insurance company),
// provider (not doctor), effective date (not approval date), revalidation for
// Medicare and re-credentialing for commercial payers (never renewal), and
// CAQH Provider Data Portal (never ProView).

export const CONTENTS = [
  { id: "difference", label: "Credentialing and enrollment are not the same thing" },
  { id: "stages", label: "The stages, and where the time goes" },
  { id: "seeing-patients", label: "Can you see patients while you wait?" },
  { id: "your-job", label: "The part that is actually your job" },
  { id: "errors", label: "The errors that restart the whole thing" },
  { id: "guides", label: "Payer-specific guides" },
];

// Six stages, wildly uneven — each explains what happens on the payer's side,
// not just how long it takes. Feeds both the numbered list and the bar chart
// at the end of the section.
export const STAGES = [
  {
    b: "Preparation.",
    t: "Gathering documents, getting the CAQH profile complete and attested, authorizing that specific payer to view it. Days, if your paperwork is current. Weeks if a malpractice certificate expired and you have to chase your carrier for a new one.",
  },
  {
    b: "Submission.",
    t: "The application goes in through the payer's portal, through CAQH, through PECOS for Medicare, through a clearinghouse, or on a delegated roster if you are part of a group that has that arrangement. This is the part everyone thinks of as “doing the enrollment,” and it takes an afternoon.",
  },
  {
    b: "Acknowledgement.",
    t: "The payer confirms they received it. Days to weeks. Sometimes never, unless you call and ask. This is the first place applications quietly die, because a submission that was never logged looks identical, from your side, to one sitting in a queue.",
  },
  {
    b: "Verification and review.",
    t: "The long one. Weeks to months. The payer is checking your license with the issuing board, confirming your malpractice coverage with the carrier, verifying your work history, running you against exclusion databases. None of this is visible to you, and most payers will not tell you which step you are on. What you can find out, if you ask precisely, is whether anything is outstanding.",
  },
  {
    b: "Contracting.",
    t: "The participation agreement. Some payers send this early, before verification even finishes, and some send it at the very end. That variation matters more than it sounds, because providers routinely treat the arrival of a contract as a sign that they are nearly done. With some payers it is. With others it means the process has barely started.",
  },
  {
    b: "Effective date and loading.",
    t: "Approval and loading are two separate events, and the gap between them is where a lot of denied claims live. You can have a confirmed effective date of March 1 and still have claims reject on March 15 because the record was not loaded into the claims processing system until March 20. The date is retroactive; the system's knowledge of it is not.",
  },
];

// The bar chart at the end of Section 3 — illustrative weights, not measured
// day counts. The point is the one the copy makes: stage 4 dwarfs the rest.
export const STAGE_CHART = [
  { label: "Preparation", range: "Days to weeks", weight: 0.16 },
  { label: "Submission", range: "An afternoon", weight: 0.05, tiny: true },
  { label: "Acknowledgement", range: "Days to weeks", weight: 0.18 },
  { label: "Verification & review", range: "Weeks to months", weight: 1, long: true },
  { label: "Contracting", range: "Varies by payer", weight: 0.22 },
  { label: "Effective date & loading", range: "Days to weeks (gap)", weight: 0.14 },
];

export const ERRORS = [
  {
    b: "A legal name",
    t: "that does not match exactly across your license, your W-9, your CAQH profile and the application. A middle initial in one place and not another is enough. This is the most common one and the most avoidable.",
  },
  {
    b: "An individual NPI",
    t: "where the group NPI belongs, or the reverse. Type 1 is you, Type 2 is the organization, and they have different roles on the form. Load them wrong and the application may go through and then pay out-of-network for months before anyone catches it.",
    linkHref: "/payer-enrollment/aetna",
    linkText: "The Aetna guide below covers how to detect this specific failure in the first week rather than the eighth.",
  },
  {
    b: "A TIN or EIN change.",
    t: "If your practice's tax ID changes, enrollment generally has to be resubmitted to every payer, one at a time. Practices have paid for a full credentialing engagement and then paid again to redo it after restructuring.",
  },
  {
    b: "A service address",
    t: "in the application that does not match the address in the CAQH profile. The payer is matching those two records against each other, and a location listed in one but not the other reads as an inconsistency.",
  },
  {
    b: "An expired document",
    t: "inside the CAQH profile. You cannot attest to a profile with expired documents, and an unattested profile blocks the application. The one that catches people most often is malpractice coverage, particularly after leaving an employer whose policy the profile was built on.",
  },
];

// Section 7 — the long-form hook for each guide, as it reads in running
// prose. clusterData.js carries a shorter version of the same hook for the
// sidebar and the end-of-article cards.
export const GUIDES = [
  {
    name: "Medicare",
    href: "/payer-enrollment/medicare",
    hook: "PECOS, the current CMS-855 forms, which one applies to your situation, and what revalidation does to your payments when it goes past due. Also covers the CMS-855R, which was discontinued in 2023 and still appears on onboarding checklists that have not been updated.",
  },
  {
    name: "Aetna",
    href: "/payer-enrollment/aetna",
    hook: "The participation request path, the 45-day network-need review that happens before credentialing even starts, and the NPI mismatch that has providers paid out-of-network for weeks without knowing why.",
  },
  {
    name: "Blue Cross Blue Shield",
    href: "/payer-enrollment/blue-cross-blue-shield",
    hook: "Why it is really thirty-some separate companies, why approval in one state tells you nothing about another, and how to identify which plan you are actually applying to.",
  },
  {
    name: "Cigna and Evernorth",
    href: "/payer-enrollment/cigna",
    hook: "The behavioral health path, the widest observed timeline of any major payer, and what to do when you are told the network is closed.",
  },
];
