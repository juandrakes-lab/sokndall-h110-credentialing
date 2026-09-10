import Link from "next/link";

import Nav from "@/components/neo/Nav";
import Footer from "@/components/neo/Footer";
import Toc, { MobileToc } from "@/components/neo/Toc";

// Article pages are read, not converted against. One reading column, no
// alternating surfaces, no cards inside the body copy, and one conversion
// point — the closing block. Two weights:
//
//   variant="guide" — a centred masthead plus a sticky contents sidebar above
//                     ~1160px. For the long, interlinked payer guides.
//   variant="solo"  — the same masthead and prose, one ~42rem column that
//                     never splits. For a 400–900 word page that does not need
//                     a locked contents list.
export default function Article({
  kicker,
  kickerHref,
  title,
  standfirst,
  contents,
  lead,
  align = "center",
  variant = "guide",
  children,
  after,
}) {
  const withToc = variant === "guide" && contents?.length;

  return (
    <>
      <Nav />

      <div className="sk-article">
        <header className={`sk-article__head${align === "left" ? " sk-article__head--left" : ""}`}>
          {kicker ? (
            <p className="sk-micro sk-article__kicker">
              {kickerHref ? <Link href={kickerHref}>{kicker}</Link> : kicker}
            </p>
          ) : null}
          <h1 className="sk-h2">{title}</h1>
          <p className="sk-lead">{standfirst}</p>
        </header>

        {/* At most one lead image per page, and it sits above the closing rule
            — never below it, which reads as the first thing in the body. */}
        {lead ? <div className="sk-article__lead">{lead}</div> : null}

        <div className="sk-article__rule" />

        {withToc ? <MobileToc items={contents} /> : null}

        {withToc ? (
          <div className="sk-article__shell">
            <article className="sk-prose">{children}</article>
            <Toc items={contents} />
          </div>
        ) : (
          <article className="sk-prose">{children}</article>
        )}

        {after}
      </div>

      <Footer />
    </>
  );
}

/** The single conversion point at the foot of an article. Never between
 *  sections — that is a landing-page move and it reads as an interruption in
 *  something meant to be read. */
export function ArticleCta({ body, primary, secondary }) {
  return (
    <div className="sk-article__cta">
      <p className="sk-body sk-body--lg">{body}</p>
      <div className="sk-article__actions">
        <Link href={primary.href} className="sk-btn sk-btn--primary">
          {primary.label}
        </Link>
        {secondary ? (
          <Link href={secondary.href} className="sk-link">
            {secondary.label} &rarr;
          </Link>
        ) : null}
      </div>
    </div>
  );
}
