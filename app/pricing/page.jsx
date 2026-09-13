import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import Rich from "@/components/neo/rich";
import { CountDiagram } from "@/components/neo/Schematics";
import LandingTemplate, {
  PlanList, PlanFeatureMatrix, ProseBandSection, FigureBandSection, CardGridSection, PanelSection, CtaSection,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEAD, PLAN_PERIOD } from "@/components/neo/neoData";
import { JsonLd, faqSchema, softwareSchema, PLAN_PRICES } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import { META, HERO, PLANS, MATRIX, UNITS, UNITS_DIAGRAM, ANCHOR, TRIAL, FAQ, CLOSING } from "./data";

// `/pricing` — page 2 of the v3.1 map, on LandingTemplate.
//
// The light header carries the premise, and the price list is its object: the
// three plans sit inside the header, under the page's first H2 (the exact
// keyword, on-page-seo.md §4), so a price is on screen without scrolling. The
// H2 is set at card-title size there — it is the list's label, not a second
// headline under the H1. Under the list, still in the header, the plan
// matrix and the security line (copy brief 2026-09-09; placed there by the
// founder 2026-09-12). Then the provider-vs-user argument beside its diagram, the four sourced anchors on the dark band, the trial terms as three
// cards, FAQ, close. Recomposed 2026-09-11 (DESIGN_DECISIONS.md).
export const metadata = pageMeta({ title: META.title, description: META.description, path: "/pricing" });

const TRIAL_CTA = { label: "Start 14-day trial", href: "/start" };
const PLAN_KEYS = ["solo", "practice", "billing_co"];

export default function PricingPage() {
  const plans = PLANS.plans.map((p, i) => ({ ...p, price: `$${PLAN_PRICES[i].price}`, period: PLAN_PERIOD, href: `/start?plan=${PLAN_KEYS[i]}` }));

  return (
    <Shell>
      <JsonLd data={softwareSchema()} />
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate
        current="/pricing"
        hero={{
          ...HERO,
          variant: "light",
          figure: (
            <div className="sk-pricehead" id="plans">
              <h2 className="sk-h3 sk-pricehead__t">{PLANS.head.title}</h2>
              <PlanList plans={plans} cta={TRIAL_CTA} />
              <p className="sk-small sk-plans__note">
                <Rich text={PLANS.note} linkClassName="sk-link" />
              </p>
              {/* What changes between the plans, straight under them and not
                  as a section of its own (founder, 2026-09-12): the list gives
                  the price, the table what the price buys. The security line
                  closes it, where someone comparing vendors is looking (copy
                  brief 2026-09-09). The Practice column is tinted like the
                  highlighted plan above it. */}
              <PlanFeatureMatrix
                embedded
                id="compare"
                head={MATRIX.head}
                plans={MATRIX.plans}
                highlight={1}
                rows={[
                  { label: "Providers tracked", cells: PLAN_PRICES.map((p) => String(p.providers)) },
                  { label: "Users included", cells: PLAN_PRICES.map((p) => String(p.users)) },
                  ...MATRIX.rows,
                ]}
                caption={MATRIX.caption}
                after={MATRIX.security}
              />
            </div>
          ),
        }}
      >
        <ProseBandSection
          id="provider-vs-user"
          head={UNITS.head}
          paras={UNITS.paras}
          closing={UNITS.closing}
          media={<CountDiagram rows={UNITS_DIAGRAM.rows} caption={UNITS_DIAGRAM.caption} />}
        />

        <FigureBandSection head={ANCHOR.head} figures={ANCHOR.figures} closing={ANCHOR.closing} />

        {/* The trial as three steps, the reference's "How we work": step label
            and a large fact on each, the last step a dark tile. One
            enumeration system (the step numbers), so no icons (§6). */}
        <CardGridSection id="trial" surface="block" layout="bento" featured={2} head={TRIAL.head} items={TRIAL.items} />

        <PanelSection id="faq" head={FAQ_HEAD} split>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection {...CLOSING} />
      </LandingTemplate>
    </Shell>
  );
}
