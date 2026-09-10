import Link from "next/link";

import Photo from "@/components/neo/Photo";
import { pageKind } from "@/components/neo/pageKinds";

/** Internal routes go through next/link; a citation points off-site and opens
 *  in a new tab, so it does not lose the reader's place in a long page. */
function Cite({ href, className, children }) {
  if (/^https?:/i.test(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

// Formatted on the server with an explicit locale and time zone so the string
// is identical in the SSR HTML and after hydration.
const DATE_FMT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/**
 * PageHeader — the editorial opening: centred title, standfirst, a meta row of
 * facts about the document (category, date, reading time), and a lead image at
 * the width of the reading column.
 *
 * No CTA. That is the whole difference from a landing hero: an editorial page
 * asks to be read first, and its single conversion point is at the foot.
 *
 * The image is obligatory here. With no art yet, `Photo` renders its labelled
 * placeholder carrying the art direction, so the brief travels with the layout
 * rather than living in a separate document.
 */
export function PageHeader({
  as: As = "h1",
  title,
  standfirst,
  category,
  categoryHref,
  date,
  dateLabel = "Updated",
  readingTime,
  image,
}) {
  return (
    <header className="sk-edhead">
      <As>{title}</As>
      {standfirst ? <p className="sk-edhead__sub">{standfirst}</p> : null}

      <div className="sk-edhead__meta sk-small">
        {category ? (
          <span className="sk-edhead__cat">
            {categoryHref ? <Link href={categoryHref}>{category}</Link> : category}
          </span>
        ) : null}
        {date ? (
          <span>
            {dateLabel} <time dateTime={date}>{DATE_FMT.format(new Date(date))}</time>
          </span>
        ) : null}
        {readingTime ? <span>{readingTime}</span> : null}
      </div>

      {image ? (
        <div className="sk-edhead__img">
          <Photo
            src={image.src}
            alt={image.alt}
            ratio={image.ratio || "21 / 9"}
            width={image.width}
            height={image.height}
            direction={image.direction}
            priority
          />
          {image.caption ? (
            <span className="sk-small sk-edhead__cap">{image.caption}</span>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

/**
 * ProseSection — H2 plus body, and the anchor target the contents list points
 * at. The connective tissue of every editorial page; the reading column is
 * nothing but a stack of these.
 *
 * No image slot by default. On an editorial page a figure per section is what
 * turns a reference document back into a brochure — pass `image` only where
 * the picture carries information the sentence cannot, and say why in
 * `imageCaption`, which prints as the caption.
 */
export function ProseSection({ as: As = "h2", id, heading, image, imageCaption, children }) {
  return (
    <section id={id}>
      {heading ? <As>{heading}</As> : null}
      {children}
      {image ? (
        <figure className="sk-edhead__img">
          <Photo
            src={image.src}
            alt={image.alt}
            ratio={image.ratio || "3 / 2"}
            width={image.width}
            height={image.height}
            direction={image.direction}
          />
          {imageCaption ? (
            <figcaption className="sk-small sk-edhead__cap">{imageCaption}</figcaption>
          ) : null}
        </figure>
      ) : null}
    </section>
  );
}

/**
 * StatedVsObserved — the interval a payer or a system publishes, with its
 * source, set against what providers actually report. The project's own form;
 * it has no reference to copy from, so its two constraints are the design:
 *
 *   1. The two sides never merge into a paragraph. They are separate labelled
 *      rows with a rule between them, and either one can be read alone.
 *   2. The observed side is not a decorative quote. Same type size, same left
 *      edge, no tint, no card, no oversized quotation mark. What makes the two
 *      sides differ is the evidence, not the styling — dressing the observed
 *      half up as a testimonial would be arguing with typography.
 *
 * `note` is where the observed side's provenance goes: these are reports, not
 * measurements, and the block says so rather than implying a dataset.
 */
export function StatedVsObserved({ caption, stated, statedSource, observed = [], note }) {
  return (
    <div className="sk-svo">
      {caption ? <span className="sk-small sk-svo__cap">{caption}</span> : null}

      <div className="sk-svo__row">
        <span className="sk-micro sk-svo__lb">Stated</span>
        <div className="sk-svo__body">
          <p>
            {stated}
            {statedSource ? (
              <>
                {" ("}
                <Cite className="sk-src__a" href={statedSource.href}>
                  {statedSource.label}
                </Cite>
                {")"}
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className="sk-svo__row">
        <span className="sk-micro sk-svo__lb">Observed</span>
        <div className="sk-svo__body">
          {observed.map((o) => (
            <div className="sk-svo__case" key={o.text}>
              <span className="sk-num">{o.figure}</span>
              <p>{o.text}</p>
            </div>
          ))}
          {note ? <span className="sk-small sk-svo__note">{note}</span> : null}
        </div>
      </div>
    </div>
  );
}

/**
 * SourcedFigure — a figure with its source linked on the same line, inline in
 * the sentence. Never a footnote marker: a number whose provenance is one
 * scroll away is a number the reader has to take on trust.
 *
 * An estimate says so in words, because an icon or a superscript is something
 * a reader can skip past without registering it.
 *
 *   <p>The cycle runs <SourcedFigure source={{ label: "CAQH", href: "…" }}>
 *   120 days</SourcedFigure> and restarts on the day you attest.</p>
 */
export function SourcedFigure({ children, source, estimate = false }) {
  return (
    <span className="sk-src">
      <span className="sk-src__v">{children}</span>
      {estimate ? <span className="sk-src__est"> [estimate]</span> : null}
      {source ? (
        <>
          {" ("}
          <Cite className="sk-src__a" href={source.href}>
            {source.label}
          </Cite>
          {")"}
        </>
      ) : null}
    </span>
  );
}

/**
 * RelatedGuides — exactly three cards, in three columns, at the foot of every
 * editorial page. It is the page's outgoing internal linking, so on-page-seo.md
 * §6 governs it: 3 to 5 outgoing internal links per page, and the body copy
 * already spends several. Three is the cap, not a target that grew.
 *
 * **The count is fixed at three and the component throws otherwise.** That is
 * what keeps the row from ever ending in a gap, whether the site has ten
 * articles or forty. It is also why there is no "show more".
 *
 * **One block, one heading, never split by type.** Two grids labelled "Guides"
 * and "Comparisons" would partition the section for the reader's benefit and
 * deliver the opposite: a reader looking for what comes next does not care
 * which template a page runs on. Where the type is worth signalling it goes as
 * a small eyebrow INSIDE the card.
 *
 * **The order is the hierarchy.** The first card is the one most related to
 * the page it sits on, and no card is enlarged to say so — position carries it.
 * Selection and order are the copywriter's, per page; this component supplies
 * the three places and nothing else.
 *
 * **The title should run to two lines almost always, and that is a copy job.**
 * There is a minimum as well as a maximum, both measured. A title under the
 * minimum renders on one line and that card is simply shorter than its
 * neighbours — nothing is padded, nothing is truncated, and the two-line cards
 * are never cut down to match the short one. Extending a one-line title is the
 * copywriter's work (real context, not filler); it is not a layout problem and
 * it has no CSS solution. Both bounds throw rather than clip, because a
 * truncated title is a title nobody approved.
 *
 * The eyebrow comes from `pageKinds.js`, looked up by href — never a string
 * written per page, so one page carries one label everywhere it is linked.
 *
 * Image policy: a reserved slot, obligatory and empty, at 3:2 — the same ratio
 * and the same tinted fill as `.sk-quad__img`. It carries no photograph, no
 * placeholder text and no icon: it is a hole for an image, not a block of
 * content.
 */
/* Measured against the rendered page, not estimated: above 1120px the foot is
   a fixed 1040px and a card is a fixed 336px, so these do not move with the
   viewport. Two lines fit 76 characters of title and 97 of hook with average
   words; the caps sit 10 under each, which is the filler noise COPY_LIMITS
   documents — copy with several long words wraps earlier than the measurement
   says, and this cap has to hold for the copy that wraps earliest. */
/* Measured at 1280px against the rendered card, whose content column is a
   fixed 286px above the 1120px breakpoint, so these do not move with the
   viewport. One line holds up to 36 characters; two lines run 37 to 76.
   The MAX sits 10 under the measurement — the filler noise COPY_LIMITS
   documents — because a cap has to hold for the copy that wraps earliest.
   The MIN is the measured threshold itself and it WARNS rather than throws:
   a title that cannot be extended without falsifying what the page is about
   is allowed to sit on one line, and that card is then shorter than its
   neighbours. Throwing here would forbid the case the rule explicitly
   permits. */
export const RG_TITLE_MIN = 37;
export const RG_TITLE_MAX = 66;
export const RG_HOOK_MAX = 87;

export function RelatedGuides({ heading = "Related guides", items = [] }) {
  if (items.length !== 3) {
    throw new Error(
      `RelatedGuides: exactly 3 items are required — got ${items.length}. A fixed count is what stops the row ever ending in a gap.`
    );
  }
  items.forEach((g) => {
    if (process.env.NODE_ENV !== "production" && g.title.length < RG_TITLE_MIN) {
      // eslint-disable-next-line no-console
      console.warn(
        `RelatedGuides: title "${g.title}" is ${g.title.length} characters, under the ${RG_TITLE_MIN} that reach a second line — this card will be shorter than its neighbours. Extend it with real context if the page allows it; leave it if it does not.`
      );
    }
    if (g.title.length > RG_TITLE_MAX) {
      throw new Error(
        `RelatedGuides: title "${g.title}" is ${g.title.length} characters, over the ${RG_TITLE_MAX} that fit two lines. Shorten the copy — the card will not clip it for you.`
      );
    }
    if (g.hook && g.hook.length > RG_HOOK_MAX) {
      throw new Error(
        `RelatedGuides: hook for "${g.title}" is ${g.hook.length} characters, over the ${RG_HOOK_MAX} that fit two lines.`
      );
    }
  });

  return (
    <nav className="sk-rg" aria-label={heading}>
      <p className="sk-micro">{heading}</p>
      <ul className="sk-rg__grid">
        {items.map((g) => (
          <li className="sk-card sk-rg__card" key={g.href}>
            {/* The whole card is the link. The anchor text is the title, which
                is the guide's own name — never "read more" (on-page-seo.md §6).
                The image slot is aria-hidden so it adds nothing to the name. */}
            <Link href={g.href} className="sk-rg__link">
              <span className="sk-rg__img" role="presentation" aria-hidden="true" />
              {pageKind(g.href) ? (
                <span className="sk-micro sk-rg__kind">{pageKind(g.href)}</span>
              ) : null}
              <span className="sk-rg__t">{g.title}</span>
              {g.hook ? <span className="sk-small sk-rg__h">{g.hook}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * EditorialClose — the one closing line an informational article gets instead
 * of the product CTA band.
 *
 * A guide is not a page with our price on it, so it does not carry the blue
 * "Start 14-day trial" band: that band belongs to pages that publish a price
 * table, which today means the comparison variant. What a guide closes with is
 * a single soft link — the reader who wants the automated version follows it,
 * and the reader who came for the answer is not asked for anything.
 */
export function EditorialClose({ href, label }) {
  return (
    <p className="sk-ed__close">
      <Link href={href} className="sk-link">
        {label}
      </Link>
    </p>
  );
}
