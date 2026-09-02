"use client";

// The desktop sidebar: sticky, contents-of-this-page only. It used to also
// carry a "related guides" list, but that duplicated what the end-of-article
// "Explore more guides" cards already do for every viewport, in a second,
// less legible treatment — removed, so this is purely a locked-in-place
// table of contents now. The one interactive piece — the active TOC item
// tracks scroll position — everything else on these pages renders on the
// server.
//
// Active tracking uses a plain scroll listener over getBoundingClientRect,
// not IntersectionObserver: IO's callbacks are tied to the compositor's
// paint cycle, which browsers throttle hard on a backgrounded/hidden tab
// (confirmed while building this — IO fired zero times against a hidden
// tab in dev tooling). A scroll listener reading layout geometry has no
// such dependency and updates on every scroll regardless of paint state.
//
// items: [{ id, label }] — matches each section's id (which carries
// `.lp-anchor` so the sticky nav doesn't cover the heading).

import { useEffect, useState } from "react";

export default function ArticleSidebar({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.id)).filter(Boolean);
    if (!els.length) return;

    // A section counts as "reached" once its top has scrolled up past this
    // line — comfortably below the sticky nav, well above mid-screen so the
    // active item changes as soon as a new heading is actually in view.
    const THRESHOLD = 140;
    let ticking = false;

    function computeActive() {
      let current = els[0].id;
      for (const el of els) {
        if (el.getBoundingClientRect().top - THRESHOLD <= 0) current = el.id;
      }
      setActiveId(current);
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(computeActive);
    }

    computeActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <aside className="lp-sidebar">
      <nav className="lp-sidebar-toc" aria-label="Contents">
        <p className="lp-toc-heading">Contents</p>
        <ol className="lp-toc-list">
          {items.map((it, i) => (
            <li key={it.id}>
              <a href={"#" + it.id} className={it.id === activeId ? "is-active" : undefined}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <span>{it.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}
