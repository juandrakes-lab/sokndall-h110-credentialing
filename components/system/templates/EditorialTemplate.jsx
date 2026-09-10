import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import TableOfContents from "../TableOfContents";

/**
 * §5 EditorialTemplate — 6 pages. Two columns: reading column (~680–720px)
 * + sticky TOC (~280–300px). No interspersed CTAs — only at the end, via the
 * `closing` slot. No cards, no alternating surfaces: one continuous reading
 * column. On mobile the TOC collapses to a plegable block at the top.
 */
export default function EditorialTemplate({
  nav,
  footer,
  toc = [],
  header,
  children,
  closing,
}) {
  return (
    <div className="bg-paper u-ink">
      <SiteHeader nav={nav?.items} trialHref={nav?.trialHref} />
      <main className="mx-auto max-w-5xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-3 grid gap-12">
          {toc.length > 0 && (
            <details className="md:hidden border u-hair rounded p-4">
              <summary className="t-small u-muted">On this page</summary>
              <ul className="grid gap-2 pt-3">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="t-small sg-link">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {header}
          <div className="grid gap-16 max-w-2xl">{children}</div>
          {closing && <div className="max-w-2xl">{closing}</div>}
        </div>
        <aside className="hidden md:block md:col-span-1">
          <div className="md:sticky md:top-24">
            {toc.length > 0 && <TableOfContents items={toc} />}
          </div>
        </aside>
      </main>
      <SiteFooter columns={footer?.columns} legal={footer?.legal} />
    </div>
  );
}
