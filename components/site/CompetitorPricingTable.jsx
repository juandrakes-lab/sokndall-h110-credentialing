// Sokndall's own price table, reused identically across all three competitor
// pages (symplr, Modio Health, MedTrainer) — per the brief, it has to appear
// the same way every time. Figures match `app/pricing/data.js`'s PLANS; kept
// as a small local literal rather than importing that array because the
// count here (plan / price / provider cap / per-provider rate) isn't a field
// PLANS exposes directly — it's assembled from prose in the features list
// there. If the published prices change, update both.
//
// A plain table, not a card grid: these pages are argument-and-fact pages,
// and the brief's own copy is written as a table. Reusing the article
// template's `.lp-a-table` keeps it visually consistent with the rest of
// the site's editorial family rather than inventing a fourth pricing
// component.

const ROWS = [
  { name: "Solo", price: "$79/mo", providers: "3", per: "$26" },
  { name: "Practice", price: "$299/mo", providers: "15", per: "$20" },
  { name: "Billing Co", price: "$699/mo", providers: "50 across clients", per: "$14" },
];

export default function CompetitorPricingTable() {
  return (
    <>
      <div className="lp-a-tablewrap">
        <table className="lp-a-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Price</th>
              <th>Providers</th>
              <th>Per provider</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.name}>
                <td>{r.name}</td>
                <td>{r.price}</td>
                <td>{r.providers}</td>
                <td>{r.per}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Published, monthly, cancel any time, 14-day trial with a card. No demo required to see any of it.
      </p>
    </>
  );
}
