const { SectionHeading, StatStrip } = window.DS;

function Trusted() {
  return (
    <section style={{ background: "var(--white)", borderTop: "1px solid var(--border-hairline)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-13) var(--page-x)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-10)" }}>
          <SectionHeading
            align="center" eyebrow="Trusted Nationwide" eyebrowIcon="💛"
            title="Results That Add Up, Year After Year."
          />
        </div>
        <StatStrip stats={[
          { value: "500+", label: "Businesses Served" },
          { value: "15+", label: "Years Advising" },
          { value: "98%", label: "Client Retention" },
          { value: "30+", label: "States Covered" },
        ]} />
      </div>
    </section>
  );
}
Object.assign(window, { Trusted });
