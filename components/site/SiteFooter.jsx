import Link from "next/link";
import { FOOTER_COLS } from "./siteData";

/** variant: "landing" (default) or "slim".
 *
 *  Slim drops the gold price badge under the wordmark. Same links, same
 *  columns — it is the article pages' footer, and a price promo under an
 *  1,800-word guide reads as a sales unit stapled to a document. */
export default function SiteFooter({ variant = "landing" }) {
  const slim = variant === "slim";

  return (
    <footer className="lp-dark">
      <div style={{ maxWidth: "var(--maxw)", margin: "0 auto", padding: "64px var(--pad-x) 40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 48,
            marginBottom: 56,
          }}
        >
          <div>
            <div className="lp-wordmark" style={{ fontSize: 20, color: "var(--text-on-dark)", marginBottom: 14 }}>
              Sokndall
            </div>
            <div
              style={{
                display: slim ? "none" : "inline-block",
                fontFamily: "var(--sans)",
                fontSize: 11,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "var(--gold)",
                border: "1px solid var(--gold)",
                borderRadius: 999,
                padding: "5px 12px",
              }}
            >
              From $79/mo · 14-day trial
            </div>
          </div>
          <div style={{ display: "flex", gap: 56, flexWrap: "wrap" }}>
            {FOOTER_COLS.map((col) => (
              <div key={col.heading} style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 150 }}>
                <div
                  style={{
                    fontFamily: "var(--sans)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--text-on-dark-soft)",
                    marginBottom: 4,
                  }}
                >
                  {col.heading}
                </div>
                {col.links.map((l) => (
                  <Link key={l.href} className="lp-footlink" href={l.href}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid var(--border-on-dark)",
            paddingTop: 24,
            fontSize: 12.5,
            color: "var(--text-on-dark-soft)",
          }}
        >
          © Sokndall
        </div>
      </div>
    </footer>
  );
}
