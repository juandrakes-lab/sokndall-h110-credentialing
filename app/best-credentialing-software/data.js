// `/best-credentialing-software` — copy verbatim from
// H110_COPY_TANDA_B_COMPARACION.md, "PÁGINA 3". New page, on
// EditorialTemplate variant="comparison". Absorbs the `credentialing software
// cost` intent (architecture v3.1 §1) in its cost-ranges section.
//
// Hard rules from the copy, enforced by the components where they can be:
// no competitor figure without a linked source; no pejorative adjective; a
// "who it is right for" section per vendor, written in earnest; vendor-
// incentivised reviews declared; no SelectHub $4 figure; symplr Payer's
// $12,500 never used as a proxy for symplr Provider.

export const META = {
  title: "Best Credentialing Software: What Each One Costs | Sokndall",
  description:
    "A comparison of credentialing software for small practices, including what each vendor publishes about price. Four of the five publish nothing at all.",
};

export const HEADER = {
  title: "The best credentialing software depends on a question most vendors will not answer",
  standfirst:
    "Five products, what each one actually costs, and who each is built for. Four of the five do not publish a price. That absence is the most useful thing on this page, and it is not an accident.",
  category: "Comparison",
  date: "2026-09-08",
  readingTime: "10 min read",
  caption:
    "The credentialing software category, priced. Four of five vendors route every pricing question through a sales call.",
};

export const CONTENTS = [
  { id: "why-no-price", label: "Why nobody publishes a price" },
  { id: "five-products", label: "What the five products cost" },
  { id: "unit", label: "The unit problem" },
  { id: "symplr", label: "symplr Provider" },
  { id: "medtrainer", label: "MedTrainer" },
  { id: "modio", label: "Modio Health" },
  { id: "credentialstream", label: "CredentialStream" },
  { id: "sokndall", label: "Sokndall" },
];

export const WHY = {
  id: "why-no-price",
  heading: "Why four of five will not tell you the price",
  paras: [
    "Every credentialing vendor in [the G2 category ranking](src:g2Category) routes pricing through a demo. [symplr](src:capterraSymplr), [Modio Health](src:capterraModio), [MedTrainer](src:capterraMedtrainer) and [CredentialStream](src:capterraCredentialStream) all show contact-vendor-for-pricing on Capterra, with no trial and no free version listed. This is not four companies independently arriving at the same policy. It is what happens when the price depends on how many providers, how many modules and which state, and when the seller would rather establish that before naming a number.",
    "The practical effect is that a three-provider practice cannot find out whether a product is affordable without booking a call with someone whose job is to prevent that call from ending in a no. For an organisation with a procurement function this is normal. For a front-office lead who also does credentialing between patient check-ins, it is the reason this category stays a spreadsheet.",
  ],
};

// MultiVendorComparison. Cells ≤29 characters; long detail goes to the
// caption. CredentialStream is in and Verisys is out: Verisys has no locatable
// Capterra profile, and a column of four empty cells is worse than no column.
export const TABLE = {
  id: "five-products",
  vendors: [
    { name: "symplr Provider" },
    { name: "MedTrainer" },
    { name: "Modio Health" },
    { name: "CredentialStream" },
    { name: "Sokndall", self: true },
  ],
  criteria: [
    {
      label: "Published list price",
      unit: "yes or no, on own site",
      cells: ["No", "No", "No", "No", "Yes — $79 / $299 / $699"],
    },
    {
      label: "Charging unit",
      unit: "what the vendor counts",
      cells: ["Not specified", "Users and modules", "Not specified", "Not specified", "Providers tracked"],
    },
    {
      label: "How you buy it",
      unit: "first step for a buyer",
      cells: ["Demo required", "Demo or sales call", "Demo required", "Demo required", "Self-serve signup"],
    },
    {
      label: "Reviewer size mix",
      unit: "share of reviewers, by size",
      cells: [
        "42% mid, 31% small (G2)",
        "77% small (Capterra)",
        "29 reviews, small to mid",
        "42% enterprise",
        "No review history",
      ],
    },
    {
      label: "Vendor-solicited reviews",
      unit: "incentive badge present",
      cells: ["Yes", "Yes", "Yes on G2", "Yes", "None to declare"],
    },
  ],
  caption:
    "Review counts and size mixes come from Capterra and G2 profiles read on 7 September 2026. The size figures are not equivalent across platforms: Capterra reports industry and business size separately, G2 reports company size bands, and neither is a customer list. Sokndall has no third-party review history, which is stated rather than left blank.",
  sources: [
    { text: "symplr Provider — [Capterra profile](src:capterraSymplr)" },
    { text: "MedTrainer — [Capterra profile](src:capterraMedtrainer) and [product FAQ](src:medtrainerProduct)" },
    { text: "Modio Health — [Capterra](src:capterraModio) and [G2](src:g2Modio) profiles" },
    { text: "CredentialStream — [Capterra profile](src:capterraCredentialStream) and [G2 category ranking](src:g2Category)" },
  ],
};

