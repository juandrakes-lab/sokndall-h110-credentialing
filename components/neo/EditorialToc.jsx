"use client";

import { useEffect, useState } from "react";

// Two-column breakpoint. Kept in sync by hand with the `1120px` media queries
// in the editorial block of neo.css — above it the contents are a sticky
// sidebar, below it a plegable block at the top of the page.
const WIDE = "(min-width: 1120px)";

/**
 * TableOfContents — the editorial template's left spine.
 *
 * Client, but only for the two things that genuinely need the browser: the
 * scroll spy that marks the section you are in, and the mobile disclosure.
 * Every link and every label is server-rendered inside a plain `<nav>`, and
 * the list ships expanded, so the internal linking survives with JS off and
 * a crawler sees the whole outline in the raw HTML.
 *
 * The active entry is marked with weight and a solid left rule. Never amber:
 * amber means "an action is required here" and a contents entry is not an
 * action.
 */
export default function TableOfContents({ items = [], title = "On this page" }) {
  const [active, setActive] = useState(items[0]?.id);
  // false on the server and on the first client render, so hydration matches;
  // the effect below corrects it. The consequence is the honest fallback:
  // without JS the list is simply open at every width.
  const [narrow, setNarrow] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(WIDE);
    const sync = () => {
      setNarrow(!mq.matches);
      if (!mq.matches) setOpen(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const nodes = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (first) setActive(first.target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [items]);

  const shown = narrow ? open : true;

  return (
    <nav className="sk-edtoc" data-open={shown} aria-label={title}>
      {narrow ? (
        <button
          type="button"
          className="sk-edtoc__btn"
          aria-expanded={open}
          aria-controls="sk-edtoc-list"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sk-micro">{title}</span>
          <span className="sk-edtoc__sign" aria-hidden="true">
            {open ? "−" : "+"}
          </span>
        </button>
      ) : (
        <p className="sk-micro">{title}</p>
      )}

      <ol className="sk-edtoc__list" id="sk-edtoc-list">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              aria-current={active === i.id ? "true" : undefined}
              onClick={() => narrow && setOpen(false)}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
