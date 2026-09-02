import Link from "next/link";
import "@/components/site/site.css";
import "@/components/site/site-pages.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import Faq from "@/components/site/Faq";
import { TRIAL_HREF } from "@/components/site/siteData";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";
import { startCheckout, openBillingPortal } from "./actions";
import { PLANS, CLIENTS, COST_BLOCKS, TRIAL_TERMS, FAQ_ITEMS } from "./data";

export const metadata = {
  title: "Credentialing software pricing, published — Sokndall",
  description:
    "Three plans, three prices, no quote process. $79, $299 and $699 a month — $26, $20 and $14 per provider. 14-day trial, cancel self-serve from Settings.",
};

/** The plan CTA is the one part of this page that knows about the signed-in
 *  org: logged out it sends you to the trial, logged in it opens checkout. */
function PlanCta({ plan, user, org }) {
  if (!user) {
    return (
      <Link href={TRIAL_HREF} className="lp-btn">
        Start 14-day trial
      </Link>
    );
  }
  if (org?.plan === plan.key) {
    return (
      <span className="lp-btn lp-btn--ghost" style={{ cursor: "default" }}>
        Current plan
      </span>
    );
  }
  return (
    <form action={startCheckout.bind(null, plan.key)}>
      <button type="submit" className="lp-btn">
        Start 14-day trial
      </button>
    </form>
  );
}