export const SECTIONS_AFTER_TABLE = [
  {
    id: "unit",
    heading: "The unit is where these comparisons break",
    paras: [
      "MedTrainer is the only one of the four that documents its own logic: [its product FAQ](src:medtrainerProduct) states that pricing is based on utilisation and scales with the number of users and modules. The other three specify nothing. Per-provider is the unit the market assumes informally, and no vendor investigated publishes it explicitly on its own site. So when a comparison puts two per-unit figures beside each other, at least one of them is measuring something it did not measure.",
    ],
    figure: { value: "$3,600 to $9,000 a year for 15 users", source: "medtrainerBlog", label: "MedTrainer blog, 2026" },
  },
  {
    id: "cost",
    heading: "What software costs, and what the service costs",
    figures: [
      { value: "$600 to $2,400 a year", source: "medicotech", label: "Medicotech, physician credentialing cost" },
      { value: "$1,500 to $5,000 once", source: "medicotech", label: "Medicotech, physician credentialing cost" },
      { value: "$3,600 to $9,000 a year", source: "medtrainerBlog", label: "MedTrainer blog, category cost guidance" },
      { value: "$948 to $8,388 a year", source: "/pricing", label: "Sokndall pricing page, published" },
    ],
    after: [
      "The first two figures buy the work: an outside team submits and maintains, priced per provider. The third buys software, priced in staff seats. The fourth is this product, priced in providers tracked. Nothing about those four numbers is comparable without the unit attached, which is why every one of them carries it here. Software and service are not competing purchases at different prices; they are different purchases.",
    ],
  },
  {
    id: "symplr",
    heading: "symplr Provider: built for the medical staff office",
    paras: [
      "[No published price](/symplr-pricing). [The product page](src:symplrProvider) offers a demo request and an ROI calculator, and [Capterra records contact-vendor-for-pricing](src:capterraSymplr) with no trial and no free version. The charging unit is not stated anywhere symplr publishes. Its own page notes that organisations credentialing 300 or more providers benefit most, which is a segment statement rather than a price.",
      "Multi-facility hospitals and health systems with a medical staff office and a credentialing committee. Every published customer story is one: Central Maine Healthcare, Inspira Health Network, Cone Health, the University of Tennessee Medical Center. This is the historically dominant brand in that segment and there is no argument here that a health system should buy something else.",
    ],
    unverified:
      "List price, charging unit and billing period. Also: symplr Payer's $12,500-per-user figure is a different product on a different unit and is not used as a proxy here.",
  },
  {
    id: "medtrainer",
    heading: "MedTrainer: the one that documents its own pricing logic",
    paras: [
      "[No published price](/medtrainer-pricing), but MedTrainer states in [its own product FAQ](src:medtrainerProduct) that pricing is based on utilisation and scales with the number of users and modules. That is more than any other vendor here discloses. [Its blog](src:medtrainerBlog) separately puts the category at $3,600 to $9,000 a year for fifteen users. [Capterra records](src:capterraMedtrainer) contact-vendor-for-pricing, no trial, no free version.",
      "Small and mid-sized organisations that want credentialing alongside compliance and learning modules: FQHCs, dental groups, urgent care, behavioural health. Seventy-seven per cent of [its Capterra reviewers](src:capterraMedtrainer) are small businesses. If you need the LMS and the compliance side as well, the bundle is a genuine reason to prefer it over a tracking tool.",
    ],
    unverified:
      "The list price itself, and how the module count maps to a number. The blog figure is category guidance, not a quote for MedTrainer's own product.",
  },
  {
    id: "modio",
    heading: "Modio Health: the closest to a small-practice product",
    paras: [
      "[No published price and no self-serve signup](/modio-health-pricing) — [the site](src:modio) offers a demo booking and nothing else. The charging unit is not documented; the marketing language refers to your team or organisation without specifying seats or providers. No third-party figure is circulating for it either, which is unusual for a product with [29 Capterra reviews](src:capterraModio).",
      "Independent medical practices and organisations in the tens rather than the hundreds of providers, including mental health groups. Its own published case study is a practice with more than forty physicians. Of the products here, this is the one whose customer base most resembles the reader of this page, and if you are willing to sit through the demo it is a reasonable shortlist entry.",
    ],
    unverified:
      "Price, unit, billing period. Also whether Capterra's 29 reviews carry the same vendor-incentive pattern confirmed on G2 — that needs a manual pass review by review.",
  },
  {
    id: "credentialstream",
    heading: "CredentialStream: the most enterprise of the group",
    paras: [
      "No published price; [Capterra records contact-vendor-for-pricing](src:capterraCredentialStream) and the model is enterprise or custom. One Capterra reviewer mentions a five-thousand-dollar charge to train new medical staff professionals on the system, which is a training fee rather than a licence fee, said by an anonymous user and not independently verified. It is recorded here as exactly that.",
      "Large hospital organisations and CVOs. Forty-two per cent of [its Capterra reviewers](src:capterraCredentialStream) are enterprise, the highest proportion of any product here. If you have a delegated credentialing agreement and an accreditation cycle to satisfy, this segment is what the product was designed around.",
    ],
    unverified:
      "Everything except the segment. The vendor's own claim to being top-rated by G2 comes from its own blog and is repeated here as a claim, not as a finding.",
  },
  {
    id: "sokndall",
    heading: "Sokndall: published price, narrower product",
    paras: [
      "$79, $299 or $699 a month for 3, 15 or 50 providers, charged per provider with users included. Self-serve signup, fourteen-day trial, cancel from Settings. Every figure on [the pricing page](/pricing) is on the page rather than behind a form. That is the entire differentiator and it is worth naming plainly, because it is a commercial decision rather than a technical achievement.",
      "What it does not have: any of the four products above will do things this one will not. There is no verification against issuing boards, no portal integration, no compliance or learning module, no delegated credentialing support, and no third-party review history at all. It is also in development. A health system should buy symplr. A group that wants compliance bundled should look at MedTrainer.",
    ],
  },
];

