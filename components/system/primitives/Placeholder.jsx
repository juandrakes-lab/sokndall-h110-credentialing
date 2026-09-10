/**
 * Placeholder — solid grey box at the right aspect ratio, labelled with the
 * image treatment (BLEED / FLOAT / TILE, CATALOGO §4). Stands in until a real
 * documental photo or product screenshot exists; when one does, it enters
 * through the component's own image prop and nothing here is redesigned.
 *
 * Never a gradient, never a blurred shape, never a fake UI. Just grey.
 */
const RATIO = {
  "1x1": "ratio-1x1",
  "4x3": "ratio-4x3",
  "3x2": "ratio-3x2",
  "16x9": "ratio-16x9",
};

export default function Placeholder({ ratio = "3x2", treatment = "FLOAT", label }) {
  const cut = treatment === "TILE" ? " corner-cut" : "";
  return (
    <div
      role="img"
      aria-label={label || `Image placeholder — ${treatment} treatment`}
      className={`${RATIO[ratio] || RATIO["3x2"]} w-full bg-rule-light border u-hair flex items-center justify-center${cut}`}
    >
      <span className="t-small u-muted">{treatment}</span>
    </div>
  );
}
