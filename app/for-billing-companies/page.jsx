import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import { IconShield, IconRefresh, IconUsers, IconCalendar } from "@/components/neo/icons";
import LandingTemplate, {
  ProseBandSection, IconRowSection, FigureBandSection, PanelSection, CtaSection, HeroStrip,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEADING } from "@/components/neo/neoData";
import { JsonLd, faqSchema } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import { META, HERO, PROBLEM, STRUCTURE, REPORT, ANCHOR, ARCHITECTURE, FAQ, CLOSING } from "./data";

// `/for-billing-companies` — page 11 of the v3.1 map, rebuilt from zero on
// LandingTemplate. Segment page, optimised for conversion. The hero CTA pair
// reuses the home's approved labels; the copy for this page gives none.
export const metadata = pageMeta({
  title: META.title,
  description: META.description,
  path: "/for-billing-companies",
});

const STRIP_ICONS = [IconShield, IconRefresh, IconUsers, IconCalendar];

export default function ForBillingCompaniesPage() {
  return (
    <Shell>
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate
        current="/for-billing-companies"
        hero={{
          title: HERO.title,
          sub: HERO.sub,
          primary: { label: "Start 14-day trial", href: "/login" },
          secondary: { label: "See all three plans", href: "/pricing" },
          children: (
            <HeroStrip
              items={HERO.strip.map((label, i) => {
                const Icon = STRIP_ICONS[i];
                return { label, icon: <Icon /> };
              })}
            />
          ),
        }}
      >
        <ProseBandSection id="problem" head={PROBLEM.head} paras={PROBLEM.paras} closing={PROBLEM.closing} />

        <IconRowSection id="structure" head={STRUCTURE.head} items={STRUCTURE.items} />

        <ProseBandSection id="report" head={REPORT.head} paras={REPORT.paras} closing={REPORT.closing} />

        <FigureBandSection head={ANCHOR.head} figures={ANCHOR.figures} closing={ANCHOR.closing} />

        <ProseBandSection id="architecture" head={ARCHITECTURE.head} paras={ARCHITECTURE.paras} />

        <PanelSection id="faq" head={{ title: FAQ_HEADING }}>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection {...CLOSING} />
      </LandingTemplate>
    </Shell>
  );
}
