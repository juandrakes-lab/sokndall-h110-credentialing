// `/pricing` — copy verbatim from H110_COPY_TANDA_A_LANDING.md, "PÁGINA 2 ·
// `/pricing`". Rebuilt from zero on LandingTemplate on 2026-09-10; nothing of
// the previous hand-built composition is carried over (DESIGN_DECISIONS.md).
//
// Plan prices are not written here: they come from PLAN_PRICES in
// components/neo/schema.jsx, which the SoftwareApplication schema reads too.

export const META = {
  title: "Credentialing Software Pricing, Published in Full | Sokndall",
  description:
    "Credentialing software pricing published in full: $79, $299 or $699 a month, with every feature in every plan. No quote process and no demo call ever.",
};

// on-page-seo.md §4 pattern: premise in the H1, the exact keyword in the first
// H2 below. The two sentences are set as two authored lines.
export const HERO = {
  eyebrow: "Pricing",
  title: ["No quote to get.", "No call to book."],
  sub:
    "Three plans, three prices, no quote process. Every plan has every feature. The difference is how many providers you track, and whether you track them for your own practice or for clients.",
};

export const PLANS = {
  head: { title: "Credentialing software pricing: three plans, published" },
  plans: [
    {
      name: "Solo",
      desc: "One provider or a small solo practice",
      features: [
        "Up to 3 providers, 1 user",
        "$26.33 per provider per month",
        "Every feature, including the weekly digest",
      ],
    },
    {
      name: "Practice",
      highlighted: true,
      tag: "Most complete for a group practice",
      desc: "A group with one person handling this",
      features: ["Up to 15 providers, up to 3 users", "$19.93 per provider per month", "Everything in Solo"],
    },
    {
      name: "Billing Co",
      // Brief 2026-09-09: names both audiences. The link to
      // /for-billing-companies stays, on "billing companies" only — that page
      // is written for them, not for a multi-TIN group (the brief's open item).
      desc: "For [billing companies](/for-billing-companies) and multi-TIN groups",
      features: [
        "Up to 50 providers across all clients",
        "Up to 10 users, scoped to their clients",
        "$13.98 per provider per month",
        "Client data isolated from client data",
      ],
    },
  ],
  note:
    "Every plan is monthly and cancels from Settings. Billing Co includes 10 users; each one after that is $39 a month. Fourteen-day trial, card up front, nothing charged before day 15.",
};

// EntityChooser — copy brief of 2026-09-09 ("selector por entidad"). Under the
// keyword H2 and above the price list, as an H3: the keyword H2 has to stay the
// page's first H2 (on-page-seo.md §4).
//
// Restructured by the founder on 2026-09-14, every word from the brief: the
// question becomes the heading, the old heading's first half becomes the pill,
// and the rest of the lead stays under the question. The dropped words are
// ", not with provider count" — pending the copywriter's review.
export const ENTITY = {
  pill: "Start with one question",
  title: "How many separate tax IDs do you need to keep apart?",
  lead: "That answer picks your plan faster than counting providers does.",
  options: [
    { label: "One practice, one tax ID", body: "Solo or Practice. Choose on provider count: up to 3, or up to 15." },
    { label: "More than one tax ID", body: "Billing Co, even at six providers. No other plan separates entities." },
  ],
  closing:
    "Solo and Practice hold one practice. If you run an ASC on its own tax ID, or grew by acquisition and each site bills under a different one, that is more than one entity.",
};

// COPY_LIMITS: ≤21 per authored H2 line. Line 4 is 22 — one over. Kept as
// approved and reported; the copy file's own shorter alternative changes the
// wording, and approved copy is not rewritten to fit.
export const UNITS = {
  head: {
    pill: "Provider vs. user",
    title: ["A provider is not", "a user, and the", "difference is the", "whole comparison"],
  },
  paras: [
    "A provider is a record being tracked: one clinician, with their credentials and their enrollment applications. A user is a person who logs in. A three-person front office managing forty clinicians is three users and forty providers. A solo practitioner who does her own paperwork is one of each.",
    "Sokndall charges by provider and includes users up to the plan's limit. MedTrainer states in [its own FAQ](src:medtrainerProduct) that its pricing scales with the number of users and modules. Neither model is wrong. They are simply not comparable, and every published comparison of this category that puts two per-unit figures side by side without saying which unit is measuring something it did not measure.",
  ],
  closing: "When you ask a vendor what it costs, the first question back should be yours: costs per what?",
};

