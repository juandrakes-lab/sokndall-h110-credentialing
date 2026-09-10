import Heading from "./primitives/Heading";
import StateMark from "./primitives/StateMark";

/**
 * 3.4 StatusTable — the 6 statuses of an application: name, what it means,
 * what you do. One row emphasised (Info requested) via a surface change, not
 * a heavier border. At most one filled mark per row (CATALOGO §3.4). The mono
 * figure is how many of your applications currently sit in that state.
 * Image policy: prohibida.
 */
export default function StatusTable({ as = "h2", id, heading, rows = [] }) {
  return (
    <section id={id} className="grid gap-4">
      {heading && <Heading as={as}>{heading}</Heading>}
      <div className="overflow-x-auto border u-hair rounded">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 t-small u-muted border-b u-hair">Status</th>
              <th className="text-left p-3 t-small u-muted border-b border-l u-hair">
                What it means
              </th>
              <th className="text-left p-3 t-small u-muted border-b border-l u-hair">
                What you do
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.status} className={r.emphasis ? "bg-paper" : undefined}>
                <td className="p-3 border-b u-hair align-top">
                  <StateMark
                    shape={r.shape}
                    label={r.status}
                    figure={r.count}
                    action={r.action}
                  />
                </td>
                <td className="p-3 border-b border-l u-hair align-top t-body u-muted">
                  {r.meaning}
                </td>
                <td className="p-3 border-b border-l u-hair align-top t-body u-ink">
                  {r.do}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
