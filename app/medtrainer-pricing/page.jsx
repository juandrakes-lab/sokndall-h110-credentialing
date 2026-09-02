import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Faq from "@/components/site/Faq";
import CompetitorPricingTable from "@/components/site/CompetitorPricingTable";
import { KNOWN, STRENGTHS, WHERE_IT_STOPS, FIT, QUESTIONS, PRICE_INTRO, FAQ_ITEMS } from "./data";

export const metadata = {
  title: "MedTrainer pricing: what is published, and what the credentialing module covers — Sokndall",
  description:
    "MedTrainer bundles credentialing with compliance training and document management. Here is what that means for the price, and what a credentialing-only tool costs.",
};

export default function MedTrainerPricingPage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-solo-shell">
        <header className="lp-article-head">
          <div className="lp-head-text">
            <h1>MedTrainer pricing: what is published, and what the credentialing module actually covers</h1>
            <p className="lp-standfirst">
              MedTrainer bundles credentialing with compliance training and document management. Here is what that
              means for the price, and what a credentialing-only tool costs.
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
            <h2>It is three products in one subscription</h2>
            {STRENGTHS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="where-it-stops">
            <h2>Where the bundle stops making sense</h2>
            {WHERE_IT_STOPS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="fit">
            <h2>Who MedTrainer is right for</h2>
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
            <h2>Sokndall&rsquo;s price</h2>
            <CompetitorPricingTable />
            <p>{PRICE_INTRO}</p>
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
