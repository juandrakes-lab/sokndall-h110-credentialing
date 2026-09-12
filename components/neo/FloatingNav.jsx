"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { NAV_LINKS, TRIAL_HREF } from "@/components/neo/neoData";
import { Wordmark } from "@/components/neo/icons";

/**
 * FloatingNav — the nav bar that stays with the reader. Added 2026-09-11.
 *
 * A petrol-ink pill floating a few pixels under the top edge, as in the
 * reference comp. Two behaviours:
 *
 *   - default: `position: sticky` from the first pixel. The product pages open
 *     on a white header, and the floating ink bar is what decorates it.
 *   - `reveal`: the home. Its hero already carries the nav inside the notch,
 *     so this bar stays out of sight until the hero has scrolled away, then
 *     slides in. The only client-side logic is that one observer.
 *
 * Why this is a client component (DESIGN_RULES.md §7 lists the four): the
 * reveal needs to know where the hero is. Every link is in the server HTML
 * either way; while the bar is hidden it is `inert` and `aria-hidden`, so a
 * keyboard never tabs into a bar nobody can see.
 */
export default function FloatingNav({ current, reveal = false }) {
  const [shown, setShown] = useState(!reveal);

  useEffect(() => {
    if (!reveal) return undefined;
    const hero = document.querySelector("[data-hero]");
    if (!hero || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting), {
      rootMargin: "-96px 0px 0px 0px",
    });
    io.observe(hero);
    return () => io.disconnect();
  }, [reveal]);

  const hiddenProps = shown ? {} : { inert: "", "aria-hidden": "true" };

  return (
    <div className={`sk-fnav${reveal ? " sk-fnav--reveal" : ""}${shown ? " is-shown" : ""}`} {...hiddenProps}>
      <header className="sk-fnav__bar">
        <Link href="/" className="sk-nav__brand">
          <Wordmark className="sk-nav__mark" />
          sokndall
        </Link>
        <nav className="sk-nav__links" aria-label="Main, floating">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={current === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href={TRIAL_HREF} className="sk-nav__cta">
          Start free trial
        </Link>
      </header>
    </div>
  );
}
