import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Faq from "@/components/site/Faq";
import CompetitorPricingTable from "@/components/site/CompetitorPricingTable";
import { KNOWN, STRENGTHS, FIT, QUESTIONS, PRICE_INTRO, FAQ_ITEMS } from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "symplr pricing: what is public, what is not — Sokndall",
  description:
    "symplr does not publish prices. Here is what can be verified, what has to be estimated, and what a smaller alternative costs — which is $79 to $699 a month, published.",
  path: "/symplr-pricing",
  type: "article",
});

export default function SymplrPricingPage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-solo-shell">
        <header className="lp-article-head">
          <div className="lp-head-text">
            <h1>symplr pricing: what is public, what is not, and what it costs to find out</h1>
            <p className="lp-standfirst">
              symplr does not publish prices. Here is what can be verified, what has to be estimated, and what a
              smaller alternative costs — which is $79 to $699 a month, published.
            </p>
          </div>
          <hr className="lp-article-rule" />
        </header>

        <article className="lp-article-main">
          <section id="known">
            <h2>What is publicly known</h2>
            {KNOWN.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="strengths">
            <h2>symplr is a suite, and credentialing is one module of it</h2>
            {STRENGTHS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="fit">
            <h2>Who symplr is right for, and what that actually looks like day to day</h2>
            {FIT.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="questions">
            <h2>Questions worth asking on the demo call, whichever way you go</h2>
            {QUESTIONS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="price">
            <h2>What Sokndall costs, and what it is being compared to</h2>
            <p>{PRICE_INTRO}</p>
            <CompetitorPricingTable />
            <div className="lp-article-actions" style={{ marginTop: 24 }}>
              <Link href="/pricing" className="lp-underline">
                See what is included &rarr;
              </Link>
            </div>
          </section>

          <section id="faq">
            <div className="lp-center-block">
              <h2>Frequently asked questions</h2>
            </div>
            <Faq items={FAQ_ITEMS} />
          </section>
        </article>
      </div>

      <SiteFooter variant="slim" />
    </div>
  );
}
