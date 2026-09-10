// Homepage copy for the neo skin.
//
// The four blocks that already existed — the three failure modes, the three
// layers, the scope list and the FAQ — are imported from the forest skin's
// data file rather than restated, so the two skins cannot drift apart on copy.
// Only the strings this layout introduces are defined here.

export {
  PROBLEMS,
  LAYERS,
  SCOPE_ITEMS,
  SCOPE_CLOSING,
  PLANS,
  FAQ_DATA,
} from "@/components/site/landingData";

export const HERO = {
  headline: ["Credentialing that", "tells you what is stuck"],
  sub:
    "Track every credential that expires and every payer application that goes quiet, " +
    "for practices with 3 to 30 providers. The price is on this page.",
  primary: { label: "Start 14-day trial", href: "/login" },
  secondary: { label: "See pricing", href: "/pricing" },
};

// The four-up strip under the hero rule. Icon keys resolve in Landing.jsx.
export const HERO_STRIP = [
  { icon: "calendar", label: "Expiration tracking" },
  { icon: "grid", label: "Enrollment matrix" },
  { icon: "bell", label: "90/60/30/14/7 alerts" },
  { icon: "mail", label: "Weekly digest" },
];

// Section 2 — the closing statement under the three failure modes.
export const PROBLEMS_HEAD = {
  pill: "What actually goes wrong",
  title: ["Three ways a practice", "stops getting paid"],
  stat: "60 days",
  statCaption: "Typical lag before an A/R report surfaces any of them",
  note:
    "None of these are credentialing failures. They are tracking failures — a date nobody was " +
    "watching, an application nobody chased, a number nobody re-checked.",
  closing:
    "Every one of them is discovered in the accounts-receivable report, weeks after the money " +
    "stopped. By then the fix is a backlog, not a task.",
};

// Section 3 — the three layers.
export const LAYERS_HEAD = {
  pill: "What it tracks",
  title: ["Three layers, one", "system of record"],
  aside:
    "Credentials expire on a schedule. Applications go quiet without warning. The Monday " +
    "follow-up is the part that gets dropped first — so it is the part Sokndall automates.",
};

// Section 4 — the matrix.
export const MATRIX_HEAD = {
  pill: "The enrollment matrix",
  title: ["Providers down,", "payers across"],
  aside:
    "Fifteen providers across twelve payers is 180 live applications. The grid puts every one " +
    "on a single screen with days since last contact in the cell, so the stuck ones are the " +
    "ones you can see.",
  points: [
    "One record per provider per payer: submitted date, submission method, confirmation number, last contact, status.",
    "Days since last contact is computed, not typed — nobody has to remember to update a spreadsheet column.",
    "Anything past 30 days with no follow-up lands in Monday's digest whether or not you go looking.",
  ],
};

// Section 5 — the price anchor.
export const ANCHOR = {
  pill: "What this replaces",
  title: ["What outsourcing", "costs instead"],
  aside:
    "Outsourced credentialing maintenance — someone else handling reattestation, recredentialing " +
    "and renewals — runs $50 to $200 per provider per month. Sokndall does not do that work. " +
    "It tracks it. That is the whole reason the price is lower: you are not paying for a person " +
    "on the other end.",
  figures: [
    {
      value: "$50–$200",
      unit: "per provider /mo",
      label: "Outsourced credentialing maintenance",
      note: "A service does the work. You hand off the portals and the phone calls.",
    },
    {
      value: "$26.33",
      unit: "per provider /mo",
      label: "Sokndall Solo — $79 ÷ 3 providers",
      note: "Software tracks the work. You still do it, and you stop losing the thread.",
    },
    {
      value: "$13.98",
      unit: "per provider /mo",
      label: "Sokndall Billing Co — $699 ÷ 50 providers",
      note: "The per-provider figure falls as the panel grows. The plan price does not move.",
    },
  ],
  closing:
    "Need someone to submit the applications for you? That is a credentialing service, and it " +
    "costs several times this. Sokndall is for the person already doing the work and losing " +
    "track of it.",
};

// Section 6 — pricing.
export const PRICING_HEAD = {
  pill: "Pricing",
  title: ["Published, because", "the category will not"],
  aside:
    "Every competitor in this category makes you book a demo before they will say a number. " +
    "Here are all three. Card at signup, charged on day 15, cancel before then and it is not.",
};

export const PLAN_FEATURES = {
  Solo: [
    "Up to 3 providers",
    "Unlimited payers and applications",
    "Expiration alerts at 90/60/30/14/7 days",
    "Weekly digest email",
  ],
  Practice: [
    "Up to 15 providers",
    "Everything in Solo",
    "CSV import for providers and credentials",
    "Enrollment matrix across every payer",
  ],
  "Billing Co": [
    "Up to 50 providers across client organizations",
    "Everything in Practice",
    "Separate client organizations, one login",
    "Per-client digest routing",
  ],
};

// Section 7 — what it does not do.
export const SCOPE_HEAD = {
  pill: "Scope",
  title: ["What it does", "not do"],
  aside:
    "Stated plainly, up front, so nobody discovers it in week three. The boundary is the reason " +
    "the price is what it is.",
};

// Section 8 — FAQ.
export const FAQ_HEAD = {
  pill: "Questions",
  title: ["Answered before", "you have to ask"],
};

export const CLOSING_CTA = {
  title: "Fourteen days. No demo, no quote, no call.",
  body: "Pick a plan, enter a card, import your providers. If it is not doing anything for you by day 14, cancel and you are not charged.",
  primary: { label: "Start 14-day trial", href: "/login" },
  secondary: { label: "See pricing", href: "/pricing" },
};

// The trial CTA as it appears on every plan card.
export const TRIAL_CTA = { label: "Start 14-day trial", href: "/login" };

// The label anchored to the featured plan's top edge.
export const PLAN_TAG = "Most complete for a group practice";

// The line under the plan grid, and the link that trails it.
export const PRICING_NOTE =
  "Card at signup, charged on day 15, cancel before then and it is not.";
export const PRICING_NOTE_LINK = { href: "/pricing", label: "Full pricing detail" };

// The dark card beside the matrix's supporting points.
export const MATRIX_ASIDE = {
  kicker: "In the cell",
  title: "Days since last contact",
  body:
    "Not a status anyone types. It is the gap between today and the last logged contact, which is " +
    "what tells you an application has gone quiet.",
};

// Section 2's rows, cut to the length the layout wants. The full sentences are
// in PROBLEMS, re-exported above from the forest skin's data file.
export const PROBLEM_ROWS = [
  { title: "Late revalidation", body: "A revalidation goes past due. Payments stop until it clears." },
  {
    title: "Lapsed attestation",
    body: "An attestation lapses. Claims start bouncing and nobody connects it for weeks.",
  },
  {
    title: "Mis-loaded NPI",
    body: "An NPI is loaded wrong. Everything pays out-of-network until someone catches it.",
  },
];

// Section 3's blocks, sized to their columns: short in the wide one, longest
// plus a list in the tall middle one, one line in the small one.
export const LAYER_BLOCKS = [
  {
    title: "Credentials that expire",
    body: "Licenses, DEA, malpractice, board certification and CAQH attestation, each on its own clock.",
  },
  {
    title: "Applications that go quiet",
    body: "One record per provider per payer, from submitted through to the effective date.",
    points: ["Submitted date and method", "Confirmation number", "Who you spoke to last"],
  },
  {
    title: "The Monday follow-up",
    body: "Anything with no contact in 30 days, in one email.",
  },
];
