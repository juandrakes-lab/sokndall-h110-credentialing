// `/payer-enrollment-software` — copy verbatim from H110_COPY_TANDA_A_LANDING.md,
// "PÁGINA 9". Rebuilt from zero on LandingTemplate on 2026-09-10; nothing of
// the previous hand-built composition is carried over.
//
// This page is about the enrollment workflow, not about comparing software:
// the SERP overlaps the home's, so the differentiation is mandatory, and there
// is no vendor-comparison language anywhere on it (that lives on page 3).

export const META = {
  title: "Provider Enrollment Software That Tracks the Wait | Sokndall",
  description:
    "Provider enrollment software for small practices: one record per provider per payer, from submitted to the effective date, plus a flag when nothing has moved.",
};

export const HERO = {
  title: ["Track the wait,", "not the paperwork"],
  sub:
    "One record per provider per payer, from submitted to effective date: status, confirmation number, who you spoke to last, and how long since anyone checked.",
  strip: ["Six statuses", "30-day stall flag", "One follow-up log per payer", "$79 to $699 a month"],
};

export const TWO_STEPS = {
  head: {
    title: ["Credentialing and", "provider enrollment", "are two steps"],
    note:
      "Credentialing is the verification: the payer confirms you are who you say you are. Enrollment is being accepted into the network and switched on for billing.",
  },
  paras: [
    "Most practices use the word credentialing for both, and that is fine in conversation. It stops being fine when you are trying to work out where a delay is sitting, because the two stages fail differently. [Verification stalls on a document](/provider-credentialing-checklist). Enrollment stalls on a contract, a network adequacy decision, or a queue.",
  ],
  closing:
    "Being able to say which of the two you are waiting on is the difference between a useful phone call and one that goes nowhere.",
};

// The two sources the copy cites for the 90-120 day range, in the same line as
// the figure. Forum-only figures (Oct-Apr, 60-190 days) were retired by the
// copy and do not appear.
export const TIMELINE = {
  head: {
    title: ["Submitting takes", "an afternoon. The", "next four months", "are the job"],
    note:
      "Enrollment runs 90 to 120 days per provider per payer on a good path ([HOM RCM](src:homrcm); [Assured](src:assured)), and considerably longer when something goes sideways.",
  },
  paras: [
    "Medicare through PECOS moves faster than commercial payers when the application is clean. Medicaid varies so widely by state that a national figure means nothing. What all three share is that the waiting is unstructured: no shared queue, no ticket number that means anything to you, and no notification when the payer needs something from your side.",
  ],
  closing:
    "Applications in this category do not usually get denied. They sit, and the sitting stays invisible until somebody goes looking for it.",
};

// StatusTable. Glyphs reuse the matrix's vocabulary where they overlap
// (● review, ▲ info requested, ✓ approved); the other three are the table's
// own and carry their written name beside them, so no status is colour alone.
// The column headers are structural labels — the copy gives the three fields
// of each row but not a header row; see DESIGN_DECISIONS.md.
export const STATUSES = {
  head: { title: ["Six statuses, and", "one of them is your", "problem right now"] },
  columns: ["Status", "What it means", "What to do"],
  rows: [
    {
      glyph: "○",
      status: "Not started",
      meaning: "Provider is on the roster, the application is not in",
      action: "Gather documents, confirm the CAQH profile is attested",
    },
    { glyph: "◐", status: "Submitted", meaning: "It went in, nobody has looked at it", action: "Nothing yet. Wait out the payer's stated window" },
    { glyph: "●", status: "In review", meaning: "Someone at the payer has it", action: "Follow up on a schedule, not on a feeling" },
    {
      glyph: "▲",
      status: "Info requested",
      meaning: "The payer is waiting on you",
      action: "Clear it today. This is the expensive one",
      needsAction: true,
    },
    { glyph: "✓", status: "Approved", meaning: "You have an effective date", action: "Confirm it, and check whether claims can be backdated" },
    { glyph: "✕", status: "Denied or withdrawn", meaning: "It is over for now", action: "Record why. It matters when you reapply" },
  ],
  closing:
    "Info requested costs the most and hides the best, because the payer frequently never tells you it is the one waiting.",
};

export const EFFECTIVE = {
  head: { title: ["Approved is not", "the date you can", "start billing"] },
  paras: [
    "[With Aetna, the in-network effective date is the day the contract is fully executed](src:clinicalDocsAetna) — not the day the application went in, and not the day someone told you it was approved. Bill against the wrong one and the claims come back. Some payers allow backdating and some do not, and you find out which after the fact.",
  ],
  closing:
    "Record the effective date the payer confirms, in writing, and treat every other date in the process as administrative.",
};

