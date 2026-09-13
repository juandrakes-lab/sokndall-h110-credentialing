// `/` — copy for the home, verbatim from H110_COPY_TANDA_A_LANDING.md,
// "PÁGINA 1 · `/` — Home". Nothing here is written by the layout: every string
// is an approved slot. Links use rich.jsx syntax; external sources resolve
// through components/neo/sources.js, which decides `nofollow`.
//
// Pieces the copy does not supply, and what stands in for them, are listed in
// docs/DESIGN_DECISIONS.md under "/ — home" rather than improvised here.

export const META = {
  title: "Credentialing Software With a Published Price | Sokndall",
  description:
    "Credentialing software for small practices. Track what expires and which payer applications went quiet. $79 to $699 a month, published, and no demo call.",
};

export const HERO = {
  title: ["Credentialing that", "tells you what went quiet"],
  sub:
    "Sokndall tracks the credentials that expire and the payer applications that go quiet, for practices and billing companies with 1 to 50 providers. $79 to $699 a month, published.",
  primary: { label: "Start 14-day trial", href: "/start" },
  secondary: { label: "See all three plans", href: "/pricing" },
  strip: ["No demo call", "No quote request", "Price list published", "Cancel before day 15"],
  caption:
    "This is the data model, not a screenshot. Sokndall is in development and no interface is shown anywhere on this site.",
  // The two chips floating over the figure. Values are product facts the
  // approved copy states elsewhere — the alert ladder (Section 3 stat caption,
  // FAQ Q4) and the 30-day flag (/payer-enrollment-software FAQ Q4). The
  // labels are layout microcopy, pending copy review (DESIGN_DECISIONS.md).
  indicators: [
    { value: "90 · 60 · 30 · 14 · 7", label: "days before an expiry, an alert goes out" },
    { value: "30 days", label: "with no contact flags an application" },
  ],
};

export const PROBLEM = {
  head: {
    pill: "Built for the small practice",
    title: ["Credentialing", "software, priced", "in public"],
    note:
      "Sokndall is credentialing software for practices that never had a credentialing department. It tracks what expires and what is stuck at a payer.",
    aside:
      "The platforms built for health systems assume a credentialing committee and delegated authority. You have a front-office lead who also handles this.",
  },
  items: [
    {
      title: "A revalidation lapses",
      body: "[Medicare pays nothing for the deactivated period](src:cmsRevalidation). None of it comes back.",
    },
    { title: "An attestation expires", body: "Nothing breaks visibly. The payer sends no warning of any kind." },
    { title: "An NPI loads wrong", body: "Everything pays out of network until someone finally catches it." },
  ],
  closing:
    "None of the three is complicated. Each one is the same thing: a date nobody was watching, or an application nobody chased.",
};

export const LAYERS = {
  head: {
    pill: "What it tracks",
    title: ["Three things, tracked", "in one place"],
    statCaption: "Alerts at 90, 60, 30, 14 and 7 days before expiry.",
  },
  wide: {
    title: "Enrollment applications that go quiet",
    body: "[One record per provider per payer](/payer-enrollment-software). Info requested is the costly one: the payer never asks.",
  },
  tall: {
    title: "Credentials that expire",
    body: "Status derives itself from the expiration date, not from someone remembering.",
    points: [
      "State licenses and DEA",
      "Malpractice COI",
      "Board certification",
      "CAQH attestation, 120 days",
      "Medicare revalidation",
    ],
  },
  small1: {
    title: "The Monday follow-up",
    body: "One digest a week: what expires, what is overdue, what went quiet.",
  },
  small2: {
    title: "One row per state",
    body: "A multi-state panel is where a spreadsheet breaks first.",
  },
};

export const MATRIX = {
  head: { pill: "The matrix", title: ["The screen this is", "really about"] },
  note:
    "Low-fidelity schematic of the data model. It is not a screenshot, and no product interface exists yet. Providers run down the side, payers across the top, and one cell holds each pair.",
  points: [
    "Every cell carries a status and the number of days since the last follow-up on that provider-payer pair.",
    "Fifteen providers across twelve payers is 180 cells. The six that are stuck are visible in one look.",
    "A spreadsheet can hold that data. It cannot show it to you this way, and it will never tell you which cell went quiet.",
  ],
  aside: {
    title: "Where the sheet gives out",
    body:
      "A sheet answers what you ask it. The follow-up problem is the opposite: you need the rows you have not thought about in a month to raise their hand.",
  },
};

export const ANCHOR = {
  head: {
    pill: "Cost anchors",
    title: ["What this work", "costs elsewhere"],
    aside:
      "Three published cost anchors sit around this product, and they do not measure the same thing. One counts providers handed to an outside team. One counts staff seats inside software. The third one is this product. Every figure below states which unit it is counting in.",
  },
  figures: [
    {
      label: "$600 to $2,400 per provider, per year",
      note: "Outsourced ongoing maintenance. Unit: one provider, per year. [Medicotech](src:medicotech) and [Medwave](src:medwave).",
    },
    {
      label: "$3,600 to $9,000 a year, 15 users",
      note: "[MedTrainer's own published category guidance](src:medtrainerBlog). Unit: staff seats, not providers.",
    },
    {
      label: "$3,588 a year, 15 providers",
      note: "[Sokndall Practice at $299 a month](/pricing). Unit: providers tracked. That is $239 each.",
      ours: true,
    },
  ],
  closing:
    "Read the middle figure carefully: a seat is a person on your staff, a provider is a record being tracked. The two never line up one to one.",
};

