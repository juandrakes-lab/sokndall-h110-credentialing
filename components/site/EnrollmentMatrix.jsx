// Provider x payer schematic. Real HTML/CSS — never a simulated screenshot.
// Sized by props: the landing runs 15 x 12, /payer-enrollment-software 12 x 10.
//
// Pure and deterministic, so this renders on the server. The only motion is the
// CSS stagger in site.css, which respects prefers-reduced-motion.

/** Deterministic "which cells are stuck" — score every cell with a cheap hash,
 *  take the worst N. Same input, same grid, every render. */
function stuckKeys(rows, cols, count) {
  const scored = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scored.push([r + "-" + c, ((r * 37 + c * 91 + r * c * 13) % 211)]);
    }
  }
  scored.sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
  return new Set(scored.slice(0, Math.max(0, count)).map(([k]) => k));
}

export function buildMatrix({ rows = 15, cols = 12, stuckCount = 6, animate = true } = {}) {
  const stuck = stuckKeys(rows, cols, stuckCount);
  const providers = Array.from({ length: rows }, (_, i) => ({
    label: "Provider " + String(i + 1).padStart(2, "0"),
    gridRow: i + 2,
  }));
  const payers = Array.from({ length: cols }, (_, i) => ({
    label: "Payer " + String.fromCharCode(65 + i),
    gridCol: i + 2,
  }));
  const cells = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isStuck = stuck.has(r + "-" + c);
      cells.push({
        key: r + "-" + c,
        gridRow: r + 2,
        gridCol: c + 2,
        stuck: isStuck,
        days: isStuck ? 35 + ((r * 7 + c * 13) % 40) : 1 + ((r * 5 + c * 3) % 18),
        delay: idx * 4 + "ms",
        animClass: animate ? "lp-cell-anim" : "",
      });
      idx++;
    }
  }
  return { providers, payers, cells };
}

/** Exported so a page can place the legend somewhere other than above the grid
 *  (the enrollment page runs it under a narrower figure column). */
export function MatrixLegend({ style }) {
  return (
    <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 20, alignItems: "center", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <span
          style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--cell-calm-mark)", display: "inline-block" }}
        />
        Calm — recent follow-up
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--ink-soft)" }}>
        <span style={{ width: 10, height: 10, border: "2px solid var(--cell-stuck-mark)", display: "inline-block" }} />
        Stuck — no follow-up in 30+ days
      </div>
      <div style={{ fontSize: 13, color: "var(--ink-soft)", fontVariantNumeric: "tabular-nums" }}>
        Number = days since last follow-up
      </div>
    </div>
  );
}

export default function EnrollmentMatrix({
  rows = 15,
  cols = 12,
  stuckCount = 6,
  cellWidth = 58,
  labelWidth = 130,
  legend = true,
}) {
  const { providers, payers, cells } = buildMatrix({ rows, cols, stuckCount });

  return (
    <>
      {legend && <MatrixLegend />}
      <div className="lp-matrix-wrap">
        <div
          className="lp-matrix"
          style={{ "--m-cols": cols, "--m-rows": rows, "--m-cellw": cellWidth + "px", "--m-labelw": labelWidth + "px" }}
        >
          <div className="lp-matrix-corner" />
          {payers.map((p) => (
            <div key={p.label} className="lp-matrix-colh" style={{ gridColumn: p.gridCol }}>
              {p.label}
            </div>
          ))}
          {providers.map((pr) => (
            <div key={pr.label} className="lp-matrix-rowh" style={{ gridRow: pr.gridRow }}>
              {pr.label}
            </div>
          ))}
          {cells.map((cell) => (
            <div
              key={cell.key}
              className={"lp-matrix-cell " + cell.animClass}
              style={{
                gridRow: cell.gridRow,
                gridColumn: cell.gridCol,
                background: cell.stuck ? "var(--cell-stuck-bg)" : "var(--cell-calm-bg)",
                animationDelay: cell.delay,
              }}
            >
              <span className="m" style={{ color: cell.stuck ? "var(--cell-stuck-mark)" : "var(--cell-calm-mark)" }}>
                {cell.stuck ? "▲" : "●"}
              </span>
              <span className="d">{cell.days}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
