import Link from "next/link";

import { Band, SectionHead, ReservedSlot, RowCard, Lines, Pill } from "@/components/neo/landingPrimitives";
import Rich from "@/components/neo/rich";

// The section kit of LandingTemplate. Every section takes its content as
// props and holds no copy of its own.
//
// These were written for the home and lived under components/system/home/,
// which said "home only" in its own path and is why a later reading of the
// repo concluded there was no reusable landing template. There was: the
// sections were parameterised all along. What was missing was the shell, and
// a name that did not claim they belonged to one page. Both fixed — the shell
// is LandingTemplate.jsx and these moved here, which also ends neo importing
// from components/system/, the other, unused design system.
//
// Layout only. Copy lives in each page's own data file; the character budgets
// each slot tolerates are in COPY_LIMITS.md.
//
// IMAGE POLICY, for the whole kit: no photography of people on a landing page
// (decision already taken; DESIGN_DECISIONS.md). The image-bearing slots are
// the home's declared `ReservedSlot`s and, since 2026-09-11, `ScreenSlot` —
// the closed frame a product screen will fill (landingPrimitives.jsx).
//
// LAYOUT VOCABULARY (2026-09-11). No section leaves the right half of the
// measure empty. A text section takes one of four distributions, chosen per
// section by what it carries (DESIGN_RULES.md §14):
//   split  — heading left, text right. For an argument with nothing to show.
//   media  — heading and text on one side, a ScreenSlot on the other (`flip`
//            swaps the sides).
//   stack  — heading left, a column of cards right (IconRowSection `split`).
//   grid   — heading on top, cards across (CardGridSection).

/** A grey block on the left holding a visual, a list of row cards on the
 *  right. `items`: [{ title, body }]. `closing` renders as plain text under
 *  the block — deliberately not a card. `reservedLabel` names what the block
 *  will hold. */
export function SplitListSection({ head, items, closing, reservedLabel }) {
  return (
    <Band>
      <SectionHead {...head} />

      <div className="sk-split">
        <ReservedSlot variant="grey" label={reservedLabel} />
        <div className="sk-stack">
          {items.map((it) => (
            <RowCard key={it.title} title={it.title} body={it.body} />
          ))}
        </div>
      </div>

      {closing ? (
        <p className="sk-body sk-body--lg sk-closing">
          <Rich text={closing} linkClassName="sk-link" />
        </p>
      ) : null}
    </Band>
  );
}

/** Four blocks across three columns. Column one is one card carrying copy
 *  above a reserved image; column two is narrow, grey and full height; column
 *  three is a small content card above a reserved visual.
 *
 *  `blocks`: [wide, tall, small, small2?] — each { title, body, points?, icon? }.
 *  A fourth block stacks under the small card in column three's first row; the
 *  reserved visual keeps the second row, so the slot is not given up to fit
 *  the copy (DESIGN_DECISIONS.md, 2026-09-10). `labels` names the two reserved
 *  visuals: { wide, corner }. */
