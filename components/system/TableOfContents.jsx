"use client";

import { useEffect, useState } from "react";

/**
 * 3.1 TableOfContents — sticky sidebar, active section highlighted. Collapses
 * to a plegable block at the top on mobile (handled by EditorialTemplate).
 * Client only for the scroll spy; every link and label is in the server HTML.
 * Active state is ink weight + dark hairline, never amber (amber is action).
 * Image policy: prohibida.
 */
export default function TableOfContents({ items = [], title = "On this page" }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean);
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label={title} className="grid gap-3">
      <div className="t-small u-muted">{title}</div>
      <ol className="grid">
        {items.map((i) => {
          const on = active === i.id;
          return (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                aria-current={on ? "true" : undefined}
                className={`block border-l pl-4 py-1 t-small ${
                  on ? "u-ink border-ink" : "u-muted u-hair"
                }`}
              >
                {i.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