// ErrorList. Each item is "comparison — explanation" in the copy. Limit of the
// claim, from the copy: it compares fields between the practice's own records,
// not against what the payer has loaded — that would be source verification,
// which section 8 denies.
export const MISMATCH = {
  head: {
    title: ["The mismatch that", "stalls it quietly"],
    note:
      "A payer will not act on an application whose fields disagree with each other, and nothing in the process tells you that is what happened.",
  },
  items: [
    {
      title: "Individual NPI against group NPI",
      body: "The type 1 on the provider record checked against the type 2 on the practice record. This is the disagreement that quietly pays everything out of network.",
    },
    {
      title: "TIN against the group record",
      body: "The tax ID the application was filed under checked against the one the practice actually bills on. Change an EIN and this is what breaks.",
    },
    {
      title: "Legal name against everything else",
      body: "The name on the license checked against the practice record. Middle initials, suffixes and married names all count as a mismatch to a payer.",
    },
  ],
  closing:
    "[Carelon gives you seven calendar days to correct a conflicting record in writing](src:carelonJoin). A flag you can see beats a letter you did not expect.",
};

export const MATRIX = {
  head: { title: ["Every provider,", "every payer,", "one screen"] },
  note:
    "Low-fidelity schematic of the data model. It is not a screenshot, and no product interface exists yet. Providers run down the side, payers across the top, and one cell holds each provider-payer pair.",
  points: [
    "Each cell carries a status and the number of days since the last follow-up on that pair.",
    "Twelve providers across ten payers is 120 applications, and most of the grid should be quiet.",
    "The few cells that are not quiet are the only ones that need a decision this week.",
  ],
  aside: {
    title: "Why the grid and not a list",
    body:
      "A list makes you read all 120 rows to find the six. The grid puts the six where your eye lands first, which is the only reason it exists.",
  },
};

export const SCOPE = {
  head: { title: ["What it does", "not do"] },
  items: [
    {
      title: "It does not submit",
      body: "You still work in the payer's own portal. This holds the record, not the filing.",
    },
    {
      title: "No portal connection",
      body: "No login, no scraping, no integration that breaks when a payer changes systems.",
    },
    { title: "It chases nobody", body: "The queue says who is due for a call. Making the call is still yours." },
  ],
  closing:
    "No tool in this category files applications for you. The ones that say otherwise are describing a service with software attached.",
};

export const FAQ = [
  {
    q: "What is provider enrollment?",
    a: "Provider enrollment is the process of being accepted into a payer's network and switched on for billing under a specific tax ID and location. It follows credentialing, which is the verification stage, and it ends with an effective date. Until that date exists and is confirmed, claims for that provider with that payer are either held, paid out of network, or written off.",
  },
  {
    q: "What is the difference between credentialing and provider enrollment?",
    a: "Credentialing is verification: the payer confirms your license, education, board status, malpractice coverage and exclusion screening against the issuing sources. Enrollment is network participation and billing activation. A provider can be fully credentialed and still not be enrolled, which is the exact situation that produces months of denied claims while everyone involved believes the process finished.",
  },
  {
    q: "How long does payer enrollment take?",
    a: "Ninety to a hundred and twenty days is the working figure for commercial payers on a clean application. Medicare through PECOS is often faster; Medicaid varies enough by state that a national number is not useful. Incomplete applications and stale [CAQH profiles](/caqh-reattestation) are the two most common reasons a file sits, and neither generates any notice from the payer.",
  },
  {
    q: "What happens if a payer enrollment application goes quiet?",
    a: "Usually it is waiting on something the payer never asked you for. Sokndall flags any application with no recorded contact in thirty days, which is not a diagnosis — it is a prompt to call. The call is the only way to find out whether the file is progressing, sitting behind a document, or in a network that quietly stopped accepting new providers.",
  },
  {
    q: "Can software submit enrollment applications for me?",
    a: "No. Not this one and not any of them. Every product in this category holds records and reminds you; the filing happens in the payer's own portal, under your login, by a person. A vendor that appears to submit for you is a credentialing service with software attached, and it is priced like a service — several times what a tracking tool costs.",
  },
];

export const CLOSING = {
  title: "See the whole price list, published",
  body: "Three plans, published, no quote process. Fourteen-day trial and you cancel yourself before day 15.",
  primary: { label: "See all three plans", href: "/pricing" },
  secondary: { label: "Start 14-day trial", href: "/login" },
};
