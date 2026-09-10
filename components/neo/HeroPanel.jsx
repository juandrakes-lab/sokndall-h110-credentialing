import Link from "next/link";

import { NavBar, NavMobile } from "@/components/neo/Nav";

// A full-bleed ink band: the nav bar at the top, then two simple columns —
// copy, subhead and both CTAs on the left, a figure container on the right.
//
// No notch, no background pattern, no floating panel. `figure` is a real
// photograph or a schematic; it is never a rendering of an interface that does
// not exist yet. Omit it and the copy column runs the full measure.
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
        <div className="sk-hero__top" style={figure ? undefined : { gridTemplateColumns: "minmax(0, 1fr)" }}>
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
                  {i < lines.length - 1 ? <br /> : null}
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