// Replaced whole by the copy brief of 2026-09-09: the same four figures, in
// two groups that are not comparable with each other (FigureBandSection
// `groups`). Figure 4 is arithmetic on our own published price: $299 × 12 =
// $3,588, ÷ 15 = $239.20.
export const ANCHOR = {
  head: {
    pill: "Cost anchors",
    title: ["What this costs", "next to what else"],
    aside:
      "Four published figures, in two groups that are not comparable with each other. Two of them buy the work. Two of them buy software. Every figure states the unit it counts in, because that is where this comparison goes wrong.",
  },
  groups: [
    {
      title: "Paying someone to do the work",
      figures: [
        {
          label: "$600 to $2,400 per provider, per year",
          note: "Ongoing maintenance, outsourced. Unit: one provider. [Medicotech](src:medicotech) and [Medwave](src:medwave).",
        },
        {
          label: "$1,500 to $5,000 per provider, once",
          note: "Initial submissions across core payers. Unit: one provider. [Medicotech](src:medicotech).",
        },
      ],
      closing:
        "Sokndall costs a fraction of these because it is not the same purchase. Nobody here verifies a licence with a board, submits an application or calls a payer. Your team does that; this holds the record.",
    },
    {
      title: "Paying for software",
      figures: [
        {
          label: "$3,600 to $9,000 a year, 15 users",
          note: "[MedTrainer's own published guidance](src:medtrainerBlog). Unit: staff seats, not providers.",
        },
        {
          label: "$3,588 a year, 15 providers",
          note: "Sokndall Practice at $299 a month. Unit: providers tracked. $239 each.",
          ours: true,
        },
      ],
      closing:
        "Against software, this sits at the bottom of the same range rather than below it. The difference is the unit and the fact that the number is on the page.",
    },
  ],
};

// TrialTermsBlock. Each item in the copy is "label — explanation"; the row card
// sets the label as its title and the explanation beside it. The explanation's
// first letter is capitalised because it now opens its own block — the only
// typographic change made to the approved strings.
export const TRIAL = {
  head: { pill: "The trial", title: "How the trial works" },
  items: [
    // `kicker` and `fact` (2026-09-11): the step label and a short value set
    // large, each lifted from this item or from FAQ Q3 ("the first charge
    // lands on day 15"). Layout microcopy, pending copy review.
    {
      kicker: "Step 01",
      fact: "14 days",
      title: "14 days, full product",
      body: "Every feature from day one. Nothing is held back for the trial.",
    },
    {
      kicker: "Step 02",
      fact: "Day 15",
      title: "Card up front",
      body: "So you are not re-entering it when the trial ends and you decide to stay.",
    },
    {
      kicker: "Step 03",
      fact: "Self-serve",
      title: "Cancel from Settings",
      body: "Self-serve, no email required. The card is charged on day 15 if you do not.",
    },
  ],
};

export const FAQ = [
  {
    q: "How much does credentialing software cost?",
    a: "Sokndall costs $79, $299 or $699 a month. Across the rest of the category nobody publishes a number: symplr, Modio Health, MedTrainer and CredentialStream all require a demo first, and [Capterra records all four as contact-vendor-for-pricing](/best-credentialing-software). The one public figure any of them offers is [MedTrainer's own blog guidance](src:medtrainerBlog) of $3,600 to $9,000 a year for fifteen users, which counts seats rather than providers.",
  },
  {
    q: "Is there a free credentialing software?",
    a: "Not a real one. What exists is the free tier of a larger product, or a spreadsheet template — and [this site publishes one of those](/credentialing-spreadsheet-template), with the formulas already in it. Sokndall has a fourteen-day trial rather than a free plan, because a permanently free tier of a tracking tool tends to mean the tracking stops working at the moment it starts mattering.",
  },
  {
    q: "What happens if I cancel during the trial?",
    a: "Nothing is charged. The card goes in at signup so that nothing has to be re-entered later, but the first charge lands on day 15. Cancel from Settings before then and it does not happen. There is no cancellation form, no retention call, and no email you have to send to a person. Your data stays exportable as CSV either way.",
  },
  {
    q: "Do you charge per provider or per user?",
    a: "Per provider. A provider is a clinician whose credentials and enrollments you track; a user is someone who logs in. Solo includes 3 providers and 1 user, Practice 15 providers and 3 users, Billing Co 50 providers and 10 users. Users are included rather than billed, which is the opposite of how most of this category prices, and it is why the per-unit figures do not compare directly.",
  },
  {
    q: "Is there an onboarding fee?",
    a: "No. There is no setup fee, no implementation cost, no paid migration and no training package. Spreadsheet import is built into the product, with a preview before anything commits. This is worth asking every vendor in the category separately from the license price, because implementation and training are frequently quoted as their own line and are not always mentioned unprompted.",
  },
  {
    q: "What counts as a provider?",
    a: "Anyone you track credentials or enrollment records for — physicians, nurse practitioners, physician assistants, therapists, BCBAs, dietitians, physical therapists. If they have an NPI and a payer relationship you are maintaining, they count. Mark someone inactive and they stop counting against your plan limit immediately, so a departing clinician does not keep occupying a slot.",
  },
];

