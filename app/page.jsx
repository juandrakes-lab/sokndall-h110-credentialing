import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import HeroPanel from "@/components/neo/HeroPanel";
import {
  IconDoc, IconGrid, IconMail, IconClock,
  IconSearch, IconRefresh, IconShield, IconUsers,
} from "@/components/neo/icons";
import LandingTemplate, {
  SplitListSection, LayersSection, DiagramSection, FigureBandSection,
  PlanListSection, CardGridSection, PanelSection, CtaSection, FactStrip,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEAD, PLAN_PERIOD } from "@/components/neo/neoData";
import { PHOTOS } from "@/components/neo/photos";
import { JsonLd, faqSchema, softwareSchema, PLAN_PRICES } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import { META, HERO, PROBLEM, LAYERS, MATRIX, ANCHOR, PRICING, SCOPE, FAQ, CLOSING, FACTS } from "./homeData";
import ProductShot from "@/components/app/showcase/ProductShot";

// `/` — page 1 of the v3.1 map, on LandingTemplate. Composition only: which
// sections, in which order, with what in them. Copy is in ./homeData.js.
//
// Renders 100% statically — no cookies, no Supabase call. Signed-in users are
// forwarded to /dashboard by middleware.js before this page is served.
export const metadata = pageMeta({ title: META.title, description: META.description, path: "/" });

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
      bleed
      figure={
        // The dashboard at 1:1, running off the panel's right edge (2026-09-19,
        // the founder's review: inside the column it drew at half size). The
        // two facts ride on it as the app's own chips, so the hero carries no
        // furniture from outside the app.
        <ProductShot
          scene="HeroDashboard"
          props={{ notes: HERO.indicators }}
          w={1120}
          h={700}
          bleed={660}
          narrow={{ scene: "NarrowDashboard", w: 420, h: 540 }}
          label="The Sokndall dashboard: what needs you this week, what expires, where every application stands"
        />
      }
    />
  );
}

export default function HomePage() {
  return (
    <Shell>
      <JsonLd data={softwareSchema()} />
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate heroSlot={<Hero />} current="/" navReveal>
        <FactStrip items={FACTS} />

        <SplitListSection
          head={PROBLEM.head}
          items={PROBLEM.items}
          closing={PROBLEM.closing}
          photo={PHOTOS.bindersDesk}
        />

        {/* "Three things" as three cards (round 3): applications, credentials
            and the Monday follow-up, each with its visual; "One row per state"
            sits inside the credentials card. Every string is the copy's. */}
        <LayersSection
          head={LAYERS.head}
          blocks={{
            applications: { ...LAYERS.wide, icon: <IconClock /> },
            credentials: { ...LAYERS.tall, icon: <IconDoc /> },
            detail: { ...LAYERS.small2, icon: <IconGrid /> },
            followup: { ...LAYERS.small1, icon: <IconMail /> },
          }}
          photo={PHOTOS.phoneDesk}
          visual={<ProductShot scene="MondayDigest" w={560} h={560} className="sk-layers__visual" label="The Monday digest email: follow-ups this week, stalled applications, what expires" />}
        />

        <DiagramSection
          head={MATRIX.head}
          diagram={
            <ProductShot scene="HomeMatrix" w={1240} h={760} narrow={{ scene: "NarrowMatrix", w: 460, h: 580 }} label="The enrollments matrix, with a payer request open on one cell" />
          }
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

        <CardGridSection
          surface="block"
          layout="bento"
          featured={0}
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
