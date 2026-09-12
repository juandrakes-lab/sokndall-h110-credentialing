import Link from "next/link";

import { NavBar, NavMobile, Brand, NavLinks } from "@/components/neo/Nav";
import { Lines, Pill, PhotoCredit } from "@/components/neo/landingPrimitives";

// The hero of every landing, in three variants. Rebuilt 2026-09-11.
//
// `variant="panel"` — the home. The reference comp's signature block, restored:
//   an ink panel inset from the page edges with rounded corners, a white notch
//   cut into its top-left corner that carries the wordmark, the nav riding on
//   the ink beside it, a faint line texture, and a small tongue dropping below
//   the bottom edge. The notch/nav pair is one absolutely-positioned row, so the
//   notch sizes itself to the wordmark. An earlier pass flattened all of this
//   to a full-bleed rectangle; that is most of why the page read flat.
//   `indicators` float over the bottom edge of the figure: real product facts
//   set as the reference's floating chips.
//
// `variant="light"` — the four product pages. White, centred: pill, H1, sub,
//   CTAs and the strip as chips, then the page's first object (`figure`) full
//   width below. The home is the brand's front door and gets the dark panel;
//   a product page is a document about one job, and a lighter head says so
//   (founder's request, 2026-09-11 — hierarchy between pages).
//
// `variant="ink"` — the previous full-bleed band, kept for anything not yet
//   moved to one of the two above.
//
// `figure` is a schematic or a ScreenSlot; it is never a rendering of an
// interface that does not exist yet, and on a landing page it is never a
// photograph of people (DESIGN_DECISIONS.md).
//
// `form` takes the place of the CTA row on the one landing whose first action
// is the free template rather than the trial (`/credentialing-spreadsheet-
// template`). The file still arrives by email and never by a direct download
// (DESIGN_RULES.md §9).
//
// `children` renders under the head — the capability strip.
export default function HeroPanel({
  variant = "ink",
  eyebrow,
  title,
  sub,
  primary,
  secondary,
  current,
  figure,
  form,
  indicators,
  backdrop = "lines",
  photo,
  children,
}) {
  const ctas = primary ? (
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
  ) : null;

  if (variant === "light") {
    return (
      <section className="sk-lhero">
        {/* The nav bar itself is FloatingNav, rendered by LandingTemplate above
            this section so it stays fixed for the whole page. Below 880px the
            link row reappears here as the scrollable strip. */}
        <NavMobile current={current} />

        {/* With a `form`, the head splits: copy left, the box right, so the
            box is above the fold (the template page's brief). Without one the
            head is centred. */}
        <div className={`sk-wrap sk-lhero__inner${form ? " sk-lhero__inner--split" : ""}`}>
          <div className="sk-lhero__copy">
            {eyebrow ? <Pill>{eyebrow}</Pill> : null}
            <h1 className="sk-display sk-lhero__h1">
              <Lines lines={title} />
            </h1>
            {sub ? <p className="sk-lead sk-lhero__sub">{sub}</p> : null}
            {ctas}
            {children ? <div className="sk-lhero__strip">{children}</div> : null}
          </div>
          {form ? <div className="sk-lhero__form">{form}</div> : null}
        </div>

        {figure ? <div className="sk-wrap sk-lhero__figure">{figure}</div> : null}
      </section>
    );
  }

  const panel = variant === "panel";
  // `backdrop="photo"`: the photograph behind the panel, under an ink scrim,
  // in place of the line texture (a photo and the lines on one surface
  // compete; it is one or the other). Compared with the lines on
  // /styleguide/hero; the home keeps the lines until the final images exist
  // (founder, round 3). A third variant — the panel beside a photo card — was
  // tried in round 2 and discarded.
  const photoBack = panel && backdrop === "photo" && photo;

  return (
    <section
      className={`sk-hero sk-band--ink${panel ? " sk-hero--panel" : ""}${photoBack ? " sk-hero--photo" : ""}`}
      data-hero=""
    >
      {photoBack ? (
        <>
          <img
            className="sk-hero__bgimg"
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt=""
            loading="eager"
            decoding="async"
          />
          <div className="sk-hero__credit">
            <PhotoCredit photo={photo} />
          </div>
        </>
      ) : null}
      {panel ? (
        <div className="sk-hero__bar">
          <div className="sk-hero__notch">
            <Brand />
          </div>
          <div className="sk-hero__navrow">
            <NavLinks current={current} />
          </div>
        </div>
      ) : (
        <div className="sk-wrap">
          <NavBar current={current} variant="dark" />
        </div>
      )}
      <div className={panel ? "sk-hero__navm" : undefined}>
        <NavMobile current={current} />
      </div>

      <div className="sk-wrap sk-hero__inner">
        <div className={`sk-hero__top${figure || form ? "" : " sk-hero__top--solo"}`}>
          <div className="sk-hero__copy">
            {eyebrow ? <Pill>{eyebrow}</Pill> : null}

            <h1 className="sk-display">
              <Lines lines={title} />
            </h1>

            {sub ? <p className="sk-lead sk-hero__sub">{sub}</p> : null}

            {ctas}
          </div>

          {figure ? (
            <div className="sk-hero__media">
              {figure}
              {indicators ? <div className="sk-hero__inds">{indicators}</div> : null}
            </div>
          ) : null}
          {form && !figure ? <div className="sk-hero__form">{form}</div> : null}
        </div>

        {children ? (
          <>
            <div className="sk-hero__rule" />
            {children}
          </>
        ) : null}
      </div>

      {panel ? <span className="sk-hero__tongue" aria-hidden="true" /> : null}
    </section>
  );
}
