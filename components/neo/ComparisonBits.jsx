import Link from "next/link";

import { ProseSection } from "@/components/neo/EditorialBits";
import Rich from "@/components/neo/rich";

/** Internal routes go through next/link; a citation points off-site, opens in
 *  a new tab so it does not cost the reader their place, and carries
 *  `nofollow` — these are competitor domains cited as evidence, not endorsed.
 *  Same helper as the editorial's, kept local so the two templates do not
 *  become each other's dependency. */
function Cite({ href, className, children }) {
  if (/^https?:/i.test(href)) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener nofollow">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

// The fixed status vocabulary. The first three are the original set; the last
// three were added on 2026-09-10 because the approved v3.1 copy
// (H110_COPY_TANDA_B) classifies its rows with them — a vendor describing its
// own model is neither "published price" nor "not published", and a Capterra
// review is neither. The set is still closed and the component still throws on
// any other word; every label fits the 18-character status column
// (COPY_LIMITS.md), "Different product" being the longest at 17.
const STATUS_LABEL = {
  published: "Published",
  "not-published": "Not published",
  estimate: "Estimate",
  "vendor-stated": "Vendor stated",
  "user-reported": "User reported",
  "different-product": "Different product",
};

/**
 * SourcedPricingDisclosure — what is and is not publicly known about a
 * competitor's price, one claim per row, each with its provenance on the same
 * row rather than in a footnote.
 *
 * The form is the argument. Every claim sits in the same two-column row: a
 * status word on the left, the claim and its provenance on the right. A
 * competitor that publishes a price gets a row that says `Published` and links
 * it; one that does not gets a row that says `Not published` and states what
 * was checked and when. **The absence is a finding, not a gap** — it occupies
 * a full row at full weight, and there is no empty cell anywhere in the block
 * for a reader to read as unfinished work.
 *
 * Three guards, because each of them is a rule that would otherwise erode in a
 * hurried content edit:
 *
 *   - `published` requires a source. A price with no link is a rumour.
 *   - `not-published` requires a note saying what was checked and when.
 *     "No price" on its own is an assertion about a company; "no figure
 *     appears on modiohealth.com before a quote request, checked in September
 *     2026" is a checkable observation.
 *   - `estimate` requires a basis, and prints `[estimate]` in the sentence.
 *     A marker only a careful reader notices is not a marker.
 */
export function SourcedPricingDisclosure({
  as: As = "h2",
  id,
  heading,
  lead,
  claims = [],
  children,
}) {
  claims.forEach((c) => {
    if (!STATUS_LABEL[c.status]) {
      throw new Error(
        `SourcedPricingDisclosure: claim status must be one of ${Object.keys(STATUS_LABEL).join(", ")} — got "${c.status}".`
      );
    }
    if (c.status === "published" && !c.source) {
      throw new Error("SourcedPricingDisclosure: a published figure requires a linked source.");
    }
    if (c.status === "not-published" && !c.note) {
      throw new Error(
        "SourcedPricingDisclosure: a `not-published` claim requires a `note` saying what was checked and when. The absence is the finding, so it has to be stated as one."
      );
    }
    if (c.status === "estimate" && !c.basis) {
      throw new Error("SourcedPricingDisclosure: an estimate requires a `basis`.");
    }
    if (["vendor-stated", "user-reported", "different-product"].includes(c.status) && !c.note) {
      throw new Error(
        `SourcedPricingDisclosure: a \`${c.status}\` claim requires a \`note\` giving its provenance — who said it and where it was read.`
      );
    }
  });

  return (
    <section id={id}>
      {heading ? <As>{heading}</As> : null}
      {lead ? <p>{lead}</p> : null}

      <div className="sk-spd">
        {claims.map((c) => (
          <div className="sk-spd__row" key={c.text}>
            <span className="sk-micro sk-spd__lb">{STATUS_LABEL[c.status]}</span>
            <div className="sk-spd__body">
              <p>
                <Rich text={c.text} />
                {c.status === "estimate" ? <span className="sk-spd__est"> [estimate]</span> : null}
              </p>
              <span className="sk-small sk-spd__src">
                {c.status === "estimate" ? `Basis: ${c.basis}` : null}
                {/* The provenance may cite more than one source inline
                    ("the product page and the Capterra profile"), so it is a
                    copy string with links rather than one `source` object. */}
                {c.note ? <Rich text={c.note} /> : null}
                {c.source ? (
                  <>
                    {c.note || c.basis ? " " : null}
                    <Cite href={c.source.href}>{c.source.label}</Cite>
                  </>
                ) : null}
              </span>
            </div>
          </div>
        ))}
      </div>

      {children}
    </section>
  );
}

/**
 * GoodFitSection — who the competitor is genuinely the right choice for.
 *
 * It delegates to `ProseSection` and adds nothing. That is the design, not
 * laziness: set off as a card, a tint or a bordered aside, this section reads
 * as a performative concession — a box the page opens to look fair and then
 * closes. Identical treatment to every other section is what makes it read as
 * meant. The component exists so the slot is named and the prohibition has
 * somewhere to live.
 *
 * No adjective characterizing the competitor negatively belongs in here, and
 * none belongs anywhere else on the page either. The contrast is made by the
 * structure — what each product is for — not by the tone.
 */
export function GoodFitSection(props) {
  return <ProseSection {...props} />;
}

/**
 * PurchaseModelCompare — two columns facing each other: how you buy this,
 * against how you buy that. Contract term, demo or self-serve, per seat or
 * per provider.
 *
 * Every row declares the unit it measures, and `unit` is required rather than
 * optional, for the same reason `PriceAnchorSourced` requires it: a price per
 * seat and a price per provider tracked are different quantities, and setting
 * them beside each other without naming the unit is the comparison error this
 * whole page exists to avoid making.
 *
 * Neither column is highlighted, tinted, ordered first as the winner or given
 * a tick. Both sides are set identically and the reader does the comparing.
 */
export function PurchaseModelCompare({
  as: As = "h2",
  id,
  heading,
  lead,
  ours = "Sokndall",
  theirs,
  rows = [],
  note,
  // The v3.1 copy names the competitor's column first ("Nombre columna 1:
  // MedTrainer"). Order is not a ranking here — both columns are set
  // identically — so the page may follow the copy. Added 2026-09-10.
  theirsFirst = false,
}) {
  if (!theirs) {
    throw new Error("PurchaseModelCompare: `theirs` (the other vendor's name) is required.");
  }
  rows.forEach((r) => {
    if (!r.unit) {
      throw new Error(
        `PurchaseModelCompare: row "${r.criterion}" has no \`unit\`. What the row measures is not optional — two different units set side by side read as one.`
      );
    }
    if (!r.ours || !r.theirs) {
      throw new Error(`PurchaseModelCompare: row "${r.criterion}" is missing a side.`);
    }
  });

  return (
    <section id={id}>
      {heading ? <As>{heading}</As> : null}
      {lead ? <p>{lead}</p> : null}

      <div className="sk-pmc">
        <div className="sk-pmc__row sk-pmc__head" aria-hidden="true">
          <span />
          <div className="sk-pmc__cells">
            <span className="sk-small sk-pmc__who">{theirsFirst ? theirs : ours}</span>
            <span className="sk-small sk-pmc__who">{theirsFirst ? ours : theirs}</span>
          </div>
        </div>

        {rows.map((r) => (
          <div className="sk-pmc__row" key={r.criterion}>
            <div>
              <span className="sk-pmc__crit">{r.criterion}</span>
              <span className="sk-small sk-pmc__unit">Measured in: {r.unit}</span>
            </div>
            <div className="sk-pmc__cells">
              {(theirsFirst
                ? [[theirs, r.theirs], [ours, r.ours]]
                : [[ours, r.ours], [theirs, r.theirs]]
              ).map(([who, text]) => (
                <div className="sk-pmc__cell" key={who}>
                  <span className="sk-small sk-pmc__who">{who}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {note ? <p className="sk-small sk-mvc__cap"><Rich text={note} /></p> : null}
    </section>
  );
}

/**
 * MultiVendorComparison — several vendors against one set of criteria.
 * `/best-credentialing-software` only, and it is what makes that page worth
 * having: it is the one place on the site where the whole category is set out
 * in one view.
 *
 * Rules it enforces rather than documents:
 *
 *   - **No logos and no screenshots.** A vendor is its name, in text. A table
 *     of logos is a table that argues by brand recognition.
 *   - **No empty cell, ever.** Pass `{ notPublished: true }` and the cell
 *     reads "Not published"; leave a cell undefined and the component throws.
 *     A blank cell in a comparison table is read as a missing feature, which
 *     is a claim nobody made.
 *   - **Nothing is estimated here.** An estimate needs its basis stated in a
 *     sentence, which a table cell cannot carry — estimates belong in
 *     `SourcedPricingDisclosure` above, where they are marked and sourced.
 *   - Every criterion carries the unit it is measured in, in the row header.
 *
 * Sokndall's own column is marked with a word, never with a colour, a tick or
 * a highlighted column: the reader can see it is our table.
 */
export function MultiVendorComparison({
  as: As = "h2",
  id,
  heading,
  lead,
  vendors = [],
  criteria = [],
  caption,
  sources = [],
}) {
  criteria.forEach((row) => {
    if (!row.unit) {
      throw new Error(`MultiVendorComparison: criterion "${row.label}" has no \`unit\`.`);
    }
    if (row.cells.length !== vendors.length) {
      throw new Error(
        `MultiVendorComparison: criterion "${row.label}" has ${row.cells.length} cells for ${vendors.length} vendors.`
      );
    }
    row.cells.forEach((cell, i) => {
      const empty = cell == null || (typeof cell === "string" && !cell.trim());
      if (empty) {
        throw new Error(
          `MultiVendorComparison: empty cell for "${vendors[i]?.name}" / "${row.label}". Where a vendor does not publish this, pass { notPublished: true } so the cell says so in words.`
        );
      }
      // A cell is a sentence, or the one sanctioned marker. Anything else is
      // someone reaching for a second kind of cell -- an estimate, a tick, a
      // tint -- and the table has no honest way to render one: an estimate
      // needs its basis stated in a sentence, which a cell cannot carry.
      if (typeof cell !== "string" && cell.notPublished !== true) {
        throw new Error(
          `MultiVendorComparison: cell for "${vendors[i]?.name}" / "${row.label}" is neither a sentence nor { notPublished: true }. Nothing in this table is estimated -- an estimate needs its basis in a sentence, so it belongs in SourcedPricingDisclosure, where it is marked and sourced.`
        );
      }
    });
  });

  return (
    <section id={id}>
      {heading ? <As>{heading}</As> : null}
      {lead ? <p>{lead}</p> : null}

      <div className="sk-mvc">
        <div className="sk-tablewrap">
          <table className="sk-table">
            <thead>
              <tr>
                <th scope="col">Criterion</th>
                {vendors.map((v) => (
                  <th scope="col" key={v.name}>
                    {v.name}
                    {v.self ? <span className="sk-mvc__self">this site</span> : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((row) => (
                <tr key={row.label}>
                  <th scope="row">
                    {row.label}
                    <span className="sk-mvc__unit">{row.unit}</span>
                  </th>
                  {row.cells.map((cell, i) => (
                    <td key={vendors[i].name}>
                      {typeof cell === "string" ? (
                        cell
                      ) : (
                        <span className="sk-mvc__np">Not published</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {caption ? <span className="sk-small sk-mvc__cap">{caption}</span> : null}

        {sources.length ? (
          <ul className="sk-mvc__sources">
            {sources.map((s) => (
              <li key={s.label || s.text}>
                {s.text ? (
                  // A source row that cites two documents for one vendor
                  // ("Capterra profile and product FAQ") is a copy string with
                  // its links inline; rel comes from the source registry.
                  <Rich text={s.text} />
                ) : (
                  <>
                    {s.vendor ? `${s.vendor}: ` : null}
                    <Cite href={s.href}>{s.label}</Cite>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