export const CLOSING = {
  title: "Start the fourteen-day trial",
  body: "Card up front, cancel yourself from Settings before day 15. Nothing on this page changes after you sign up.",
  primary: { label: "Start 14-day trial", href: "/login" },
};

// PlanFeatureMatrix and the security line — copywriting brief of 2026-09-09,
// added to Page 2 without replacing anything in the Tanda A copy. Placed after
// the price list and before the provider-vs-user section: the table shows,
// that section explains.
// Two decisions on the brief (DESIGN_DECISIONS.md, 2026-09-12):
//   - rows 5 and 6 consolidated into "Aggregate and scoped client views", as
//     the copywriter recommended, so the caption's "two rows" is true as
//     written (the multi-client rows are the organizations row and this one);
//   - the "Document storage" row is left out: its figures are [PEND] and no
//     storage limit exists in the product config, and the brief says a row
//     without them does not ship.
// The providers and users rows are not written here: page.jsx builds them from
// PLAN_PRICES, the same data the list and the Offer schema read.
// `pill` is a structural label written by design, pending copy review.
export const MATRIX = {
  head: {
    pill: "Plan comparison",
    title: ["What changes between", "the three plans"],
    note:
      "Three plans, one product. What changes is how many providers you track and whether you track them for clients.",
  },
  plans: ["Solo", "Practice", "Billing Co"],
  // Brief 2026-09-09 (entity chooser), cell 0.3 corrected by copy on
  // 2026-09-14 ("Several" → "No limit"): the first row, above "Providers
  // tracked" — the decision axis; below, the table reads as a size ladder.
  first: [{ label: "Separate tax IDs", cells: ["One", "One", "No limit"] }],
  // Brief 2026-09-09 (anchors): after "Users included". "Not available" is
  // printed as text, never an empty cell or a dash (DESIGN_RULES §2 regla 3).
  afterUsers: [{ label: "Additional users", cells: ["Not available", "Not available", "$39 a month each"] }],
  rows: [
    { label: "Separate client organizations", cells: ["Not included", "Not included", "Included"] },
    { label: "Aggregate and scoped client views", cells: ["Not included", "Not included", "Included"] },
    { label: "Every tracking feature", cells: ["Included", "Included", "Included"] },
  ],
  // Caption withdrawn 2026-09-14 (founder's decision): with the tax-ID and
  // additional-users rows it is no longer true as written ("the only two
  // rows…" — there are now four). Returns when copy rewrites it. Approved text:
  // "The only two rows where a plan is missing something are the multi-client
  // rows, and those are the Billing Co structure rather than a feature held
  // back."
  caption: null,
  // The security line, stated as a fact rather than as an answer to SOC 2
  // (the brief's reasoning). No badge, shield or seal may be added beside it:
  // that would imply an accreditation that does not exist (DESIGN_RULES §2
  // regla 6). Pending the same legal review as home Section 7, item 3.
  security:
    "No patient data enters the system at any point, so there is no PHI to expose. Each client organization's data is isolated at the database level.",
};

// The provider-versus-user diagram beside the UNITS section: the copy's own
// example, drawn. Counts and wording come from UNITS.paras[0]; nothing here is
// a customer figure.
export const UNITS_DIAGRAM = {
  rows: [
    { count: 3, unit: "users", note: "A user is a person who logs in.", kind: "person" },
    { count: 40, unit: "providers", note: "A provider is a record being tracked.", kind: "record" },
  ],
  caption: "A three-person front office managing forty clinicians is three users and forty providers.",
};