export const PRICING = {
  head: { pill: "Pricing", title: ["The whole price", "list, on this page"] },
  plans: [
    {
      name: "Solo",
      desc: "One provider or a small solo practice",
      features: ["Up to 3 providers", "$26.33 per provider per month"],
    },
    {
      name: "Practice",
      highlighted: true,
      tag: "Most complete for a group practice",
      desc: "A group with one person handling this",
      features: ["Up to 15 providers", "$19.93 per provider per month"],
    },
    {
      name: "Billing Co",
      desc: "Separate client organizations, one login",
      features: [
        "Up to 50 providers across clients",
        "$13.98 per provider per month",
        "Client data isolated from client data",
      ],
    },
  ],
  note:
    "Fourteen-day trial, card up front, cancel yourself from Settings before day 15 and nothing is charged. Full terms and the three cost anchors on [the pricing page](/pricing).",
};

export const SCOPE = {
  head: {
    pill: "Scope",
    title: ["What Sokndall", "does not do"],
    note:
      "Being clear about this now saves you a trial you were going to cancel in week two anyway, and saves us both the email.",
  },
  items: [
    { title: "It does not verify", body: "It does not query license boards. You verify; it records what you verified." },
    { title: "No portal connection", body: "You still work inside CAQH (DataSpring), PECOS and the payer portals." },
    { title: "No patient data", body: "No PHI enters the system, so there is no BAA to negotiate to try it." },
    {
      title: "It does not do the work",
      body: "It organizes the person already doing it, and shows what they lost track of.",
    },
  ],
  closing:
    "If you need someone to submit applications for you, that is a credentialing service and it costs several times this.",
};

// Questions literal from faq-por-pagina.md, page 1. Q5 is not interrogative on
// purpose: it is the query as registered, and the copy may not rephrase it.
export const FAQ = [
  {
    q: "What is credentialing software?",
    a: "Credentialing software tracks two things that otherwise live in a spreadsheet: the credentials each provider holds and when they expire, and the enrollment applications sitting with each payer. It does not verify anything with a licensing board and it does not file applications for you. It records what you checked and when, tells you what is due next, and flags an application that has not moved.",
  },
  {
    q: "How much does credentialing software cost?",
    a: "Sokndall is $79, $299 or $699 a month, published on this page, which works out to $26.33, $19.93 and $13.98 per provider. Most of the category publishes nothing: [symplr, Modio Health, MedTrainer and CredentialStream all route you to a demo](/best-credentialing-software) before naming a number. [MedTrainer's own blog](src:medtrainerBlog) puts the category at $3,600 to $9,000 a year for fifteen users, counted in staff seats rather than providers.",
  },
  {
    q: "Can CLM software track credentialing requirements and expiration dates?",
    a: "Contract lifecycle management software tracks contracts, and a payer contract is one artifact in credentialing rather than the whole record. It will not hold a state license renewal, a DEA registration, a malpractice certificate or a CAQH attestation date, and it has no concept of an application waiting on a payer. Some practices run CLM for the contract half and something else for everything underneath it.",
  },
  {
    q: "How customizable are credentialing workflows in healthcare software?",
    a: "In the enterprise tools, very. That flexibility is what a credentialing committee and a delegated agreement need, and it is also why those systems take months to configure. Sokndall makes the opposite trade: fixed fields, fixed statuses, and an alert ladder at 90, 60, 30, 14 and 7 days. You can change the alert intervals and the named owner of each item. You cannot design your own workflow.",
  },
  {
    q: "How to choose credentialing software for a healthcare organization",
    a: "Start with the unit you are charged in, because that is where comparisons break: some vendors count staff seats and some count providers tracked, and the two never line up. Then ask whether the price is published at all. Then check whether the tool verifies credentials with the issuing board or records the verification you did. Three answers rule out most of the market before anyone books a demo.",
  },
  {
    q: "Do I need credentialing software if I only have three providers?",
    a: "Probably not yet. Three providers across six payers is eighteen enrollment records and perhaps twenty credential rows, and a spreadsheet holds that without complaint. [The free template on this site](/credentialing-spreadsheet-template) is built for exactly that size. What eventually breaks the sheet is not the row count. It is that the file cannot tell you which application went quiet while you were looking somewhere else.",
  },
];

export const CLOSING = {
  title: "Fourteen days. No call, no quote.",
  body: "Card up front, cancel yourself before day 15. The price you see here is the price on the invoice.",
  primary: { label: "Start 14-day trial", href: "/start" },
  secondary: { label: "See all three plans", href: "/pricing" },
};

// What each of the home's reserved blocks will hold. Production notes, not
// copy: the pages are not published until every block is filled with a real
// product screen (decision of 2026-09-11), so the labels stay visible until
// then and tell whoever captures the screens what goes where.
// Since 2026-09-11 the section-2 block and the quad's wide card hold Pexels
// photographs (components/neo/photos.js); the corner block stays a product
// screen, because only the real digest email can fill it.
export const SLOTS = {
  quadCorner: "The Monday digest email",
};

// The fact row under the hero (FactStrip, 2026-09-11). Each value is stated in
// the approved copy: the price list and the 1-50 range (hero subhead), the
// trial (pricing, "14 days, full product"), no PHI and no BAA (Section 7).
// Labels are layout microcopy, pending copy review.
export const FACTS = [
  { value: "$79", label: "a month to start, on a published price list" },
  { value: "14 days", label: "of trial, with every feature" },
  { value: "1–50", label: "providers, from a solo practice to a billing company" },
  { value: "0", label: "patient records: no PHI, so no BAA" },
];
