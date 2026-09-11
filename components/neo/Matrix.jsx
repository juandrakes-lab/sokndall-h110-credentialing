// The provider x payer schematic: one row per provider, one column per payer,
// one cell per application.
//
// Every cell states its status four ways — glyph, written label, day count,
// and only then colour. Desaturate the page and nothing is lost, which is the
// difference between a diagram and a heatmap. Amber marks the two states that
// need someone to act; nothing else on the grid is amber.
//
// It is a diagram of the data model, not a picture of a product screen. The
// note renders on the page, above the grid, so a reader is told that directly
// rather than having to infer it.
//
// Deterministic: same props in, same grid out, so it renders on the server.

export const CELL_STATES = {
  approved: { glyph: "✓", label: "Approved", kind: "calm" },
  review:   { glyph: "●", label: "In review", kind: "calm" },
  info:     { glyph: "▲", label: "Info req.", kind: "action" },
  quiet:    { glyph: "■", label: "No contact", kind: "urgent" },
};

const LEGEND = [
  { key: "approved", note: "Loaded and paying at in-network rates." },
  { key: "review", note: "With the payer. Nothing outstanding on your side." },
  { key: "info", note: "The payer needs something and did not tell you." },
  { key: "quiet", note: "No contact in over 40 days. Call today." },
];

function score(r, c) {
  return (r * 37 + c * 91 + r * c * 13) % 211;
}

export function buildMatrix({ rows = 5, cols = 5, infoCount = 3, quietCount = 3, reviewCount = 6 } = {}) {
  const scored = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) scored.push([r, c, score(r, c)]);
  }
  scored.sort((a, b) => b[2] - a[2] || a[0] - b[0] || a[1] - b[1]);

  const state = new Map();
  let i = 0;
  for (let n = 0; n < quietCount && i < scored.length; n++, i++) state.set(key(scored[i]), "quiet");
  for (let n = 0; n < infoCount && i < scored.length; n++, i++) state.set(key(scored[i]), "info");
  for (let n = 0; n < reviewCount && i < scored.length; n++, i++) state.set(key(scored[i]), "review");

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const s = state.get(`${r}-${c}`) || "approved";
      const days =
        s === "quiet" ? 41 + ((r * 7 + c * 13) % 38)
        : s === "info" ? 19 + ((r * 5 + c * 11) % 14)
        : s === "review" ? 6 + ((r * 3 + c * 7) % 12)
        : 1 + ((r * 5 + c * 3) % 9);
      cells.push({ key: `${r}-${c}`, r, c, state: s, days });
    }
  }
  return cells;
}

function key([r, c]) {
  return `${r}-${c}`;
}

/** The visible "this is not a screenshot" note. Pages pass their own approved
 *  wording as `children`; the default is the pre-v3.1 home wording, kept for
 *  the styleguide. Whatever the words, the note is always rendered — a
 *  schematic without it reads as a product screen (DESIGN_RULES.md §2 regla 1). */
export function MatrixNote({ children }) {
  return (
    <p className="sk-matrix__note">
      <span aria-hidden="true">◇</span>
      {children ? (
        <span>{children}</span>
      ) : (
        <span>
          <b>This is a schematic of the data model, not a product screenshot.</b> One cell per
          provider-payer application, showing the status and the days since anyone last made contact —
          drawn here at reduced size, five providers by five payers, so every cell stays readable.
        </span>
      )}
    </p>
  );
}

export function MatrixLegend() {
  return (
    <div className="sk-matrix__legend">
      {LEGEND.map(({ key: k, note }) => {
        const s = CELL_STATES[k];
        return (
          <div className="sk-matrix__legend-item" key={k}>
            <span className="k">
              <span className={`sk-matrix__sw${s.kind === "calm" ? "" : " is-action"}`} aria-hidden="true">
                {s.glyph}
              </span>
              {s.label}
            </span>
            <span className="sk-small">{note}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Matrix({
  rows = 5,
  cols = 5,
  infoCount = 3,
  quietCount = 3,
  reviewCount = 6,
  providers,
  payers,
  compact = false,
}) {
  const cells = buildMatrix({ rows, cols, infoCount, quietCount, reviewCount });
  const rowLabels = providers || Array.from({ length: rows }, (_, i) => `Provider ${String(i + 1).padStart(2, "0")}`);
  const colLabels = payers || Array.from({ length: cols }, (_, i) => `Payer ${String.fromCharCode(65 + i)}`);

  const needsAction = cells.filter((x) => x.state === "info" || x.state === "quiet").length;

  // The column count is a custom property rather than a finished
  // grid-template, so the stylesheet can narrow the grid below 640px: a phone
  // shows the first three payers whole instead of five payers cut off by a
  // scroll edge nobody sees (2026-09-11). Columns past the third carry
  // `.sk-matrix__x` and drop out at that width. It is a schematic, so the
  // density is ours to choose — the note still says what it is.
  return (
    <div className={`sk-matrix${compact ? " sk-matrix--compact" : ""}`}>
      <div
        className="sk-matrix__grid"
        style={{ "--cols": cols }}
        role="img"
        aria-label={
          `Schematic: ${rowLabels.length} providers down, ${colLabels.length} payers across, ` +
          `${rows * cols} applications. Each cell shows a status and days since last contact; ` +
          `${needsAction} need action.`
        }
      >
        <div className="sk-matrix__corner" />
        {colLabels.map((p, c) => (
          <div className={`sk-matrix__col${c > 2 ? " sk-matrix__x" : ""}`} key={p}>{p}</div>
        ))}

        {rowLabels.map((label, r) => (
          <Row key={label} label={label} cells={cells.filter((x) => x.r === r)} compact={compact} />
        ))}
      </div>
    </div>
  );
}

function Row({ label, cells, compact }) {
  return (
    <>
      <div className="sk-matrix__row">{label}</div>
      {cells.map((cell) => {
        const s = CELL_STATES[cell.state];
        return (
          <div key={cell.key} className={`sk-matrix__cell sk-matrix__cell--${s.kind}${cell.c > 2 ? " sk-matrix__x" : ""}`}>
            <span className="sk-matrix__lb">
              <span className="sk-matrix__glyph" aria-hidden="true">{s.glyph}</span>
              {s.label}
            </span>
            <span className="sk-matrix__d">{compact ? `${cell.days}d` : `${cell.days}d since contact`}</span>
          </div>
        );
      })}
    </>
  );
}
