// `/provider-credentialing-checklist` — copy verbatim from
// H110_COPY_TANDA_C_EDITORIAL.md, "PÁGINA 10". New page on EditorialTemplate.
//
// The SERP carries an Image pack, so the checklist is set as a visual element
// (DocumentChecklist), and "downloadable" is the page's email box, which sends
// the same list as a spreadsheet. Success metric: template capture, not trial.
//
// The copy's own honesty note applies: only one of the two institutional
// sources for the document list could be confirmed (Maryland Department of
// Health), so only that one is cited.

export const META = {
  title: "Provider Credentialing Checklist: Documents and Dates",
  description:
    "Every document a credentialing application needs, what has to be current before you start, and the Medicare revalidation deadline that pays nothing back.",
};

export const HEADER = {
  title: "A provider credentialing checklist, and the two deadlines that are not on it",
  standfirst:
    "What to gather before you start, what has to be current rather than merely present, and the two recurring cycles — CAQH at 120 days and Medicare revalidation at five years — that outlive the onboarding this checklist covers.",
  category: "Guide",
  date: "2026-09-08",
  readingTime: "8 min read",
  caption:
    "The onboarding checklist is finite. The two cycles underneath it are not, and the second one deactivates billing privileges without paying anything back.",
};

export const CONTENTS = [
  { id: "what-it-is", label: "What credentialing is" },
  { id: "checklist", label: "The document checklist" },
  { id: "current", label: "Current, not merely present" },
  { id: "how-long", label: "How long it takes" },
  { id: "privileging", label: "Credentialing and privileging" },
  { id: "deadlines", label: "The two recurring deadlines" },
  { id: "goes-wrong", label: "When it goes wrong" },
];

export const SECTIONS = [
  {
    id: "what-it-is",
    heading: "What provider credentialing is",
    paras: [
      "Credentialing is the verification stage: a payer, hospital or network confirms a clinician's licence, education, training, board status, malpractice coverage and exclusion status against the issuing sources rather than against what the clinician wrote down. It is distinct from [enrollment](/payer-enrollment-software), which is network participation and billing activation, and a provider can complete one without the other.",
    ],
  },
  {
    id: "checklist",
    heading: "The document checklist",
    checklist: {
      items: [
        "State licence for every state of practice, current, with the expiration date recorded per state rather than per provider",
        "DEA registration, current, on a three-year cycle",
        "CDS certificate where the state requires one in addition to the DEA",
        "Malpractice insurance face sheet, current, with the coverage limits legible",
        "Summary of any pending or settled malpractice cases",
        "Curriculum vitae, with month and year for every position and no unexplained gaps",
        "Board certification, with the cycle end date",
        "IRS Form W-9 for the billing entity",
        "Identification numbers: NPI type 1, NPI type 2 for the group, SSN, licence number, DEA number",
        "Every current and previous practice location, with dates",
        "CAQH Provider ID, and a profile that is complete and attested",
        "Group tax ID, and confirmation the location is active under it",
      ],
    },
    // The source for the list, on its own line after it, attributing it in the
    // copy's own terms: the Maryland Department of Health reference guide.
    after: ["Source: [Maryland Department of Health](src:marylandCaqh)"],
  },
  {
    id: "current",
    heading: "Current is not the same as present",
    paras: [
      "Most checklists tell you to gather documents. The failure mode is having all of them and having one expired. An out-of-date malpractice certificate inside a CAQH profile blocks the attestation even when every other field is complete, and an unattested profile stops every major payer without generating a message. Check expiry dates before you open the application, not while you are filling it in.",
    ],
  },
  {
    id: "how-long",
    heading: "How long provider credentialing takes",
    paras: [
      "Ninety to a hundred and twenty days is the working figure for commercial payers on a complete application. Medicare through PECOS is usually faster when the file is clean. Medicaid varies enough by state that a national number is misleading. Every one of those clocks starts when the payer judges the file complete, not when you send it.",
    ],
    figure: { value: "90 to 120 days", source: "homrcm", label: "HOM RCM, 2026" },
  },
  {
    id: "privileging",
    heading: "Credentialing, enrollment and privileging",
    paras: [
      "Credentialing verifies the clinician. Enrollment puts them in a payer's network and switches on billing. Privileging is a hospital granting permission to perform specific procedures in its facility, and it is a medical staff process rather than a payer one. A small practice with no hospital relationship deals with the first two and never encounters the third.",
    ],
  },
  {
    id: "deadlines",
    heading: "The two deadlines that outlive onboarding",
    paras: [
      "CAQH reattestation runs every 120 days, on a date that moves every time you attest. Nothing visible breaks when it lapses, which is what makes it expensive: claims keep processing while a panel application quietly stops advancing.",
      "[Medicare revalidation runs every five years for most providers and every three for DMEPOS suppliers](src:cmsRevalidation). [CMS publishes due dates seven months ahead](src:medsoleMedicare), through PECOS and by post to the correspondence address on file. The rule is hard: past the date, the Medicare Administrative Contractor may deactivate billing privileges under 42 CFR 424.540.",
      "The financial difference is the part worth knowing. Initial enrollment allows some retroactive billing. Revalidation does not: [Medicare does not reimburse services delivered during a deactivation caused by a missed revalidation](src:credyapp). Reactivating requires a completely new enrollment application, which the contractor has 60 to 90 days to process while Medicare income stays frozen.",
    ],
  },
  {
    id: "goes-wrong",
    heading: "What to do when the revalidation notice never arrived",
    paras: [
      "The most common and most avoidable failure in this whole document is a correspondence address in PECOS that nobody has looked at in years. CMS sends the notice there. If it is wrong, the notice never arrives, and the first sign of trouble is claims rejecting. Check the address in PECOS this week rather than at renewal, because the notice arrives seven months ahead and that is the entire warning you get.",
      "[CMS maintains a revalidation list searchable by NPI](src:cmsPecos), which gives you the due date for a specific provider without waiting for a letter. Checking it once a year for every Medicare-enrolled provider takes minutes and removes the dependency on post arriving at the right building.",
      "If deactivation has already happened, submit the new enrollment application immediately and assume 60 to 90 days of processing. Nothing delivered during the gap will be reimbursed, so the practical decision is about the schedule during those months rather than about recovering the money, which is not recoverable.",
    ],
  },
  {
    id: "limit",
    heading: "What a checklist and a tracker do not cover",
    paras: [
      "No tool here verifies anything with a state board, a school or a carrier. Sokndall records what you verified and when, holds the expiry dates, and alerts a named person at 90, 60, 30, 14 and 7 days. The verification is yours, the phone calls are yours, and the PECOS address is something you have to go and look at.",
    ],
    after: ["[The three published plans](/pricing)"],
  },
];

