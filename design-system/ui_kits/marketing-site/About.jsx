const { SectionHeading, FeatureItem, Button, Card } = window.DS;

function About() {
  return (
    <section style={{ background: "var(--surface-page)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-14) var(--page-x)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: "var(--space-12)", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ height: 440, borderRadius: "var(--radius-image)", borderTopRightRadius: 0, backgroundImage: "url(../../assets/imagery/about-desk.svg)", backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", right: -24, bottom: -28 }}>
              <Card elevation="float" pad="var(--space-6)" style={{ maxWidth: 220 }}>
                <div style={{ font: "var(--font-display)", fontSize: "var(--fs-h3)", fontWeight: "var(--fw-semibold)", color: "var(--text-heading)", lineHeight: 1.1 }}>15+</div>
                <div style={{ font: "var(--type-small)", color: "var(--text-body)", marginTop: 4 }}>Years advising individuals and businesses across the USA.</div>
              </Card>
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Why Sokndall" eyebrowIcon="💛"
              title="Simplifying Accounting So You Can Focus on What Matters Most."
              description="Our experienced accountants take care of your numbers so you can focus on running and growing your business — from daily bookkeeping to financial reporting."
            />
            <ul style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", padding: 0, margin: "var(--space-7) 0 0" }}>
              <FeatureItem>Client-Centric Approach</FeatureItem>
              <FeatureItem>Proven Track Record</FeatureItem>
              <FeatureItem>Commitment to Excellence</FeatureItem>
            </ul>
            <div style={{ marginTop: "var(--space-8)" }}>
              <Button arrow>More About Us</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { About });
