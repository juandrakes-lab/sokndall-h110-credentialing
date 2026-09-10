import Shell from "@/components/neo/Shell";
import EditorialTemplate, { EditorialCta } from "@/components/neo/Editorial";
import { GoodFitSection } from "@/components/neo/ComparisonBits";
import { PageHeader, ProseSection, RelatedGuides } from "@/components/neo/EditorialBits";
import {
  CONTENTS,
  RELATED,
  KNOWN,
  STRENGTHS,
  WHERE_IT_STOPS,
  FIT,
  QUESTIONS,
  PRICE_INTRO,
  FAQ_ITEMS,
} from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "MedTrainer pricing: what is published, and what the credentialing module covers — Sokndall",
  description:
    "MedTrainer bundles credentialing with compliance training and document management. Here is what that means for the price, and what a credentialing-only tool costs.",
  path: "/medtrainer-pricing",
  type: "article",
});

// Moved onto the editorial mould's comparison variant, alongside the other two
// competitor pages. Copy unchanged; the price section is now the template's
// rather than a row in this file, and "who MedTrainer is right for" renders
// through `GoodFitSection` — same markup as a prose section, which is the
// point of that component, but the slot is named.
//
// Worth keeping in view for a later pass: of the four vendors researched, this
// is the only one that documents its own pricing logic in its own words —
// utilization, scaling with users and modules. That makes it the page best
// suited to `SourcedPricingDisclosure`, whose whole form is a claim beside its
// provenance. The current copy states it in a paragraph instead, and recasting
// approved copy into claim rows is a copy decision, not a template one.
export default function MedTrainerPricingPage() {
  return (
    <Shell>
      <EditorialTemplate
        variant="comparison"
        contents={CONTENTS}
        header={
          <PageHeader
            title="MedTrainer pricing: what is published, and what the credentialing module actually covers"
            standfirst="MedTrainer bundles credentialing with compliance training and document management. Here is what that means for the price, and what a credentialing-only tool costs."
            category="Pricing comparison"
            date="2026-09-06"
            dateLabel="Checked"
            readingTime="4 min read"
          />
        }
        price={{
          heading: "What Sokndall costs",
          paras: [PRICE_INTRO],
          href: "/pricing",
          link: "See what is included",
        }}
        faq={FAQ_ITEMS}
        cta={
          <EditorialCta
            body="Sokndall publishes its price because the comparison above is the whole argument. Fourteen days, card at signup, no demo to see any of it."
            primary={{ href: "/login", label: "Start 14-day trial" }}
            secondary={{ href: "/pricing", label: "See what is included" }}
          />
        }
        related={<RelatedGuides items={RELATED} />}
      >
        <ProseSection id="known" heading="What is publicly known">
          {KNOWN.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ProseSection>

        <ProseSection id="strengths" heading="It is three products in one subscription">
          {STRENGTHS.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ProseSection>

        <ProseSection id="where-it-stops" heading="Where the bundle stops making sense">
          {WHERE_IT_STOPS.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ProseSection>

        <GoodFitSection id="fit" heading="Who MedTrainer is right for">
          {FIT.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </GoodFitSection>

        <ProseSection
          id="questions"
          heading="Questions worth asking on the demo call, whichever way you go"
        >
          {QUESTIONS.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ProseSection>
      </EditorialTemplate>
    </Shell>
  );
}