export default async function PricingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const org = user ? await getCurrentOrg() : null;

  return (
    <div className="sokndall-landing">
      <SiteNav />

      {/* 1 — HEADER. No image: on this page the price is the content.
          Headline left, subhead right — the subhead is what fills the column
          the headline would otherwise leave empty. */}
      <header className="lp-page-head">
        <div className="lp-head2">
            <div className="lp-eyebrow">Pricing</div>
            <h1 className="lp-h1">Credentialing software pricing, published</h1>
            <div className="bd">
            <p className="lp-lead">
              Three plans, three prices, no quote process. Every plan has every feature. The difference is how many
              providers you track, and whether you track them for your practice or for clients.
            </p>
          </div>
        </div>
      </header>

      {/* 2 — THE THREE PLANS. The home pricing list, expanded to full detail. */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "0 var(--pad-x) 96px" }}>
        <div className="lp-plans">
          {PLANS.map((plan) => (
            <div key={plan.key} className={"lp-plan" + (plan.featured ? " lp-plan--featured" : "")}>
              {plan.label && <div className="lp-plan-label">{plan.label}</div>}
              <div>
                <h2 className="lp-plan-name">{plan.name}</h2>
                <div className="lp-plan-price">
                  <span className="amt">{plan.price}</span>
                  <span className="per">{plan.period}</span>
                </div>
                <p className="lp-plan-unit">{plan.perProvider}</p>
              </div>
              <ul className="lp-plan-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="lp-plan-cta">
                <PlanCta plan={plan} user={user} org={org} />
                <p className="lp-note">Card required. Charged day 15.</p>
              </div>
            </div>
          ))}
        </div>

        {org?.polar_customer_id && (
          <form action={openBillingPortal} style={{ marginTop: 28 }}>
            <button type="submit" className="lp-underline" style={{ background: "none", border: 0, cursor: "pointer" }}>
              Manage billing / cancel subscription →
            </button>
          </form>
        )}
      </section>

      {/* 3 — BILLING CO. The claim is structural, so the visual is the structure:
          six isolated client organizations and the one number that only exists
          when you can read across them. */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
          <div className="lp-split lp-split--wide-left lp-split--top">
            <div>
              <div className="lp-eyebrow" style={{ marginBottom: 18 }}>
                Billing Co
              </div>
              <h2 className="lp-h2" style={{ marginBottom: 24 }}>
                Billing Co is a different structure, not a bigger number
              </h2>
              {/* B-1: the old closing line pointed at a digest number the copy no
                  longer stated — it moved into the schematic. This gives the
                  roll-up its antecedent back and drops the orphan one-liner. */}
              <p className="lp-body" style={{ margin: "0 0 18px" }}>
                Billing Co is not a bigger version of the other plans — each client sits in its own organization, with
                its own providers and its own records, and nothing bleeds between them. That structure is what makes the
                roll-up beside this text possible in the first place.
              </p>
              <p className="lp-body" style={{ margin: 0 }}>
                You switch between clients without logging out, and you can give a staff member access to two clients and
                not the other four.
              </p>
            </div>

            <div className="lp-clients">
              <div className="lp-client-grid">
                {CLIENTS.map((c) => (
                  <div key={c.name} className="lp-client">
                    <div className="nm">{c.name}</div>
                    <div className="rw">
                      <span>Providers</span>
                      <b>{c.providers}</b>
                    </div>
                    <div className="rw">
                      <span>Open applications</span>
                      <b>{c.open}</b>
                    </div>
                    <div className="bar">
                      <i style={{ width: Math.round((c.quiet / c.open) * 100) + "%" }} />
                    </div>
                    <div className="rw">
                      <span>Quiet 30+ days</span>
                      <b>{c.quiet}</b>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lp-rollup">
                <span className="lb">Monday digest · across all clients</span>
                <span className="tx">
                  23 applications need follow-up this week across your 6 clients, 4 of them have been quiet for over 30
                  days.
                </span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <Link href="/for-billing-companies" className="lp-underline">
              See the Billing Co plan in depth →
            </Link>
          </div>
        </div>
      </section>

      {/* 4 — COST PER PROVIDER. The honest comparison, then the calculation with
          the weight of a closing line. */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-head2" style={{ marginBottom: 56 }}>
            <div className="lp-eyebrow">Cost per provider</div>
            <h2 className="lp-h2">What this costs next to what you are already paying to stay credentialed</h2>
            <div className="bd">
            <p className="lp-lead">
              This is not cheaper than credentialing software. It is a different thing, and the honest comparison is
              against what maintaining credentials already costs — whether or not you have ever called it that.
            </p>
          </div>
        </div>

        <div className="lp-split lp-split--wide-right lp-split--top">
          <div className="lp-img-framed">
            <img
              className="lp-img"
              src="/pages/pricing-comparison.png"
              alt="A practice manager at her desk comparing a credentialing service invoice against a provider roster on her laptop"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {COST_BLOCKS.map((b) => (
              <div key={b.title} className="lp-callout">
                <h3>{b.title}</h3>
                <span className="fig">
                  {b.figure} <span style={{ fontSize: 14, fontWeight: 400, color: "var(--ink-soft)" }}>{b.unit}</span>
                </span>
                <p>{b.body}</p>
              </div>
            ))}
            <p className="lp-note">Ranges as published by the sources that publish one.</p>
          </div>
        </div>
      </section>

      {/* The payoff. Was a rounded card floating inside the section — now a
          full-width band, the same device /landing uses after the problem
          section. B-2 made the line self-contained so it survives the move. */}
      <section className="lp-dark lp-band">
        <div className="in">
          <p>
            Outsourced maintenance for fifteen providers starts around <em>$750 a month</em> at the low end of the
            published range. Practice is <em>$299</em> for the same fifteen — $20 per provider.
          </p>
        </div>
      </section>

      {/* The consequence of the band above. It sits between two dark masses, so
          it needs to read as a section in its own right rather than as the gap
          between them: cream tint, its own hairlines, generous height, and lead
          type instead of body. */}
      <section className="lp-panel">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "104px var(--pad-x)" }}>
          {/* B-3: 31 and 45 words, so the two columns bottom out together. */}
          <div className="lp-cols2">
            <p className="lp-lead">
              The gap is not a discount. It is the difference between paying a person to do the work and paying a system
              to track it — and those are different jobs with different prices.
            </p>
            <p className="lp-lead">
              If you want the work done for you, buy that; it is a real service. If your problem is that nobody can say
              what needs attention this week without opening six things, that is a tracking problem, and it is priced
              like one.
            </p>
          </div>
        </div>
      </section>

      {/* 5 — TRIAL TERMS. The brief asks for the same visual weight as the price
          itself, so this is a full forest band, not a card sitting inside one.
          Three labelled commitments: what you get, what we ask, how you leave. */}
      <section className="lp-forest">
        <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "88px var(--pad-x)" }}>
          <div className="lp-center" style={{ marginBottom: 44 }}>
            <div className="lp-eyebrow" style={{ marginBottom: 20 }}>
              The Trial
            </div>
            <h2 className="lp-h2" style={{ maxWidth: 700 }}>
              How the trial works
            </h2>
          </div>

          <div className="lp-terms" style={{ marginBottom: 48 }}>
            {TRIAL_TERMS.map((t) => (
              <div key={t.label} className="lp-term">
                <span className="lb">{t.label}</span>
                <p>{t.body}</p>
              </div>
            ))}
          </div>

          <div className="lp-center" style={{ gap: 14 }}>
            <Link href={TRIAL_HREF} className="lp-btn lp-btn--accent">
              Start 14-day trial
            </Link>
            <p className="lp-note" style={{ color: "var(--text-on-dark-soft)" }}>
              No sales call. No quote request. No onboarding fee.
            </p>
          </div>
        </div>
      </section>

      {/* 6 — FAQ */}
      {/* 6 — FAQ. An accordion reads at ~840px, which is narrower than the
          container: centred it is symmetric, left-aligned it is a 344px void.
          Centred, with the eyebrow and headline over it. */}
      <section style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "96px var(--pad-x)" }}>
        <div className="lp-center" style={{ gap: 18, marginBottom: 44 }}>
          <div className="lp-eyebrow">FAQ</div>
          <h2 className="lp-h2" style={{ maxWidth: 720 }}>
            Nothing here is negotiable, so ask
          </h2>
        </div>
        <div style={{ maxWidth: 840, margin: "0 auto" }}>
          <Faq items={FAQ_ITEMS} />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
