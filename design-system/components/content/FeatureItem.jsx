import React from "react";

/* A checked proof line — "Client-Centric Approach". Circular forest check, tight row. */
export function FeatureItem({ children, tone = "light", style, ...rest }) {
  const dark = tone === "dark";
  return (
    <li
      style={{
        display: "flex", alignItems: "center", gap: "var(--space-3)",
        font: "var(--type-body)", fontSize: "var(--fs-small)",
        color: dark ? "var(--text-body-on-dark)" : "var(--text-body)",
        listStyle: "none", ...style,
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          display: "grid", placeItems: "center", flex: "0 0 auto",
          width: 22, height: 22, borderRadius: "var(--radius-tile)",
          background: dark ? "rgba(255,255,255,.12)" : "var(--sage-100)",
          color: dark ? "var(--white)" : "var(--forest-600)",
        }}
      >
        <i data-lucide="check" style={{ width: 13, height: 13 }} />
      </span>
      {children}
    </li>
  );
}
