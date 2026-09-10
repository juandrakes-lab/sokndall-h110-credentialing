import Link from "next/link";
import Cta from "./primitives/Cta";

/**
 * 3.1 SiteHeader — logo + nav + CTA. Sticky on every page. Bottom hairline,
 * never a shadow (CATALOGO §3.1). The scroll-reactive hairline described in
 * the catalog needs a client scroll listener; deferred — see NOTAS.
 * Image policy: prohibida (no image prop).
 */
export default function SiteHeader({ nav = [], trialHref = "/pricing", cta = "Start 14-day trial" }) {
  return (
    <header className="sticky top-0 z-20 bg-paper border-b u-hair">
      <div className="mx-auto max-w-5xl flex items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="t-h3 u-ink">
          Sokndall
        </Link>
        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} className="t-small u-muted">
              {l.label}
            </Link>
          ))}
        </nav>
        <Cta href={trialHref} tone="primary">
          {cta}
        </Cta>
      </div>
    </header>
  );
}
