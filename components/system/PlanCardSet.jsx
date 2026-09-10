import Heading from "./primitives/Heading";
import Cta from "./primitives/Cta";

/**
 * 3.5 PlanCardSet — the expanded plan view for /pricing: name, price,
 * provider limit, user limit, features, per-provider cost, CTA, optional
 * label. Distinct from PricingTable (which is the anti-funnel list). 1px
 * borders, one 4px radius, no shadows. Only the labelled plan gets a primary
 * (amber) CTA; the others are secondary.
 * Image policy: prohibida.
 */
export default function PlanCardSet({ as = "h2", id, heading, plans = [] }) {
  return (
    <section id={id} className="grid gap-4">
      {heading && <Heading as={as}>{heading}</Heading>}
      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`grid gap-4 p-6 border u-hair rounded ${
              p.label ? "bg-paper" : "u-card"
            }`}
          >
            <div className="grid gap-1">
              <span className="t-h3 u-ink">{p.name}</span>
              {p.label && <span className="t-small u-muted">{p.label}</span>}
            </div>
            <div className="grid gap-1">
              <div>
                <span className="t-h3 u-ink">{p.price}</span>{" "}
                <span className="t-small u-muted">{p.period}</span>
              </div>
              <div className="t-small u-muted">{p.perProvider} per provider</div>
            </div>
            <ul className="grid gap-1 t-small u-muted">
              <li>{p.providerLimit}</li>
              <li>{p.userLimit}</li>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Cta href={p.cta.href} tone={p.label ? "primary" : "secondary"}>
              {p.cta.label}
            </Cta>
          </div>
        ))}
      </div>
    </section>
  );
}
