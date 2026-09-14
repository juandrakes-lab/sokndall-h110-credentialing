// The primitives LandingTemplate's sections are built from.
//
// They render the `.sk-*` classes from components/neo/neo.css. Nothing here
// uses an inline `style` or a hex literal: every value comes from a token.
//
// Everything takes its content as props. No copy is hardcoded.
//
// Text props that can carry an inline source link go through `Rich`, so a data
// file writes `[Medicotech](src:medicotech)` and the rel comes from the source
// registry rather than from whoever typed the link.

import Rich from "@/components/neo/rich";

/** A full-bleed horizontal surface. `surface` picks the ground:
 *  "card" (white), "paper" (white — kept as an alias), "ink" / "ink-2" (the
 *  inset rounded dark blocks). `.sk-wrap` inside holds the measure. */
export function Band({ surface = "card", id, className = "", children }) {
  return (
    <section className={`sk-band sk-band--${surface}${className ? ` ${className}` : ""}`} id={id}>
      <div className="sk-wrap">{children}</div>
    </section>
  );
}

/** A heading's authored lines. The copy writes where a headline breaks, so the
 *  break belongs to the content — but only where the line is wide enough to
 *  honour it. `.sk-br` is `display: none` below 900px, so on a phone the
 *  headline wraps naturally instead of stranding a word on its own line
 *  ("one of them is / your / problem right now" at 390px, 2026-09-11). */
// The last authored line of a multi-line heading carries `.sk-em`: section
// headings set it in the brand's mid tone, the reference's coloured second
// line ("TRUSTED AT SCALE"). Display headings (the H1s) ignore it.
export function Lines({ lines }) {
  const arr = Array.isArray(lines) ? lines : [lines];
  return arr.map((line, i) => (
    <span key={line} className={arr.length > 1 && i === arr.length - 1 ? "sk-em" : undefined}>
      {line}
      {i < arr.length - 1 ? <>{" "}<br className="sk-br" /></> : null}
    </span>
  ));
}

/** A row of large facts under the home's hero, the reference's "10M+ · 99.99%"
 *  row — with the difference that every value is a stated product fact from
 *  the approved copy, never a metric. `items`: [{ value, label }]. Not a
 *  section head, so no pill. Added 2026-09-11. */
