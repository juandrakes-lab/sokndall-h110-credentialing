// `/modio-health-pricing` — copy verbatim from H110_COPY_TANDA_B_COMPARACION.md,
// "PÁGINA 14". Replaces the pre-v3.1 copy entirely.
//
// The one concrete public fact about how Modio is sold is its paid search: 27
// keywords whose ads lead to a demo booking, never to a figure. The copy
// treats it as evidence, not a jab, and so does this page.

export const META = {
  title: "Modio Health Pricing: What Is Public and What Is Not",
  description:
    "Modio Health does not publish a price for OneView. What it does publish is 27 paid search keywords, all of which lead to a demo booking rather than a figure.",
};

export const HEADER = {
  title: "Modio Health does not publish a price, and it buys 27 search keywords to say so",
  standfirst:
    "OneView is the closest product in this category to a small-practice tool, and finding out what it costs still requires a demo. The advertising spend around that demo is the most concrete evidence available of how it is sold.",
  category: "Pricing",
  date: "2026-09-08",
  readingTime: "4 min read",
};

// No contents list in the copy for this page: the entries are its H2s verbatim.
export const CONTENTS = [
  { id: "fit", label: "When Modio Health is the right product to buy" },
  { id: "price", label: "What Sokndall costs, and what it is being compared to" },
];

// Claim 3's provenance is the copy's own: "Paid keyword data, September 2026".
// The copy gives no URL for it, so it carries none (reported).
export const DISCLOSURE = {
  id: "disclosure",
  lead:
    "There is less public information about Modio's pricing than about any other product compared on this site. What exists is the shape of the sale rather than the price itself, and that turns out to be informative.",
  claims: [
    {
      status: "not-published",
      text: "Modio Health does not publish a price for OneView. The site offers a free demo booking and there is no self-serve signup path anywhere on it.",
      note: "Confirmed on [modiohealth.com](src:modio). No third-party figure was found circulating for the product, which is unusual for one with [29 Capterra reviews](src:capterraModio).",
    },
    {
      status: "not-published",
      text: "The charging unit is not documented. Marketing copy refers to your team and your organisation without specifying seats, providers or modules.",
      note: "[modiohealth.com](src:modio). Per-provider is the unit the market assumes informally, but Modio does not state it anywhere public.",
    },
    {
      status: "vendor-stated",
      text: "Modio runs 27 paid search keywords whose ad copy reads try our free demo today and schedule a demo. Not one of them leads to a figure.",
      note: "Paid keyword data, September 2026. This is direct, citable evidence of the sales model rather than an inference about it.",
    },
  ],
};

export const PURCHASE = {
  id: "purchase",
  theirs: "Modio Health",
  rows: [
    {
      criterion: "Published price",
      unit: "yes or no, on the vendor's own site",
      theirs: "No. A free demo booking, and no self-serve signup path anywhere on the site.",
      ours: "Yes. Three figures on the page, and the same three inside the product schema.",
    },
    {
      criterion: "What the ads promise",
      unit: "what a paid click actually leads to",
      theirs: "A demo booking. Twenty-seven paid keywords, and not one lands on a figure.",
      ours: "The price list. There is no ad spend here, and no page behind a form.",
    },
  ],
  note:
    "The paid keyword data is evidence, not a jab. Twenty-seven keywords is a real budget spent getting a buyer into a conversation, and that spend is recovered somewhere inside whatever price the demo produces. It is also the clearest available answer to a question the site itself never answers: how Modio expects to be bought.",
};

export const FIT = {
  id: "fit",
  heading: "When Modio Health is the right product to buy",
  paras: [
    "Independent medical practices and organisations with tens rather than hundreds of providers, including mental health groups. Its own published case study is a practice with more than forty physicians, and [its Capterra base](src:capterraModio) runs about half hospital and health care with a quarter medical practice. Of every product compared on this site, this is the one whose customers most resemble the reader of this page, and it is a reasonable shortlist entry if you will sit through the demo.",
  ],
};

// No EmailCapture heading in the copy for this page: the component default.
export const TEMPLATE_HEADING = undefined;

export const PRICE = {
  heading: "What Sokndall costs, and what it is being compared to",
  paras: [
    "$79, $299 and $699 a month for up to 3, 15 and 50 providers — $26.33, $19.93 and $13.98 per provider. Every plan has every feature. A 14-day trial, card up front, cancel yourself from Settings before day 15.",
  ],
};

// Button labels are not given for this page; they are page 12's approved pair.
export const CTA = {
  body: "The same size of buyer, without the demo. The price is on the page and the trial starts when you decide it does.",
  primary: { label: "Start the 14-day trial", href: "/start" },
  secondary: { label: "See all three plans", href: "/pricing" },
};

export const FAQ = [
  {
    q: "How much does Modio Health cost?",
    a: "Modio Health does not publish a price for OneView, and no third-party figure is circulating either — unusual for a product with [29 Capterra reviews](src:capterraModio). The site offers a free demo booking and no self-serve path. The charging unit is not documented anywhere public: the marketing copy refers to your team without specifying seats, providers or modules.",
  },
  {
    q: "Does Modio Health publish its pricing?",
    a: "No. It runs 27 paid search keywords whose ad copy invites you to try a free demo or schedule one, and not a single one of them leads to a figure. That advertising spend is the most concrete public evidence of how the product is sold, and it is a real budget that has to be recovered somewhere inside whatever price the demo eventually produces.",
  },
  {
    q: "What is OneView?",
    a: "OneView is Modio Health's credentialing platform — the product name you will see on the site and in reviews. It covers provider data management, credentialing and payer enrollment tracking for practices and medical groups. Its published case study is a practice with more than forty physicians, which is a fair indication of the size it is built around.",
  },
];

// No related cards in the copy for this page. Architecture v3.1 §6: 14 → 3, 2.
// Third card: symplr, titled with its own approved <title> (brand dropped) and
// hooked with the first sentence of its approved meta description.
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
    href: "/symplr-pricing",
    title: "symplr Provider Pricing: What Is Public and What Is Not",
    hook: "symplr does not publish a price for symplr Provider.",
  },
];
