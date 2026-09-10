/**
 * Provisional nav + footer data. CATALOGO_SISTEMA.md does not specify the
 * items — these are drawn from the routes in H110_ARQUITECTURA_v3.md §6 and
 * flagged as an open question in NOTAS_STYLEGUIDE.md.
 */
export const NAV = {
  trialHref: "/pricing",
  items: [
    { label: "Pricing", href: "/pricing" },
    { label: "Payer enrollment", href: "/payer-enrollment-software" },
    { label: "CAQH reattestation", href: "/caqh-reattestation" },
    { label: "For billing companies", href: "/for-billing-companies" },
  ],
};

export const FOOTER = {
  columns: [
    {
      title: "Product",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "Payer enrollment software", href: "/payer-enrollment-software" },
        { label: "Credentialing tracking software", href: "/credentialing-tracking-software" },
        { label: "Spreadsheet template", href: "/credentialing-spreadsheet-template" },
      ],
    },
    {
      title: "Guides",
      links: [
        { label: "CAQH reattestation", href: "/caqh-reattestation" },
        { label: "Provider credentialing checklist", href: "/provider-credentialing-checklist" },
        { label: "Insurance credentialing for therapists", href: "/insurance-credentialing-for-therapists" },
      ],
    },
    {
      title: "Compare",
      links: [
        { label: "Best credentialing software", href: "/best-credentialing-software" },
        { label: "symplr pricing", href: "/symplr-pricing" },
        { label: "MedTrainer pricing", href: "/medtrainer-pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Security", href: "/security" },
      ],
    },
  ],
  legal: "© 2026 Sokndall. Provider credential and payer enrollment tracking. No PHI.",
};
