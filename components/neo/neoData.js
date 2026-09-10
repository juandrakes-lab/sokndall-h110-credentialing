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
