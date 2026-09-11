// Shared chrome for every neo marketing page. Changing TRIAL_HREF changes the
// CTA everywhere. Nav/footer sets are deliberately the same as the forest
// skin's siteData.js so the two never disagree about what routes exist.

export const TRIAL_HREF = "/login";

export const NAV_LINKS = [
  { label: "Payer enrollment", href: "/payer-enrollment-software" },
  { label: "Pricing", href: "/pricing" },
];

export const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Payer enrollment", href: "/payer-enrollment-software" },
      { label: "Pricing", href: "/pricing" },
      { label: "For billing companies", href: "/for-billing-companies" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { label: "symplr pricing", href: "/symplr-pricing" },
      { label: "Modio Health pricing", href: "/modio-health-pricing" },
      { label: "MedTrainer pricing", href: "/medtrainer-pricing" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { label: "Free spreadsheet template", href: "/credentialing-spreadsheet-template" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security", href: "/security" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

// ---- v3.1 footer (2026-09-10) ----------------------------------------------
//
// The fifteen pages of the v3.1 map pass these to `Footer`; `/about` and
// `/security` are out of scope for this run and keep the defaults above
// untouched until their own pass. The blurb is the approved line from
// H110_COPY_TANDA_A_LANDING.md ("Cierre y footer"), which also retires the
// "3 to 30 providers" claim — v3.1 sizes the product at 1 to 50.
export const FOOTER_BLURB_V31 =
  "Sokndall tracks provider credentials and payer enrollment applications for small practices and billing companies. No PHI.";

export const FOOTER_COLS_V31 = [
  {
    heading: "Product",
    links: [
      { label: "Payer enrollment", href: "/payer-enrollment-software" },
      { label: "Pricing", href: "/pricing" },
      { label: "For billing companies", href: "/for-billing-companies" },
    ],
  },
  {
    heading: "Compare",
    links: [
      { label: "Best credentialing software", href: "/best-credentialing-software" },
      { label: "symplr pricing", href: "/symplr-pricing" },
      { label: "Modio Health pricing", href: "/modio-health-pricing" },
      { label: "MedTrainer pricing", href: "/medtrainer-pricing" },
    ],
  },
  {
    heading: "Guides",
    links: [
      { label: "Credentialing for therapists", href: "/insurance-credentialing-for-therapists" },
      { label: "Behavioral health credentialing", href: "/behavioral-health-credentialing" },
      { label: "CAQH reattestation", href: "/caqh-reattestation" },
      { label: "CAQH Provider Data Portal", href: "/caqh-provider-data-portal" },
      { label: "Credentialing checklist", href: "/provider-credentialing-checklist" },
      { label: "Credentialing services", href: "/credentialing-services-for-therapists" },
      { label: "Free spreadsheet template", href: "/credentialing-spreadsheet-template" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security", href: "/security" },
      { label: "Sign in", href: "/login" },
    ],
  },
];

// The FAQ section heading on a landing page. No copy file supplies one for the
// landing FAQs, so the landing uses the same structural label the editorial
// template prints ("Frequently asked questions"), broken for the .sk-h2 line
// budget. Recorded in DESIGN_DECISIONS.md, 2026-09-10.
export const FAQ_HEADING = ["Frequently asked", "questions"];

// The FAQ section head on every landing. The pill is a structural label, like
// the heading itself (DESIGN_RULES.md §13: every section head carries one).
export const FAQ_HEAD = { pill: "FAQ", title: FAQ_HEADING };

// The price format every plan row uses.
export const PLAN_PERIOD = "/month";
