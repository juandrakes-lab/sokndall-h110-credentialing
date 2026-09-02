const { SectionHeading, ServiceCard, Button } = window.DS;

const SERVICES = [
  { icon: "receipt", title: "Tax Planning & Preparation", body: "Strategic tax planning and accurate filing to minimize your tax liability and keep you compliant year-round." },
  { icon: "bar-chart-3", title: "Accounting & Bookkeeping", body: "Accurate books and real-time financial insight to help you make better business decisions." },
  { icon: "wallet", title: "Payroll Management", body: "Full-service payroll processing so your team gets paid accurately and on time, every time." },
  { icon: "briefcase", title: "Business Advisory", body: "Expert guidance to help you grow, manage risk, and reach your goals." },
];

function Services() {
  return (
    <section id="services" style={{ background: "var(--gradient-dark)" }}>
      <div style={{ maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-14) var(--page-x)" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SectionHeading
            tone="dark" align="center"
            eyebrow="We're Here To Support Your Financial Success" eyebrowIcon="💛"
            title="Comprehensive Accounting Solutions for Your Business."
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--card-gap)", marginTop: "var(--space-11)" }}>
          {SERVICES.map((s) => <ServiceCard key={s.title} {...s} />)}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "var(--space-9)" }}>
          <Button variant="gold" arrow>Explore All Services</Button>
        </div>
      </div>
    </section>
  );
}
Object.assign(window, { Services });
