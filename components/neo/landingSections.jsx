import Link from "next/link";

import { Band, SectionHead, ReservedSlot, RowCard } from "@/components/neo/landingPrimitives";
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
// (decision already taken; DESIGN_DECISIONS.md). The only image-bearing slots
// are the declared, empty `ReservedSlot`s in SplitListSection and QuadSection,
// which stay empty at their declared geometry. The three sections added on
// 2026-09-10 — PlanListSection, ProseBandSection, StatusTableSection — carry
// no image slot at all.

/** A grey block on the left holding a visual, a list of row cards on the
 *  right. `items`: [{ title, body }]. `closing` renders as plain text under
 *  the block — deliberately not a card. */
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
 *  the copy (DESIGN_DECISIONS.md, 2026-09-10). */
export function QuadSection({ head, blocks, imageRatio = "3:2" }) {
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
          <h3 className="sk-h4">{wide.title}</h3>
          <p className="sk-body">
            <Rich text={wide.body} linkClassName="sk-link" />
          </p>
          <ReservedSlot ratio={imageRatio} className="sk-quad__img" />
        </article>

        <article className="sk-card sk-card--soft sk-card--pad sk-quad__b">
          <div className="sk-quad__b-top">
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

        <ReservedSlot variant="card" className="sk-quad__d" />
      </div>
    </Band>
  );
}

/** The schematic, its caption, its legend, and the two cards beneath it.
 *  `diagram`, `note` and `legend` are passed in so this file stays layout-only.
 *  `aside.kicker` is optional; when the copy gives none, no empty eyebrow is
 *  rendered in its place. */
export function DiagramSection({ head, note, diagram, legend, points, aside }) {
  return (
    <Band>
      <SectionHead {...head} />

      {note}
      {diagram}
      {legend}

      <div className="sk-bento sk-bento--2 sk-bento--eq sk-matrix__after">
        <div className="sk-card sk-card--soft sk-card--pad">
          <ul className="sk-list">
            {points.map((p) => (
              <li key={p}>
                <Rich text={p} linkClassName="sk-link" />
              </li>
            ))}
          </ul>
        </div>
        <div className="sk-card sk-card--pad sk-stack">
          {aside.kicker ? <p className="sk-micro">{aside.kicker}</p> : null}
          <p className="sk-h4">{aside.title}</p>
          <p className="sk-small">{aside.body}</p>
        </div>
      </div>
    </Band>
  );
}

/** A dark band carrying a row of figures. `figures`: [{ value?, unit?, label,
 *  note }]. The unit sits on the figure's baseline, to its right.
 *
 *  `value` is optional: when the copy writes the figure into the label itself
 *  ("$600 to $2,400 per provider, per year"), the label carries it and nothing
 *  is split out or restated above it. `note` may carry the source link, which
 *  is where it has to be — in the same card as the figure it sources.
 *  Four figures lay out two by two rather than four across: four in a row puts
 *  a 50-character label on four lines at 1200px. */
export function FigureBandSection({ head, figures, closing }) {
  const lines = Array.isArray(head.title) ? head.title : [head.title];
  const four = figures.length === 4;
  return (
    <Band surface="ink">
      {head.pill ? (
        <p className="sk-head__pill">
          <span className="sk-pill">{head.pill}</span>
        </p>
      ) : null}

      <div className="sk-head__row sk-head__row--top">
        <h2 className="sk-h2">
          {lines.map((line, i) => (
            <span key={line}>
              {line}
              {i < lines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h2>
        {head.aside ? <p className="sk-lead sk-head__aside">{head.aside}</p> : null}
      </div>

      <div className={`sk-bento sk-bento--eq sk-figures${four ? " sk-figures--4" : ""}`}>
        {figures.map((f) => (
          <div className={`sk-fig${f.value ? "" : " sk-fig--label"}`} key={f.label}>
            {f.value ? (
              <p className="sk-fig__v">
                <span className="sk-num">{f.value}</span>
                <span className="sk-fig__u">{f.unit}</span>
              </p>
            ) : null}
            <p className="sk-fig__l">{f.label}</p>
            <p className="sk-small">
              <Rich text={f.note} linkClassName="sk-link sk-link--on-ink" />
            </p>
          </div>
        ))}
      </div>

      {closing ? <p className="sk-lead sk-anchor__closing">{closing}</p> : null}
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
  plans.forEach((p) => {
    if (p.highlighted && p.tag !== "Most complete for a group practice") {
      throw new Error(
        `PlanListSection: the highlighted plan's label must be "Most complete for a group practice" (DESIGN_RULES.md §2 regla 8) — got "${p.tag}".`
      );
    }
  });
  return (
    <Band id={id}>
      <SectionHead {...head} />

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
              <p className="sk-small">{p.desc}</p>
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

      {note ? (
        <p className="sk-small sk-plans__note">
          <Rich text={note} linkClassName="sk-link" />
        </p>
      ) : null}
    </Band>
  );
}

/**
 * ProseBandSection — a section head over running paragraphs, then an optional
 * closing line. Added 2026-09-10.
 *
 * The product pages carry sections that are an argument rather than a set of
 * parallel items: "credentialing and provider enrollment are two steps", "the
 * effective date is not the approval date". Their copy is two to four
 * paragraphs. Forcing it into row cards would cut prose into equal-looking
 * boxes that are not parallel items; forcing it into SplitListSection would
 * spend a reserved slot on a section with nothing to put in it. This is the
 * plain case: head, paragraphs on the section ground, closing line.
 *
 * No card, no surface change, no image slot. The paragraphs hold a reading
 * measure (`.sk-proseband__body`, 68ch) and align to the heading's left edge.
 * `paras` are copy strings and may carry inline source links.
 *
 * Image policy: none.
 */
export function ProseBandSection({ head, paras = [], closing, id }) {
  return (
    <Band id={id}>
      <SectionHead {...head} />
      {paras.length ? (
        <div className="sk-proseband__body">
          {paras.map((p, i) => (
            <p className="sk-body sk-body--lg" key={i}>
              <Rich text={p} linkClassName="sk-link" />
            </p>
          ))}
        </div>
      ) : null}
      {closing ? (
        <p className="sk-body sk-body--lg sk-closing">
          <Rich text={closing} linkClassName="sk-link" />
        </p>
      ) : null}
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
              <tr key={r.status}>
                <th scope="row">
                  <span className={`sk-mark ${r.needsAction ? "sk-mark--warn" : "sk-mark--calm"}`}>
                    <span className="sk-mark__g" aria-hidden="true">{r.glyph}</span>
                    {r.status}
                  </span>
                </th>
                <td>{r.meaning}</td>
                <td>{r.action}</td>
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
 *  lists on the product pages (errors, structure, trial terms) are set. */
export function IconRowSection({ head, items, closing, id }) {
  return (
    <Band id={id}>
      <SectionHead {...head} />

      <div className="sk-stack">
        {items.map((s) => (
          <article className="sk-card sk-card--pad" key={s.title}>
            <div className="sk-row-card">
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
 *  accordion is a client island and stays in components/neo/. */
export function PanelSection({ head, children, id }) {
  return (
    <Band id={id}>
      <SectionHead {...head} />
      {children}
    </Band>
  );
}

/** The closing call to action on a dark band. */
export function CtaSection({ title, body, primary, secondary }) {
  return (
    <Band surface="ink">
      <div className="sk-cta__inner">
        <h2 className="sk-h2">{title}</h2>
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
