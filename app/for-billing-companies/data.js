// /for-billing-companies content. A conversion page for the Billing Co plan —
// same species as /pricing and the two product pages, not the editorial
// article template.

// The six-client schematic — identical numbers to /pricing's Billing Co
// section (23 open across the book, 4 quiet 30+ days), because it is the
// same claim illustrated the same way. Kept as its own copy here rather than
// imported, matching how every other page's schematic data is self-contained.
export const CLIENTS = [
  { name: "Client 01", providers: 9, open: 6, quiet: 1 },
  { name: "Client 02", providers: 7, open: 3, quiet: 0 },
  { name: "Client 03", providers: 12, open: 5, quiet: 2 },
  { name: "Client 04", providers: 5, open: 2, quiet: 0 },
  { name: "Client 05", providers: 8, open: 4, quiet: 1 },
  { name: "Client 06", providers: 6, open: 3, quiet: 0 },
];

// Four of the five structural points — parallel, one-line mechanisms, so
// plain cards. The fifth ("one aggregate view") gets the client-grid +
// rollup schematic below instead, since it's the one claim that is actually
// stronger shown than said — and it's the same schematic /pricing uses for
// the identical figures (23 open, 4 quiet), reused rather than reinvented.
export const STRUCTURE = [
  {
    title: "Separate client organizations",
    body: "Each client's providers, payers and records are isolated. Nothing bleeds between them, and nothing shows a client's data to anyone assigned elsewhere.",
  },
  {
    title: "Client switcher",
    body: "Move between clients without logging out or re-authenticating.",
  },
  {
    title: "Scoped user access",
    body: "Assign a coordinator to two clients and not the other four, by complexity or by workload — not everyone needs to see everyone's queue.",
  },
  {
    title: "Per-client follow-up queue",
    body: "Every coordinator opens their Monday view already filtered to the clients assigned to them, not the whole book.",
  },
];

// The sample digest line for the "report" schematic — reuses the same
// forest-tile digest component /payer-enrollment-software builds its Monday
// view with, populated with one client's worth of rows as a stand-in for
// "the report you'd actually send."
export const REPORT_LINES = [
  { tx: "Dr. Alvarez — Aetna re-credentialing, submitted 41 days ago", ct: "41d" },
  { tx: "Dr. Chen — BCBS enrollment, no contact in 33 days", ct: "33d", hot: true },
  { tx: "Dr. Osei — Medicare revalidation due in 19 days", ct: "19d" },
];
