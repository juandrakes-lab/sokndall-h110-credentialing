import Link from "next/link";

import { Band, SectionHead, ReservedSlot, RowCard } from "@/components/neo/landingPrimitives";

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

      {closing ? <p className="sk-body sk-body--lg sk-closing">{closing}</p> : null}
    </Band>
  );
}

/** Four blocks across three columns. Column one is one card carrying copy
 *  above a reserved image; column two is narrow, grey and full height; column
 *  three is a small content card above a reserved visual.
 *
 *  `blocks`: [wide, tall, small] — each { title, body, points?, icon? }. */
export function QuadSection({ head, blocks, imageRatio = "3:2" }) {
  const [wide, tall, small] = blocks;
  return (
    <Band>
      <SectionHead {...head} />

      <div className="sk-quad">
        <article className="sk-card sk-card--soft sk-card--pad sk-quad__a">
          <h3 className="sk-h4">{wide.title}</h3>
          <p className="sk-body">{wide.body}</p>
          <ReservedSlot ratio={imageRatio} className="sk-quad__img" />
        </article>

        <article className="sk-card sk-card--soft sk-card--pad sk-quad__b">
          <div className="sk-quad__b-top">
            {tall.icon ? <span className="sk-tile">{tall.icon}</span> : null}
            <h3 className="sk-h4">{tall.title}</h3>
            <p className="sk-body">{tall.body}</p>
          </div>
          {tall.points ? (
            <ul className="sk-list">
              {tall.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          ) : null}
        </article>

        <article className="sk-card sk-card--pad sk-quad__c sk-layer">
          {small.icon ? <span className="sk-tile sk-layer__ico">{small.icon}</span> : null}
          <h3 className="sk-h4">{small.title}</h3>
          <p className="sk-body">{small.body}</p>
        </article>

        <ReservedSlot variant="card" className="sk-quad__d" />
      </div>
    </Band>
  );
}

/** The schematic, its caption, its legend, and the two cards beneath it.
 *  `diagram`, `note` and `legend` are passed in so this file stays layout-only. */
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
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="sk-card sk-card--pad sk-stack">
          <p className="sk-micro">{aside.kicker}</p>
          <p className="sk-h4">{aside.title}</p>
          <p className="sk-small">{aside.body}</p>
        </div>
      </div>
    </Band>
  );
}

/** A dark band carrying a row of figures. `figures`: [{ value, unit, label,
 *  note }]. The unit sits on the figure's baseline, to its right. */
export function FigureBandSection({ head, figures, closing }) {
  const lines = Array.isArray(head.title) ? head.title : [head.title];
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

      <div className="sk-bento sk-bento--eq sk-figures">
        {figures.map((f) => (
          <div className="sk-fig" key={f.label}>
            <p className="sk-fig__v">
              <span className="sk-num">{f.value}</span>
              <span className="sk-fig__u">{f.unit}</span>
            </p>
            <p className="sk-fig__l">{f.label}</p>
            <p className="sk-small">{f.note}</p>
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
 *  `noteLink` trails the note as an inline link. */
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

/** A stack of row cards, each with an icon beside its title. `items`:
 *  [{ title, body, icon, link }]. */
export function IconRowSection({ head, items, closing }) {
  return (
    <Band>
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
                {s.body}
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

      {closing ? <p className="sk-body sk-body--lg sk-scope__closing">{closing}</p> : null}
    </Band>
  );
}

/** A section whose only body is a passed-in element — used for the FAQ, whose
 *  accordion is a client island and stays in components/neo/. */
export function PanelSection({ head, children }) {
  return (
    <Band>
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
        {body ? <p className="sk-lead sk-cta__b">{body}</p> : null}
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
