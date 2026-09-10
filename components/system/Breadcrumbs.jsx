import Link from "next/link";

/**
 * 3.6 Breadcrumbs — for pages inside a subfolder, with BreadcrumbList schema
 * (on-page-seo.md §6, §8). Separator is "/", never an arrow.
 * Image policy: prohibida.
 */
export default function Breadcrumbs({ items = [], baseUrl = "https://sokndall.com" }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: `${baseUrl}${it.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="t-small u-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true" className="u-muted">/</span>}
            {it.href && i < items.length - 1 ? (
              <Link href={it.href} className="sg-link">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
