/**
 * StateMark — state is never colour alone (CATALOGO §2.3, hard rules):
 * a glyph (shape) + a text label + a mono figure, every time. Amber applies
 * only when `action` is true, i.e. the state requires someone to act now.
 * Used by StatusTable, MatrixSchematic and AlertLadder.
 */
export default function StateMark({ shape = "○", label, figure, action = false, className = "" }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`.trim()}>
      <span aria-hidden="true" className={`t-small ${action ? "text-signal" : "u-muted"}`}>
        {shape}
      </span>
      <span className="t-small u-ink">{label}</span>
      {figure != null && <span className="mono-data u-muted">{figure}</span>}
    </span>
  );
}
