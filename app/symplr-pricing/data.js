// /symplr-pricing — content for the editorial template's comparison variant. Copy is verbatim from
// H110_COPY_COMPLETO.md, page 7, re-cut into the template's fixed section
// order: what is known and from where → what is estimated and on what basis →
// who symplr is right for → how the two are bought → our price → FAQ.
//
// Two guardrails from the copy brief live in this file rather than in the
// components, because they are content decisions:
//
//   1. No figure is attributed to symplr anywhere. symplr publishes none, so
//      the page publishes none — the absence is stated as the finding instead.
//   2. Nothing here characterizes symplr negatively. Every sentence about the
//      product describes what it is built to do and for whom.

const CHECKED = "September 6, 2026";

export const SYMPLR_SOURCE = {
  label: "symplr.com",
  href: "https://www.symplr.com/",
};

// Section 2 — what is publicly known. Both rows are `not-published`, which is
// the entire point of the section: the absence occupies a full row at full
// weight rather than leaving a hole where a price would go.
export const KNOWN_CLAIMS = [
  {
    status: "not-published",
    text: "symplr does not list a price for symplr Provider, or for any other module, on its site. Pricing is quoted after a demo request.",
    note: `Checked ${CHECKED} — no figure appears anywhere before the demo request:`,
    source: SYMPLR_SOURCE,
  },
  {
    status: "not-published",
    text: "There is no reliable published figure to cite here, from symplr or from independent sources — and that absence is the actual finding. A category where the entry price cannot be known without a sales conversation is a category built around a sales conversation.",
    note: "No company-published figure exists, and no third-party figure is treated as one on this page.",
  },
];

export const KNOWN_AFTER =
  "That is not unusual for enterprise software sold to health systems, and it is not necessarily a red flag on its own. Products in this category are configured per customer — which modules, how many seats, what integrations — closer to how a hospital buys an EHR than how a small practice buys a subscription.";

// Section 3 — the estimates, each carrying the basis it rests on. These are
// estimates about how the purchase works, not about what it costs: this page
// does not estimate a symplr price at all, because guessing a number and
// labelling the guess is still publishing a number.
export const ESTIMATE_CLAIMS = [
  {
    status: "estimate",
    text: "Terms are annual, and negotiated per organization by module count, seat count and scope.",
    basis: "the standard shape of enterprise health-system software contracts. symplr publishes no terms, so this is not quoted from it.",
  },
  {
    status: "estimate",
    text: "A discovery call, a follow-up scoping call, a proposal, and in many organizations a procurement or legal review, sit between the first conversation and a signature. Weeks to months, not days.",
    basis: "the ordinary enterprise purchase path. No timeline is published by symplr, and this is not one attributed to it.",
  },
];

export const ESTIMATE_AFTER =
  "The sales cycle that comes with that is a real cost, separate from whatever number ends up on the contract, and it is the part a small practice most often does not budget for.";

// Section 4 — context. Between the disclosure and the good-fit section: what
// the product actually is, so the fit question that follows has something to
// stand on.
export const SUITE = [
  "symplr Provider handles credentialing, privileging, enrollment and committee workflow. Alongside it are workforce management, contract management, learning, vendor credentialing, directory and payer-side products. Organizations buy several and integrate them.",
  "That is a coherent product for a health system with a credentialing committee, delegated authority, and departments that need to share provider data. It is a lot of machinery for a practice with nine providers and one person handling this.",
];

// Section 5 — who symplr is right for. Rendered with exactly the same
// treatment as every other section on the page; see GoodFitSection.
export const FIT = [
  "A credentialing committee is not a formality — it is a standing group, often physicians and administrators, that meets on a schedule to review and vote on each provider's file before they can practice or bill. If your organization runs one, or is required to by an accrediting body, you need software built around that workflow: routing files for review, tracking votes, keeping minutes tied to each provider's record. That is what symplr Provider is for.",
  "Privileging is a related but separate need. It means maintaining delineated lists of specific procedures each provider is approved to perform, routed to department chairs for sign-off — a surgeon's privilege list looks nothing like a therapist's, and both have to be tracked, renewed, and auditable. A practice that credentials providers to bill payers does not have this need at all; a hospital does, structurally, regardless of size.",
  "Delegated credentialing is a formal arrangement where a payer allows an organization to credential providers on the payer's behalf, subject to regular audit. It exists almost exclusively at the health-system or large-group level, because payers only delegate to organizations that can pass that audit repeatedly.",
  "And if provider data has to flow automatically into an EHR, a claims system, and a public-facing directory at once, that is an integration requirement most small practices do not have — those three systems either do not exist separately in a nine-provider practice, or someone updates them by hand without much friction.",
  "If any of that describes your organization, this page will not change your mind, and it should not. The rest of it is for the much larger group of practices and billing companies for whom none of it applies yet.",
];

