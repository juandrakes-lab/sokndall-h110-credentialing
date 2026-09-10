import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";

/**
 * §5 ComparisonTemplate — 4 pages. More argumentative than a landing, shorter
 * than an editorial, carries a pricing table. Single column, no sidebar. The
 * mandatory section order (what is known about the price + source → estimate
 * marked → who it is right for → purchase-model comparison → own price →
 * FAQ) is enforced by how the page composes its children, not by this frame.
 */
export default function ComparisonTemplate({ nav, footer, header, children }) {
  return (
    <div className="bg-paper u-ink">
      <SiteHeader nav={nav?.items} trialHref={nav?.trialHref} />
      <main className="mx-auto max-w-3xl px-6 py-16 grid gap-12">
        {header}
        <div className="grid gap-14">{children}</div>
      </main>
      <SiteFooter columns={footer?.columns} legal={footer?.legal} />
    </div>
  );
}
