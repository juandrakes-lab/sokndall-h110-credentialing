import Link from "next/link";

import Shell from "@/components/neo/Shell";
import Nav from "@/components/neo/Nav";
import Footer from "@/components/neo/Footer";
import Faq from "@/components/neo/Faq";
import Mark from "@/components/neo/Mark";
import HeroArt from "@/components/neo/HeroArt";
import { TRIAL_HREF } from "@/components/neo/neoData";
import { PLANS, CLIENTS, TRIAL_TERMS, COST_BLOCKS, FAQ_ITEMS } from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Pricing — $79, $299, $699 a month, published — Sokndall",
  description:
    "Three plans, all published: $79 Solo, $299 Practice, $699 Billing Co. 14-day trial, card at signup, cancel self-serve. No demo required to see a number.",
  path: "/pricing",
});

export default function PricingPage() {
  const totalProviders = CLIENTS.reduce((n, c) => n + c.providers, 0);
  const totalOpen = CLIENTS.reduce((n, c) => n + c.open, 0);
  const totalQuiet = CLIENTS.reduce((n, c) => n + c.quiet, 0);

  return (
    <Shell>
      <Nav current="/pricing" />

      {/* Masthead */}
      <section className="sk-sec sk-sec--flush">
        <div className="sk-head">
          <p className="sk-head__pill">
            <span className="sk-pill">Pricing</span>
          </p>
          <div className="sk-head__row">
            <h1 className="sk-h2">Three plans, all of them on this page</h1>
            <p className="sk-body sk-body--lg sk-head__aside">
              Every competitor in this category makes you book a demo before they will say a number. Here are all three,
              with what each one includes. Card at signup, charged on day 15, cancel before then and it is not.
            </p>
          </div>
        </div>

        <div className="sk-plans">
          {PLANS.map((p) => (
            <article
              className={`sk-card sk-plan ${p.featured ? "sk-plan--hi" : "sk-card--line sk-card--flat"}`}
              key={p.key}
            >
              <div className="sk-plan__top">
                <h2 className="sk-h4">{p.name}</h2>
                {p.label ? <Mark state={{ label: p.label, glyph: "◆", tone: "blue" }} /> : null}
              </div>
              <p className="sk-plan__price sk-num">
                {p.price}
                <span className="sk-plan__per">{p.period}</span>
              </p>
              <p className="sk-small sk-num">{p.perProvider}</p>
              <ul className="sk-list sk-plan__feats">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="sk-plan__cta">
                <Link href={TRIAL_HREF} className="sk-btn sk-btn--primary">
                  Start 14-day trial
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Trial terms */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-card sk-card--soft sk-card--pad">
          <div className="sk-def">
            {TRIAL_TERMS.map((t) => (
              <div className="sk-def__row" key={t.label}>
                <h3 className="sk-h4">{t.label}</h3>
                <p className="sk-body">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it is being compared to */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-panel sk-on-blue">
          <HeroArt />
          <div className="sk-panel__in">
            <p className="sk-head__pill">
              <span className="sk-pill">The comparison</span>
            </p>
            <div className="sk-head__row">
              <h2 className="sk-h2">What outsourcing the same work costs</h2>
              <p className="sk-lead sk-head__aside">
                Sokndall does not do the work. It tracks it. That is the whole reason the price is lower — you are not
                paying for a person on the other end.
              </p>
            </div>

            <div className="sk-bento sk-bento--2 sk-figures">
              {COST_BLOCKS.map((c) => (
                <div className="sk-fig" key={c.title}>
                  <p className="sk-fig__v sk-num">{c.figure}</p>
                  <p className="sk-micro">{c.unit}</p>
                  <p className="sk-fig__l">{c.title}</p>
                  <p className="sk-small">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Billing Co structure */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-head">
          <p className="sk-head__pill">
            <span className="sk-pill">Billing Co</span>
          </p>
          <div className="sk-head__row sk-head__row--top">
            <h2 className="sk-h2">Separate client organizations, one login</h2>
            <p className="sk-body sk-body--lg sk-head__aside">
              Each client is its own organization with its own providers, payers and applications. Users are restricted
              to the clients they are assigned. One digest covers all of them.
            </p>
          </div>
        </div>

        <div className="sk-bento sk-bento--split">
          <div className="sk-card sk-card--line sk-card--pad">
            <div className="sk-hcard__head">
              <p className="sk-micro">Client organizations</p>
              <span className="sk-small sk-num">{CLIENTS.length} clients</span>
            </div>
            <div className="sk-note">
              {CLIENTS.map((c) => (
                <div className="sk-staterow" key={c.name}>
                  <span className="st">{c.name}</span>
                  <span className="dt">{c.providers} providers</span>
                  {c.quiet ? (
                    <Mark state={{ label: "Gone quiet", glyph: "▲", tone: "warn" }} count={String(c.quiet)} />
                  ) : (
                    <Mark state={{ label: "Open", glyph: "◐", tone: "blue" }} count={String(c.open)} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sk-stack">
            <div className="sk-card sk-card--soft sk-card--pad sk-stack">
              <p className="sk-micro">Across every client</p>
              <p className="sk-kpi sk-kpi--lg sk-num">{totalProviders}</p>
              <p className="sk-small">
                providers tracked, {totalOpen} open applications, {totalQuiet} that have gone quiet
              </p>
            </div>
            <div className="sk-card sk-card--blue sk-card--pad sk-stack">
              <p className="sk-micro">One digest</p>
              <p className="sk-h4">Per client, or all of them at once</p>
              <p className="sk-small">
                Monday&rsquo;s email routes by client, so the person who owns an account gets the account, and whoever
                runs the operation gets the whole board.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-head">
          <p className="sk-head__pill">
            <span className="sk-pill">Questions</span>
          </p>
          <div className="sk-head__row sk-head__row--top">
            <h2 className="sk-h2">Answered before you have to ask</h2>
          </div>
        </div>
        <Faq items={FAQ_ITEMS} openFirst />
      </section>

      {/* Closing */}
      <section className="sk-sec sk-sec--tight">
        <div className="sk-cta sk-on-blue">
          <HeroArt />
          <div className="sk-cta__inner">
            <h2 className="sk-h2">No demo, no quote, no call.</h2>
            <p className="sk-lead sk-cta__b">
              Pick a plan, enter a card, import your providers. If it is not doing anything for you by day 14, cancel
              and you are not charged.
            </p>
            <div className="sk-cta__btns">
              <Link href={TRIAL_HREF} className="sk-btn sk-btn--primary">
                Start 14-day trial
              </Link>
              <Link href="/payer-enrollment-software" className="sk-btn sk-btn--ghost">
                See what it tracks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </Shell>
  );
}