// Section 6 — how the two are bought. Every row names its unit, because the
// two columns frequently do not measure the same thing. Where symplr does not
// publish something the cell says so; nothing in this table is a guess.
export const PURCHASE_ROWS = [
  {
    criterion: "Contract term",
    unit: "months committed at signature",
    ours: "One. Billing is monthly and cancelling from Settings stops the next charge.",
    theirs: "Not published. Terms are negotiated per organization — see the estimate above.",
  },
  {
    criterion: "How you get a price",
    unit: "steps between arriving and seeing a number",
    ours: "None. It is on this page, and on the pricing page, without a form.",
    theirs: `A demo request. No figure appears before it (symplr.com, checked ${CHECKED}).`,
  },
  {
    criterion: "What the price counts",
    unit: "the quantity the rate is multiplied by",
    ours: "Providers tracked. Three, fifteen or fifty, flat per plan, whatever the headcount does in between.",
    theirs: "Not published. Quotes in this category are assembled from modules and seats.",
  },
  {
    criterion: "Getting in",
    unit: "conversations before you can use it",
    ours: "None. Card at signup, fourteen days, self-serve from the first minute.",
    theirs: "A demo, then scoping. The published entry point is a sales conversation.",
  },
  {
    criterion: "Getting out",
    unit: "what leaves with you, and how",
    ours: "CSV export of everything, at any time, including after cancelling. No fee, no request process.",
    theirs: "Not published. Worth asking on the call — see the questions below.",
  },
];

export const PURCHASE_NOTE =
  "Each row states what it measures because the two columns do not always measure the same thing: a flat plan price counts providers tracked, while a negotiated quote is assembled from modules and seats. Where symplr does not publish something, the row says so rather than filling the gap with a guess.";

// Section 7 — the questions, which apply whichever way the reader goes.
export const QUESTIONS = [
  "Whether you end up on symplr, on Sokndall, or on something else entirely, these are the questions that actually separate a good fit from a bad one, and enterprise sales calls do not always surface them unprompted.",
  "How many organizations your size are current customers, not just how many customers overall — a platform built for a five-hospital system can technically onboard a nine-provider practice, but the support experience and the product defaults are usually tuned for the larger customer.",
  "What implementation actually involves — data migration from your current system, staff training, and a realistic go-live date, not the fastest one they can promise.",
  "What happens to your data and your workflow if you cancel. Can you export everything, in what format, and how long does that take.",
  "Whether the quoted price includes support, or whether support tiers are a separate line item you find out about later.",
  "And specifically for a growing practice: what changes about the price or the contract if you add five providers next year. Enterprise contracts are often locked to a seat count or module scope set at signing, and changing it mid-contract is not always simple.",
];

// Section 8 — our own price. The template renders the table unconditionally;
// these two paragraphs are the framing around it.
export const PRICE_LEAD =
  "The honest comparison is not against enterprise credentialing software — that category includes privileging and committee workflow this does not do. It is against paying someone to keep your credentials current.";

export const PRICE_CLOSE =
  "Sokndall tracks the same dates and applications without a person on the other end doing the work, which is the whole reason it costs less.";

export const FAQ_ITEMS = [
  {
    q: "Why doesn't symplr publish pricing?",
    a: "Enterprise software is usually priced per organization, by module and seat count. That is a normal model, and the trade-off is that you cannot compare without a call.",
  },
  {
    q: "Is Sokndall a replacement for symplr?",
    a: "For a health system, no. For a practice under fifty providers that needs dates and application statuses tracked, it covers that scope at a published price.",
  },
  {
    q: "Can I try Sokndall without talking to sales?",
    a: "Yes. That is the whole difference.",
  },
  {
    q: "How long does an enterprise credentialing sales cycle usually take?",
    a: "Expect weeks to months from first call to signed contract, not days — discovery, scoping, proposal, and often a procurement review sit between the demo and go-live.",
  },
  {
    q: "Does symplr work for a small practice at all?",
    a: "The product technically can. Whether it is worth the scope and cost depends entirely on whether you need committee workflow, privileging, or delegated credentialing — see the section above.",
  },
  {
    q: "What if my needs grow into what symplr offers?",
    a: "Nothing about starting with a simpler tracker locks you out of moving to enterprise software later. The data you build up — provider records, credential history — is yours to export.",
  },
];

// The contents list and the related-guide rows the editorial mould adds. Both
// are new with the move onto `EditorialTemplate`; the previous single-column
// comparison template had neither.
//
// Labels are written for the 288px sidebar (COPY_LIMITS: 47 characters), not
// truncated from the H2s above them — an outline entry and a heading are
// different pieces of writing.
export const CONTENTS = [
  { id: "known", label: "What is publicly known" },
  { id: "estimates", label: "What has to be estimated" },
  { id: "suite", label: "symplr is a suite" },
  { id: "fit", label: "Who symplr is right for" },
  { id: "purchase", label: "How each one is bought" },
  { id: "questions", label: "Questions for the demo call" },
  { id: "price", label: "What Sokndall costs" },
  { id: "faq", label: "Questions" },
];

export const RELATED = [
  {
    href: "/modio-health-pricing",
    title: "Modio Health pricing",
    hook: "The same question asked of OneView, and what a demo-only quote implies.",
  },
  {
    href: "/medtrainer-pricing",
    title: "MedTrainer pricing",
    hook: "The one vendor here that documents how its price is calculated.",
  },
  {
    href: "/pricing",
    title: "What Sokndall costs",
    hook: "Three plans, published, with what each one includes and what it does not.",
  },
];
