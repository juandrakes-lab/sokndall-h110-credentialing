// Low-fidelity schematics of the data model, for the product landings.
// Added 2026-09-11.
//
// Same family as `Matrix`: real HTML at deliberately low fidelity, every
// label taken from the approved copy, no invented metric. Each one is meant
// to sit inside a `ScreenSlot`, whose visible note says it is not a
// screenshot, and each is replaced by the real product screen once it exists
// — never by a better-drawn mockup (CLAUDE.md, "Diagrams stay diagrams").
//
// IMAGE POLICY for the file: none. No image slot, no illustration, no people.
// Icons are the solid set in icons.jsx, without a box (DESIGN_RULES.md §5).

import { IconLock, IconUser, IconUsers } from "@/components/neo/icons";

/**
 * StatusTrack — the statuses one application moves through, in order, with
 * the exit branch under them. `/payer-enrollment-software`, hero.
 *
 * `steps`: [{ glyph, label, action?, hint? }] — the same glyphs as the page's
 * status table, so the two describe one system. The one step that needs the
 * reader to act takes the amber fill and border, never amber text (§2 regla
 * 4), and may carry a `hint` from the copy. `end`: the cap after the last
 * step. `branch`: { glyph, label, hint } — the way out of the track.
 */
export function StatusTrack({ steps, end, branch }) {
  return (
    <div
      className="sk-track"
      role="img"
      aria-label={`Schematic: ${steps.map((s) => s.label).join(", then ")}, then ${end}. ${branch.label} leaves the track.`}
    >
      <ol className="sk-track__steps">
        {steps.map((s) => (
          <li className={`sk-track__step${s.action ? " is-action" : ""}`} key={s.label}>
            <span className="sk-track__row">
              <span className={`sk-mark ${s.action ? "sk-mark--warn" : "sk-mark--calm"}`}>
                <span className="sk-mark__g" aria-hidden="true">{s.glyph}</span>
                {s.label}
              </span>
              <span className="sk-track__line" aria-hidden="true" />
            </span>
            {s.hint ? <span className="sk-track__hint">{s.hint}</span> : null}
          </li>
        ))}
        <li className="sk-track__end">
          <span className="sk-track__endchip">{end}</span>
        </li>
      </ol>
      <p className="sk-track__branch">
        <span className="sk-track__fork" aria-hidden="true" />
        <span className="sk-mark sk-mark--calm">
          <span className="sk-mark__g" aria-hidden="true">{branch.glyph}</span>
          {branch.label}
        </span>
        <span className="sk-track__hint">{branch.hint}</span>
      </p>
    </div>
  );
}

/**
 * ClientStructure — one login over separate client organizations, the
 * coordinators scoped to some of them, and the one view that counts across
 * all of them. `/for-billing-companies`, hero.
 *
 * `clients`: names, one tile each (the copy's "six clients"). `scopes`:
 * [{ label, from, to }] — a bar under the clients it covers (column indexes,
 * inclusive), from the copy's "assign a coordinator to two clients and not the
 * other four". `login` and `aggregate` are the two labels across the top and
 * the foot. No counts anywhere: the copy gives none.
 */
export function ClientStructure({ login, clients, tileNote, scopes, aggregate }) {
  const cols = clients.length;
  return (
    <div
      className={`sk-orgs sk-orgs--${cols}`}
      role="img"
      aria-label={`Schematic: ${login}; ${cols} separate client organizations; ${scopes
        .map((s) => s.label)
        .join("; ")}; ${aggregate}.`}
    >
      <p className="sk-orgs__login">
        <span className="sk-mark sk-mark--calm">
          <IconUsers className="sk-orgs__ico" />
          {login}
        </span>
      </p>
      <ul className="sk-orgs__row">
        {clients.map((c) => (
          <li className="sk-orgs__tile" key={c}>
            <IconLock className="sk-orgs__lock" />
            <span className="sk-orgs__name">{c}</span>
            <span className="sk-orgs__note">{tileNote}</span>
          </li>
        ))}
      </ul>
      <ul className="sk-orgs__scopes">
        {scopes.map((s) => (
          <li className={`sk-orgs__scope sk-orgs__scope--${s.from}-${s.to}`} key={s.label}>
            {s.label}
          </li>
        ))}
      </ul>
      <p className="sk-orgs__agg">{aggregate}</p>
    </div>
  );
}

/**
 * CountDiagram — two counts of different things, drawn as marks so the
 * difference in unit is visible before it is read. `/pricing`, the "a provider
 * is not a user" section.
 *
 * `rows`: [{ count, unit, note, kind: "person" | "record" }]. The counts are
 * the copy's own example ("a three-person front office managing forty
 * clinicians"), never a customer figure. `caption` is that sentence.
 */
export function CountDiagram({ rows, caption }) {
  return (
    <div className="sk-count">
      {rows.map((r) => (
        <div className="sk-count__row" key={r.unit}>
          <p className="sk-count__head">
            <span className="sk-count__n">{r.count}</span>
            <span className="sk-count__u">{r.unit}</span>
            <span className="sk-count__note">{r.note}</span>
          </p>
          <ul
            className={`sk-count__marks sk-count__marks--${r.kind}`}
            aria-label={`${r.count} ${r.unit}`}
          >
            {Array.from({ length: r.count }, (_, i) => (
              <li key={i}>{r.kind === "person" ? <IconUser className="sk-count__person" /> : null}</li>
            ))}
          </ul>
        </div>
      ))}
      {caption ? <p className="sk-count__cap">{caption}</p> : null}
    </div>
  );
}

/**
 * StageCompare — the two stages the copy separates, side by side, each with
 * what it is and what it stalls on. `/payer-enrollment-software`, "two steps".
 * Every string is lifted from that section's approved note and paragraph; the
 * stage names are the copy's own nouns. Not a product screen, so it sits in the
 * section's media column without a ScreenSlot. Added 2026-09-11.
 *
 * `stages`: [{ name, is, stalls }].
 */
export function StageCompare({ stages }) {
  return (
    <ol className="sk-stages">
      {stages.map((st, i) => (
        <li className={`sk-stage${i === stages.length - 1 ? " sk-stage--last" : ""}`} key={st.name}>
          <p className="sk-stage__n">Stage {String(i + 1).padStart(2, "0")}</p>
          <p className="sk-stage__name">{st.name}</p>
          <p className="sk-body">{st.is}</p>
          <p className="sk-stage__stall">
            <span className="sk-mark sk-mark--calm">Stalls on</span>
            <span>{st.stalls}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
