import { lift } from "@/components/app/showcase/AppScreen";
import { CHIP } from "@/components/app/showcase/parts";

// The six enrollment statuses, in the app's own design system (the founder's
// call, 2026-09-20): the section used to draw them with the marketing table's
// own marks, which meant the page had a second, invented vocabulary for the
// thing the product already names.
//
// It is NOT a product shot. A shot is a fixed canvas that scales; this is the
// page's copy — six meanings and six actions — so it stays a real, fluid
// <table> that reflows and that a crawler reads. What comes from the app is
// the card it sits in and the chips in the status column, nothing else.
//
// The glyph stays inside the chip. DESIGN_RULES §2 rule 3: a status is glyph +
// label, never colour alone, and the app's chips are colour + label.
//
// No ground behind it: the section is a grey block, and a white card with its
// own shadow is already the hierarchy (§3).

// The rows arrive in the app's own status order, which is the order the copy
// is written in. Index, not label: the copy may be reworded, the order is
// structural.
const KEYS = ["not_started", "submitted", "in_review", "info_requested", "approved", "denied"];

export default function StatusTable({ columns, rows }) {
  const [c1, c2, c3] = columns;
  return (
    <div className="app-type">
      <div className={`overflow-hidden rounded-[18px] bg-white ${lift}`}>
        <table className="w-full border-separate border-spacing-0 text-left max-[640px]:block">
          <thead className="max-[640px]:hidden">
            <tr>
              <th scope="col" className="w-[15rem] border-b border-ink-100 px-5 py-3.5 text-xs font-semibold text-ink-700">
                {c1}
              </th>
              <th scope="col" className="w-[38%] border-b border-ink-100 px-5 py-3.5 text-xs font-semibold text-ink-700">
                {c2}
              </th>
              <th scope="col" className="border-b border-ink-100 px-5 py-3.5 text-xs font-semibold text-ink-700">
                {c3}
              </th>
            </tr>
          </thead>
          <tbody className="max-[640px]:block">
            {rows.map((r, i) => (
              <tr
                key={r.status}
                className={`max-[640px]:block max-[640px]:border-b max-[640px]:border-ink-100 max-[640px]:px-5 max-[640px]:py-4 ${
                  r.needsAction ? "bg-status-expiring-bg/35" : ""
                }`}
              >
                <th scope="row" className="border-b border-ink-100 px-5 py-3.5 align-top font-normal max-[640px]:block max-[640px]:border-0 max-[640px]:px-0 max-[640px]:py-0">
                  <span
                    className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium ${CHIP[KEYS[i]]} ${
                      r.needsAction ? "ring-1 ring-status-expiring" : ""
                    }`}
                  >
                    <span aria-hidden="true" className="text-[0.6875rem] leading-none opacity-80">
                      {r.glyph}
                    </span>
                    {r.status}
                  </span>
                </th>
                <td className="border-b border-ink-100 px-5 py-3.5 align-top text-[0.9375rem] leading-snug text-ink-900 max-[640px]:mt-2.5 max-[640px]:block max-[640px]:border-0 max-[640px]:px-0 max-[640px]:py-0">
                  {r.meaning}
                </td>
                <td className="border-b border-ink-100 px-5 py-3.5 align-top text-[0.9375rem] leading-snug text-ink-700 max-[640px]:mt-1.5 max-[640px]:block max-[640px]:border-0 max-[640px]:px-0 max-[640px]:py-0">
                  <span className="hidden text-xs font-semibold uppercase tracking-wide text-ink-500 max-[640px]:mb-1 max-[640px]:block">
                    {c3}
                  </span>
                  {r.action}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
