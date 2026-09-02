// Content + matrix logic ported from the "Sokndall Landing.dc.html" data script.
// Copy is unchanged except the hero subhead (cut after "...1 to 50 providers.").

export const PROBLEMS = [
  { num: "01", title: "Late revalidation", body: "A revalidation goes past due. Payments stop until it clears — some practices have gone three months like that." },
  { num: "02", title: "Lapsed attestation", body: "An attestation lapses. The payer's record stops matching, claims start bouncing, and nobody connects it until the A/R report is 60 days out." },
  { num: "03", title: "Mis-loaded NPI", body: "An NPI gets loaded wrong on the payer's side. Everything pays out-of-network until someone catches it — weeks of revenue later." },
];

export const LAYERS = [
  {
    title: "Credentials that expire",
    body1: "State licenses, DEA, controlled substance registrations, malpractice COI, board certification, CAQH attestation, Medicare and Medicaid revalidation.",
    body2: "Status derives itself from the expiration date. Alerts at 90, 60, 30, 14 and 7 days. One row per state — a multi-state panel is where this breaks first.",
    slotId: "icon-credentials",
    iconDesc: "Small mono-line icon: a calendar page with one date circled — represents a tracked expiration date.",
  },
  {
    title: "Enrollment applications that go quiet",
    body1: "One record per provider per payer: submitted date, how it went in, the confirmation number, who you talked to last, and the status.",
    body2: "Info requested is the expensive one. Payers frequently do not tell you they need something — the application just sits. You find out weeks later the wait was on your side the whole time.",
    slotId: "icon-applications",
    iconDesc: "Small mono-line icon: a single form with a pause symbol (two short vertical bars) over it — represents an application that has gone quiet.",
  },
  {
    title: "The Monday follow-up",
    body1: "Applications get forgotten more often than they get denied.",
    body2: "Sokndall flags anything with no follow-up in 30 days and sends one digest a week: what is expiring, what is overdue, which applications went quiet, and which provider-payer pairs have claims on hold.",
    slotId: "icon-followup",
    iconDesc: "Small mono-line icon: a weekly calendar strip with one day marked, next to a small envelope or checklist mark — represents the Monday digest.",
  },
];

// Fix 2: the 4 items only. The closing line is rendered separately, full-width below.
export const SCOPE_ITEMS = [
  { title: "No primary source verification.", body: "It does not query license boards for you. You verify; it records what you verified and when." },
  { title: "No connection to CAQH (DataSpring), PECOS or payer portals.", body: "You still work in the portals. Sokndall holds the dates, statuses and reference numbers the portals will not keep for you." },
  { title: "No patient data.", body: "No PHI enters the system — no BAA to negotiate, no security review to schedule before you can try it.", linkHref: "/security" },
  { title: "It does not do the work.", body: "It organizes the person doing it." },
];
export const SCOPE_CLOSING =
  "Need someone to submit applications for you? That is a credentialing service, and it costs several times this. Sokndall is for the person already doing the work and losing track of it.";

export const PLANS = [
  { name: "Solo", price: "$79", period: "/mo", providers: "up to 3", desc: "One provider or a small solo practice", highlighted: false },
  { name: "Practice", price: "$299", period: "/mo", providers: "up to 15", desc: "A group with one person handling this", highlighted: true },
  { name: "Billing Co", price: "$699", period: "/mo", providers: "up to 50 across clients", desc: "Separate client organizations, one login", highlighted: false },
];

export const FAQ_DATA = [
  { q: "Do I have to talk to anyone to buy this?", a: "No. Pick a plan, enter a card, you are in. No demo, no quote, no onboarding call." },
  { q: "What happens on day 15?", a: "The card is charged at the plan price. Cancel before then and it is not." },
  { q: "Is my patient data safe in this?", a: "There is no patient data in it. Provider credentials and enrollment records only. No PHI, no BAA required." },
  { q: "We already have a spreadsheet. Why change?", a: "Below roughly 40 provider-payer pairs, you may not need to. Past that the sheet stops being a tracker and becomes something you have to remember to read. Take the free template first and see where you land →", linkHref: "/credentialing-spreadsheet-template" },
  { q: "Does this work for behavioral health, therapy, or allied health?", a: "Yes. Anyone who credentials with payers — therapists, BCBAs, dietitians, PTs, NPs, chiropractors — tracks the same things: licenses, CAQH, malpractice, and one application per payer." },
  { q: "What if I go over my provider limit?", a: "You move up a plan. Nothing is locked or deleted while you decide." },
];

// Nav, footer and the matrix builder now live in components/site/ — shared with
// /pricing, /payer-enrollment-software and /credential-expiration-tracking.
