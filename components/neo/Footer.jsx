import Link from "next/link";
import { FOOTER_COLS, TRIAL_HREF } from "@/components/neo/neoData";
import { Wordmark } from "@/components/neo/icons";

export default function Footer() {
  return (
    <footer className="sk-footer">
      <div className="sk-wrap">
      <div className="sk-footer__top">
        <div className="sk-footer__col">
          <Link href="/" className="sk-nav__brand">
            <Wordmark className="sk-nav__mark" />
            sokndall
          </Link>
          <p className="sk-small sk-footer__blurb">
            Credential expiry and payer enrollment tracking for practices with 3 to 30 providers.
            Published pricing. No demo required.
          </p>
          <Link href={TRIAL_HREF} className="sk-btn sk-btn--primary sk-btn--sm sk-footer__btn">
            Start free trial
          </Link>
        </div>

        {FOOTER_COLS.map((col) => (
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
        <span>No patient data. No PHI. No BAA to negotiate.</span>
      </div>
      </div>
    </footer>
  );
}
