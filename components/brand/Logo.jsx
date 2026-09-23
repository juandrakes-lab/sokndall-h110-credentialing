/**
 * The Sokndall logo — the only copy of it in the codebase (2026-09-22).
 *
 * An imagotype: the SOKNDALL logotype, whose K carries a check mark in its
 * arms, and that K alone as the symbol. Drawn in Claude Design, paths pasted
 * verbatim from the export (public/brand/ keeps the source SVGs).
 *
 * Single colour, always `currentColor`: ink on light surfaces, white on ink.
 * The component carries no styling system of its own, so the neo skin and the
 * Tailwind app both size and colour it from the outside without crossing.
 *
 * - `<Logo />`               the logotype, for bars, footers and auth screens
 * - `<Logo variant="symbol" />`  the K alone; below ~24px it switches to the
 *                            16px master, redrawn on the pixel grid (`small`)
 */

const LOGOTYPE =
  "M40,-1.6c23.04,0 36,10.82 36,30.05c0,0.52 -0.01,1.04 -0.03,1.55l-18.69,0c0.06,-0.5 0.09,-1.02 0.09,-1.55c0,-7.83 -6.95,-13.05 -17.38,-13.05c-10.43,0 -17.38,5.22 -17.38,13.05c0,7.83 6.95,13.05 17.38,13.05c25.6,0 40,10.82 40,30.05c0,19.23 -14.4,30.05 -40,30.05c-25.6,0 -40,-10.82 -40,-30.05c0,-0.52 0.01,-1.04 0.03,-1.55l19.08,0c-0.08,0.5 -0.11,1.02 -0.11,1.55c0,7.83 8.4,13.05 21,13.05c12.6,0 21,-5.22 21,-13.05c0,-7.83 -8.4,-13.05 -21,-13.05c-23.04,0 -36,-10.82 -36,-30.05c0,-19.23 12.96,-30.05 36,-30.05zM131.3,-1.6c30.08,0 47,18.58 47,51.6c0,33.02 -16.92,51.6 -47,51.6c-30.08,0 -47,-18.58 -47,-51.6c0,-33.02 16.92,-51.6 47,-51.6zM103.3,50c0,20.76 11.2,34.6 28,34.6c16.8,0 28,-13.84 28,-34.6c0,-20.76 -11.2,-34.6 -28,-34.6c-16.8,0 -28,13.84 -28,34.6zM186.3,100v-100h19v39.07l20.67,20.35l30.64,-59.43l19.69,0l-28.73,55.72l28.73,44.28v0l-20.86,0l-17.11,-26.36l-7.7,14.94l-25.33,-24.94v36.37zM346.83,70.48v-70.48h17.67v100h-22.14l-42.19,-70.48v70.48h-17.67v-100h22.14zM375.5,0h40c30.03,0 46,18 46,50c0,32 -15.97,50 -46,50h-40zM394.5,83h19c17.4,0 29,-13.2 29,-33c0,-19.8 -11.6,-33 -29,-33h-19zM530.43,80.15l-38.85,0l-8.08,19.85h-19.5l41,-100h12l41,100l-19.5,0zM498.15,64l25.71,0l-12.85,-31.58zM564,0h19v83h45v17h-64zM634.7,0h19v83h45v17h-64z";

const SYMBOL =
  "M0,100v-100h19l0,39.07l20.67,20.35l30.64,-59.43l19.69,0l-28.73,55.72l28.73,44.28v0l-20.86,0l-17.11,-26.36l-7.7,14.94l-25.33,-24.94v36.37z";

const SYMBOL_16 =
  "M1,1h3v4l4,4l4,-8h3l-3.5,7l3.5,7h-3l-2,-4l-1.333,2.667l-4.667,-4.667v6h-3z";

export default function Logo({ variant = "logotype", small = false, title = "Sokndall", className, ...rest }) {
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": "true" };
  if (variant === "symbol") {
    return small ? (
      <svg viewBox="0 0 16 16" fill="currentColor" className={className} {...a11y} {...rest}>
        <path d={SYMBOL_16} />
      </svg>
    ) : (
      <svg viewBox="0 0 90 100" fill="currentColor" className={className} {...a11y} {...rest}>
        <path d={SYMBOL} />
      </svg>
    );
  }
  // The S and O overshoot the cap line by 1.6 units; the viewBox keeps them.
  return (
    <svg viewBox="0 -2 698.7 104" fill="currentColor" className={className} {...a11y} {...rest}>
      <path d={LOGOTYPE} />
    </svg>
  );
}
