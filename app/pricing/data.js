// /pricing content. Prices and per-provider figures are plain text on the page
// (no images of numbers) so they match any structured data added later.
//
// NOTE: these are the published marketing prices. `lib/plans.js` — which drives
// the Polar checkout — still carries the older 49/99/199 figures. They have to
// be reconciled before this page goes live.

export const PLANS = [
  {
    key: "solo",
    name: "Solo",
    price: "$79",
    period: "/month",
    perProvider: "$26 per provider per month",
    features: [
      "Up to 3 providers, 1 user",
      "All credential tracking, all payer enrollment tracking",
      "Weekly digest every Monday",
    ],
    featured: false,
  },
  {
    key: "practice",
    name: "Practice",
    price: "$299",
    period: "/month",
    perProvider: "$20 per provider per month",
    label: "Most complete for a group practice",
    features: [
      "Up to 15 providers, up to 3 users",
      "Everything in Solo",
      "All credential tracking, all payer enrollment tracking",
      "Weekly digest every Monday",
    ],
    featured: true,
  },
  {
    key: "billing_co",
    name: "Billing Co",
    price: "$699",
    period: "/month",
    perProvider: "$14 per provider per month",
    features: [
      "Up to 50 providers across all clients",
      "Up to 10 users included, each restricted to assigned clients",
      "Everything in Practice, plus the multi-client structure",
      "One view across every client you manage",
    ],
    featured: false,
  },
];

// The six client organizations in the Billing Co schematic. The numbers add up
// to the 23 in the digest line, on purpose.
export const CLIENTS = [
  { name: "Client 01", providers: 9, open: 6, quiet: 1 },
  { name: "Client 02", providers: 7, open: 3, quiet: 0 },
  { name: "Client 03", providers: 12, open: 5, quiet: 2 },
  { name: "Client 04", providers: 5, open: 2, quiet: 0 },
  { name: "Client 05", providers: 8, open: 4, quiet: 1 },
  { name: "Client 06", providers: 6, open: 3, quiet: 0 },
];

// Trial terms as three labelled commitments (B-4). "No retention call" is kept
// explicit rather than folded into "no email required" — it is the claim that
// separates this from the incumbents' sales model, and it is brief copy.
export const TRIAL_TERMS = [
  {
    label: "14 days, full product.",
    body: "Every feature, from day one — nothing held back for the trial.",
  },
  {
    label: "Card up front.",
    body: "So you are not re-entering it when the trial ends and you decide to stay.",
  },
  {
    label: "Cancel from Settings.",
    body: "Self-serve, no email required, no retention call. The card is charged on day 15 if you do not.",
  },
];

export const COST_BLOCKS = [
  {
    title: "Ongoing maintenance, done for you",
    figure: "$600 – $2,400",
    unit: "per provider per year",
    body: "Reattestation on the CAQH clock, recredentialing every two to three years, license and DEA renewals, roster updates. As a recurring fee, that lands at roughly $50 to $200 a month per provider.",
  },
  {
    title: "One-time engagements",
    figure: "$1,500 – $5,000",
    unit: "per provider",
    body: "Someone doing the initial submissions across your payers. You pay again when something structural changes: change your EIN and every application typically gets resubmitted, billable.",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Is there a contract?",
    a: "No. Monthly, cancel any time. What you put in stays exportable.",
  },
  {
    q: "Is there an annual discount?",
    a: "No. One price, published, the same for everyone. There is no negotiated rate you are missing because you did not ask.",
  },
  {
    q: "What if I go over my provider limit?",
    a: "You cannot add a new provider past the plan limit — you will see it before it blocks you, with the option to move up a plan right there. Nothing you have already entered is ever locked or hidden.",
  },
  {
    q: "What counts as a provider?",
    a: "Anyone you track credentials or enrollments for. Mark them inactive and they stop counting toward the limit.",
  },
  {
    q: "Can I export everything?",
    a: "Yes, CSV, any time, including after you cancel.",
  },
  {
    q: "Do you offer setup or migration help?",
    a: "Spreadsheet import is built in, with a preview before anything commits. There is no paid onboarding because there is nothing that needs a consultant.",
    linkHref: "/credentialing-spreadsheet-template",
    linkLabel: "Free spreadsheet template",
  },
];
