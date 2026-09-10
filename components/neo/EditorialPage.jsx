import Shell from "@/components/neo/Shell";
import EditorialTemplate, { EditorialCta } from "@/components/neo/Editorial";
import { PageHeader, RelatedGuides, EditorialClose } from "@/components/neo/EditorialBits";
import { renderSections } from "@/components/neo/editorialRender";
import { headerImage, ogImage } from "@/components/neo/pageImages";
import { JsonLd, articleSchema, faqSchema } from "@/components/neo/schema";
import { pageMeta } from "@/lib/seo";

/**
 * The ten editorial pages of the v3.1 map, composed from their data files.
 *
 * This is composition, not a visual component: every piece it places is an
 * existing one (EditorialTemplate, PageHeader, RelatedGuides, EditorialClose,
 * the section renderer). It exists so the ten pages cannot drift in how they
 * wire the same things — the header image from pageImages.js, the Article and
 * FAQPage schema from the same data the page shows, the date format of the
 * meta row, the related cards.
 *
 * `data`: { META, HEADER, CONTENTS, SECTIONS?, TEMPLATE_HEADING, FAQ, RELATED,
 *           CLOSE?, PRICE?, CTA? }. Comparison pages pass their body as
 * `children` (they use ComparisonBits); articles pass SECTIONS.
 */

export function editorialMetadata(route, data) {
  return pageMeta({
    title: data.META.title,
    description: data.META.description,
    path: route,
    type: "article",
    ...(ogImage(route) ? { image: ogImage(route) } : {}),
  });
}

export default function EditorialPage({ route, data, variant = "editorial", children }) {
  const { META, HEADER, CONTENTS, SECTIONS, TEMPLATE_HEADING, FAQ, RELATED, CLOSE, PRICE, CTA } = data;
  const img = headerImage(route);
  const comparison = variant === "comparison";

  return (
    <Shell>
      <JsonLd
        data={articleSchema({
          headline: HEADER.title,
          description: META.description,
          path: route,
          datePublished: HEADER.date,
          image: img?.src,
        })}
      />
      {FAQ?.length ? <JsonLd data={faqSchema(FAQ)} /> : null}

      <EditorialTemplate
        variant={variant}
        current={route}
        contents={CONTENTS}
        templateCtaHeading={TEMPLATE_HEADING}
        templateCtaAt={comparison ? undefined : "before-last"}
        header={
          <PageHeader
            title={HEADER.title}
            standfirst={HEADER.standfirst}
            category={HEADER.category}
            date={HEADER.date}
            dateLabel=""
            dateStyle="dmy"
            readingTime={HEADER.readingTime}
            // The caption only prints under a real photograph; with the slot
            // empty there is nothing for it to caption.
            image={img ? { ...img, ratio: "21 / 9", caption: HEADER.caption } : undefined}
          />
        }
        faq={FAQ || []}
        price={PRICE}
        cta={
          comparison && CTA ? (
            <EditorialCta body={CTA.body} primary={CTA.primary} secondary={CTA.secondary} />
          ) : undefined
        }
        related={<RelatedGuides heading="Related guides" items={RELATED} />}
        closing={CLOSE ? <EditorialClose href={CLOSE.href} label={CLOSE.label} /> : null}
      >
        {children || renderSections(SECTIONS)}
      </EditorialTemplate>
    </Shell>
  );
}