export const TEMPLATE_HEADING = "Take the free tracking template before you book any demo";

export const PRICE = {
  heading: "What Sokndall costs, and what it is being compared to",
  paras: [
    "Three plans, published: $79, $299 and $699 a month for up to 3, 15 and 50 providers. Per provider that is $26.33, $19.93 and $13.98. Every plan has every feature, and the fourteen-day trial cancels from Settings before day 15.",
  ],
};

export const CTA = {
  body: "Fourteen-day trial, card up front, cancel yourself before day 15. Nothing on the pricing page changes after you sign up.",
  primary: { label: "Start the fourteen-day trial", href: "/start" },
  secondary: { label: "See the full price list", href: "/pricing" },
};

export const FAQ = [
  {
    q: "What is the best credentialing software?",
    a: "There is no single answer, and any page that gives you one is selling something. symplr is the established choice for hospital medical staff offices; CredentialStream serves the largest organisations; MedTrainer suits small groups that want compliance and learning bundled; Modio Health fits independent practices. Sokndall is the only one that publishes a price, which matters most if you are too small to run a procurement process.",
  },
  {
    q: "How much does credentialing software cost?",
    a: "Four of the five products compared here do not publish a number at all. The only public figure any vendor offers is [MedTrainer's own blog guidance](src:medtrainerBlog) of $3,600 to $9,000 a year for fifteen users, counted in staff seats. Sokndall publishes $79, $299 and $699 a month, counted in providers tracked. Outsourcing the work rather than the tracking runs [$600 to $2,400 per provider per year](src:medicotech).",
  },
  {
    q: "How much does Cactus credentialing software cost?",
    a: "Cactus is now symplr Provider — symplr acquired the product and folded it into that line. symplr does not publish a price for it. The product page offers a demo request and an ROI calculator, and [Capterra records it as contact-vendor-for-pricing](src:capterraSymplr) with no trial and no free version. Any figure you find circulating for Cactus is a third-party estimate rather than a rate symplr publishes.",
  },
  {
    q: "Which credentialing software is best for a small practice?",
    a: "Modio Health and MedTrainer both show substantial small-practice representation in their reviewer bases, and both require a demo before you learn the price. Sokndall publishes its price and is built specifically for one to fifty providers, but it is narrower: no verification, no portal integration, no compliance modules. The honest comparison is scope against transparency, and which of the two you need more.",
  },
  {
    q: "Why do credentialing vendors hide their pricing?",
    a: "Because the price genuinely varies with provider count, module selection and state coverage, and because a seller would rather establish those things in conversation than publish a range a buyer might reject alone. Both reasons are real. The cost of the practice falls hardest on small practices, which have no procurement function and no bargaining power, and which end up staying on a spreadsheet instead.",
  },
  {
    q: "What is the difference between credentialing software and a credentialing service?",
    a: "Software holds records and reminds you; a service does the work. A service submits the applications, follows up with the payer and maintains the profiles, priced at [$600 to $2,400 per provider per year](src:medicotech) for ongoing maintenance. Software is priced at a fraction of that because it replaces a spreadsheet, not a person. No product in this category files applications on your behalf.",
  },
];

export const RELATED = [
  {
    href: "/pricing",
    title: "What Sokndall costs, and what each plan covers",
    hook: "Three plans, three prices, and the unit each figure is counted in.",
  },
  {
    href: "/medtrainer-pricing",
    title: "MedTrainer pricing: a pricing page with no prices",
    hook: "They rank first for their own pricing query. The page does not carry a number.",
  },
  {
    href: "/credentialing-spreadsheet-template",
    title: "The free credentialing spreadsheet template",
    hook: "Six tabs with the formulas already written. No account, one email address.",
  },
];
