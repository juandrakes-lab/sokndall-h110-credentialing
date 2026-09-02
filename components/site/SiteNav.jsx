import Link from "next/link";
import { NAV_LINKS, TRIAL_HREF } from "./siteData";

/** variant: "landing" (default) or "slim".
 *
 *  Slim is for the article pages: the same wordmark, the same links and the
 *  same trial button — navigation is consistent across the site — but as a
 *  thin utility strip rather than a landing header. The weight change lives
 *  in site-article.css under `.lp-nav--slim`. */
export default function SiteNav({ variant = "landing" }) {
  const slim = variant === "slim";

  return (
    <nav className={"lp-nav" + (slim ? " lp-nav--slim" : "")}>
      <Link href="/landing" className="lp-wordmark" style={{ fontSize: 18 }}>
        Sokndall
      </Link>
      <div className="lp-navlinks">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} className="lp-navlink" href={l.href}>
            {l.label}
          </Link>
        ))}
      </div>
      <Link href={TRIAL_HREF} className="lp-btn lp-btn--sm">
        Start 14-day trial
      </Link>
    </nav>
  );
}
