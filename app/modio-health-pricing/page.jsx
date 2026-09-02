import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Faq from "@/components/site/Faq";
import CompetitorPricingTable from "@/components/site/CompetitorPricingTable";
import { KNOWN, STRENGTHS, FIT, THIRD_OPTION, QUESTIONS, FAQ_ITEMS } from "./data";

export const metadata = {
  title: "Modio Health pricing: what is public, and what to know before the call — Sokndall",
  description:
    "Modio quotes after a demo. Here is what is verifiable, who OneView fits, and what a published-price alternative costs.",
};

export default function ModioHealthPricingPage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-solo-shell">
        <header className="lp-article-head">
          <div className="lp-head-text">
            <h1>Modio Health pricing: what is public, and what to know before the call</h1>
            <p className="lp-standfirst">
              Modio quotes after a demo. Here is what is verifiable, who OneView fits, and what a published-price
              alternative costs.
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
            <h2>What OneView actually does well</h2>
            {STRENGTHS.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="fit">
            <h2>Where the fit question comes in</h2>
            {FIT.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>

          <section id="third-option">
            <h2>Two different products, and a third one worth naming</h2>
            {THIRD_OPTION.map((p) => (
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
