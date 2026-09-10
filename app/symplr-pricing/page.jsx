import Shell from "@/components/neo/Shell";
import EditorialTemplate, { EditorialCta } from "@/components/neo/Editorial";
import {
  SourcedPricingDisclosure,
  GoodFitSection,
  PurchaseModelCompare,
} from "@/components/neo/ComparisonBits";
import {
  PageHeader,
  ProseSection,
  SourcedFigure,
  RelatedGuides,
} from "@/components/neo/EditorialBits";
import {
  CONTENTS,
  RELATED,
  KNOWN_CLAIMS,
  KNOWN_AFTER,
  ESTIMATE_CLAIMS,
  ESTIMATE_AFTER,
  SUITE,
  FIT,
  PURCHASE_ROWS,
  PURCHASE_NOTE,
  QUESTIONS,
  PRICE_LEAD,
  PRICE_CLOSE,
  FAQ_ITEMS,
} from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "symplr pricing: what is public, what is not — Sokndall",
  description:
    "symplr does not publish prices. Here is what can be verified, what has to be estimated, and what a smaller alternative costs — which is $79 to $699 a month, published.",
  path: "/symplr-pricing",
  type: "article",
});

// The sample page for EditorialTemplate's comparison variant. Section order is
// the page's own, but the last three blocks are the template's: our price, the
// closing CTA, the FAQ, and the related guides below them. The template throws
// if the FAQ or the CTA is missing, and it renders the price section whether
// or not this file asks for it.
//
// It used to run on ComparisonTemplate, a single 780px column with no contents
// list. It is on the editorial mould now: the same masthead, the same sticky
// contents at 288px, the same 720px reading column as /caqh-reattestation.
//
// The header carries the lead-image slot the mould expects, empty. There is no
// art for it, so `Photo` renders its labelled placeholder with the direction
// attached. The previous version argued the page should have no image at all,
// on the grounds that its evidence is textual and a photograph would stand in
// front of the argument; that reasoning is now in the slot's direction, where
// it constrains what the photograph may be rather than forbidding one.
export default function SymplrPricingPage() {
  return (
    <Shell>
      <EditorialTemplate
        variant="comparison"
        contents={CONTENTS}
        header={
          <PageHeader
            title="symplr pricing: what is public, what is not, and what it costs to find out"
            standfirst="symplr does not publish prices. Here is what can be verified, what has to be estimated, and what a smaller alternative costs — which is $79 to $699 a month, published."
            category="Pricing comparison"
            date="2026-09-06"
            dateLabel="Checked"
            readingTime="5 min read"
          />
        }
        price={{
          heading: "What Sokndall costs, and what it is being compared to",
          paras: [
            PRICE_LEAD,
            <>
              Outsourced maintenance runs{" "}
              <SourcedFigure estimate>$600 to $2,400 per provider per year</SourcedFigure> in
              published industry estimates, or roughly $50 to $200 a month per provider.{" "}
              {PRICE_CLOSE}
            </>,
          ],
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
        <SourcedPricingDisclosure id="known" heading="What is publicly known" claims={KNOWN_CLAIMS}>
          <p>{KNOWN_AFTER}</p>
        </SourcedPricingDisclosure>

        <SourcedPricingDisclosure
          id="estimates"
          heading="What has to be estimated, and on what basis"
          lead="Everything below is an estimate about how the purchase works, not about what it costs. This page does not estimate a symplr price: labelling a guess does not stop it being a number attributed to a company that published none."
          claims={ESTIMATE_CLAIMS}
        >
          <p>{ESTIMATE_AFTER}</p>
        </SourcedPricingDisclosure>

        <ProseSection id="suite" heading="symplr is a suite, and credentialing is one module of it">
          {SUITE.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </ProseSection>

        <GoodFitSection
          id="fit"
          heading="Who symplr is right for, and what that actually looks like day to day"
        >
          {FIT.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </GoodFitSection>

        <PurchaseModelCompare
          id="purchase"
          heading="How each one is bought"
          theirs="symplr"
          rows={PURCHASE_ROWS}
          note={PURCHASE_NOTE}
        />

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
