import Nav from "@/components/neo/Nav";
import Footer from "@/components/neo/Footer";
import Photo from "@/components/neo/Photo";

/**
 * InstitutionalTemplate — /security and /about, and nothing else.
 *
 * Both pages answer an objection a buyer has before they will start a trial:
 * "what data does this hold, and do I need a security review" and "who am I
 * buying compliance software from". 300-600 words each, one narrow centred
 * column at 36rem (~72 characters), no sidebar, no contents list.
 *
 * **No CTA — not between the sections and not at the foot.** The other three
 * templates all close with one. This one does not: a page that answers a
 * trust objection and then asks for the sale has answered it in order to ask,
 * and the reader can feel the difference. The footer carries the trial link,
 * which is the whole of what these two pages need.
 *
 * It is composed from the editorial pieces — `PageHeader` and `ProseSection`
 * from `EditorialBits` — rather than from anything of its own. The only thing
 * this file adds is the measure and the portrait slot.
 *
 * The portrait slot, on /about only: a real photograph of the founder or of
 * the place the work actually happens, or nothing. Never stock. A stock
 * "diverse team in a boardroom" on the page that says a single person runs
 * this is a claim a visitor can disprove in two clicks, and it would discredit
 * the one section on the site that is hardest to write. The slot ships empty
 * at a declared 4:5 crop, so the brief travels with the layout instead of
 * living in a separate document.
 */
export default function InstitutionalTemplate({ current, header, portrait, children }) {
  return (
    <div className="sk-inst">
      {/* The nav keeps its own 1200px measure rather than being re-parented
          onto this page's 36rem column, the way the editorial template
          re-parents it: at 656px the four links and the CTA wrap onto two
          rows. Both are centred, so they still share a centre axis. */}
      <Nav current={current} />

      <div className="sk-inst__body">
        {header ? <div className="sk-inst__head">{header}</div> : null}

        {portrait ? (
          <div className="sk-inst__portrait">
            <Photo
              src={portrait.src}
              alt={portrait.alt}
              ratio={portrait.ratio || "4 / 5"}
              width={portrait.width}
              height={portrait.height}
              direction={portrait.direction}
            />
            {portrait.caption ? <span className="sk-small">{portrait.caption}</span> : null}
          </div>
        ) : null}

        <article className="sk-prose sk-inst__prose">{children}</article>
      </div>

      <Footer />
    </div>
  );
}
