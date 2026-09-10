import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";

/**
 * §5 LandingTemplate — 6 pages. Full width, marked sections, light/dark
 * surface alternation, CTAs where the copy defines them. Receives children;
 * it only frames them. Compose the body from <Section> blocks.
 */
export function Section({ tone = "light", children, className = "" }) {
  const tones = {
    light: "bg-paper",
    paper: "bg-paper-2",
    dark: "bg-ink on-dark",
  };
  return (
    <section className={`${tones[tone] || tones.light} border-b u-hair`}>
      <div className={`mx-auto max-w-5xl px-6 py-24 ${className}`.trim()}>
        {children}
      </div>
    </section>
  );
}

export default function LandingTemplate({ nav, footer, children }) {
  return (
    <div className="bg-paper u-ink">
      <SiteHeader nav={nav?.items} trialHref={nav?.trialHref} />
      <main>{children}</main>
      <SiteFooter columns={footer?.columns} legal={footer?.legal} />
    </div>
  );
}
