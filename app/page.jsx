import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import Matrix, { MatrixLegend } from "@/components/neo/Matrix";
import HeroPanel from "@/components/neo/HeroPanel";
import {
  IconBan, IconDoc, IconGrid, IconCalendar, IconMail, IconClock, IconBell,
  IconSearch, IconRefresh, IconShield, IconUsers,
} from "@/components/neo/icons";
import LandingTemplate, {
  SplitListSection, QuadSection, DiagramSection, FigureBandSection,
  PlanListSection, IconRowSection, PanelSection, CtaSection, HeroStrip, ScreenSlot, Indicator,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEAD, PLAN_PERIOD } from "@/components/neo/neoData";
import { JsonLd, faqSchema, softwareSchema, PLAN_PRICES } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import {
  META, HERO, PROBLEM, LAYERS, MATRIX, ANCHOR, PRICING, SCOPE, FAQ, CLOSING, SLOTS,
} from "./homeData";

// `/` — page 1 of the v3.1 map, on LandingTemplate. Composition only: which
// sections, in which order, with what in them. Copy is in ./homeData.js.
//
// Renders 100% statically — no cookies, no Supabase call. Signed-in users are
// forwarded to /dashboard by middleware.js before this page is served.
export const metadata = pageMeta({ title: META.title, description: META.description, path: "/" });

const STRIP_ICONS = [IconBan, IconDoc, IconGrid, IconCalendar];
const SCOPE_ICONS = [IconSearch, IconRefresh, IconShield, IconUsers];

function Hero() {
  return (
    <HeroPanel
      variant="panel"
      current="/"
      title={HERO.title}
      sub={HERO.sub}
      primary={HERO.primary}
      secondary={HERO.secondary}
      figure={
        // The data model at hero size, in the frame the real matrix screen
        // will fill. Four providers by four payers is the home's own density;
        // /payer-enrollment-software draws a different grid.
        <ScreenSlot screen="Provider × payer matrix" ratio="4:3" tone="white" note={HERO.caption}>
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
        </ScreenSlot>
      }
      indicators={HERO.indicators.map((ind, i) => {
        const Icon = [IconBell, IconClock][i];
        return <Indicator key={ind.label} icon={<Icon />} value={ind.value} label={ind.label} />;
      })}
    >
      <HeroStrip
        items={HERO.strip.map((label, i) => {
          const Icon = STRIP_ICONS[i];
          return { label, icon: <Icon /> };
        })}
      />
    </HeroPanel>
  );
}

export default function HomePage() {
  return (
    <Shell>
      <JsonLd data={softwareSchema()} />
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate heroSlot={<Hero />}>
        <SplitListSection
          head={PROBLEM.head}
          items={PROBLEM.items}
          closing={PROBLEM.closing}
          reservedLabel={SLOTS.problem}
        />

        <QuadSection
          head={LAYERS.head}
          blocks={[
            { ...LAYERS.wide, icon: <IconClock /> },
            { ...LAYERS.tall, icon: <IconDoc /> },
            { ...LAYERS.small1, icon: <IconMail /> },
            { ...LAYERS.small2, icon: <IconGrid /> },
          ]}
          labels={{ wide: SLOTS.quadWide, corner: SLOTS.quadCorner }}
        />

        <DiagramSection
          head={MATRIX.head}
          diagram={
            <ScreenSlot screen="Provider × payer matrix" ratio="16:9" tone="white" note={MATRIX.note}>
              <Matrix rows={5} cols={5} infoCount={3} quietCount={3} reviewCount={6} />
            </ScreenSlot>
          }
          legend={<MatrixLegend />}
          points={MATRIX.points}
          aside={MATRIX.aside}
        />

        <FigureBandSection head={ANCHOR.head} figures={ANCHOR.figures} closing={ANCHOR.closing} />

        <PlanListSection
          id="pricing"
          head={PRICING.head}
          plans={PRICING.plans.map((p, i) => ({
            ...p,
            price: `$${PLAN_PRICES[i].price}`,
            period: PLAN_PERIOD,
          }))}
          cta={HERO.primary}
          note={PRICING.note}
        />

        <IconRowSection
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
