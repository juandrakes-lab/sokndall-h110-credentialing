import HeroPanel from "@/components/neo/HeroPanel";
import Faq from "@/components/neo/Faq";
import Matrix, { MatrixLegend, MatrixNote } from "@/components/neo/Matrix";
import {
  IconCalendar, IconGrid, IconBell, IconMail, IconDoc,
  IconShield, IconUsers, IconRefresh, IconSearch,
} from "@/components/neo/icons";
import LandingTemplate, {
  SplitListSection, QuadSection, DiagramSection, FigureBandSection,
  PlanSection, IconRowSection, PanelSection, CtaSection,
} from "@/components/neo/LandingTemplate";
import {
  HERO, HERO_STRIP, PROBLEMS_HEAD, PROBLEM_ROWS, LAYERS_HEAD, LAYER_BLOCKS,
  MATRIX_HEAD, MATRIX_ASIDE, ANCHOR, PLANS, PLAN_FEATURES, PLAN_TAG, PRICING_HEAD,
  PRICING_NOTE, PRICING_NOTE_LINK, SCOPE_ITEMS, SCOPE_CLOSING, SCOPE_HEAD, FAQ_DATA, FAQ_HEAD,
  CLOSING_CTA, TRIAL_CTA,
} from "@/components/neo/landingData";

// The home is the first page of `LandingTemplate` and the reference for the
// other five. This file is content and composition only: which sections, in
// which order, with what in them. It holds no layout of its own.
//
// Its hero goes in through `heroSlot` rather than `hero`, because the figure
// on the right is the enrollment matrix at a specific density rather than an
// image — the one hero on the site that is composed by hand.

const STRIP_ICONS = { calendar: IconCalendar, grid: IconGrid, bell: IconBell, mail: IconMail };
const SCOPE_ICONS = [IconSearch, IconRefresh, IconShield, IconUsers];

/* ============================== 1. HERO ============================= */

// The right column carries the enrollment matrix — the object the product is
// about — as a labelled schematic. It is not a rendering of a screen.
function Hero() {
  return (
    <HeroPanel
      current="/"
      title={HERO.headline}
      sub={HERO.sub}
      primary={HERO.primary}
      secondary={HERO.secondary}
      figure={
        <div className="sk-herofig">
          <p className="sk-micro sk-herofig__cap">Provider &times; payer — schematic</p>
          <Matrix
            compact
            rows={4}
            cols={4}
            infoCount={2}
            quietCount={2}
            reviewCount={4}
            providers={["P 01", "P 02", "P 03", "P 04"]}
            payers={["A", "B", "C", "D"]}
          />
          <p className="sk-small sk-herofig__note">
            One cell per application, with days since last contact. Not a product screenshot.
          </p>
        </div>
      }
    >
      <ul className="sk-strip">
        {HERO_STRIP.map((s) => {
          const Icon = STRIP_ICONS[s.icon];
          return (
            <li className="sk-strip__item" key={s.label}>
              <span className="sk-tile"><Icon /></span>
              {s.label}
            </li>
          );
        })}
      </ul>
    </HeroPanel>
  );
}

export default function Landing() {
  return (
    <LandingTemplate heroSlot={<Hero />}>
      <SplitListSection
        head={{
          pill: PROBLEMS_HEAD.pill,
          title: PROBLEMS_HEAD.title,
          stat: PROBLEMS_HEAD.stat,
          statCaption: PROBLEMS_HEAD.statCaption,
          note: PROBLEMS_HEAD.note,
        }}
        items={PROBLEM_ROWS}
        closing={PROBLEMS_HEAD.closing}
      />

      <QuadSection
        head={LAYERS_HEAD}
        blocks={[
          LAYER_BLOCKS[0],
          { ...LAYER_BLOCKS[1], icon: <IconDoc /> },
          { ...LAYER_BLOCKS[2], icon: <IconMail /> },
        ]}
      />

      <DiagramSection
        head={{ pill: MATRIX_HEAD.pill, title: MATRIX_HEAD.title, aside: MATRIX_HEAD.aside }}
        note={<MatrixNote />}
        diagram={<Matrix rows={5} cols={5} infoCount={3} quietCount={3} reviewCount={6} />}
        legend={<MatrixLegend />}
        points={MATRIX_HEAD.points}
        aside={MATRIX_ASIDE}
      />

      <FigureBandSection
        head={{ pill: ANCHOR.pill, title: ANCHOR.title, aside: ANCHOR.aside }}
        figures={ANCHOR.figures}
        closing={ANCHOR.closing}
      />

      <PlanSection
        id="pricing"
        head={PRICING_HEAD}
        plans={PLANS.map((p) => ({
          ...p,
          features: PLAN_FEATURES[p.name] || [],
          tag: PLAN_TAG,
        }))}
        cta={TRIAL_CTA}
        note={PRICING_NOTE}
        noteLink={PRICING_NOTE_LINK}
      />

      <IconRowSection
        head={SCOPE_HEAD}
        items={SCOPE_ITEMS.map((s, i) => ({
          title: s.title,
          body: s.body,
          icon: (() => {
            const Icon = SCOPE_ICONS[i];
            return Icon ? <Icon /> : null;
          })(),
          link: s.linkHref ? { href: s.linkHref, label: "How we handle data" } : null,
        }))}
        closing={SCOPE_CLOSING}
      />

      <PanelSection head={FAQ_HEAD}>
        <Faq items={FAQ_DATA} openFirst />
      </PanelSection>

      <CtaSection
        title={CLOSING_CTA.title}
        body={CLOSING_CTA.body}
        primary={CLOSING_CTA.primary}
        secondary={CLOSING_CTA.secondary}
      />
    </LandingTemplate>
  );
}
