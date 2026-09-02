import React from "react";
import { Wordmark } from "../brand/Wordmark.jsx";
import { IconCircle } from "../core/IconCircle.jsx";

/* Transparent over the hero; turns solid white after a little scroll. The right
   side is a "Speak With An Expert" phone block, not a button. */
export function NavBar({
  items = [], active, onSelect, phone = "+1 646 555 0198", phoneLabel = "Speak With An Expert",
  transparent = true, style, ...rest
}) {
  return (
    <header
      style={{
        height: "var(--nav-h)", display: "flex", alignItems: "center", gap: "var(--space-9)",
        padding: "0 var(--page-x)", minWidth: 1120,
        background: transparent ? "transparent" : "var(--white)",
        borderBottom: transparent ? "1px solid transparent" : "1px solid var(--border-hairline)",
        transition: "var(--transition-hover)", ...style,
      }}
      {...rest}
    >
      <Wordmark size={20} />
      <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-7)", margin: "0 auto" }}>
        {items.map((it) => {
          const on = it === active;
          return (
            <a
              key={it}
              href="#"
              onClick={(e) => { e.preventDefault(); onSelect && onSelect(it); }}
              style={{
                font: "var(--type-nav)", letterSpacing: "var(--ls-nav)",
                color: on ? "var(--forest-600)" : "var(--ink-800)",
                fontWeight: on ? "var(--fw-semibold)" : "var(--fw-medium)",
                whiteSpace: "nowrap",
              }}
            >
              {it}
            </a>
          );
        })}
      </nav>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        <IconCircle icon="phone" tone="sage" size={40} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
          <span style={{ font: "var(--type-small)", fontSize: "var(--fs-caption)", color: "var(--text-muted)" }}>{phoneLabel}</span>
          <span style={{ font: "var(--type-small)", fontWeight: "var(--fw-semibold)", color: "var(--ink-900)" }}>{phone}</span>
        </div>
      </div>
    </header>
  );
}
