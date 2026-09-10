import Heading from "./primitives/Heading";
import StateMark from "./primitives/StateMark";

/**
 * 3.4 MatrixSchematic — providers down the side, payers across the top, one
 * cell per pair: shape + label + mono days-since-follow-up. Real HTML/CSS,
 * deliberately low fidelity. NEVER simulates a screenshot (CATALOGO §0, §3.4).
 * It is the only "product" element available today, and it IS the image, so
 * there is no image prop.
 */
const CELL = {
  none: { shape: "·", label: "Not started" },
  submitted: { shape: "◇", label: "Submitted" },
  review: { shape: "●", label: "In review" },
  action: { shape: "◆", label: "Info requested", action: true },
  approved: { shape: "✓", label: "Approved" },
  quiet: { shape: "○", label: "No follow-up" },
};

function Legend() {
  // The key is documentation, not a live state — so no amber here even for
  // the action status; the ◆ shape + label already carry the meaning.
  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {Object.values(CELL).map((c) => (
        <li key={c.label}>
          <StateMark shape={c.shape} label={c.label} />
        </li>
      ))}
    </ul>
  );
}

export default function MatrixSchematic({
  as = "h2",
  id,
  heading,
  note,
  providers = [],
  payers = [],
  cells = {},
}) {
  return (
    <section id={id} className="grid gap-4">
      {heading && <Heading as={as}>{heading}</Heading>}
      {note && <p className="t-body u-muted max-w-2xl">{note}</p>}

      <div className="overflow-x-auto border u-hair rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 t-small u-muted border-b u-hair">
                Provider / Payer
              </th>
              {payers.map((p) => (
                <th
                  key={p}
                  className="text-left p-3 t-small u-muted border-b border-l u-hair"
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {providers.map((prov) => (
              <tr key={prov}>
                <th
                  scope="row"
                  className="text-left p-3 t-small u-ink border-b u-hair"
                >
                  {prov}
                </th>
                {payers.map((pay) => {
                  const c = cells[`${prov}|${pay}`];
                  const meta = c ? CELL[c.k] : CELL.none;
                  return (
                    <td
                      key={pay}
                      className="p-3 border-b border-l u-hair align-top"
                    >
                      <StateMark
                        shape={meta.shape}
                        label={meta.label}
                        figure={c && c.days != null ? `${c.days}d` : "—"}
                        action={meta.action}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Legend />
    </section>
  );
}
