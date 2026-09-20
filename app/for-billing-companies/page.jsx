import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import {
  IconShield, IconRefresh, IconUsers, IconCalendar, IconGrid, IconMail, IconLock,
} from "@/components/neo/icons";
import LandingTemplate, {
  ProseBandSection, CardGridSection, FigureBandSection, PanelSection, CtaSection, HeroStrip,
  PlanCard,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEAD, PLAN_PERIOD } from "@/components/neo/neoData";
import { JsonLd, faqSchema, PLAN_PRICES } from "@/components/neo/schema";
import { PLANS } from "@/app/pricing/data";
import { pageMeta } from "@/lib/seo";
import {
  META, HERO, PROBLEM, STRUCTURE, REPORT, ANCHOR, ARCHITECTURE, FAQ, CLOSING, ORGS, REPORT_SCREEN,
} from "./data";
import ProductShot from "@/components/app/showcase/ProductShot";

// `/for-billing-companies` — page 11 of the v3.1 map, on LandingTemplate.
// Segment page, optimised for conversion. Recomposed 2026-09-11
// (DESIGN_DECISIONS.md): light header with the client structure as its
// object — the page sells a structure, so the header shows it; problem (dark
// tile + text card) → structure (bento on a grey block) → report (text +
// screen frame) → cost anchors (dark tile + figure cards) → architecture (text
// + the Billing Co plan card) → FAQ → close. Round 2, 2026-09-11. The hero
// CTA pair reuses the home's approved labels; the copy for this page gives none.
export const metadata = pageMeta({
  title: META.title,
  description: META.description,
  path: "/for-billing-companies",
});

const STRIP_ICONS = [IconShield, IconRefresh, IconUsers, IconCalendar];
const STRUCTURE_ICONS = [IconLock, IconRefresh, IconUsers, IconGrid, IconMail];

// The Billing Co plan, from the same data as the price list and the schema.
const BILLING_PLAN = {
  ...PLANS.plans[2],
  desc: "Separate client organizations, one login",
  price: `$${PLAN_PRICES[2].price}`,
  period: PLAN_PERIOD,
};

// The label on the card's top edge, like the middle plan's on /pricing. Layout
// microcopy, pending copy review (DESIGN_DECISIONS.md, round 3). It is not the
// middle plan's label, which DESIGN_RULES §2 regla 8 fixes to one string.
const BILLING_TAG = "The plan built for billing companies";

export default function ForBillingCompaniesPage() {
  return (
    <Shell>
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate
        current="/for-billing-companies"
        hero={{
          variant: "light",
          eyebrow: HERO.eyebrow,
          title: HERO.title,
          sub: HERO.sub,
          primary: { label: "Start 14-day trial", href: "/start?plan=billing_co" },
          secondary: { label: "See all three plans", href: "/pricing" },
          children: (
            <HeroStrip
              tone="light"
              items={HERO.strip.map((label, i) => {
                const Icon = STRIP_ICONS[i];
                return { label, icon: <Icon /> };
              })}
            />
          ),
          figure: (
            <ProductShot scene="ClientBook" w={1160} h={760} narrow={{ scene: "NarrowClients", w: 440, h: 520 }} label={ORGS.screen} />
          ),
        }}
      >
        <ProseBandSection
          id="problem"
          surface="ink"
          head={PROBLEM.head}
          paras={PROBLEM.paras}
          closing={PROBLEM.closing}
        />

        <CardGridSection
          id="structure"
          surface="block"
          layout="bento"
          featured={0}
          head={STRUCTURE.head}
          items={STRUCTURE.items.map((it, i) => {
            const Icon = STRUCTURE_ICONS[i];
            return { ...it, icon: <Icon /> };
          })}
        />

        <ProseBandSection
          id="report"
          head={REPORT.head}
          paras={REPORT.paras}
          closing={REPORT.closing}
          media={<ProductShot scene="ClientReport" w={800} h={660} narrow={{ scene: "NarrowReport", w: 440, h: 560 }} label={REPORT_SCREEN} />}
        />

        <FigureBandSection head={ANCHOR.head} figures={ANCHOR.figures} closing={ANCHOR.closing} />

        {/* The plan the page argues for, shown rather than described, in the
            price list's own style: white card, yellow trial button, and the
            petrol-ink highlight and top-edge label (round 3). */}
        <ProseBandSection
          id="architecture"
          head={ARCHITECTURE.head}
          paras={ARCHITECTURE.paras}
          media={<PlanCard plan={BILLING_PLAN} cta={{ label: "Start 14-day trial", href: "/start?plan=billing_co" }} tag={BILLING_TAG} />}
        />

        <PanelSection id="faq" head={FAQ_HEAD} split>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection {...CLOSING} />
      </LandingTemplate>
    </Shell>
  );
}
