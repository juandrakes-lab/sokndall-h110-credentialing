import Link from "next/link";
import { FOOTER_BLURB_V31, FOOTER_COLS_V31, TRIAL_HREF } from "@/components/neo/neoData";
import Logo from "@/components/brand/Logo";

// One footer for every page: the v3.1 blurb and columns are the default, so a
// new template gets the current footer without passing anything (2026-09-22;
// the pre-v3.1 default had left the institutional pages on the old one).
export default function Footer({ blurb = FOOTER_BLURB_V31, cols = FOOTER_COLS_V31 }) {
  return (
    <footer className="sk-footer">
      <div className="sk-wrap">
      <div className="sk-footer__top">
        <div className="sk-footer__col">
          <Link href="/" className="sk-nav__brand">
            <Logo className="sk-nav__logo" />
          </Link>
          <p className="sk-small sk-footer__blurb">{blurb}</p>
          <Link href={TRIAL_HREF} className="sk-btn sk-btn--primary sk-btn--sm sk-footer__btn">
            Start free trial
          </Link>
          {/* Its own line rather than a clause inside the blurb (copy brief
              2026-09-22): the address is looked for when the reader has
              stopped reading, and the blurb is measured at four lines. */}
          <p className="sk-small sk-footer__support">
            Questions? <a href="mailto:support@sokndall.com">support@sokndall.com</a>. Written support only.
          </p>
        </div>

        {cols.map((col) => (
          <div className="sk-footer__col" key={col.heading}>
            <h3>{col.heading}</h3>
            {col.links.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="sk-footer__bottom">
        <span>© {new Date().getFullYear()} Sokndall. All rights reserved.</span>
        <span className="sk-footer__legal">
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </span>
        <span>No patient data. No PHI. No BAA to negotiate.</span>
      </div>
      </div>
    </footer>
  );
}
