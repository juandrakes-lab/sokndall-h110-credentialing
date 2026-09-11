import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import { ClientStructure } from "@/components/neo/Schematics";
import {
  IconShield, IconRefresh, IconUsers, IconCalendar, IconGrid, IconMail, IconLock,
} from "@/components/neo/icons";
import LandingTemplate, {
  ProseBandSection, IconRowSection, FigureBandSection, PanelSection, CtaSection, HeroStrip, ScreenSlot,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEAD } from "@/components/neo/neoData";
import { JsonLd, faqSchema } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import {
  META, HERO, PROBLEM, STRUCTURE, REPORT, ANCHOR, ARCHITECTURE, FAQ, CLOSING, ORGS, REPORT_SCREEN,
} from "./data";

// `/for-billing-companies` — page 11 of the v3.1 map, on LandingTemplate.
// Segment page, optimised for conversion. Recomposed 2026-09-11
// (DESIGN_DECISIONS.md): light header with the client structure as its
// object — the page sells a structure, so the header shows it; problem
// (split) → structure (rows with icons) → report (text + screen frame) →
// cost anchors (dark, heading left and figures stacked right) → architecture
// (split) → FAQ → close. The hero CTA pair reuses the home's approved labels;
// the copy for this page gives none.
export const metadata = pageMeta({
  title: META.title,
  description: META.description,
  path: "/for-billing-companies",
});

const STRIP_ICONS = [IconShield, IconRefresh, IconUsers, IconCalendar];
const STRUCTURE_ICONS = [IconLock, IconRefresh, IconUsers, IconGrid, IconMail];

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
          primary: { label: "Start 14-day trial", href: "/login" },
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
            <ScreenSlot screen={ORGS.screen} ratio="16:7" tone="white" note={ORGS.note}>
              <ClientStructure
                login={ORGS.login}
                clients={ORGS.clients}
                tileNote={ORGS.tileNote}
                scopes={ORGS.scopes}
                aggregate={ORGS.aggregate}
              />
            </ScreenSlot>
          ),
        }}
      >
        <ProseBandSection id="problem" head={PROBLEM.head} paras={PROBLEM.paras} closing={PROBLEM.closing} />

        <IconRowSection
          id="structure"
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
          media={<ScreenSlot screen={REPORT_SCREEN} ratio="4:3" />}
        />

        <FigureBandSection head={ANCHOR.head} figures={ANCHOR.figures} closing={ANCHOR.closing} layout="side" />

        <ProseBandSection id="architecture" head={ARCHITECTURE.head} paras={ARCHITECTURE.paras} />

        <PanelSection id="faq" head={FAQ_HEAD} split>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection {...CLOSING} />
      </LandingTemplate>
    </Shell>
  );
}
