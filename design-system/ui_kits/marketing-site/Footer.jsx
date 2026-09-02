const { Wordmark } = window.DS;

const COLS = [
  { head: "Services", links: ["Tax Planning", "Bookkeeping", "Payroll", "Advisory"] },
  { head: "Company", links: ["About Us", "Careers", "Blog", "Contact"] },
  { head: "Legal", links: ["Privacy", "Terms", "Disclosures"] },
];

function Footer() {
  return (
    <footer style={{ background: "var(--forest-900)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-12) var(--page-x) var(--space-8)", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: "var(--space-11)" }}>
        <div>
          <Wordmark size={20} tone="inverse" />
          <p style={{ font: "var(--type-small)", color: "rgba(255,255,255,.6)", margin: "var(--space-5) 0 0", maxWidth: 240 }}>
            Smart financial solutions that help individuals and businesses save, grow, and thrive.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.head}>
            <div style={{ font: "var(--type-eyebrow)", fontWeight: "var(--fw-semibold)", color: "var(--gold-400)" }}>{c.head}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginTop: "var(--space-5)" }}>
              {c.links.map((l) => <a key={l} href="#" style={{ font: "var(--type-small)", color: "rgba(255,255,255,.78)" }}>{l}</a>)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.12)" }}>
        <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-5) var(--page-x)", font: "var(--type-small)", fontSize: "var(--fs-caption)", color: "rgba(255,255,255,.5)" }}>
          © 2026 Sokndall. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
Object.assign(window, { Footer });
