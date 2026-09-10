// Copy for /caqh-reattestation, verbatim from H110_COPY_COMPLETO.md page 10.
// The page is the first one built on the editorial template.

export const CONTENTS = [
  { id: "rebrand", label: "CAQH is now DataSpring" },
  { id: "what", label: "What reattestation is" },
  { id: "cadence", label: "Why the cadence confuses everyone" },
  { id: "lapse", label: "When the date passes" },
  { id: "calculate", label: "Calculating your next date" },
  { id: "documents", label: "When a document expires first" },
  { id: "lost", label: "Why the date gets lost" },
  { id: "tracker", label: "How a tracker handles this" },
];

// TODO(sources): the copy cites these by publication and date, not by URL.
// The hrefs below are the publishers' own landing pages, which is honest but
// weak — replace each with the deep link to the specific item before this page
// is treated as citable. Nothing here is a fabricated article URL.
export const SOURCES = {
  rebrand: {
    label: "DataSpring announcement, June 8, 2026",
    href: "https://www.dataspring.com/blog",
  },
  forProfit: {
    label: "reported by Fierce Healthcare, June 10, 2026",
    href: "https://www.fiercehealthcare.com",
  },
  portal: {
    label: "CAQH Provider Data Portal",
    href: "https://proview.caqh.org/",
  },
};

// The cadence disagreement, as the copy states it: CAQH's published interval
// against what providers report being asked for. Two cases, because two is
// what the source material actually carries — padding it to a round number
// would be inventing evidence.
export const CADENCE = {
  caption: "The 120-day cycle, and the intervals providers are actually held to",
  stated:
    "The CAQH cycle is 120 days. Attest, and the clock restarts from the date you attested.",
  statedSource: SOURCES.portal,
  observed: [
    {
      figure: "60 days",
      text:
        "One payer's platform tells a provider their data is stale on a 60-day refresh, while the CAQH profile still shows as current.",
    },
    {
      figure: "90 days",
      text:
        "A second platform asks again at 90, on a schedule of its own that references neither the first payer nor CAQH.",
    },
  ],
  note:
    "Reported by providers, not measured by us. Each is one account; the finding is that the three intervals do not agree, not the numbers themselves.",
};

export const RELATED = [
  {
    href: "/credentialing-spreadsheet-template",
    title: "The free credentialing spreadsheet template",
    hook: "Every field worth tracking, and the point at which a sheet stops being enough.",
  },
  {
    href: "/pricing",
    title: "What Sokndall costs, and what each plan covers",
    hook: "Three plans, published, with what each one includes and what it does not.",
  },
  {
    href: "/symplr-pricing",
    title: "symplr pricing: what is public and what is not",
    hook: "What the largest vendor in this category does and does not publish.",
  },
];

