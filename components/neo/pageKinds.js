/**
 * The kind label a page carries when another page links to it.
 *
 * One map, keyed by route. A related-guide card never carries a hand-written
 * string: it looks its label up here from the href it points at, so the same
 * page is labelled identically wherever it is linked from, and renaming a
 * category is one edit rather than one per linking page.
 *
 * **Provenance.** These labels are a taxonomy defined during the design
 * process, approved 6 September 2026. They are NOT inherited from
 * `H110_ARQUITECTURA_v3.md` — that document classifies pages by wave and by
 * keyword cluster, which are planning axes with nothing to say to a reader
 * choosing what to open next. This file is the definition; DESIGN_RULES.md
 * §12 is the record of where it came from.
 *
 * Five values:
 *
 *   Guide       reference content, read rather than converted against
 *   Comparison  a named competitor's pricing, argued section by section
 *   Pricing     our own price table — only `/pricing` has one
 *   Template    the downloadable spreadsheet
 *   Product     what the product does for one job, and who it is for
 *
 * `Product` was added when the three product pages turned out to be labelled
 * `Guide`, which they are not. `Pricing` was the other candidate and is wrong
 * for them: a card labelled `Pricing` promises a price table on the other end,
 * and none of these three has one — they link on to `/pricing` for that. A
 * label that promises something the destination does not have is the same
 * defect as the one it would be replacing.
 */
const PAGE_KINDS = {
  "/pricing": "Pricing",
  "/credentialing-spreadsheet-template": "Template",

  "/symplr-pricing": "Comparison",
  "/modio-health-pricing": "Comparison",
  "/medtrainer-pricing": "Comparison",
  "/best-credentialing-software": "Comparison",

  "/caqh-reattestation": "Guide",
  // The remaining article routes from the architecture, none built yet.
  "/insurance-credentialing-for-therapists": "Guide",
  "/behavioral-health-credentialing": "Guide",
  "/caqh-provider-data-portal": "Guide",
  "/provider-credentialing-checklist": "Guide",
  "/payer-enrollment/aetna-behavioral-health": "Guide",

  "/payer-enrollment-software": "Product",
  "/credentialing-tracking-software": "Product",
  "/for-billing-companies": "Product",
};

/** Returns the label for a route, or null. A missing route renders no eyebrow
 *  rather than a guessed one. */
export function pageKind(href) {
  if (!href) return null;
  return PAGE_KINDS[href.split(/[?#]/)[0].replace(/\/$/, "") || "/"] || null;
}

export default PAGE_KINDS;
