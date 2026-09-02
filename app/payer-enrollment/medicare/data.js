// /payer-enrollment/medicare — structured content for the article.
// Running prose lives in page.jsx.
// Terminology: revalidation (never renewal), effective date, payer, provider.

export const CONTENTS = [
  { id: "process", label: "The process, in order" },
  { id: "documents", label: "What Medicare asks for" },
  { id: "timelines", label: "Stated timeline and observed timeline" },
  { id: "revalidation", label: "Revalidation is the one that costs money" },
  { id: "finding-the-date", label: "Finding your revalidation date" },
  { id: "playbook", label: "What to do while it is in process" },
  { id: "errors", label: "What sends you back to the start" },
];

// The 855 family. A table, because the question is which row applies to you.
export const FORMS = [
  {
    form: "CMS-855I",
    who: "Individual practitioners",
    note: "Since October 31, 2023 this form also carries reassignment of benefits. The separate CMS-855R was formally discontinued, and MACs return applications still filed on it with a letter requiring resubmission on the current 855I. If your onboarding checklist still references an 855R as a standalone form, it is out of date.",
  },
  {
    form: "CMS-855B",
    who: "Groups and organizations enrolling as a billing entity",
    note: "A new group starts here, before any individual reassigns to it.",
  },
  {
    form: "CMS-855A",
    who: "Institutional providers — hospitals and similar",
    note: "Not the form path for a typical physician practice.",
  },
  {
    form: "CMS-588",
    who: "Everyone, for EFT authorization",
    note: "So Medicare can direct-deposit payments. Filed alongside enrollment, not after it.",
  },
];

// Stated vs. realistic initial-enrollment range, for the small chart in the
// timelines section — the data point the copy names, drawn instead of only
// stated: real HTML/CSS, illustrative weights on the same two-item scale.
export const TIMELINE_CHART = [
  { label: "Stated (clean application)", range: "45–65 days", weight: 0.55 },
  { label: "Realistic (incl. one correction round)", range: "60–95 days", weight: 0.8, long: true },
];

export const PLAYBOOK = [
  {
    lb: "Week 2",
    b: "Confirm receipt with your MAC.",
    t: "Get and record a reference or tracking number.",
  },
  {
    lb: "Weeks 3 – 6",
    b: "Check status every three weeks.",
    t: "Ask specifically whether anything is outstanding rather than whether it is approved — those are different questions and only one of them gets you useful information.",
  },
  {
    lb: "Weeks 6 – 12",
    b: "If nothing has moved, escalate.",
    t: "Ask what the record shows as pending and who is holding it.",
  },
  {
    lb: "Throughout",
    b: "Log every contact",
    t: "with the date, the name and what was said.",
  },
  {
    lb: "On approval",
    b: "Confirm the effective date and the PTAN,",
    t: "and confirm the record is loaded before assuming claims will pay. Approval and loading are separate events.",
  },
  {
    lb: "If you have been holding claims",
    b: "Confirm the window for submitting them",
    t: "once the effective date is known, before it closes.",
  },
];

export const ERRORS = [
  { b: "Legal name", t: "inconsistent between the individual record and the group record." },
  {
    b: "Individual NPI",
    t: "where the group NPI belongs.",
    linkHref: "/payer-enrollment/aetna",
    linkText: "The Aetna guide covers how to catch this exact mismatch in week one instead of month two.",
  },
  { b: "An EIN change", t: "without resubmitting." },
  { b: "A practice location", t: "in the application that does not match the one on file." },
  {
    b: "Banking information for EFT",
    t: "that does not match the group record — the item that has held released funds after everything else cleared.",
  },
];
