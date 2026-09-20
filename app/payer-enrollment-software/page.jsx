import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import { IconGrid, IconClock, IconDoc, IconCalendar, IconBan, IconRefresh, IconUsers } from "@/components/neo/icons";
import LandingTemplate, {
  ProseBandSection, StatusTableSection, IconRowSection, DiagramSection, CardGridSection,
  PanelSection, CtaSection, HeroStrip,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEAD } from "@/components/neo/neoData";
import { JsonLd, faqSchema } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import {
  META, HERO, TWO_STEPS, TIMELINE, STATUSES, EFFECTIVE, MISMATCH, MATRIX, SCOPE, FAQ, CLOSING,
  TRACK, EFFECTIVE_SCREEN, STAGES,
} from "./data";
import ProductShot from "@/components/app/showcase/ProductShot";

// `/payer-enrollment-software` — page 9 of the v3.1 map, on LandingTemplate.
// Recomposed 2026-09-11 (DESIGN_DECISIONS.md):
//   light header with the status track as its object (not the home's matrix);
//   two steps (text + the two stages) → the wait (dark tile + text card, with
//   the 90–120 figure) → statuses (table, grey block) → effective date (text +
//   screen frame) → mismatches (list beside its head) → the matrix (dark tile
//   beside the screen) → scope (bento) → FAQ → close. Round 2, 2026-09-11.
// No more than three white sections in a row (DESIGN_RULES.md §15).
//
// The hero CTA pair reuses the home's approved labels ("Start 14-day trial",
// "See all three plans") — the copy for this page gives none, and the action
// is identical.
export const metadata = pageMeta({
  title: META.title,
  description: META.description,
  path: "/payer-enrollment-software",
});

const STRIP_ICONS = [IconGrid, IconClock, IconDoc, IconCalendar];
const SCOPE_ICONS = [IconBan, IconRefresh, IconUsers];

export default function PayerEnrollmentSoftwarePage() {
  return (
    <Shell>
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate
        current="/payer-enrollment-software"
        hero={{
          variant: "light",
          eyebrow: HERO.eyebrow,
          title: HERO.title,
          sub: HERO.sub,
          primary: { label: "Start 14-day trial", href: "/start" },
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
            <ProductShot scene="StatusPath" props={{ steps: TRACK.steps, end: TRACK.end, branch: TRACK.branch }} w={1000} h={306} mid={{ scene: "MidStatusPath", w: 640, h: 306 }} narrow={{ scene: "NarrowStatusPath", w: 380, h: 478 }} label={TRACK.screen} />
          ),
        }}
      >
        <ProseBandSection
          id="two-steps"
          head={TWO_STEPS.head}
          paras={TWO_STEPS.paras}
          closing={TWO_STEPS.closing}
          media={<ProductShot scene="Stages" props={{ stages: STAGES }} backdrop="ground" w={560} h={310} label="Credentialing and enrollment, the two stages" />}
        />

        <ProseBandSection
          id="timeline"
          surface="ink"
          head={TIMELINE.head}
          paras={TIMELINE.paras}
          closing={TIMELINE.closing}
        />

        <StatusTableSection
          surface="block"
          id="statuses"
          head={STATUSES.head}
          columns={STATUSES.columns}
          rows={STATUSES.rows}
          closing={STATUSES.closing}
        />

        <ProseBandSection
          id="effective-date"
          head={EFFECTIVE.head}
          paras={EFFECTIVE.paras}
          closing={EFFECTIVE.closing}
          media={<ProductShot scene="EffectiveDate" backdrop="ground" w={620} h={560} label={EFFECTIVE_SCREEN} />}
          flip
        />

        <IconRowSection
          id="mismatch"
          layout="split"
          head={MISMATCH.head}
          items={MISMATCH.items}
          closing={MISMATCH.closing}
        />

        <DiagramSection
          layout="bento"
          head={MATRIX.head}
          // Six providers by five payers, six cells needing action — the copy
          // says "the six" twice, so the grid shows six. The home's 5 x 5 is a
          // different density.
          diagram={
            <ProductShot scene="EnrollmentMatrix" w={690} h={486} narrow={{ scene: "NarrowMatrix", w: 460, h: 580 }} label="The enrollments matrix with the book's totals" />
          }
          points={MATRIX.points}
          aside={MATRIX.aside}
        />

        <CardGridSection
          layout="bento"
          featured={0}
          id="scope"
          head={SCOPE.head}
          items={SCOPE.items.map((s, i) => {
            const Icon = SCOPE_ICONS[i];
            return { ...s, icon: <Icon /> };
          })}
          closing={SCOPE.closing}
        />

        <PanelSection id="faq" head={FAQ_HEAD} split>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection {...CLOSING} />
      </LandingTemplate>
    </Shell>
  );
}
