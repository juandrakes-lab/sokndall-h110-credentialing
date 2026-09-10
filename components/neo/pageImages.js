/**
 * The header photograph of each editorial page, indexed by route, and the 3:2
 * crop of it that a related-guide card shows when it links to that page.
 *
 * One registry, so a card never goes looking for a picture of its own: the
 * rule is that a card shows the header of the page it points at, cropped to
 * 3:2 (DESIGN_DECISIONS.md, EditorialTemplate — tarjetas de relacionados).
 * A route with no entry has no header photograph, and every card pointing at
 * it keeps the empty, declared 3:2 slot.
 *
 * Landing pages never appear here: there is no photography on a landing
 * (decision already taken), so a card linking to `/pricing` or to the
 * template page always shows the empty slot.
 *
 * Entry shape, once an image exists (see scripts/editorial-image.mjs, which
 * produces all three files from one source photograph):
 *
 *   "/caqh-reattestation": {
 *     alt: "…",                                  // descriptive, no keyword stuffing
 *     header: { src: "/editorial/<slug>-header.webp", width: 1600, height: 686 },
 *     card:   { src: "/editorial/<slug>-card.webp",   width: 672,  height: 448 },
 *     og:     "/editorial/<slug>-og.jpg",          // 1200 x 630
 *     credit: { photographer: "…", url: "https://www.pexels.com/photo/…" },
 *   },
 *
 * EMPTY on 2026-09-10: the Pexels API key supplied for the run was rejected
 * (401 "Invalid API key" on every uncached request), so no photograph could be
 * sourced and every header ships as its declared 21:9 slot. Recorded in
 * DESIGN_DECISIONS.md.
 */
const PAGE_IMAGES = {};

export function headerImage(route) {
  const e = PAGE_IMAGES[route];
  return e ? { ...e.header, alt: e.alt } : null;
}

export function cardImage(route) {
  const e = PAGE_IMAGES[route];
  return e ? { ...e.card, alt: e.alt } : null;
}

export function ogImage(route) {
  return PAGE_IMAGES[route]?.og || null;
}

export default PAGE_IMAGES;
