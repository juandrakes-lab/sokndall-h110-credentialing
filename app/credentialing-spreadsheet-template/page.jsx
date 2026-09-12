import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import EmailCapture from "@/components/neo/EmailCapture";
import {
  IconUsers, IconGrid, IconDoc, IconMail, IconShield, IconCalendar, IconBell, IconRefresh, IconSearch,
} from "@/components/neo/icons";
import LandingTemplate, {
  IconRowSection, CardGridSection, ProseBandSection, PanelSection, CtaSection, HeroStrip, ScreenSlot,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEAD } from "@/components/neo/neoData";
import { TEMPLATE_CTA } from "@/components/neo/templateCta";
import { JsonLd, faqSchema } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import { META, HERO, FIELDS, LIMITS, ENOUGH, FAQ, CLOSING, FILE_SCREEN } from "./data";

// `/credentialing-spreadsheet-template` — page 4 of the v3.1 map, on
// LandingTemplate. Its function is email capture and a linkable asset, so the
// offer is above the fold: the light header splits, copy left and the email
// box right, with a frame for a real capture of the file under both. The box
// is this page's one template CTA; the file arrives by email and there is no
// direct download anywhere on the page (DESIGN_RULES.md §9). Recomposed
// 2026-09-11 (DESIGN_DECISIONS.md): tabs (list beside its head) → limits
// (bento on a grey block) → when to switch (dark tile + text card) → FAQ →
// close.
export const metadata = pageMeta({
  title: META.title,
  description: META.description,
  path: "/credentialing-spreadsheet-template",
});

const STRIP_ICONS = [IconUsers, IconGrid, IconDoc, IconMail];
const TAB_ICONS = [IconUsers, IconDoc, IconGrid, IconShield, IconCalendar];
const LIMIT_ICONS = [IconBell, IconRefresh, IconDoc, IconSearch, IconGrid];
const FORM_ID = "get-template";

export default function SpreadsheetTemplatePage() {
  return (
    <Shell>
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate
        current="/credentialing-spreadsheet-template"
        hero={{
          variant: "light",
          eyebrow: HERO.eyebrow,
          title: HERO.title,
          sub: HERO.sub,
          children: (
            <HeroStrip
              tone="light"
              items={HERO.strip.map((label, i) => {
                const Icon = STRIP_ICONS[i];
                return { label, icon: <Icon /> };
              })}
            />
          ),
          form: <EmailCapture heading={TEMPLATE_CTA.heading} id={FORM_ID} />,
          figure: <ScreenSlot screen={FILE_SCREEN} ratio="21:9" todo="Reserved for a capture of the file" />,
        }}
      >
        <IconRowSection
          id="tabs"
          layout="split"
          head={FIELDS.head}
          items={FIELDS.items.map((it, i) => {
            const Icon = TAB_ICONS[i];
            return { ...it, icon: <Icon /> };
          })}
        />

        <CardGridSection
          id="limits"
          surface="block"
          layout="bento"
          featured={0}
          head={LIMITS.head}
          items={LIMITS.items.map((it, i) => {
            const Icon = LIMIT_ICONS[i];
            return { ...it, icon: <Icon /> };
          })}
          closing={LIMITS.closing}
        />

        <ProseBandSection id="enough" surface="ink" head={ENOUGH.head} paras={ENOUGH.paras} />

        <PanelSection id="faq" head={FAQ_HEAD} split>
          <Faq items={FAQ} openFirst />
        </PanelSection>

        <CtaSection
          title={CLOSING.title}
          body={CLOSING.body}
          primary={{ label: TEMPLATE_CTA.buttonLabel, href: `#${FORM_ID}` }}
        />
      </LandingTemplate>
    </Shell>
  );
}
