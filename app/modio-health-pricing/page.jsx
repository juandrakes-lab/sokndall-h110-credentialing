import Shell from "@/components/neo/Shell";
import EditorialTemplate, { EditorialCta } from "@/components/neo/Editorial";
import { GoodFitSection } from "@/components/neo/ComparisonBits";
import { PageHeader, ProseSection, RelatedGuides } from "@/components/neo/EditorialBits";
import {
  CONTENTS,
  RELATED,
  KNOWN,
  STRENGTHS,
  FIT,
  THIRD_OPTION,
  QUESTIONS,
  FAQ_ITEMS,
} from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Modio Health pricing: what is public, and what to know before the call — Sokndall",
  description:
    "Modio quotes after a demo. Here is what is verifiable, who OneView fits, and what a published-price alternative costs.",
  path: "/modio-health-pricing",
  type: "article",
});

// Moved off the solo-column `Comparison` wrapper onto the editorial mould's
// comparison variant, so all three competitor pages now share one frame with
// /caqh-reattestation: masthead, sticky contents at 288px, 720px column, and
// the fixed tail of price → CTA → FAQ → related.
//
// The copy is unchanged. Only two things about it moved: the price section is
// now the template's, not a row in this file's SECTIONS array, and the
// "where the fit question comes in" section renders through `GoodFitSection`
// instead of a generic prose section. That swap changes no markup — the
// component delegates to `ProseSection` precisely so a good-fit section is
// visually indistinguishable from the body around it — it names the slot, so
// the prohibition on dressing it up as a card has somewhere to live.
//
// The three sections that would suit `SourcedPricingDisclosure` and
// `PurchaseModelCompare` are deliberately left as prose: this page's approved
// copy is written as paragraphs, and recasting it into claim/status/source
// rows would be a copy rewrite, not a template migration. /symplr-pricing is
// the page that shows those two components.
export default function ModioHealthPricingPage() {
  return (
    <Shell>
      <EditorialTemplate
        variant="comparison"
        contents={CONTENTS}
        header={
          <PageHeader
            title="Modio Health pricing: what is public, and what to know before the call"
            standfirst="Modio quotes after a demo. Here is what is verifiable, who OneView fits, and what a published-price alternative costs."
            category="Pricing comparison"
            date="2026-09-06"
            dateLabel="Checked"
            readingTime="4 min read"
          />
        }
        price={{
          heading: "What Sokndall costs",
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

        <ProseSection id="strengths" heading="What OneView actually does well">
          {STRENGTHS.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ProseSection>

        <GoodFitSection id="fit" heading="Where the fit question comes in">
          {FIT.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </GoodFitSection>

        <ProseSection
          id="third-option"
          heading="Two different products, and a third one worth naming"
        >
          {THIRD_OPTION.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ProseSection>

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
