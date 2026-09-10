import { SITE_URL } from "@/lib/seo";

// Every indexable marketing URL. /landing is excluded (301 → /). /terms and
// /privacy are excluded until they have real content. No app routes.
const ROUTES = [
  "/",
  "/pricing",
  "/payer-enrollment-software",
  "/for-billing-companies",
  "/credentialing-spreadsheet-template",
  "/caqh-reattestation",
  "/symplr-pricing",
  "/modio-health-pricing",
  "/medtrainer-pricing",
  "/about",
  "/security",
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
