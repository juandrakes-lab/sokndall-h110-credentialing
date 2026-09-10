// The primitives LandingTemplate's sections are built from.
//
// They render the `.sk-*` classes from components/neo/neo.css. Nothing here
// uses an inline `style` or a hex literal: every value comes from a token.
//
// Everything takes its content as props. No copy is hardcoded.

/** A full-bleed horizontal surface. `surface` picks the ground:
 *  "card" (white), "paper" (white — kept as an alias), "ink" / "ink-2" (the
 *  inset rounded dark blocks). `.sk-wrap` inside holds the measure. */
export function Band({ surface = "card", id, children }) {
  return (
    <section className={`sk-band sk-band--${surface}`} id={id}>
      <div className="sk-wrap">{children}</div>
    </section>
  );
}

/** Section head: eyebrow pill, then heading left and supporting matter right.
 *  The right column is a caption to the left one, never a second heading.
 *
 *  `title` is an array of lines — the line breaks are a design decision, so
 *  they belong to the content, not to a CSS width guess.
 *  Pass either `aside` (a paragraph) or `stat` + `statCaption` (a figure).
 *  `note` renders full width underneath both columns. */
export function SectionHead({ pill, title, aside, stat, statCaption, note }) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <div className="sk-head">
      {pill ? (
        <p className="sk-head__pill">
          <span className="sk-pill">{pill}</span>
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

        {stat ? (
          <div className="sk-head__aside sk-head__aside--stat">
            <p className="sk-stat">{stat}</p>
            {statCaption ? <p className="sk-small sk-head__statcap">{statCaption}</p> : null}
          </div>
        ) : aside ? (
          <p className="sk-body sk-body--lg sk-head__aside">{aside}</p>
        ) : null}
      </div>

      {note ? <p className="sk-body sk-head__note">{note}</p> : null}
    </div>
  );
}

/** A block held for artwork that does not exist yet.
 *
 *  `variant`: "grey" (filled, takes its height from its neighbour), "card"
 *  (white, sits among white cards), "square" (dashed 1:1). `ratio` prints the
 *  reserved aspect ratio so the constraint is visible on the page itself. */
export function ReservedSlot({ variant, ratio, className = "", label = "Reserved" }) {
  // No variant means the bare `.sk-slot` — the caller's own class supplies the
  // ground. `.sk-quad__img` does exactly that.
  const cls = ["sk-slot", variant && `sk-slot--${variant}`, className].filter(Boolean).join(" ");
  return (
    <div className={cls} role="presentation">
      <span className="sk-slot__k">{label}</span>
      {ratio ? <span className="sk-slot__r">{ratio}</span> : null}
    </div>
  );
}

/** A card whose title sits left and its explanation right, centred on each
 *  other. `icon` is optional and renders beside the title. */
// `headingLevel` is the tag; `.sk-h4` is the size. They are separate on
// purpose — the document outline should not be dictated by type scale.
export function RowCard({ title, body, icon, headingLevel = "h3" }) {
  const H = headingLevel;
  return (
    <article className="sk-card sk-card--pad">
      <div className="sk-row-card">
        {icon ? (
          <div className="sk-layer__t">
            <span className="sk-tile">{icon}</span>
            <H className="sk-h4">{title}</H>
          </div>
        ) : (
          <H className="sk-h4">{title}</H>
        )}
        <p className="sk-body">{body}</p>
      </div>
    </article>
  );
}
