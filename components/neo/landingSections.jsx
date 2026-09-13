import Link from "next/link";

import {
  Band, SectionHead, ReservedSlot, ScreenSlot, RowCard, Lines, Pill, InkTile, PhotoFrame,
} from "@/components/neo/landingPrimitives";
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
// IMAGE POLICY, for the whole kit (revised 2026-09-11, DESIGN_RULES §19):
// photographs only in the home's hero and in the photo slots the founder
// defined on the home (`PhotoFrame`, sourced from components/neo/photos.js,
// credited). A `ScreenSlot` holds a product screen or a schematic and never
// stock. Everything else carries no image.
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
export function SplitListSection({ head, items, closing, reservedLabel, photo }) {
  return (
    <Band>
      <SectionHead {...head} />

      <div className="sk-split">
        {photo ? (
          <PhotoFrame photo={photo} ratio="fill" />
        ) : (
          <ReservedSlot variant="grey" label={reservedLabel} />
        )}
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
export function QuadSection({ head, blocks, imageRatio = "3:2", labels = {}, widePhoto }) {
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
          {widePhoto ? (
            <PhotoFrame photo={widePhoto} ratio="3x2" className="sk-quad__img sk-quad__photo" />
          ) : (
            <ReservedSlot ratio={imageRatio} className="sk-quad__img" label={labels.wide} />
          )}
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

/**
 * LayersSection — "Three things, tracked in one place", as three things.
 * Added 2026-09-12 for the home's section 3, replacing QuadSection there.
 *
 * The approved copy heads the section "Three things" and then supplies four
 * cards. Read against the rest of the copy, three are the things tracked —
 * enrollment applications, credentials, the Monday follow-up — and the fourth,
 * "One row per state", is a property of the second (a multi-state licence is a
 * credential). So: three cards, each carrying its own visual at its foot — the
 * applications card a photograph, the follow-up card the digest's screen
 * frame — and "One row per state" set inside the credentials card as a detail.
 * Every string is the copy's; only the grouping is a layout decision, flagged
 * to the copywriter in DESIGN_DECISIONS.md.
 *
 * `blocks`: { applications, credentials, detail, followup } — each { title,
 * body, points?, icon? }. `photo`: the applications card's picture.
 * `screen`: the follow-up card's frame label.
 */
export function LayersSection({ head, blocks, photo, screen }) {
  const { applications: a, credentials: c, detail: d, followup: f } = blocks;
  return (
    <Band>
      <SectionHead {...head} />
      <div className="sk-layers">
        <article className="sk-card sk-card--soft sk-card--pad sk-layers__card">
          <div className="sk-layers__top">
            {a.icon ? <span className="sk-tile">{a.icon}</span> : null}
            <h3 className="sk-h4">{a.title}</h3>
            <p className="sk-body">
              <Rich text={a.body} linkClassName="sk-link" />
            </p>
          </div>
          {photo ? <PhotoFrame photo={photo} ratio="4x3" className="sk-layers__visual" /> : null}
        </article>

        <article className="sk-card sk-card--pad sk-layers__card">
          <div className="sk-layers__top">
            {c.icon ? <span className="sk-tile">{c.icon}</span> : null}
            <h3 className="sk-h4">{c.title}</h3>
            <p className="sk-body">
              <Rich text={c.body} linkClassName="sk-link" />
            </p>
            {c.points ? (
              <ul className="sk-list sk-layers__list">
                {c.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="sk-layers__detail">
            {d.icon ? <span className="sk-tile">{d.icon}</span> : null}
            <h3 className="sk-h4">{d.title}</h3>
            <p className="sk-body">
              <Rich text={d.body} linkClassName="sk-link" />
            </p>
          </div>
        </article>

        <article className="sk-card sk-card--soft sk-card--pad sk-layers__card">
          <div className="sk-layers__top">
            {f.icon ? <span className="sk-tile">{f.icon}</span> : null}
            <h3 className="sk-h4">{f.title}</h3>
            <p className="sk-body">
              <Rich text={f.body} linkClassName="sk-link" />
            </p>
          </div>
          <ScreenSlot screen={screen} ratio="4:3" tone="white" className="sk-layers__visual" />
        </article>
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
export function DiagramSection({ head, note, diagram, legend, points, aside, surface = "card", layout }) {
  // `layout="bento"` (2026-09-11): the heading, the points and the aside go in
  // a dark tile with the dot-grid texture, beside the screen frame and its
  // legend. The full-width dark block this replaces was the emptiest section
  // on the site (founder, round 2).
  if (layout === "bento") {
    return (
      <Band>
        <div className="sk-diagbento">
          <InkTile texture="dots" className="sk-diagbento__head">
            {head.pill ? <Pill>{head.pill}</Pill> : null}
            <h2 className="sk-h2">
              <Lines lines={head.title} />
            </h2>
            <ul className="sk-list sk-diagbento__points">
              {points.map((p) => (
                <li key={p}>
                  <Rich text={p} linkClassName="sk-link" />
                </li>
              ))}
            </ul>
            <div className="sk-glass sk-tile-foot">
              {aside.kicker ? <p className="sk-micro">{aside.kicker}</p> : null}
              <p className="sk-h4">{aside.title}</p>
              <p className="sk-body">{aside.body}</p>
            </div>
          </InkTile>
          <div className="sk-diagbento__screen">
            {note}
            {diagram}
            {legend}
          </div>
        </div>
      </Band>
    );
  }

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

/** Split a figure label into its money range and the rest, for type only:
 *  "$600 to $2,400 per provider, per year" → ["$600 to $2,400", "per provider,
 *  per year"]. The words, their order and the sentence are untouched — the
 *  range is set large, the unit under it (round 3: the founder found the cards
 *  empty at large widths; the reference sets its figures big). A label that
 *  does not open on a dollar figure renders whole. */
function splitFigure(label) {
  const m = label.match(/^(\$[\d,.]+(?:\s+to\s+\$[\d,.]+)?)\s*(.*)$/);
  return m ? [m[1], m[2]] : [null, label];
}

export function FigureBandSection({ head, figures, closing, id }) {
  // A bento since 2026-09-11: a dark tile (ring texture) carries the pill, the
  // heading, the aside and — pinned to its foot — the closing line; the
  // figures sit beside it as light cards, two per row. The one figure that is
  // this product (`ours`) is the section's single yellow element (DESIGN_RULES
  // §18) and spans the full row when the count is odd.
  if (!head.pill && process.env.NODE_ENV !== "production") {
    console.warn("FigureBandSection: head without a pill (DESIGN_RULES.md §13).");
  }
  return (
    <Band id={id}>
      <div className={`sk-figbento sk-figbento--${figures.length}`}>
        <InkTile texture="rings" className="sk-figbento__head">
          {head.pill ? <Pill>{head.pill}</Pill> : null}
          <h2 className="sk-h2">
            <Lines lines={head.title} />
          </h2>
          {head.aside ? <p className="sk-lead sk-figbento__aside">{head.aside}</p> : null}
        </InkTile>
        {/* The closing line sits under the figures, not at the foot of the
            dark tile (round 3): in the tile it made the tile — and so the
            figure cards beside it — tall enough to leave the cards' middles
            empty. Under the figures it reads as what it is, their caption. */}
        <div className="sk-figbento__side">
          <div className="sk-figbento__figs">
            {figures.map((f) => {
              const [range, rest] = splitFigure(f.label);
              return (
                <div className={`sk-figcard${f.ours ? " sk-figcard--ours" : ""}`} key={f.label}>
                  <p className="sk-figcard__l">
                    {range ? <span className="sk-figcard__v">{range}</span> : null}
                    <span className="sk-figcard__u">{range ? ` ${rest}` : rest}</span>
                  </p>
                  <p className="sk-small sk-figcard__note">
                    <Rich text={f.note} linkClassName="sk-link" />
                  </p>
                </div>
              );
            })}
          </div>
          {closing ? <p className="sk-body sk-body--lg sk-figbento__closing">{closing}</p> : null}
        </div>
      </div>
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
            {/* A plan's own href (/start?plan=…) preselects it at signup. */}
            <Link href={p.href ?? cta.href} className="sk-btn sk-btn--primary">
              {cta.label}
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** One plan as a card — for a page that talks about one plan and should show
 *  it rather than describe it (`/for-billing-companies`, "A different
 *  architecture"). Added 2026-09-11; restyled 2026-09-12 to the price list's
 *  own language, because a plan should look the same wherever it appears:
 *  a white card, the trial button in yellow, and — when `tag` is given — the
 *  petrol-ink border and the label on its top edge that mark the highlighted
 *  plan on /pricing. Figures come from the same data as the list and schema. */
export function PlanCard({ plan, cta, tag }) {
  return (
    <article className={`sk-card sk-plancard${tag ? " sk-plancard--hi" : ""}`}>
      {tag ? <span className="sk-plan__tag">{tag}</span> : null}
      <p className="sk-plancard__name">{plan.name}</p>
      <p className="sk-plan__price">
        <span className="sk-num">{plan.price}</span>
        <span className="sk-plan__per">{plan.period}</span>
      </p>
      <p className="sk-body sk-plancard__desc">
        <Rich text={plan.desc} linkClassName="sk-link" />
      </p>
      <ul className="sk-list sk-plan__feats">
        {(plan.features || []).map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <Link href={cta.href} className="sk-btn sk-btn--primary sk-plancard__cta">
        {cta.label}
      </Link>
    </article>
  );
}

/**
 * PlanFeatureMatrix — what changes between the plans, as a table. Added
 * 2026-09-12 for `/pricing`, on the copywriter's brief of 2026-09-09; restyled
 * the same day on the founder's reference (a comparison table set straight
 * under the plans).
 *
 * Deliberately short. The three plans carry the same product except the
 * multi-client layer, so the table does not list every feature with a tick in
 * each column (that invites the reader to hunt for the catch); parity is one
 * row, "Every tracking feature", and the rows that differ are the ones shown.
 *
 * Cells are either a value (a count) or one of two fixed words, "Included" /
 * "Not included". A status cell shows only its symbol — a petrol disc with a
 * tick, or a grey ring with a cross — and carries the word as screen-reader
 * text. The two differ by shape, not by colour, so taking the colour away
 * loses nothing (DESIGN_RULES.md §2 regla 3, as amended 2026-09-12 for binary
 * cells). Any other word in a status cell throws, and so does a bare boolean.
 * The tick is petrol, never yellow: it means what the plan list's ticks above
 * it mean, and the yellow stays the action (§2 regla 4). No row numbers (§6).
 *
 * `embedded`: no band and no section head of its own — the table sits under
 * the price list inside the page's header, with its H2 set at card-title size
 * like the list's (the H2 stays for the outline and SEO; the copy is intact).
 *
 * Below 640px each row becomes a card: the row label, then one line per plan
 * with the plan's name beside its value (`data-label`).
 *
 * `plans`: column names. `rows`: [{ label, cells }]. `caption` renders under
 * the table. `highlight`: the column index of the highlighted plan, tinted.
 * `after`: the line set under the table (the security line on /pricing).
 * Image policy: none — no slot, no decorative icon.
 */
const MATRIX_WORDS = { Included: "yes", "Not included": "no" };
export function PlanFeatureMatrix({ head, plans, rows, caption, highlight, id, surface = "card", after, embedded = false }) {
  rows.forEach((r) => {
    if (r.cells.length !== plans.length) {
      throw new Error(`PlanFeatureMatrix: row "${r.label}" has ${r.cells.length} cells for ${plans.length} plans.`);
    }
    r.cells.forEach((c) => {
      if (typeof c === "boolean") {
        throw new Error(
          `PlanFeatureMatrix: row "${r.label}" passes a bare boolean. Write "Included" or "Not included" — the word is kept as screen-reader text (DESIGN_RULES.md §2 regla 3).`
        );
      }
    });
  });

  const table = (
    <div className="sk-pfm">
      <table className="sk-pfm__table">
        <thead>
          <tr>
            <td className="sk-pfm__corner" />
            {plans.map((p, i) => (
              <th scope="col" key={p} className={i === highlight ? "is-hi" : undefined}>
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.cells.map((c, i) => {
                const kind = MATRIX_WORDS[c];
                return (
                  <td key={plans[i]} data-label={plans[i]} className={i === highlight ? "is-hi" : undefined}>
                    {kind ? (
                      <span className={`sk-pfm__mark sk-pfm__mark--${kind}`}>
                        <span className="sk-pfm__g" aria-hidden="true">{kind === "yes" ? "\u2713" : "\u2715"}</span>
                        <span className="sk-sr">{c}</span>
                      </span>
                    ) : (
                      <span className="sk-pfm__v">{c}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? <p className="sk-small sk-pfm__cap">{caption}</p> : null}
    </div>
  );

  const afterEl = after ? (
    <p className="sk-body sk-body--lg sk-closing sk-pfm__after">
      <Rich text={after} linkClassName="sk-link" />
    </p>
  ) : null;

  if (embedded) {
    const lines = Array.isArray(head.title) ? head.title : [head.title];
    return (
      <div className="sk-pfm-embed" id={id}>
        <h2 className="sk-h3 sk-pfm-embed__t">{lines.join(" ")}</h2>
        {head.note ? (
          <p className="sk-body sk-body--lg sk-pfm-embed__note">
            <Rich text={head.note} linkClassName="sk-link" />
          </p>
        ) : null}
        {table}
        {afterEl}
      </div>
    );
  }

  return (
    <Band id={id} surface={surface}>
      <SectionHead {...head} />
      {table}
      {afterEl}
    </Band>
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

  // A dark prose section is a bento since 2026-09-11: the pill, heading and
  // figure in a dark tile (contour texture), the text in a light card beside
  // it. The full-width dark block read as a box with a heading in its corner.
  if (surface === "ink") {
    return (
      <Band id={id}>
        <div className="sk-prosebento">
          <InkTile texture="contours" className="sk-prosebento__head">
            {headEl}
          </InkTile>
          <div className="sk-card sk-card--pad sk-prosebento__text">{textEl}</div>
        </div>
      </Band>
    );
  }

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
export function StatusTableSection({ head, rows, closing, columns, id, surface = "card" }) {
  const [c1, c2, c3] = columns;
  return (
    <Band id={id} surface={surface}>
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
export function IconRowSection({ head, items, closing, id, layout, surface = "card" }) {
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
    <Band id={id} surface={surface}>
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
export function CardGridSection({ head, items, closing, id, layout, featured, surface = "card" }) {
  // `layout="bento"` (2026-09-11): the same cards at mixed sizes, one of them
  // (`featured`, an index) a dark tile — the reference's "How we work". The
  // pattern is fixed per count so no page improvises a grid: 3 = the dark card
  // tall on the left, two beside it; 4 = dark tall left, two, then one wide;
  // 5 = dark wide over two columns, one beside it, three below. An item's
  // `fact` is a short value from the copy set large (the reference's numbers).
  const bento = layout === "bento";
  const card = (s, i) => {
    const dark = bento && i === featured;
    const inner = (
      <>
        {s.kicker ? <p className="sk-cardgrid__kicker">{s.kicker}</p> : null}
        {s.icon ? <span className="sk-tile sk-cardgrid__ico">{s.icon}</span> : null}
        {s.fact ? <p className="sk-cardgrid__fact">{s.fact}</p> : null}
        <h3 className="sk-h4">{s.title}</h3>
        <p className="sk-body">
          <Rich text={s.body} linkClassName="sk-link" />
        </p>
      </>
    );
    return dark ? (
      <InkTile texture="contours" className={`sk-cardgrid__item sk-cardgrid__item--${i}`} as="article" key={s.title}>
        {inner}
      </InkTile>
    ) : (
      <article className={`sk-card sk-card--pad sk-cardgrid__item sk-cardgrid__item--${i}`} key={s.title}>
        {inner}
      </article>
    );
  };
  return (
    <Band id={id} surface={surface}>
      <SectionHead {...head} />
      <div
        className={`sk-cardgrid sk-cardgrid--${items.length}${bento ? ` sk-cgb sk-cgb--${items.length} sk-cgb--f${featured ?? 0}` : ""}`}
      >
        {items.map(card)}
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
