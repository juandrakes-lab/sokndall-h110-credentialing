// `/for-billing-companies` — copy verbatim from H110_COPY_TANDA_A_LANDING.md,
// "PÁGINA 11". Rebuilt from zero on LandingTemplate on 2026-09-10.
//
// No target keyword: this is a segment page for traffic already on the site
// and for the Billing Co plan, optimised for conversion rather than search.
// It does not chase "credentialing services for providers" (service intent).

export const META = {
  title: "Credentialing Software for Billing Companies | Sokndall",
  description:
    "Run credentialing for six clients without six spreadsheets: separate client organizations, isolated data, one login, and one weekly view across the book.",
};

export const HERO = {
  eyebrow: "For billing companies",
  title: ["Six clients,", "not six sheets"],
  sub:
    "Separate client organizations, isolated data, one login, one weekly view across all of them. $699 a month for up to 50 providers across your book.",
  strip: [
    "Data isolated per client",
    "Switch clients without logging out",
    "Scoped access per coordinator",
    "$13.98 a provider at capacity",
  ],
};

export const PROBLEM = {
  head: {
    pill: "The problem",
    title: ["The problem is not", "volume. It is that", "nothing adds up"],
    note:
      "Each client has their own file, their own naming, their own way of recording a follow-up, and none of it totals.",
  },
  paras: [
    "Answering what needs attention this week means opening six things and holding the answer in your head. Answering it for a client on the phone means opening theirs while they wait.",
  ],
  closing:
    "And when a coordinator leaves, whatever they knew about where each application stood walks out of the building with them.",
};

// Each item in the copy is "feature — explanation".
export const STRUCTURE = {
  head: { pill: "Structure", title: ["How the", "structure works"] },
  items: [
    {
      title: "Separate client organizations",
      body: "Each client's providers, payers and records are isolated. Nothing bleeds between them, and nothing shows a client's data to anyone assigned elsewhere.",
    },
    { title: "Client switcher", body: "Move between clients without logging out or re-authenticating." },
    {
      title: "Scoped user access",
      body: "Assign a coordinator to two clients and not the other four. Not everyone needs to see everyone's queue.",
    },
    {
      title: "One aggregate view",
      body: "Across every client at once: how many applications need follow-up this week, and how many have been [quiet for more than thirty days](/payer-enrollment-software).",
    },
    {
      title: "Per-client follow-up queue",
      body: "Every coordinator opens their Monday view already filtered to their own clients, not the whole book.",
    },
  ],
};

export const REPORT = {
  head: { pill: "Client reporting", title: ["The report you can", "send without", "building it"] },
  paras: [
    "When a client asks where their enrollments stand, the answer is a list with dates, statuses and the last follow-up on each one. Not a recollection, and not an afternoon of assembling.",
  ],
  closing:
    "That is also the report that justifies your invoice, which is a different conversation than the one where you explain that the payer is slow.",
};

// Zedtreeo is cited only for the dedicated-specialist figure, with its unit in
// the same line. The same article's "85-88%" saving compares against in-house
// staff, a different unit, and is deliberately not used (copy note).
export const ANCHOR = {
  head: { pill: "Cost anchors", title: ["What the work", "costs, and what", "tracking it costs"] },
  figures: [
    {
      label: "$600 to $2,400 per provider, per year",
      note: "Outsourced maintenance, the work you resell. Unit: one provider, per year. [Medicotech](src:medicotech).",
    },
    {
      label: "$699 a month, up to 50 providers",
      note: "[Sokndall Billing Co](/pricing). Unit: providers tracked across your whole book.",
      ours: true,
    },
    {
      label: "$960 to $1,120 a month, one specialist",
      note: "One dedicated specialist per client. Unit: per specialist hired, not per provider. [Zedtreeo](src:zedtreeo).",
    },
  ],
  closing:
    "The gap is not a discount. Buying the work and tracking the work are different purchases, and only one of them replaces a person.",
};

export const ARCHITECTURE = {
  head: { pill: "Billing Co plan", title: ["A different", "architecture, not", "a bigger number"] },
  paras: [
    "Every feature in the smaller plans is here. What is different is the multi-client structure, and it is not available on Solo or Practice — the isolation is built into how the data is stored, not switched on afterwards.",
  ],
};

export const FAQ = [
  {
    q: "Can one account manage credentialing for multiple clients?",
    a: "Yes, and that is what the Billing Co plan is for. Each client is a separate organization inside one login, with its own providers, payer records, follow-up logs and documents. You move between them without logging out. The aggregate view answers what needs attention this week across every client at once, which is the thing six separate spreadsheets cannot do at all.",
  },
  {
    q: "How is client data separated between practices?",
    a: "At the database level, with [row-level security](/security) rather than a filter in the interface. A coordinator assigned to two clients cannot query, export or see the other four, and there is no view in the product that combines client records except the aggregate follow-up count. This matters when a client asks the question directly, which they eventually will.",
  },
  {
    q: "Can I bill credentialing tracking back to my clients?",
    a: "That is between you and your client agreement, and plenty of billing companies do. What the product gives you is the report that supports it: per client, per provider, per payer, with dates and the last follow-up on each application. Whether it appears on the invoice as a line item or sits inside your existing rate is your call, not a software question.",
  },
];

export const CLOSING = {
  title: "Start the 14-day trial on Billing Co",
  // The written-support line reaches this page too (founder, 2026-09-22): same
  // buyer as /pricing, same doubt, and until now the page offered no way out
  // other than buying. The six editorial pages keep their own close unchanged.
  body: "Card up front, cancel yourself from Settings before day 15. Full plan details on [the pricing page](/pricing). Questions about multi-client setup before you buy? Email [support@sokndall.com](mailto:support@sokndall.com). Support is written only — no call to book, no calendar link.",
  primary: { label: "Start 14-day trial", href: "/start" },
};

// The hero's schematic: the structure the copy describes — one login, separate
// client organizations with isolated data, a coordinator assigned to two
// clients and not the other four, and one view across the book. Six clients
// because the H1 says six. No counts: the copy gives none. The note mirrors the
// approved matrix note; the tile and bar labels are layout microcopy built
// from STRUCTURE's own words. All pending copy review.
export const ORGS = {
  screen: "Client organizations, scoped access and the aggregate view",
  note: "Low-fidelity schematic of the data model. It is not a screenshot, and no product interface exists yet. Each client is its own organization; nothing crosses between them.",
  login: "One login",
  clients: ["Client A", "Client B", "Client C", "Client D", "Client E", "Client F"],
  tileNote: "Isolated data",
  scopes: [
    { label: "Coordinator 1 · two clients", from: 0, to: 1 },
    { label: "Coordinator 2 · the other four", from: 2, to: 5 },
  ],
  aggregate: "One aggregate view: follow-ups due this week and applications quiet for 30 days, across every client",
};

// What the empty screen frame beside the report section will hold.
export const REPORT_SCREEN = "Per-client report: dates, statuses, last follow-up";
