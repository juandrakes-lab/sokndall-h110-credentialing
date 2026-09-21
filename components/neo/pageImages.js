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
/*
 * FILLED 2026-09-21 from Pexels (the key works now), one graded series — see
 * the SERIES treatment in scripts/editorial-image.mjs and DESIGN_DECISIONS.md.
 * `/behavioral-health-credentialing` is the one generated image: Pexels had
 * nothing that fits (clinical exam rooms, or sessions with a client in frame).
 * Generated from the prompt recorded in DESIGN_DECISIONS.md (2026-09-21) and
 * put through the same SERIES grade. `generated: true`, and no credit.
 */
const PAGE_IMAGES = {
  "/behavioral-health-credentialing": {
    alt: "An empty therapy office in daylight: two sage armchairs facing each other across a small wooden table",
    header: { src: "/editorial/behavioral-health-credentialing-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/behavioral-health-credentialing-card.webp", width: 672, height: 448 },
    og: "/editorial/behavioral-health-credentialing-og.jpg",
    generated: true,
  },
  "/caqh-reattestation": {
    alt: "A hand writing dates on a large paper desk calendar",
    header: { src: "/editorial/caqh-reattestation-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/caqh-reattestation-card.webp", width: 672, height: 448 },
    og: "/editorial/caqh-reattestation-og.jpg",
    credit: { photographer: "RDNE Stock project", url: "https://www.pexels.com/photo/a-person-writing-on-the-calendar-using-a-blue-marker-6170766/" },
  },
  "/caqh-provider-data-portal": {
    alt: "A hand resting on a light keyboard at a desk, in soft daylight",
    header: { src: "/editorial/caqh-provider-data-portal-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/caqh-provider-data-portal-card.webp", width: 672, height: 448 },
    og: "/editorial/caqh-provider-data-portal-og.jpg",
    credit: { photographer: "Jakub Zerdzicki", url: "https://www.pexels.com/photo/typing-on-keyboard-in-office-16284689/" },
  },
  "/provider-credentialing-checklist": {
    alt: "A hand filling in a form on a clipboard",
    header: { src: "/editorial/provider-credentialing-checklist-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/provider-credentialing-checklist-card.webp", width: 672, height: 448 },
    og: "/editorial/provider-credentialing-checklist-og.jpg",
    credit: { photographer: "RDNE Stock project", url: "https://www.pexels.com/photo/person-holding-a-pen-9064799/" },
  },
  "/insurance-credentialing-for-therapists": {
    alt: "Someone on a phone call, writing notes in a notebook at a desk",
    header: { src: "/editorial/insurance-credentialing-for-therapists-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/insurance-credentialing-for-therapists-card.webp", width: 672, height: 448 },
    og: "/editorial/insurance-credentialing-for-therapists-og.jpg",
    credit: { photographer: "Vlada Karpovich", url: "https://www.pexels.com/photo/shallow-focus-of-a-person-taking-down-notes-on-the-table-8367849/" },
  },
  "/credentialing-services-for-therapists": {
    alt: "Two people's hands going over printed documents on a wooden table",
    header: { src: "/editorial/credentialing-services-for-therapists-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/credentialing-services-for-therapists-card.webp", width: 672, height: 448 },
    og: "/editorial/credentialing-services-for-therapists-og.jpg",
    credit: { photographer: "Kindel Media", url: "https://www.pexels.com/photo/persons-in-long-sleeves-shirts-sitting-and-holding-a-documents-7651953/" },
  },
  "/best-credentialing-software": {
    alt: "A hand writing on sticky notes beside an open laptop",
    header: { src: "/editorial/best-credentialing-software-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/best-credentialing-software-card.webp", width: 672, height: 448 },
    og: "/editorial/best-credentialing-software-og.jpg",
    credit: { photographer: "https://kaboompics.com/", url: "https://www.pexels.com/photo/person-writing-on-green-sticky-notes-8547193/" },
  },
  "/symplr-pricing": {
    alt: "Black ring binders and a pair of glasses resting on papers",
    header: { src: "/editorial/symplr-pricing-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/symplr-pricing-card.webp", width: 672, height: 448 },
    og: "/editorial/symplr-pricing-og.jpg",
    credit: { photographer: "https://kaboompics.com/", url: "https://www.pexels.com/photo/photograph-of-eyeglasses-on-top-of-binders-7681493/" },
  },
  "/modio-health-pricing": {
    alt: "Hands at a calculator on a wooden desk, beside printed figures",
    header: { src: "/editorial/modio-health-pricing-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/modio-health-pricing-card.webp", width: 672, height: 448 },
    og: "/editorial/modio-health-pricing-og.jpg",
    credit: { photographer: "Mikhail Nilov", url: "https://www.pexels.com/photo/couple-people-woman-hand-6963867/" },
  },
  "/medtrainer-pricing": {
    alt: "Hands writing on a printed document at a desk",
    header: { src: "/editorial/medtrainer-pricing-header.webp", width: 1600, height: 686 },
    card: { src: "/editorial/medtrainer-pricing-card.webp", width: 672, height: 448 },
    og: "/editorial/medtrainer-pricing-og.jpg",
    credit: { photographer: "cottonbro studio", url: "https://www.pexels.com/photo/a-person-signing-contract-documents-6814526/" },
  },
};

export function headerImage(route) {
  const e = PAGE_IMAGES[route];
  return e ? { ...e.header, alt: e.alt, credit: e.credit } : null;
}

export function cardImage(route) {
  const e = PAGE_IMAGES[route];
  return e ? { ...e.card, alt: e.alt } : null;
}

export function ogImage(route) {
  return PAGE_IMAGES[route]?.og || null;
}

export default PAGE_IMAGES;
