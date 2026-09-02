"use client";

import Link from "next/link";
import { useState } from "react";

/** items: [{ q, a, linkHref?, linkLabel? }]. The only stateful piece on these
 *  pages — everything else renders on the server. */
export default function Faq({ items, defaultOpen = 0 }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ borderTop: "1px solid var(--line)" }} />
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <div
              className="lp-faq-q"
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(isOpen ? -1 : i);
                }
              }}
            >
              <h3>{item.q}</h3>
              <span className="g">{isOpen ? "–" : "+"}</span>
            </div>
            {isOpen && (
              <div className="lp-faq-a">
                <p className="lp-body" style={{ margin: 0 }}>
                  {item.a}
                </p>
                {item.linkHref && (
                  <Link
                    href={item.linkHref}
                    style={{
                      display: "inline-block",
                      marginTop: 10,
                      fontSize: 14,
                      color: "var(--ink)",
                      borderBottom: "1px solid var(--ink)",
                    }}
                  >
                    {item.linkLabel || item.linkHref} →
                  </Link>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
