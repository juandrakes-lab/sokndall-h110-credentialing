const { Pill, Button, LogoWall } = window.DS;

function Hero() {
  return (
    <section style={{ position: "relative", background: "var(--gradient-hero)", overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: 0, left: "46%",
        backgroundImage: "url(../../assets/imagery/hero-team.svg)",
        backgroundSize: "cover", backgroundPosition: "center",
        borderTopRightRadius: 0,
        maskImage: "linear-gradient(90deg,transparent 0,rgba(0,0,0,1) 24%)",
        WebkitMaskImage: "linear-gradient(90deg,transparent 0,rgba(0,0,0,1) 24%)",
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(246,248,243,.98) 0%,rgba(246,248,243,.86) 40%,rgba(246,248,243,0) 78%)" }} />
      <div style={{ position: "relative", maxWidth: "var(--container-max)", margin: "0 auto", padding: "0 var(--page-x)" }}>
        <div style={{ padding: "var(--space-12) 0 var(--space-14)", maxWidth: 560 }}>
          <Pill icon="🏆">Top-Rated Accounting &amp; Advisory Firm in USA</Pill>
          <h1 style={{ font: "var(--type-display)", letterSpacing: "var(--ls-display)", color: "var(--text-heading)", margin: "var(--space-5) 0 0", textWrap: "balance" }}>
            Smart Financial Solutions for a Stronger Tomorrow
          </h1>
          <p style={{ font: "var(--type-lead)", color: "var(--text-body)", margin: "var(--space-5) 0 0", maxWidth: 440 }}>
            Avoid costly mistakes and keep more of what you earn. We help individuals and businesses save, grow, and thrive.
          </p>
          <div style={{ display: "flex", gap: "var(--space-4)", marginTop: "var(--space-8)" }}>
            <Button arrow>Get Free Consultation</Button>
            <Button variant="gold" arrow>Schedule a Call</Button>
          </div>
          <div style={{ marginTop: "var(--space-10)" }}>
            <LogoWall names={["Intuit", "Xero", "FreshBooks", "Gusto", "Wave"]} />
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Hero });
