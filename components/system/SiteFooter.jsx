import Link from "next/link";

/**
 * 3.1 SiteFooter — link columns + legal. Absorbs part of the required
 * internal linking (on-page-seo.md §6). Dark surface.
 * Image policy: prohibida.
 */
export default function SiteFooter({ columns = [], legal = "" }) {
  return (
    <footer className="on-dark bg-ink border-t u-hair">
      <div className="mx-auto max-w-5xl px-6 py-16 grid gap-12 md:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title} className="grid gap-3">
            <div className="t-small u-muted">{col.title}</div>
            <ul className="grid gap-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="t-small sg-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {legal && (
        <div className="mx-auto max-w-5xl px-6 pb-12 t-small u-muted border-t u-hair pt-8">
          {legal}
        </div>
      )}
    </footer>
  );
}
