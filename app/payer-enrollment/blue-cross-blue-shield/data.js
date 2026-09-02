// /payer-enrollment/blue-cross-blue-shield — structured content for the
// article. Running prose lives in page.jsx.
//
// V2 update: the copywriter's review converted the week 3–12 playbook from a
// labelled list into flowing prose (it reads better as three paragraphs than
// as a scannable list here, unlike Medicare's and Cigna's playbooks, which
// stayed lists), so there is no PLAYBOOK export any more — that copy is
// inline in page.jsx. STEPS and ERRORS are unchanged.
//
// Terminology: payer, provider, effective date, re-credentialing (never
// renewal), CAQH Provider Data Portal.

export const CONTENTS = [
  { id: "structure", label: "“Blue Cross Blue Shield” is a federation, not a company" },
  { id: "process", label: "The process, in order" },
  { id: "timelines", label: "Stated and observed" },
  { id: "playbook", label: "What to do while it is in review" },
  { id: "errors", label: "What sends you back" },
];

export const STEPS = [
  {
    b: "Identify the correct Blue plan",
    t: "for the provider's service location, using the member prefix rather than the market you are used to.",
  },
  {
    b: "CAQH profile complete",
    t: "and that specific plan authorized to view it.",
  },
  {
    b: "Submit through that plan's own application channel",
    t: "— its own portal, its own forms, not a shared BCBS-wide system.",
  },
  { b: "Confirm receipt", t: "and record whatever reference the plan gives you." },
  {
    b: "Credentialing review,",
    t: "verifying licensure, education, malpractice and other primary-source items.",
  },
  { b: "Contracting,", t: "run separately from credentialing and not always in the same order." },
  { b: "Effective date confirmed", t: "before billing." },
];

export const ERRORS = [
  { b: "Applying to the wrong Blue plan", t: "for the service location." },
  {
    b: "Name, NPI or TIN inconsistencies",
    t: "between the individual record and the group record.",
    linkHref: "/payer-enrollment/aetna",
    linkText: "This is the same failure Aetna's guide covers in the most depth.",
  },
  {
    b: "A categorization dispute",
    t: "over how your practice model is classified.",
  },
];
