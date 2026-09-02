// Shared chrome for every marketing page: nav, footer, and the one href the
// trial CTA points at. Changing TRIAL_HREF changes it everywhere.

export const TRIAL_HREF = "/login";

export const NAV_LINKS = [
  { label: "Payer Enrollment", href: "/payer-enrollment-software" },
  { label: "Expiration Tracking", href: "/credential-expiration-tracking" },
  { label: "Pricing", href: "/pricing" },
  { label: "Free Template", href: "/credentialing-spreadsheet-template" },
];

export const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Payer Enrollment", href: "/payer-enrollment-software" },
      { label: "Expiration Tracking", href: "/credential-expiration-tracking" },
      { label: "Pricing", href: "/pricing" },
      { label: "For Billing Companies", href: "/for-billing-companies" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Free Template", href: "/credentialing-spreadsheet-template" },
      { label: "How payer enrollment works", href: "/payer-enrollment/" },
      { label: "CAQH reattestation", href: "/caqh-reattestation" },
      { label: "DEA renewal tracking", href: "/dea-renewal-tracking" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];
