import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import Matrix, { MatrixLegend, MatrixNote } from "@/components/neo/Matrix";
import { IconGrid, IconClock, IconDoc, IconCalendar, IconBan, IconRefresh, IconUsers } from "@/components/neo/icons";
import LandingTemplate, {
  ProseBandSection, StatusTableSection, IconRowSection, DiagramSection, PanelSection, CtaSection, HeroStrip,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEADING } from "@/components/neo/neoData";
import { JsonLd, faqSchema } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import {
  META, HERO, TWO_STEPS, TIMELINE, STATUSES, EFFECTIVE, MISMATCH, MATRIX, SCOPE, FAQ, CLOSING,
} from "./data";

// `/payer-enrollment-software` — page 9 of the v3.1 map, rebuilt from zero on
// LandingTemplate. The hero carries no figure: the matrix is section 7 here,
// drawn at this page's own density rather than the home's.
//
// The hero CTA pair reuses the home's approved labels ("Start 14-day trial",
// "See all three plans") — the copy for this page gives none, and the action
// is identical. Recorded in DESIGN_DECISIONS.md.
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
        <ProseBandSection id="two-steps" head={TWO_STEPS.head} paras={TWO_STEPS.paras} closing={TWO_STEPS.closing} />

        <ProseBandSection id="timeline" head={TIMELINE.head} paras={TIMELINE.paras} closing={TIMELINE.closing} />

        <StatusTableSection
          id="statuses"
          head={STATUSES.head}
          columns={STATUSES.columns}
          rows={STATUSES.rows}
          closing={STATUSES.closing}
        />

        <ProseBandSection id="effective-date" head={EFFECTIVE.head} paras={EFFECTIVE.paras} closing={EFFECTIVE.closing} />

        <IconRowSection id="mismatch" head={MISMATCH.head} items={MISMATCH.items} closing={MISMATCH.closing} />

        <DiagramSection
          head={MATRIX.head}
          note={<MatrixNote>{MATRIX.note}</MatrixNote>}
          // Six providers by five payers at reduced size, three cells needing
          // action — this page's own grid, not the home's 5 x 5.
          diagram={<Matrix rows={6} cols={5} infoCount={1} quietCount={2} reviewCount={5} />}
          legend={<MatrixLegend />}
          points={MATRIX.points}
          aside={MATRIX.aside}
        />

        <IconRowSection
          id="scope"
          head={SCOPE.head}
          items={SCOPE.items.map((s, i) => {
            const Icon = SCOPE_ICONS[i];
            return { ...s, icon: <Icon /> };
          })}
          closing={SCOPE.closing}
        />

        <PanelSection id="faq" head={{ title: FAQ_HEADING }}>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection {...CLOSING} />
      </LandingTemplate>
    </Shell>
  );
}
