import Link from "next/link";
import { FOOTER_COLS, TRIAL_HREF } from "@/components/neo/neoData";
import Logo from "@/components/brand/Logo";

const DEFAULT_BLURB =
  "Credential expiry and payer enrollment tracking for practices with 3 to 30 providers. Published pricing. No demo required.";

// `blurb` and `cols` default to the pre-v3.1 values, which is what `/about`
// and `/security` still render: those two pages are out of scope for the
// 2026-09-10 run and are left exactly as they were. The v3.1 templates pass
// FOOTER_BLURB_V31 / FOOTER_COLS_V31 from neoData.
export default function Footer({ blurb = DEFAULT_BLURB, cols = FOOTER_COLS }) {
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
