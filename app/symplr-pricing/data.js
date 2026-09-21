// `/symplr-pricing` — copy verbatim from H110_COPY_TANDA_B_COMPARACION.md,
// "PÁGINA 13". Replaces the pre-v3.1 copy entirely.
//
// Two figures circulate for symplr and neither is what it appears to be. The
// $12,500-per-user figure belongs to symplr Payer, a different product on a
// different unit (one-time fee), and appears here only to be set aside — it is
// never used as a proxy for symplr Provider.

export const META = {
  title: "symplr Provider Pricing: What Is Public and What Is Not",
  description:
    "symplr does not publish a price for symplr Provider. Here is every figure that does exist, what each one measures, and which product each one belongs to.",
};

export const HEADER = {
  title: "symplr does not publish a price, and the one figure circulating is a different product",
  standfirst:
    "symplr Provider is the established credentialing system for hospital medical staff offices. What it costs is not public, and the one number people quote for symplr belongs to a separate product on a separate unit.",
  category: "Pricing",
  date: "2026-09-08",
  readingTime: "4 min read",
};

// No contents list in the copy for this page: the entries are its H2s verbatim.
export const CONTENTS = [
  { id: "fit", label: "When symplr Provider is the right system to buy" },
  { id: "price", label: "What Sokndall costs, and what it is being compared to" },
];

export const DISCLOSURE = {
  id: "disclosure",
  lead:
    "Two figures get attached to symplr in conversation, and neither is what it appears to be. One of them is not a price at all. The other is a real price, for a different product, on a different unit. Each row below says which is which and where it was read.",
  claims: [
    {
      status: "not-published",
      text: "symplr does not publish a list price for symplr Provider. The product page offers a demo request and an ROI calculator, and nothing else.",
      note: "Confirmed on [symplr.com](src:symplrProvider) and on [the Capterra profile](src:capterraSymplr), which records contact vendor for pricing, with no trial and no free version listed.",
    },
    {
      status: "different-product",
      text: "The $12,500-per-user figure people cite is symplr Payer, a different product, and it is a one-time fee rather than a subscription.",
      note: "[Capterra profile for symplr Payer](src:capterraSymplrPayer), not symplr.com. Different product and different unit, so it is not used as a proxy anywhere on this page.",
    },
    {
      status: "vendor-stated",
      text: "symplr's own page notes that organisations credentialing 300 or more providers benefit most. That is a statement about segment, not price.",
      note: "[symplr Provider product page](src:symplrProvider). Useful for working out whether you are the buyer, which is the more important question here.",
    },
  ],
};

export const PURCHASE = {
  id: "purchase",
  theirs: "symplr Provider",
  rows: [
    {
      criterion: "Published price",
      unit: "yes or no, on the vendor's own site",
      theirs: "No. Demo request and an ROI calculator, with no figure anywhere on the site.",
      ours: "Yes. Three figures on the page, and the same three inside the product schema.",
    },
    {
      criterion: "Target size",
      unit: "providers the product is designed around",
      theirs: "300 or more providers, by symplr's own account. Health systems and hospitals.",
      ours: "One to fifty providers. A practice or a billing company, not a health system.",
    },
  ],
  note:
    "This row matters more than the price. symplr Provider was built for a medical staff office with a credentialing committee, and its published customers are all multi-facility health systems. If that describes you, the missing price is a procurement question rather than a barrier. If it does not, the price was never the reason it would not fit.",
};

export const FIT = {
  id: "fit",
  heading: "When symplr Provider is the right system to buy",
  paras: [
    "Multi-facility hospitals and health systems with a medical staff office. Central Maine Healthcare, Inspira Health Network, Cone Health and the University of Tennessee Medical Center are all published customers, and they are the shape of organisation the product was designed around. It is the historically dominant brand in that segment, and nothing on this page argues that a health system should buy a $79-a-month tracker instead.",
  ],
};

// The copy gives no EmailCapture heading for this page; the box keeps the
// component's default heading from templateCta.js.
export const TEMPLATE_HEADING = undefined;

export const PRICE = {
  heading: "What Sokndall costs, and what it is being compared to",
  paras: [
    "$79, $299 and $699 a month for up to 3, 15 and 50 providers — $26.33, $19.93 and $13.98 per provider. Every plan has every feature. A 14-day trial, card up front, cancel yourself from Settings before day 15.",
  ],
};

// Button labels are not given for this page; they are page 12's approved pair.
export const CTA = {
  body: "A different product for a different size of organisation, with the price on the page instead of behind a form.",
  primary: { label: "Start the 14-day trial", href: "/start" },
  secondary: { label: "See all three plans", href: "/pricing" },
};

export const FAQ = [
  {
    q: "How much does symplr cost?",
    a: "symplr does not publish a price for symplr Provider. The product page offers a demo request and an ROI calculator, and [Capterra records contact-vendor-for-pricing](src:capterraSymplr) with no trial and no free version. A $12,500-per-user figure circulates, but it belongs to [symplr Payer](src:capterraSymplrPayer) — a different product, sold as a one-time fee rather than a subscription — and it should not be read as a proxy.",
  },
  {
    q: "Does symplr publish its pricing?",
    a: "No. Neither the product page nor the Capterra profile carries a figure, and there is no self-serve path to one. For the organisations symplr sells to this is normal procurement practice rather than evasion: a health system credentialing several hundred providers negotiates a contract, and a list price would not survive contact with the first deal.",
  },
  {
    q: "Is symplr right for a small practice?",
    a: "Probably not, and symplr comes close to saying so itself — [its product page](src:symplrProvider) notes that organisations credentialing 300 or more providers benefit most. Every published customer story is a multi-facility health system. A three-provider practice would be buying a system designed around a credentialing committee and delegated authority, which is a governance structure it does not have.",
  },
];

// No related cards in the copy for this page. Architecture v3.1 §6: 13 → 3, 2.
// Third card: MedTrainer, with page 3's approved title and hook.
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
    href: "/medtrainer-pricing",
    title: "MedTrainer pricing: a pricing page with no prices",
    hook: "They rank first for their own pricing query. The page does not carry a number.",
  },
];