export function QuadSection({ head, blocks, imageRatio = "3:2", labels = {} }) {
  const [wide, tall, small, small2] = blocks;
  const Small = ({ b }) => (
    <article className="sk-card sk-card--pad sk-layer">
      {b.icon ? <span className="sk-tile sk-layer__ico">{b.icon}</span> : null}
      <h3 className="sk-h4">{b.title}</h3>
      <p className="sk-body">
        <Rich text={b.body} linkClassName="sk-link" />
      </p>
    </article>
  );
  return (
    <Band>
      <SectionHead {...head} />

      <div className="sk-quad">
        <article className="sk-card sk-card--soft sk-card--pad sk-quad__a">
          {wide.icon ? <span className="sk-tile sk-layer__ico">{wide.icon}</span> : null}
          <h3 className="sk-h4 sk-quad__t">{wide.title}</h3>
          <p className="sk-body">
            <Rich text={wide.body} linkClassName="sk-link" />
          </p>
          <ReservedSlot ratio={imageRatio} className="sk-quad__img" label={labels.wide} />
        </article>

        <article className="sk-card sk-card--soft sk-card--pad sk-quad__b">
          <div className="sk-quad__b-top">
            {/* The narrow column's icon sits above its title, as in the
                reference: in the corner it would push a 23-character title
                onto two lines in a 230px column. */}
            {tall.icon ? <span className="sk-tile">{tall.icon}</span> : null}
            <h3 className="sk-h4">{tall.title}</h3>
            <p className="sk-body">
              <Rich text={tall.body} linkClassName="sk-link" />
            </p>
          </div>
          {tall.points ? (
            <ul className="sk-list">
              {tall.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          ) : null}
        </article>

        {small2 ? (
          <div className="sk-quad__c sk-quad__c--pair">
            <Small b={small} />
            <Small b={small2} />
          </div>
        ) : (
          <div className="sk-quad__c">
            <Small b={small} />
          </div>
        )}

        <ReservedSlot variant="card" className="sk-quad__d" label={labels.corner} />
      </div>
    </Band>
  );
}

/** The schematic, its legend, and the two cards beneath it. `diagram` is
 *  passed in whole — on the rebuilt pages it is a `ScreenSlot` holding the
 *  matrix and its "not a screenshot" note — so this file stays layout-only.
 *  `aside.kicker` is optional; when the copy gives none, no empty eyebrow is
 *  rendered in its place.
 *
 *  The two cards keep their own heights (DESIGN_RULES.md §4 — height matching
 *  was repealed on 2026-09-06; the aside card used to stretch to the list
 *  beside it and float its body in the middle). */
export function DiagramSection({ head, note, diagram, legend, points, aside, surface = "card" }) {
  return (
    <Band surface={surface}>
      <SectionHead {...head} />

      {note}
      {diagram}
      {legend}

      <div className="sk-bento sk-bento--split sk-matrix__after">
        <div className="sk-card sk-card--soft sk-card--pad">
          <ul className="sk-list">
            {points.map((p) => (
              <li key={p}>
                <Rich text={p} linkClassName="sk-link" />
              </li>
            ))}
          </ul>
        </div>
        <div className="sk-card sk-card--pad sk-aside-card">
          {aside.kicker ? <p className="sk-micro">{aside.kicker}</p> : null}
          <p className="sk-h4">{aside.title}</p>
          <p className="sk-body">{aside.body}</p>
        </div>
      </div>
    </Band>
  );
}

/** A dark band carrying a row of figures. `figures`: [{ value?, unit?, label,
 *  note, ours? }]. The unit sits on the figure's baseline, to its right.
 *
 *  `value` is optional: when the copy writes the figure into the label itself
 *  ("$600 to $2,400 per provider, per year"), the label carries it and nothing
 *  is split out or restated above it. `note` may carry the source link, which
 *  is where it has to be — in the same card as the figure it sources.
 *  Four figures lay out two by two rather than four across: four in a row puts
 *  a 50-character label on four lines at 1200px.
 *
 *  `ours` marks Sokndall's own figure. It is the one light card on the dark
 *  band — white against the band's ink-2 cards is the §3 hierarchy (white
 *  carries the main content), so the reader finds this product's number
 *  without a badge or an adjective (2026-09-11).
 *
 *  `layout="side"`: heading left, figures stacked right — for a band whose
 *  copy has no aside paragraph, so the head's right column is not left empty. */
export function FigureBandSection({ head, figures, closing, layout }) {
  const four = figures.length === 4;
  const side = layout === "side";
  if (!head.pill) {
    if (process.env.NODE_ENV !== "production") console.warn("FigureBandSection: head without a pill (DESIGN_RULES.md §13).");
  }

  const figs = (
    <div
      className={`sk-bento sk-figures${four ? " sk-figures--4" : ""}${side ? " sk-figures--side" : ""}`}
    >
      {figures.map((f) => (
        <div className={`sk-fig${f.value ? "" : " sk-fig--label"}${f.ours ? " sk-fig--ours" : ""}`} key={f.label}>
          {f.value ? (
            <p className="sk-fig__v">
              <span className="sk-num">{f.value}</span>
              <span className="sk-fig__u">{f.unit}</span>
            </p>
          ) : null}
          <p className="sk-fig__l">{f.label}</p>
          <p className="sk-small">
            <Rich text={f.note} linkClassName={f.ours ? "sk-link" : "sk-link sk-link--on-ink"} />
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <Band surface="ink">
      {head.pill ? <Pill>{head.pill}</Pill> : null}

      {side ? (
        <div className="sk-figside">
          <div className="sk-figside__head">
            <h2 className="sk-h2">
              <Lines lines={head.title} />
            </h2>
            {closing ? <p className="sk-lead sk-anchor__closing">{closing}</p> : null}
          </div>
          {figs}
        </div>
      ) : (
        <>
          <div className="sk-head__row sk-head__row--top">
            <h2 className="sk-h2">
              <Lines lines={head.title} />
            </h2>
            {head.aside ? <p className="sk-lead sk-head__aside">{head.aside}</p> : null}
          </div>
          {figs}
          {closing ? <p className="sk-lead sk-anchor__closing">{closing}</p> : null}
        </>
      )}
    </Band>
  );
}

/** Plan cards. `plans`: [{ name, price, period, desc, features, highlighted,
 *  tag }]. The highlighted plan takes an accent border and a label anchored on
 *  its top edge — never a filled ground.
 *  `noteLink` trails the note as an inline link.
 *
 *  Superseded on the rebuilt pages by `PlanListSection` — the pricing rule for
 *  this site is a vertical list, not three cards (2026-09-10). Kept so the
 *  styleguide keeps compiling; no page of the v3.1 map uses it. */
export function PlanSection({ head, plans, cta, note, noteLink, id }) {
  return (
    <Band id={id}>
      <SectionHead {...head} />

      <div className="sk-plans">
        {plans.map((p) => (
          <article className={`sk-card sk-plan${p.highlighted ? " sk-plan--hi" : ""}`} key={p.name}>
            {p.highlighted && p.tag ? <span className="sk-plan__tag">{p.tag}</span> : null}
            <h3 className="sk-h4">{p.name}</h3>
            <p className="sk-plan__price">
              <span className="sk-num">{p.price}</span>
              <span className="sk-plan__per">{p.period}</span>
            </p>
            <p className="sk-small">{p.desc}</p>
            <ul className="sk-list sk-plan__feats">
              {(p.features || []).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="sk-plan__cta">
              <Link href={cta.href} className="sk-btn sk-btn--primary">
                {cta.label}
              </Link>
            </div>
          </article>
        ))}
      </div>

      {note ? (
        <p className="sk-small sk-plans__note">
          {note}
          {noteLink ? (
            <>
              {" "}
              <Link href={noteLink.href} className="sk-link">
                {noteLink.label}
              </Link>
            </>
          ) : null}
        </p>
      ) : null}
    </Band>
  );
}

/** The plan rows themselves, without a band around them — so a page can put
 *  the price list inside its header (`/pricing`, where the list is the page's
 *  first object and has to be above the fold). */
export function PlanList({ plans, cta }) {
  plans.forEach((p) => {
    if (p.highlighted && p.tag !== "Most complete for a group practice") {
      throw new Error(
        `PlanList: the highlighted plan's label must be "Most complete for a group practice" (DESIGN_RULES.md §2 regla 8) — got "${p.tag}".`
      );
    }
  });
  return (
    <ol className="sk-planlist">
      {plans.map((p) => (
        <li className={`sk-card sk-planrow${p.highlighted ? " sk-planrow--hi" : ""}`} key={p.name}>
          {p.highlighted ? <span className="sk-plan__tag">{p.tag}</span> : null}
          <div className="sk-planrow__id">
            <h3 className="sk-h4">{p.name}</h3>
            <p className="sk-plan__price">
              <span className="sk-num">{p.price}</span>
              <span className="sk-plan__per">{p.period}</span>
            </p>
          </div>
          <div className="sk-planrow__body">
            <p className="sk-body sk-planrow__desc">
              <Rich text={p.desc} linkClassName="sk-link" />
            </p>
            <ul className="sk-list sk-plan__feats">
              {(p.features || []).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div className="sk-planrow__cta">
            <Link href={cta.href} className="sk-btn sk-btn--primary">
              {cta.label}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * PlanListSection — the price list as a vertical list, one plan per row.
 *
 * Added 2026-09-10. The rule for this site is that prices are a list read top
 * to bottom, not three cards side by side: three cards invite a
 * left-to-right "good / better / best" reading and force three descriptions of
 * different lengths into equal columns, which DESIGN_RULES.md §4 says to stack
 * instead. Each row is a white card: name and price on the left, what the plan
 * is for and what it holds in the middle, the trial button on the right.
 *
 * The middle plan is marked the way the card version marked it — an amber
 * border and a label straddling the top edge, never a filled ground — and the
 * label is always "Most complete for a group practice" (§2 regla 8), which is
 * why it is a prop the page passes rather than a string that could drift here.
 *
 * Figures read from the same data the SoftwareApplication schema does, so the
 * list and the schema cannot disagree.
 *
 * Image policy: none. No slot, no icon, no illustration.
 */
export function PlanListSection({ head, plans, cta, note, id }) {
  return (
    <Band id={id}>
      <SectionHead {...head} />
      <PlanList plans={plans} cta={cta} />
      {note ? (
        <p className="sk-small sk-plans__note">
          <Rich text={note} linkClassName="sk-link" />
        </p>
      ) : null}
    </Band>
  );
}

/**
 * ProseBandSection — a heading and running paragraphs. Added 2026-09-10,
 * rebuilt 2026-09-11.
 *
 * The product pages carry sections that are an argument rather than a set of
 * parallel items: "credentialing and provider enrollment are two steps", "the
 * effective date is not the approval date". Their copy is one to four
 * paragraphs.
 *
 * The first version set the heading over the paragraphs on the left 60% of the
 * measure and left the rest empty — the same dead right half the founder
 * flagged on the forest skin on 2026-08-28, and that the neo rebuild lost.
 * Every distribution now uses the whole measure:
 *
 *   default (split) — pill + heading in the left column, the text in the right.
 *   `media`         — pill, heading and text in one column, a ScreenSlot (or
 *                     any figure) in the other. `flip` puts the figure left.
 *
 * The note is the section's direct answer (on-page-seo.md §5), so it opens the
 * text column at lead size — before this it was the smallest type in the
 * section. Note, paragraphs and closing share one measure: the column's.
 *
 * `surface="ink"` sets it as a dark block, for the band rhythm (no more than
 * three white sections in a row, DESIGN_RULES.md §15). `stat` +
 * `statCaption` put a figure from the copy under the heading, the reference's
 * big number — always one the copy gives, with its source in the caption.
 *
 * Image policy: none of its own; `media` carries a ScreenSlot.
 */
export function ProseBandSection({ head, paras = [], closing, id, media, flip = false, surface = "card" }) {
  if (!head.pill) {
    if (process.env.NODE_ENV !== "production") console.warn("ProseBandSection: head without a pill (DESIGN_RULES.md §13).");
  }

  const headEl = (
    <div className="sk-prose2__head">
      {head.pill ? <Pill>{head.pill}</Pill> : null}
      <h2 className="sk-h2">
        <Lines lines={head.title} />
      </h2>
      {head.stat ? (
        <div className="sk-prose2__stat">
          <p className="sk-stat">{head.stat}</p>
          {head.statCaption ? (
            <p className="sk-small sk-prose2__statcap">
              <Rich text={head.statCaption} linkClassName="sk-link" />
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  const textEl = (
    <div className="sk-prose2__text">
      {head.note ? (
        <p className="sk-lead sk-prose2__note">
          <Rich text={head.note} linkClassName="sk-link" />
        </p>
      ) : null}
      {paras.map((p, i) => (
        <p className="sk-body sk-body--lg" key={i}>
          <Rich text={p} linkClassName="sk-link" />
        </p>
      ))}
      {closing ? (
        <p className="sk-body sk-body--lg sk-prose2__closing">
          <Rich text={closing} linkClassName="sk-link" />
        </p>
      ) : null}
    </div>
  );

  if (media) {
    return (
      <Band id={id} surface={surface}>
        <div className={`sk-prose2 sk-prose2--media${flip ? " sk-prose2--flip" : ""}`}>
          <div className="sk-prose2__col">
            {headEl}
            {textEl}
          </div>
          <div className="sk-prose2__media">{media}</div>
        </div>
      </Band>
    );
  }

  return (
    <Band id={id} surface={surface}>
      <div className="sk-prose2">
        {headEl}
        {textEl}
      </div>
    </Band>
  );
}

/**
 * StatusTableSection — every status an application can be in, what it means,
 * and what to do about it. Added 2026-09-10 for `/payer-enrollment-software`.
 *
 * A status is never colour alone (DESIGN_RULES.md §2 regla 3): each row's
 * status is a `.sk-mark` carrying a glyph and its written name, and the one
 * state that needs action from the reader takes the amber fill and border
 * (never amber text). The glyphs reuse the matrix's vocabulary where the two
 * overlap — ● in review, ▲ info requested, ✓ approved — so the table and the
 * schematic on the same page describe one system.
 *
 * There is no count column. The copy describes the statuses; it does not report
 * how many applications sit in each, and a count here would be invented.
 *
 * Below 640px each row stacks into a card: the mark on top, then the two
 * fields under their column names (`data-label`). Three columns at 390px put
 * eight characters on a line and pushed the last column off the screen.
 *
 * `rows`: [{ glyph, status, meaning, action, needsAction? }].
 * Image policy: none.
 */
export function StatusTableSection({ head, rows, closing, columns, id }) {
  const [c1, c2, c3] = columns;
  return (
    <Band id={id}>
      <SectionHead {...head} />
      <div className="sk-tablewrap sk-statustable">
        <table className="sk-table">
          <thead>
            <tr>
              <th scope="col">{c1}</th>
              <th scope="col">{c2}</th>
              <th scope="col">{c3}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.status} className={r.needsAction ? "is-action" : undefined}>
                <th scope="row">
                  <span className={`sk-mark ${r.needsAction ? "sk-mark--warn" : "sk-mark--calm"}`}>
                    <span className="sk-mark__g" aria-hidden="true">{r.glyph}</span>
                    {r.status}
                  </span>
                </th>
                <td data-label={c2}>{r.meaning}</td>
                <td data-label={c3}>{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {closing ? (
        <p className="sk-body sk-body--lg sk-closing">
          <Rich text={closing} linkClassName="sk-link" />
        </p>
      ) : null}
    </Band>
  );
}

/** A stack of row cards, each with an icon beside its title. `items`:
 *  [{ title, body, icon, link }]. The icon is optional: without one the card
 *  is a plain title-left / explanation-right row, which is how the parallel
 *  lists on the product pages (errors, structure, trial terms) are set.
 *
 *  `layout="split"` (2026-09-11): pill, heading and note in the left column,
 *  the cards stacked in the right one with title above text — the home's
 *  section-2 distribution, for a list short enough to sit beside its head. */
export function IconRowSection({ head, items, closing, id, layout }) {
  const cards = items.map((s) => (
    <article className="sk-card sk-card--pad" key={s.title}>
      <div className={`sk-row-card${layout === "split" ? " sk-row-card--stacked" : ""}`}>
        <div className="sk-layer__t">
          {s.icon ? <span className="sk-tile">{s.icon}</span> : null}
          <h3 className="sk-h4">{s.title}</h3>
        </div>
        <p className="sk-body">
          <Rich text={s.body} linkClassName="sk-link" />
          {s.link ? (
            <>
              {" "}
              <Link href={s.link.href} className="sk-link">
                {s.link.label}
              </Link>
            </>
          ) : null}
        </p>
      </div>
    </article>
  ));

  const closingEl = closing ? (
    <p className="sk-body sk-body--lg sk-scope__closing">
      <Rich text={closing} linkClassName="sk-link" />
    </p>
  ) : null;

  if (layout === "split") {
    if (!head.pill && process.env.NODE_ENV !== "production") {
      console.warn("IconRowSection: head without a pill (DESIGN_RULES.md §13).");
    }
    return (
      <Band id={id}>
        <div className="sk-prose2 sk-prose2--list">
          <div className="sk-prose2__head">
            {head.pill ? <Pill>{head.pill}</Pill> : null}
            <h2 className="sk-h2">
              <Lines lines={head.title} />
            </h2>
            {head.note ? (
              <p className="sk-lead sk-prose2__note">
                <Rich text={head.note} linkClassName="sk-link" />
              </p>
            ) : null}
            {closingEl}
          </div>
          <div className="sk-stack">{cards}</div>
        </div>
      </Band>
    );
  }

  return (
    <Band id={id}>
      <SectionHead {...head} />
      <div className="sk-stack">{cards}</div>
      {closingEl}
    </Band>
  );
}

/**
 * CardGridSection — parallel items across the measure, icon above title above
 * text. Added 2026-09-11.
 *
 * For a list of two to four items whose texts run to a similar length — the
 * one case where cards in a horizontal row are allowed (DESIGN_RULES.md §4).
 * The icon is the section's one enumeration system (§6): no number beside it.
 * Heights are natural; nothing is stretched to match.
 *
 * `items`: [{ icon, title, body }]. Image policy: none.
 */
export function CardGridSection({ head, items, closing, id }) {
  return (
    <Band id={id}>
      <SectionHead {...head} />
      <div className={`sk-cardgrid sk-cardgrid--${items.length}`}>
        {items.map((s) => (
          <article className="sk-card sk-card--pad sk-cardgrid__item" key={s.title}>
            {s.icon ? <span className="sk-tile sk-cardgrid__ico">{s.icon}</span> : null}
            <h3 className="sk-h4">{s.title}</h3>
            <p className="sk-body">
              <Rich text={s.body} linkClassName="sk-link" />
            </p>
          </article>
        ))}
      </div>
      {closing ? (
        <p className="sk-body sk-body--lg sk-scope__closing">
          <Rich text={closing} linkClassName="sk-link" />
        </p>
      ) : null}
    </Band>
  );
}

/** A section whose only body is a passed-in element — used for the FAQ, whose
 *  accordion is a client island and stays in components/neo/.
 *
 *  `split` (2026-09-11): the head sits in a left column and the body fills the
 *  right one. The FAQ heading used to run two lines at display size over a
 *  full-width accordion; beside it, it reads as the label it is. */
export function PanelSection({ head, children, id, split = false }) {
  if (split) {
    if (!head.pill && process.env.NODE_ENV !== "production") {
      console.warn("PanelSection: head without a pill (DESIGN_RULES.md §13).");
    }
    return (
      <Band id={id}>
        <div className="sk-panelsplit">
          <div className="sk-panelsplit__head">
            {head.pill ? <Pill>{head.pill}</Pill> : null}
            <h2 className="sk-h2">
              <Lines lines={head.title} />
            </h2>
            {head.note ? (
              <p className="sk-lead sk-prose2__note">
                <Rich text={head.note} linkClassName="sk-link" />
              </p>
            ) : null}
          </div>
          <div>{children}</div>
        </div>
      </Band>
    );
  }
  return (
    <Band id={id}>
      <SectionHead {...head} />
      {children}
    </Band>
  );
}

/** The closing call to action on a dark band. */
export function CtaSection({ title, body, primary, secondary, pill }) {
  return (
    <Band surface="ink" className="sk-cta-band">
      <div className="sk-cta__inner">
        {pill ? <Pill>{pill}</Pill> : null}
        <h2 className="sk-h2">
          <Lines lines={title} />
        </h2>
        {body ? (
          <p className="sk-lead sk-cta__b">
            <Rich text={body} linkClassName="sk-link sk-link--on-ink" />
          </p>
        ) : null}
        <div className="sk-cta__btns">
          <Link href={primary.href} className="sk-btn sk-btn--primary">
            {primary.label}
          </Link>
          {secondary ? (
            <Link href={secondary.href} className="sk-btn sk-btn--ghost">
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </Band>
  );
}
