import { SITE_URL, SITE_NAME } from "@/lib/seo";
import { plainText } from "@/components/neo/rich";

/**
 * JSON-LD for the marketing pages (on-page-seo.md §8).
 *
 * Rendered as a plain <script> on the server, so it is in the raw HTML with no
 * JavaScript run. Next's App Router has no metadata field for structured data;
 * its documented pattern is a script in the page body, which Google reads the
 * same as one in <head>.
 *
 * What goes where:
 *   Organization               the root layout, every page
 *   SoftwareApplication+Offer  `/` and `/pricing` only, prices from PLAN_PRICES
 *   FAQPage                    every page with a FAQ, questions verbatim
 *   Article                    the editorial pages
 * LocalBusiness is prohibited and has no builder here on purpose.
 */

/** The published plan prices. The visible price list and the schema both read
 *  from this, so the two cannot disagree (DESIGN_RULES.md §2 regla 7). The
 *  provider and user limits feed the plan matrix on /pricing (2026-09-12). */
export const PLAN_PRICES = [
  { name: "Solo", price: "79", providers: 3, users: 1 },
  { name: "Practice", price: "299", providers: 15, users: 3 },
  { name: "Billing Co", price: "699", providers: 50, users: 10 },
];

export function JsonLd({ data }) {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps a string in the data from closing the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
  };
}

export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: `${SITE_URL}/`,
    offers: PLAN_PRICES.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price,
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.price,
        priceCurrency: "USD",
        unitCode: "MON",
        referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
      },
    })),
  };
}

/** `items` are the same objects the accordion renders, so the question text is
 *  literally the one on screen and the answer is its text minus link syntax. */
export function faqSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: plainText(it.a) },
    })),
  };
}

export function articleSchema({ headline, description, path, datePublished, dateModified, image }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    mainEntityOfPage: `${SITE_URL}${path}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
  };
}
