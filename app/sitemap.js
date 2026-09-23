import { SITE_URL } from "@/lib/seo";

// Every indexable marketing URL: the fifteen pages of the v3.1 map
// (H110_ARQUITECTURA_v3.1.md §4) plus the permanent pages: /about, /security
// and, since 2026-09-22, the two legal pages now that they carry real text.
// No app routes.
//
// Deliberately absent, because v3.1 removed them: /credentialing-tracking-
// software, /credential-expiration-tracking, /dea-renewal-tracking, the
// /payer-enrollment/ hub and its payer guides, and /payer-enrollment/aetna-
// behavioral-health. /landing is a 301 to / and is not listed either.
const ROUTES = [
  "/",
  "/pricing",
  "/best-credentialing-software",
  "/credentialing-spreadsheet-template",
  "/insurance-credentialing-for-therapists",
  "/behavioral-health-credentialing",
  "/caqh-reattestation",
  "/caqh-provider-data-portal",
  "/payer-enrollment-software",
  "/provider-credentialing-checklist",
  "/for-billing-companies",
  "/medtrainer-pricing",
  "/symplr-pricing",
  "/modio-health-pricing",
  "/credentialing-services-for-therapists",
  "/about",
  "/security",
  "/terms",
  "/privacy",
];

export default function sitemap() {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
