// `/medtrainer-pricing` — copy verbatim from H110_COPY_TANDA_B_COMPARACION.md,
// "PÁGINA 12". Replaces the pre-v3.1 copy entirely.
//
// The angle, verbatim from the copy: MedTrainer has a /pricing/ page and it
// ranks first; that page has no prices. Excluded on purpose: SelectHub's "$4
// per user/month" (a directory's own calculation for the LMS module).

export const META = {
  title: "MedTrainer Pricing: What Is Public and What Is Not",
  description:
    "MedTrainer has a pricing page and it does not carry a price. Here is what the company does publish about cost, and what it costs to find out the rest.",
};

export const HEADER = {
  title:
    "MedTrainer has a pricing page, and there is no price anywhere on it. Here is what the company does publish",
  standfirst:
    "What MedTrainer publishes about cost, what its own blog says the category runs, and what the review sites record. One of those three is more useful than the other two, and it is not the pricing page.",
  category: "Pricing",
  date: "2026-09-08",
  readingTime: "5 min read",
};

// The copy gives no contents list for this page. The entries are the page's
// own H2s, verbatim; the two blocks without an H2 (the disclosure and the
// purchase-model table) have no entry rather than an invented label.
export const CONTENTS = [
  { id: "fit", label: "When MedTrainer is the right product to buy" },
  { id: "price", label: "What Sokndall costs, and what it is being compared to" },
];

export const DISCLOSURE = {
  id: "disclosure",
  lead:
    "Three separate things get called MedTrainer's price, and only one of the three comes from MedTrainer itself. Each row below says which is which, what it is a price for, and where it was read. Nothing here is a quote for your practice.",
  claims: [
    {
      status: "not-published",
      text: "MedTrainer does not publish a list price for credentialing. The product page offers a demo and a call with an expert; there is no self-serve path.",
      note: "Confirmed on [medtrainer.com product page](src:medtrainerProduct) and on [the Capterra profile](src:capterraMedtrainer), which records contact vendor for pricing, no trial, no free version.",
    },
    {
      status: "vendor-stated",
      text: "Pricing is based on utilisation and scales with the number of users and modules. This is MedTrainer describing its own model, in its own FAQ.",
      note: "[MedTrainer product FAQ](src:medtrainerProduct). It is the only vendor in this category that documents its charging logic publicly, which is worth crediting.",
    },
    {
      status: "vendor-stated",
      text: "MedTrainer's blog puts the category at $20 to $50 per user per month, or $3,600 to $9,000 a year for fifteen users. Users, not providers.",
      note: "[MedTrainer blog on credentialing software cost](src:medtrainerBlog). This is category guidance published by the vendor, not a quote for MedTrainer's own product.",
    },
    {
      status: "user-reported",
      text: "One verified Capterra review describes a one-year contract with thirty days' notice required before renewal. That is a term, not a price.",
      note: "[Capterra review](src:capterraMedtrainer), marked as a user review. Capterra also shows a vendor-referred incentive badge on multiple MedTrainer reviews.",
    },
  ],
};

export const PURCHASE = {
  id: "purchase",
  theirs: "MedTrainer",
  rows: [
    {
      criterion: "Published price",
      unit: "yes or no, on the vendor's own site",
      theirs: "No. The pricing page routes to a demo request and a call with a sales expert.",
      ours: "Yes. Three figures on the page, and the same three inside the product schema.",
    },
    {
      criterion: "Charging unit",
      unit: "what the vendor counts to reach the number",
      theirs: "Users and modules, by utilisation. Stated by MedTrainer in its own product FAQ.",
      // Replaced by copywriting on 2026-09-14 (the $39 additional user on Billing Co).
      ours: "Providers tracked. Users included up to each plan's limit; Billing Co bills $39 past ten.",
    },
    {
      criterion: "First step to buy",
      unit: "what a buyer has to do before seeing a number",
      theirs: "Book a demo or take a sales call. There is no self-serve signup path at all.",
      ours: "Enter a card and start. 14 days, cancel from Settings before day 15.",
    },
  ],
  note:
    "Neither model is wrong. MedTrainer sells a bundle whose price depends on which modules an organisation takes, and a published figure would misdescribe most deals. Sokndall sells one product at three sizes, which is an easier thing to put a number on. What the row above shows is not that one vendor is hiding something.",
};

