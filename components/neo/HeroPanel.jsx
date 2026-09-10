import Link from "next/link";

import { NavBar, NavMobile } from "@/components/neo/Nav";

// A full-bleed ink band: the nav bar at the top, then two simple columns —
// copy, subhead and both CTAs on the left, a figure container on the right.
//
// No notch, no background pattern, no floating panel. `figure` is a
// schematic; it is never a rendering of an interface that does not exist yet,
// and on a landing page it is never a photograph of people (DESIGN_DECISIONS.md).
// Omit it and the copy column runs the full measure.
//
// `form` takes the place of the CTA row on the one landing whose first action
// is the free template rather than the trial (`/credentialing-spreadsheet-
// template`). It is the EmailCapture box, passed in whole: the file still
// arrives by email and never by a direct download (DESIGN_RULES.md §9). Added
// 2026-09-10; it carries no image.
//
// `children` renders under a hairline below the two columns — the capability
// strip on the pages that use one.
export default function HeroPanel({
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  current,
  figure,
  form,
  children,
}) {
  const lines = Array.isArray(title) ? title : [title];

  return (
    <section className="sk-hero sk-band--ink">
      <div className="sk-wrap">
        <NavBar current={current} variant="dark" />
        <NavMobile current={current} />
      </div>

      <div className="sk-wrap sk-hero__inner">
        <div className={`sk-hero__top${figure || form ? "" : " sk-hero__top--solo"}`}>
          <div className="sk-hero__copy">
            {eyebrow ? (
              <p className="sk-head__pill">
                <span className="sk-pill">{eyebrow}</span>
              </p>
            ) : null}

            <h1 className="sk-display">
              {lines.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < lines.length - 1 ? <>{" "}<br /></> : null}
                </span>
              ))}
            </h1>

            {sub ? <p className="sk-lead sk-hero__sub">{sub}</p> : null}

            {primary ? (
              <div className="sk-hero__cta">
                <Link href={primary.href} className="sk-btn sk-btn--primary">
                  {primary.label}
                </Link>
                {secondary ? (
                  <Link href={secondary.href} className="sk-btn sk-btn--ghost">
                    {secondary.label}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>

          {figure ? <div className="sk-hero__media">{figure}</div> : null}
          {form && !figure ? <div className="sk-hero__form">{form}</div> : null}
        </div>

        {children ? (
          <>
            <div className="sk-hero__rule" />
            {children}
          </>
        ) : null}
      </div>
    </section>
  );
}