export const TEMPLATE_HEADING = "The checklist as a spreadsheet, with the dates calculated";

export const FAQ = [
  {
    q: "What is provider credentialing?",
    a: "Verification of a clinician's qualifications by a payer, hospital or network: licence, education, training, board certification, malpractice coverage and exclusion status, checked against the issuing sources rather than against the application. It precedes network enrollment and it recurs — commercial recredentialing typically every three years, Medicare revalidation every five.",
  },
  {
    q: "What is credentialing in healthcare?",
    a: "The process by which an organisation verifies that a clinician is who they say they are and holds what they say they hold. In practice it means a payer contacting state boards, schools, malpractice carriers and federal exclusion databases directly. It is a verification exercise, not an assessment of clinical quality, and it says nothing about whether a provider is any good.",
  },
  {
    q: "What documents are needed for provider credentialing?",
    a: "State licence for every state of practice, DEA registration, CDS certificate where required, malpractice face sheet, a summary of any pending or settled cases, a CV with month and year for every position, board certification, IRS Form W-9, and identification numbers including both NPI types. Plus every current and previous practice location, and a CAQH profile that is complete and attested.",
  },
  {
    q: "How long does provider credentialing take?",
    a: "Ninety to a hundred and twenty days for commercial payers on a complete application. Medicare through PECOS is often faster; Medicaid varies too widely by state for a single figure to help. The clock starts when the payer judges the file complete, so the calendar time from your side is reliably longer than any published number.",
  },
  {
    q: "What is the difference between credentialing and privileging?",
    a: "Credentialing verifies a clinician's qualifications. Privileging is a hospital granting permission to perform specific procedures within its own facility, decided by its medical staff rather than by a payer. Privileging depends on credentialing having happened first, but a practice with no hospital relationship deals only with credentialing and payer enrollment and never encounters privileging at all.",
  },
  {
    q: "What is included in a new provider credentialing checklist?",
    a: "Documents, identification numbers, history and dates. The documents and numbers are listed above. The history is every practice location with dates and an explanation for any gap longer than three months. The dates are the part most checklists omit: expiry for each licence and certificate, the CAQH attestation cycle at 120 days, and the Medicare revalidation date, which CMS publishes seven months ahead.",
  },
];

export const CLOSE = {
  href: "/credentialing-spreadsheet-template",
  label: "The free template is this checklist with the expiry maths already written, one row per credential per provider.",
};

export const RELATED = [
  {
    href: "/credentialing-spreadsheet-template",
    title: "The free credentialing spreadsheet template",
    hook: "Six tabs with the formulas already written. No account, one email address.",
  },
  {
    href: "/caqh-reattestation",
    title: "CAQH reattestation and the 120-day rule",
    hook: "The recurring deadline that outlives every onboarding checklist ever written.",
  },
  {
    href: "/payer-enrollment-software",
    title: "Provider enrollment software and the follow-up problem",
    hook: "What happens after the documents are gathered and the application is in.",
  },
];
