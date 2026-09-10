"use client";

import { useEffect, useState } from "react";

// Sticky contents for article pages, with scroll-spy. Client only because of
// the observer — every link is server-rendered, so the internal linking is
// intact without JS.
export default function Toc({ items }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const nodes = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  return (
    <aside className="sk-toc" aria-label="On this page">
      <p className="sk-micro">On this page</p>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} data-active={active === i.id}>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

/** The same list as a plain disclosure, for viewports too narrow to hold a
 *  sidebar. Server-rendered; no client cost. */
export function MobileToc({ items }) {
  return (
    <details className="sk-toc-m">
      <summary>On this page</summary>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`}>{i.label}</a>
          </li>
        ))}
      </ol>
    </details>
  );
}