export const FIT = {
  id: "fit",
  heading: "When MedTrainer is the right product to buy",
  paras: [
    "If you need compliance training, policy management and credentialing in one system, MedTrainer covers ground that a tracking tool does not touch. Seventy-seven per cent of [its Capterra reviewers](src:capterraMedtrainer) are small businesses and its customer stories are FQHCs, dental groups and behavioural health organisations, which is a genuine small-practice base rather than an enterprise product marketed downward. The demo requirement is the cost of entry, not evidence of anything worse.",
  ],
};

export const TEMPLATE_HEADING = "The free credentialing tracking template, while you decide";

export const PRICE = {
  heading: "What Sokndall costs, and what it is being compared to",
  paras: [
    "$79, $299 and $699 a month for up to 3, 15 and 50 providers — $26.33, $19.93 and $13.98 per provider. Every plan has every feature. A 14-day trial, card up front, cancel yourself from Settings before day 15.",
  ],
};

export const CTA = {
  body: "No demo required to see the price, because the price is already on the page. 14 days, and you cancel it yourself.",
  primary: { label: "Start the 14-day trial", href: "/start" },
  secondary: { label: "See all three plans", href: "/pricing" },
};

export const FAQ = [
  {
    q: "How much does MedTrainer cost?",
    a: "MedTrainer does not publish a price. Its product page offers a demo and a call, and [Capterra records contact-vendor-for-pricing](src:capterraMedtrainer) with no trial and no free version. What the company does state is that pricing runs on utilisation and scales with users and modules. [Its own blog](src:medtrainerBlog) puts the category at $20 to $50 per user per month, which is guidance for the market rather than a quote for its product.",
  },
  {
    q: "Does MedTrainer publish its pricing?",
    a: "No. It has a pricing page, and that page ranks first for its own pricing query, but there is no figure on it — the page routes to a demo request. This is worth checking yourself rather than taking on trust, because it takes one click. Capterra, SaaSworthy and FindLM all independently record MedTrainer as custom-quote only.",
  },
  {
    q: "What is included in MedTrainer credentialing?",
    a: "Provider enrollment and credentialing tracking, sitting alongside the compliance and learning modules that make up the rest of the platform. Because pricing scales with modules, which parts are included is a per-deal question rather than a published list. That bundling is the actual reason to consider it: it covers compliance ground that a dedicated credentialing tracker does not.",
  },
  {
    q: "Does MedTrainer require a contract?",
    a: "[One verified Capterra review](src:capterraMedtrainer) describes a one-year contract requiring thirty days' notice before renewal. That is a user report, not a policy MedTrainer publishes, and it is recorded here as such. Capterra also shows a vendor-referred incentive badge on several MedTrainer reviews, so the review base as a whole should be read with that in mind — in both directions.",
  },
];

// The copy gives no related cards for this page. Architecture v3.1 §6 links
// 12 → 3 and 2; the third is the template. Every title and hook is an approved
// string: page 3's own cards for /pricing and the template, and for /best-
// credentialing-software its <title> (brand dropped) and the first sentence of
// its standfirst. See DESIGN_DECISIONS.md.
export const RELATED = [
  {
    href: "/best-credentialing-software",
    title: "Best Credentialing Software: What Each One Costs",
    hook: "Five products, what each one actually costs, and who each is built for.",
  },
  {
    href: "/pricing",
    title: "What Sokndall costs, and what each plan covers",
    hook: "Three plans, three prices, and the unit each figure is counted in.",
  },
  {
    href: "/credentialing-spreadsheet-template",
    title: "The free credentialing spreadsheet template",
    hook: "Six tabs with the formulas already written. No account, one email address.",
  },
];
