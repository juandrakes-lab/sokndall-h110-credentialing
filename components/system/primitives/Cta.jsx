import Link from "next/link";

/**
 * Cta — the only place `bg-signal` (amber) is allowed to appear as a fill,
 * and only on tone="primary". tone="secondary" is a 1px hairline with ink
 * text. No icons, no arrows glued to the label (CATALOGO §7, hard rules).
 *
 * Amber = "an action is required here". A page must not carry more than one
 * primary Cta per view; that is a review rule, not enforced here.
 */
export default function Cta({ href, tone = "primary", className = "", children }) {
  const tones = {
    primary: "bg-signal border-signal u-ink",
    secondary: "bg-transparent u-hair u-ink",
  };
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded border px-4 py-3 t-small ${tones[tone]} ${className}`.trim()}
    >
      {children}
    </Link>
  );
}
