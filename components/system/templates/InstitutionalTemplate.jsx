import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";

/**
 * §5 InstitutionalTemplate — 2 pages (/security, /about). Narrow column,
 * 300–600 words, no sidebar. /terms and /privacy are out of scope (legal
 * template or lawyer review) — no placeholders for them.
 */
export default function InstitutionalTemplate({ nav, footer, children }) {
  return (
    <div className="bg-paper u-ink">
      <SiteHeader nav={nav?.items} trialHref={nav?.trialHref} />
      <main className="mx-auto max-w-2xl px-6 py-16 grid gap-10">{children}</main>
      <SiteFooter columns={footer?.columns} legal={footer?.legal} />
    </div>
  );
}
