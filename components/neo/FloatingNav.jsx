"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { NAV_LINKS } from "@/components/neo/neoData";
import NavAccess from "@/components/neo/NavAccess";
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
 *     slides in. The only client-side logic is that one scroll check.
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
    if (!hero) {
      setShown(true);
      return undefined;
    }
    // A passive scroll check rather than an IntersectionObserver: it also
    // settles the state on load when the page opens mid-scroll (a reload, a
    // back-navigation), and it costs one rect read per scroll event.
    const check = () => setShown(hero.getBoundingClientRect().bottom < 96);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [reveal]);

  // `inert` is a boolean attribute to the React the App Router ships (19): an
  // empty string would read as false and leave the hidden bar tabbable.
  const hiddenProps = shown ? {} : { inert: true, "aria-hidden": "true" };

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
        <NavAccess />
      </header>
    </div>
  );
}
