import Shell from "@/components/neo/Shell";
import Faq from "@/components/neo/Faq";
import EmailCapture from "@/components/neo/EmailCapture";
import { IconUsers, IconGrid, IconDoc, IconMail } from "@/components/neo/icons";
import LandingTemplate, {
  IconRowSection, ProseBandSection, PanelSection, CtaSection, HeroStrip,
} from "@/components/neo/LandingTemplate";
import { FAQ_HEADING } from "@/components/neo/neoData";
import { TEMPLATE_CTA } from "@/components/neo/templateCta";
import { JsonLd, faqSchema } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";
import { META, HERO, FIELDS, LIMITS, ENOUGH, FAQ, CLOSING } from "./data";

// `/credentialing-spreadsheet-template` — page 4 of the v3.1 map, rebuilt from
// zero on LandingTemplate. Its function is email capture and a linkable asset,
// so the offer is above the fold: the hero's right column is the email box,
// which is this page's one template CTA. The file arrives by email; there is
// no direct download anywhere on the page (DESIGN_RULES.md §9).
export const metadata = pageMeta({
  title: META.title,
  description: META.description,
  path: "/credentialing-spreadsheet-template",
});

const STRIP_ICONS = [IconUsers, IconGrid, IconDoc, IconMail];
const FORM_ID = "get-template";

export default function SpreadsheetTemplatePage() {
  return (
    <Shell>
      <JsonLd data={faqSchema(FAQ)} />

      <LandingTemplate
        current="/credentialing-spreadsheet-template"
        hero={{
          title: HERO.title,
          sub: HERO.sub,
          form: <EmailCapture heading={null} id={FORM_ID} />,
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
        <IconRowSection id="tabs" head={FIELDS.head} items={FIELDS.items} />

        <IconRowSection id="limits" head={LIMITS.head} items={LIMITS.items} closing={LIMITS.closing} />

        <ProseBandSection id="enough" head={ENOUGH.head} paras={ENOUGH.paras} />

        <PanelSection id="faq" head={{ title: FAQ_HEADING }}>
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
