import { Children, isValidElement } from "react";
import Link from "next/link";

import { NavBar, NavMobile } from "@/components/neo/Nav";
import EmailCapture from "@/components/neo/EmailCapture";
import Footer from "@/components/neo/Footer";
import Faq from "@/components/neo/Faq";
import TableOfContents from "@/components/neo/EditorialToc";
import { PriceTable } from "@/components/neo/ArticleBits";

/**
 * EditorialTemplate — the long reference pages.
 *
 * The masthead — kicker through lead image — spans the full 1040px measure and
 * is centred on it. Below it the page splits: a sticky contents list on the
 * left at 288px, and a reading column pinned to 720px. The measure is a cap
 * rather than a fraction, so it does not stretch with the viewport; an
 * editorial page that reflows to 900 characters a line at 1440 is a page
 * nobody finishes.
 *
 * What it deliberately does not have, and what separates it from
 * `LandingTemplate` and from the existing `Article`:
 *
 *   - no CTA between sections. The reading column is uninterrupted from the
 *     first H2 to the last, and the only conversion points are the sidebar's
 *     email capture and the `closing` block at the foot;
 *   - no cards and no alternating surfaces inside the column. One continuous
 *     ground, sections separated by air;
 *   - inline links underlined, always.
 *
 * Below 1120px the contents collapse to a plegable block at the top and the
 * sidebar's email capture drops out of the sidebar to sit after the article —
 * one DOM node either way, moved by the grid rather than rendered twice.
 *
 * `variant="comparison"` serves the competitor pages off the same mould. It
 * changes nothing about the frame — same masthead and lead image, same sticky
 * contents, same single reading column, same absence of interstitial CTAs. It
 * only fixes what the last three blocks of the reading column are:
 *
 *     … body sections → our own price → the closing CTA → the FAQ
 *
 * and puts the related articles below the FAQ, in the `related` slot the
 * editorial pages already use. The price section is rendered unconditionally
 * rather than taken from a slot a page could leave empty, and `faq` and `cta`
 * throw when missing, so the shape of the page cannot erode by omission.
 *
 * The body of such a page is built from `SourcedPricingDisclosure`,
 * `GoodFitSection` and `PurchaseModelCompare` in `ComparisonBits`, which are
 * plain `<section>`s and drop into `children` like any other prose section.
 */
export default function EditorialTemplate({
  variant = "editorial",
  current,
  contents = [],
  header,
  children,
  closing,
  related,
  price = {},
  cta,
  faq = [],
  templateCta = true,
}) {
  const comparison = variant === "comparison";

  if (comparison && !faq.length) {
    throw new Error(
      'EditorialTemplate(variant="comparison"): `faq` is required. A comparison page closes with the questions a reader arrives with; without them the page ends on its own price, which is a pitch rather than an answer.'
    );
  }
  if (comparison && !cta) {
    throw new Error(
      'EditorialTemplate(variant="comparison"): `cta` is required. It is the only conversion point on the page, and it sits with the price rather than being scattered through the body.'
    );
  }

  // ---- the two CTAs, which are two different things ----------------------
  //
  //   1. the TEMPLATE CTA  — the grey box, email in, spreadsheet out. It never
  //      links to a page; the file arrives by email. Copy and destination come
  //      from `templateCta.js`.
  //   2. the PRODUCT CTA   — the blue band, "Start 14-day trial" beside the
  //      price table. It belongs only to pages that publish our own price,
  //      which today means the comparison variant.
  //
  // The template CTA is placed where the argument for the file has just been
  // made, not at a fixed fraction of the column. On a comparison page that
  // point is the end of the body, immediately before the price section: the
  // reader has seen what the alternatives cost and what they do not publish,
  // which is the moment the free spreadsheet is worth having. On an article
  // the placement stays where the page put it — after the problem is
  // explained, before the closing section.
  const sections = Children.toArray(children);
  let body = sections;
  if (templateCta && sections.length > 1) {
    const before = comparison
      ? sections.length
      : Math.min(sections.length - 1, Math.max(1, Math.round(sections.length * 0.75)));
    body = [
      ...sections.slice(0, before),
      <div className="sk-ed__tcta" key="template-cta">
        <EmailCapture />
      </div>,
      ...sections.slice(before),
    ];
  }

  // Every EditorialTemplate page carries a header image slot, article and
  // comparison alike, and the slot belongs to the template rather than to ten
  // page files. It ships EMPTY: a declared 21:9 box and nothing inside it, the
  // same as every other reserved slot in the skin. It is not filled, not
  // simulated, and not labelled -- a grey box with words in it reads as
  // content, and there is no content there yet. The art direction lives in
  // docs/image-brief-marketing-pages.md, not in the rendered page.
  const headerHasImage = isValidElement(header) && Boolean(header.props?.image);

  return (
    <div className="sk-ed">
      <div className="sk-ed__bar">
        <NavBar current={current} />
      </div>
      <NavMobile current={current} />

      {/* The masthead spans the whole measure and sits above the split, so the
          title is centred on the page rather than on the reading column and
          the lead image runs the full width. The two columns start below it. */}
      {header ? (
        <div className="sk-ed__head">
          {header}
          {headerHasImage ? null : (
            <div className="sk-ed__headslot" role="presentation" aria-hidden="true" />
          )}
        </div>
      ) : null}

      <div className="sk-ed__grid">
        <div className="sk-ed__side">
          {/* The sticky column carries the contents list and nothing else.
              It used to carry the email box under it; that box is now in the
              reading column, because this column does not exist below ~980px
              and a CTA that is absent on every phone is not a CTA. */}
          <div className="sk-ed__sidein">
            {contents.length ? <TableOfContents items={contents} /> : null}
          </div>
        </div>

        <div className="sk-ed__main">
          <article className="sk-prose sk-ed__prose">
            {body}

            {/* The comparison tail. It is inside the reading column, in the
                same continuous prose flow as the body above it, because the
                mould does not change — only what the last three sections are.

                The price section is rendered unconditionally, not from a prop
                that a page could forget: a page that quotes what a competitor
                costs and not what we cost is the exact move this site argues
                against. The CTA sits with it, and the FAQ closes. */}
            {comparison ? (
              <>
                <section id={price.id || "price"}>
                  <h2>{price.heading || "What Sokndall costs"}</h2>
                  {/* Indexed keys: a paragraph here can carry an inline
                      `SourcedFigure`, so it is a node rather than a string. */}
                  {(price.paras || []).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  <PriceTable />
                  <p>
                    <Link href={price.href || "/pricing"}>
                      {price.link || "See what is included"}
                    </Link>
                  </p>
                </section>

                <div className="sk-ed__cta">{cta}</div>

                <section id="faq">
                  <h2>Frequently asked questions</h2>
                  <Faq items={faq} />
                </section>
              </>
            ) : null}
          </article>
        </div>

        {closing || related ? (
          <div className="sk-ed__foot">
            {/* Related first, closing CTA after it. The reader is handed
                somewhere else to go before being asked for anything. */}
            {related}
            {closing}
          </div>
        ) : null}
      </div>

      <Footer />
    </div>
  );
}

export { ArticleCta as EditorialCta } from "@/components/neo/Article";