export function FactStrip({ items }) {
  return (
    <section className="sk-facts" aria-label="Sokndall in figures">
      <ul className="sk-wrap sk-facts__row">
        {items.map((f) => (
          <li className="sk-facts__item" key={f.label}>
            <span className="sk-facts__v">{f.value}</span>
            <span className="sk-facts__l">{f.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The eyebrow pill. Every section head carries one (DESIGN_RULES.md §13,
 *  2026-09-11): it is the brand-colour mark that opens a section, as in the
 *  reference comp. Ink, never amber (§2 regla 4). */
export function Pill({ children }) {
  return (
    <p className="sk-head__pill">
      <span className="sk-pill">{children}</span>
    </p>
  );
}

function warnNoPill(where) {
  if (process.env.NODE_ENV !== "production") {
    // A warning, not a throw: a missing eyebrow is a copy gap, not a broken page.
    console.warn(`${where}: section head without a pill — every section head carries one (DESIGN_RULES.md §13).`);
  }
}

/** Section head: eyebrow pill, then heading left and supporting matter right.
 *  The right column is a caption to the left one, never a second heading.
 *
 *  `title` is an array of lines — the line breaks are a design decision, so
 *  they belong to the content, not to a CSS width guess.
 *  Pass either `aside` (a paragraph) or `stat` + `statCaption` (a figure).
 *  A `statCaption` with no `stat` renders alone in the right column, set as a
 *  caption: the copy can deliver the line without the figure, and the head
 *  must not invent a number to sit above it.
 *  `note` renders full width underneath both columns.
 *  `center` centres pill, heading and note on one axis (no right column). */
export function SectionHead({ pill, title, aside, stat, statCaption, note, center = false }) {
  if (!pill) warnNoPill("SectionHead");

  const right = stat ? (
    <div className="sk-head__aside sk-head__aside--stat">
      <p className="sk-stat">{stat}</p>
      {statCaption ? (
        <p className="sk-small sk-head__statcap">
          <Rich text={statCaption} linkClassName="sk-link" />
        </p>
      ) : null}
    </div>
  ) : statCaption ? (
    <p className="sk-body sk-body--lg sk-head__aside sk-head__aside--cap">{statCaption}</p>
  ) : aside ? (
    <p className="sk-body sk-body--lg sk-head__aside">
      <Rich text={aside} linkClassName="sk-link" />
    </p>
  ) : null;

  const noteEl = note ? (
    <p className="sk-lead sk-head__note">
      <Rich text={note} linkClassName="sk-link" />
    </p>
  ) : null;

  if (center) {
    return (
      <div className="sk-head sk-head--center">
        {pill ? <Pill>{pill}</Pill> : null}
        <h2 className="sk-h2">
          <Lines lines={title} />
        </h2>
        {noteEl}
      </div>
    );
  }

  // When a section has both a right column and a note, the note is the
  // section's direct answer (on-page-seo.md §5: the first paragraph under the
  // first H2). It is therefore placed in the DOM straight after the heading and
  // moved under both columns by grid areas, so a crawler reading source order
  // meets the answer first while the layout stays the approved one.
  const noted = Boolean(noteEl && right);

  return (
    <div className="sk-head">
      {pill ? <Pill>{pill}</Pill> : null}

      <div className={`sk-head__row sk-head__row--top${noted ? " sk-head__row--noted" : ""}`}>
        <h2 className="sk-h2">
          <Lines lines={title} />
        </h2>
        {noted ? noteEl : null}
        {right}
      </div>

      {noted ? null : noteEl}
    </div>
  );
}

/** A block held for artwork that does not exist yet.
 *
 *  `variant`: "grey" (filled, takes its height from its neighbour), "card"
 *  (white, sits among white cards), "square" (dashed 1:1). `ratio` prints the
 *  reserved aspect ratio so the constraint is visible on the page itself.
 *  `label` says what goes there. The pages are not published until every slot
 *  is filled (decision of 2026-09-11), so the label is a production note and
 *  stays visible. */
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

/**
 * ScreenSlot — the closed frame a product screen will fill. Added 2026-09-11.
 *
 * Every visual of the product on a landing lives in one of these: a rounded
 * frame at a declared ratio, with a slim header naming the screen that goes
 * there. Until the screen exists the frame shows one of two things:
 *
 *   - `children` — a low-fidelity schematic of the data model (the matrix, the
 *     status track, the client structure). It explains the product today and
 *     is replaced, never redrawn, when the screenshot exists.
 *   - nothing — an empty, tinted frame. The label is the production note.
 *
 * With children the frame takes the schematic's height (a schematic cannot be
 * squeezed into a ratio without scrolling on a phone); the ratio is still
 * printed, and it is the ratio the screenshot will be cut to. Empty, the frame
 * holds the ratio itself.
 *
 * `screen`: what goes here, written as a production note ("Provider × payer
 * matrix"). `note`: the "not a screenshot" line, required with a schematic
 * (DESIGN_RULES.md §2 regla 1). `todo`: the line on an empty frame — "Reserved
 * for the product screen" unless the frame holds something else (the template
 * page's frame holds a capture of the file itself).
 *
 * Image policy: this is the only image-bearing slot on a landing besides the
 * home's original reserved blocks. Product screens only — never stock, never
 * people.
 */
export function ScreenSlot({
  screen,
  ratio = "16:10",
  note,
  children,
  className = "",
  tone = "grey",
  todo = "Reserved for the product screen",
}) {
  if (children && !note) {
    throw new Error(
      `ScreenSlot "${screen}": a schematic needs its visible "not a screenshot" note (DESIGN_RULES.md §2 regla 1).`
    );
  }
  const empty = !children;
  const [w, h] = ratio.split(":");
  return (
    <figure
      className={`sk-screen sk-screen--${tone}${empty ? " sk-screen--empty" : ""}${className ? ` ${className}` : ""}`}
      data-ratio={ratio}
    >
      {/* No window chrome (traffic-light dots, a URL bar): that would dress
          the frame as an interface, which §2 regla 1 forbids. The bar is a
          production label and nothing else. */}
      <figcaption className="sk-screen__bar">
        <span className="sk-screen__k">Screen</span>
        <span className="sk-screen__name">{screen}</span>
        <span className="sk-screen__r">{ratio}</span>
      </figcaption>
      {empty ? (
        <div className={`sk-screen__hold sk-ar-${w}x${h}`} role="presentation">
          <span className="sk-screen__todo">{todo}</span>
        </div>
      ) : (
        <div className="sk-screen__body">
          {note ? (
            <p className="sk-screen__note">
              <span aria-hidden="true">◇</span>
              <span>{note}</span>
            </p>
          ) : null}
          {children}
        </div>
      )}
    </figure>
  );
}

/** A small fact, set as an indicator: an icon, a figure or short value, and
 *  what it counts. The reference's floating chips, with one difference that is
 *  not negotiable: every value is a real product fact or a sourced figure from
 *  the approved copy — never an invented metric (§2 reglas 1-2). */
export function Indicator({ icon, value, label, tone = "white" }) {
  return (
    <div className={`sk-ind sk-ind--${tone}`}>
      {icon ? <span className="sk-ind__ico">{icon}</span> : null}
      <span className="sk-ind__txt">
        {value ? <span className="sk-ind__v">{value}</span> : null}
        <span className="sk-ind__l">{label}</span>
      </span>
    </div>
  );
}

/** The four-up capability strip. `items`: [{ icon, label }] where `icon` is
 *  an element from icons.jsx. On the ink hero it is a plain row under the
 *  rule; on a light header (`tone="light"`) each item is a chip. */
/**
 * RangeText — a range in a display figure, set with an en dash (DESIGN_RULES
 * §21, 2026-09-14). The copy writes "$600 to $2,400"; in a large figure the
 * word "to" competes with the numbers, so the dash is drawn and the word is
 * kept for screen readers, which read an en dash as nothing or as "dash".
 * Only for figures, stats and chips: running prose keeps "to".
 */
const RANGE_TO = /(\$?\d[\d,.]*\+?)\s+to\s+(\$?\d[\d,.]*)/g;
export function RangeText({ text }) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(RANGE_TO)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push(
      <span className="sk-range" key={m.index}>
        {m[1]}
        <span className="sk-range__dash" aria-hidden="true">{"\u2013"}</span>
        <span className="sk-sr"> to </span>
        {m[2]}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

export function HeroStrip({ items, tone = "dark" }) {
  return (
    <ul className={`sk-strip${tone === "light" ? " sk-strip--chips" : ""}`}>
      {items.map((s) => (
        <li className="sk-strip__item" key={s.label}>
          {s.icon ? <span className="sk-tile">{s.icon}</span> : null}
          <RangeText text={s.label} />
        </li>
      ))}
    </ul>
  );
}

/** A card whose title sits left and its explanation right, centred on each
 *  other. `icon` is optional and renders beside the title. `stacked` sets the
 *  title above the explanation, for a card in a narrow column. */
// `headingLevel` is the tag; `.sk-h4` is the size. They are separate on
// purpose — the document outline should not be dictated by type scale.
export function RowCard({ title, body, icon, headingLevel = "h3", stacked = false }) {
  const H = headingLevel;
  return (
    <article className="sk-card sk-card--pad">
      <div className={`sk-row-card${stacked ? " sk-row-card--stacked" : ""}`}>
        {icon ? (
          <div className="sk-layer__t">
            <span className="sk-tile">{icon}</span>
            <H className="sk-h4">{title}</H>
          </div>
        ) : (
          <H className="sk-h4">{title}</H>
        )}
        <p className="sk-body">
          <Rich text={body} linkClassName="sk-link" />
        </p>
      </div>
    </article>
  );
}

/**
 * InkTile — a dark tile that shares a row with light ones. Added 2026-09-11.
 *
 * The founder found the full-width dark blocks empty: one big box with a
 * heading in a corner and nothing to balance it. The reference (VELD) never
 * does that — its dark surfaces are tiles in a bento, beside light tiles or a
 * photo. This is that tile: ink, rounded, carrying one of the texture family
 * (`texture`: "rings" | "dots" | "contours") and the corner glow. Text inside
 * is white; a `.sk-glass` box inside it is the nested surface.
 *
 * It stretches to its row by design: it is a surface, not a card of content,
 * so the §4 rule against stretched cards does not reach it. What it holds sits
 * at the top, and a `foot` child sits at the bottom.
 */
export function InkTile({ texture = "contours", className = "", children, as: Tag = "div" }) {
  return <Tag className={`sk-tile-ink sk-tex-${texture}${className ? ` ${className}` : ""}`}>{children}</Tag>;
}

/** The visible Pexels credit. Small, on the image's corner. */
export function PhotoCredit({ photo, tone = "dark" }) {
  return (
    <p className={`sk-credit sk-credit--${tone}`}>
      Photo:{" "}
      <a href={photo.url} target="_blank" rel="noopener nofollow">
        {photo.photographer} / Pexels
      </a>
    </p>
  );
}

/**
 * PhotoFrame — a photograph in a rounded frame at a fixed ratio, with its
 * credit. For the photo slots the founder defined; never for a ScreenSlot.
 * `ratio` is one of the `.sk-ar-*` classes ("3x2", "1x1", "4x5"…), or
 * "fill" to take the height of the grid cell it sits in. `children` float
 * over the photo (an indicator chip, as in the reference).
 */
export function PhotoFrame({ photo, ratio = "3x2", eager = false, className = "", children }) {
  return (
    <figure className={`sk-photoframe${ratio === "fill" ? " sk-photoframe--fill" : ` sk-ar-${ratio}`}${className ? ` ${className}` : ""}`}>
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
      />
      {children ? <div className="sk-photoframe__over">{children}</div> : null}
      <figcaption>
        <PhotoCredit photo={photo} />
      </figcaption>
    </figure>
  );
}
