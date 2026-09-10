import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import LandingTemplate, {
  PlanListSection, ProseBandSection, FigureBandSection, IconRowSection, PanelSection, CtaSection,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEADING, PLAN_PERIOD } from "@/components/neo/neoData";
import { JsonLd, faqSchema, softwareSchema, PLAN_PRICES } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import { META, HERO, PLANS, UNITS, ANCHOR, TRIAL, FAQ, CLOSING } from "./data";

// `/pricing` — page 2 of the v3.1 map, rebuilt from zero on LandingTemplate.
// The hero carries the premise and no figure; the price list comes straight
// after it, as a vertical list, and the four sourced anchors follow the
// provider-vs-user section the copy makes mandatory on this page.
export const metadata = pageMeta({ title: META.title, description: META.description, path: "/pricing" });

const TRIAL_CTA = { label: "Start 14-day trial", href: "/login" };

export default function PricingPage() {
  return (
    <Shell>
      <JsonLd data={softwareSchema()} />
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate current="/pricing" hero={HERO}>
        <PlanListSection
          id="plans"
          head={PLANS.head}
          plans={PLANS.plans.map((p, i) => ({ ...p, price: `$${PLAN_PRICES[i].price}`, period: PLAN_PERIOD }))}
          cta={TRIAL_CTA}
          note={PLANS.note}
        />

        <ProseBandSection id="provider-vs-user" head={UNITS.head} paras={UNITS.paras} closing={UNITS.closing} />

        <FigureBandSection head={ANCHOR.head} figures={ANCHOR.figures} closing={ANCHOR.closing} />

        <IconRowSection id="trial" head={TRIAL.head} items={TRIAL.items} />

        <PanelSection id="faq" head={{ title: FAQ_HEADING }}>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection {...CLOSING} />
      </LandingTemplate>
    </Shell>
  );
}
