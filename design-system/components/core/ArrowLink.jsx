import React from "react";

export function ArrowLink({ children, href = "#", weight = "semibold", tone = "default", size, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const color =
    tone === "onDark"
      ? "var(--white)"
      : hover
      ? "var(--text-link-hover)"
      : "var(--text-link)";
  return (
    <a
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "var(--space-2)",
        font: "var(--type-small)", fontSize: size || "var(--fs-small)",
        fontWeight: weight === "semibold" ? "var(--fw-semibold)" : "var(--fw-medium)",
        color,
        textDecoration: "underline", textUnderlineOffset: "3px",
        textDecorationColor: tone === "onDark" ? "rgba(255,255,255,.5)" : "currentColor",
        transition: "var(--transition-hover)", ...style,
      }}
      {...rest}
    >
      {children}
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          transform: hover ? "translateX(3px)" : "none",
          transition: "transform var(--dur-base) var(--ease-out)",
          lineHeight: 1,
        }}
      >
        &#8599;
      </span>
    </a>
  );
}
