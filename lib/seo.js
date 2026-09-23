// Per-page metadata helper for the marketing site. Every marketing page runs
// its title/description through this so canonical, Open Graph and Twitter tags
// stay consistent and self-referential. `metadataBase` lives in app/layout.jsx,
// so `alternates.canonical` can be a root-relative path and Next resolves it to
// an absolute URL against https://sokndall.com.

export const SITE_URL = "https://sokndall.com";
export const SITE_NAME = "Sokndall";

// Default social share image: the logotype, white on ink (2026-09-22). It is
// app/opengraph-image.png, which Next also serves to every route with no
// metadata of its own; pages with a purpose-built image pass `image`.
const DEFAULT_OG_IMAGE = "/opengraph-image.png";

/**
 * @param {object} opts
 * @param {string} opts.title        Unique page title (already includes " — Sokndall").
 * @param {string} opts.description  Unique meta description.
 * @param {string} opts.path         Root-relative canonical path, e.g. "/pricing" or "/".
 * @param {"website"|"article"} [opts.type]   Open Graph type. Articles use "article".
 * @param {string} [opts.image]      Root-relative social image path.
 */
export function pageMeta({ title, description, path, type = "website", image = DEFAULT_OG_IMAGE }) {
  const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
