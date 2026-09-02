import React from "react";

/* The small round ↓ button that straddles the seam between the hero and the
   forest section. Decorative wayfinding — safe to omit for keyboard users. */
export function ScrollCue({ onClick, style, ...rest }) {
  return (
    <button
      type="button"
      aria-label="Scroll to content"
      onClick={onClick}
      style={{
        width: 48, height: 48, display: "grid", placeItems: "center",
        background: "var(--white)", color: "var(--forest-800)",
        border: "1px solid var(--border-card)", borderRadius: "var(--radius-tile)",
        boxShadow: "var(--shadow-card)", cursor: "pointer",
        transition: "var(--transition-hover), transform var(--dur-fast) var(--ease-standard)",
        ...style,
      }}
      {...rest}
    >
      <i data-lucide="arrow-down" style={{ width: 18, height: 18 }} />
    </button>
  );
}
