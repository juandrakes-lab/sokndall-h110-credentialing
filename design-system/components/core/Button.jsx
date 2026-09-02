import React from "react";

const SIZES = {
  sm: { height: 38, padding: "0 18px", fontSize: "var(--fs-caption)" },
  md: { height: 46, padding: "0 24px", fontSize: "var(--fs-small)" },
  lg: { height: 54, padding: "0 30px", fontSize: "var(--fs-body)" },
};

function fills(variant) {
  switch (variant) {
    case "gold":
      return { bg: "var(--action-gold)", hover: "var(--action-gold-hover)", press: "var(--action-gold-press)", fg: "var(--text-on-gold)", border: "transparent", chip: "rgba(20,40,29,.12)" };
    case "outline":
      return { bg: "transparent", hover: "var(--paper-warm)", press: "var(--ink-050)", fg: "var(--action-outline-text)", border: "var(--action-outline-border)", chip: "var(--ink-100)" };
    case "ghost":
      return { bg: "transparent", hover: "var(--sage-100)", press: "var(--sage-200)", fg: "var(--forest-700)", border: "transparent", chip: "var(--sage-100)" };
    case "onDark":
      return { bg: "var(--action-on-dark-bg)", hover: "var(--paper)", press: "var(--ink-100)", fg: "var(--action-on-dark-text)", border: "transparent", chip: "rgba(20,40,29,.10)" };
    default:
      return { bg: "var(--action-primary)", hover: "var(--action-primary-hover)", press: "var(--action-primary-press)", fg: "var(--white)", border: "transparent", chip: "rgba(255,255,255,.14)" };
  }
}

/* The comp sets a small inset square holding a ↗ on the right of every CTA. */
function ArrowChip({ bg }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: "grid", placeItems: "center", width: "1.55em", height: "1.55em",
        marginRight: "-0.35em", marginLeft: "0.15em", borderRadius: "var(--radius-xs)",
        background: bg, fontSize: "0.85em", lineHeight: 1,
      }}
    >
      &#8599;
    </span>
  );
}

export function Button({
  children, variant = "primary", size = "md", arrow = false,
  iconLeft, iconRight, disabled = false, fullWidth = false, as = "button", style, ...rest
}) {
  const Tag = as;
  const c = fills(variant);
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size];
  const bg = disabled ? "var(--action-disabled-bg)" : press ? c.press : hover ? c.hover : c.bg;
  return (
    <Tag
      disabled={as === "button" ? disabled : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "var(--space-2)",
        height: s.height, padding: s.padding, width: fullWidth ? "100%" : "auto",
        font: "var(--type-button)", fontSize: s.fontSize,
        color: disabled ? "var(--action-disabled-text)" : c.fg,
        background: bg,
        border: "1px solid " + (disabled ? "transparent" : c.border),
        borderRadius: "var(--radius-button)",
        boxShadow: variant === "primary" || variant === "gold" ? "var(--shadow-button)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transform: press && !disabled ? "scale(var(--press-scale))" : "none",
        transition: "var(--transition-hover), transform var(--dur-fast) var(--ease-standard)",
        textDecoration: "none", whiteSpace: "nowrap", ...style,
      }}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
      {arrow ? <ArrowChip bg={c.chip} /> : null}
    </Tag>
  );
}
