import { ProseSection, SourcedFigure, StatedVsObserved, DocumentChecklist } from "@/components/neo/EditorialBits";
import SOURCES from "@/components/neo/sources";
import Rich from "@/components/neo/rich";

/**
 * Maps a page's section data onto the editorial pieces, so every article of
 * the v3.1 run renders its body the same way and a data file holds only copy.
 *
 * A section: {
 *   id, heading, paras: [string],              // rich.jsx syntax for links
 *   figure?:   { value, source: key, label },  // the copy's "SourcedFigure" slot
 *   svo?:      StatedVsObserved props,
 *   checklist?: DocumentChecklist props,
 *   after?:    [string]                        // paragraphs after an svo/checklist
 *   figures?:  [{ value, source, label }]      // several SourcedFigure slots, as a list
 *   unverified?: string                        // the comparison's "No verificado" slot
 * }
 *
 * `unverified` prints behind the structural label "Not verified", the same
 * kind of fixed word as StatedVsObserved's "Stated" / "Observed": the copy
 * gives the slot's text, and without its label the sentence reads as a claim
 * rather than as the list of what could not be checked.
 *
 * The SourcedFigure slot is set as its own line after the section's
 * paragraphs: the copy delivers it as a separate slot ("90 to 120 days (Aetna,
 * via BehaveHealth)"), not woven into a sentence, and it is not re-worded to
 * fit one. Its source label is the copy's; its link comes from sources.js.
 */
export function source(key, label) {
  // An internal route is a source too ("Sokndall pricing page, published").
  if (key.startsWith("/")) return { label, href: key };
  const s = SOURCES[key];
  if (!s) throw new Error(`editorialRender: unknown source "${key}"`);
  return { label: label || s.label, href: `src:${key}` };
}

export function EditorialSection({ section }) {
  const { id, heading, paras, figure, figures, svo, checklist, after, unverified } = section;
  return (
    <ProseSection id={id} heading={heading} paras={paras}>
      {checklist ? <DocumentChecklist {...checklist} /> : null}
      {svo ? <StatedVsObserved {...svo} /> : null}
      {(after || []).map((p, i) => (
        <p key={i}>
          <Rich text={p} />
        </p>
      ))}
      {figures ? (
        <ul className="sk-list sk-ed__figs">
          {figures.map((f) => (
            <li key={f.value}>
              <SourcedFigure source={source(f.source, f.label)}>{f.value}</SourcedFigure>
            </li>
          ))}
        </ul>
      ) : null}
      {unverified ? (
        <p className="sk-ed__nv">
          <span className="sk-micro sk-ed__nvlb">Not verified</span> <Rich text={unverified} />
        </p>
      ) : null}
      {figure ? (
        <p className="sk-ed__fig">
          <SourcedFigure source={source(figure.source, figure.label)}>{figure.value}</SourcedFigure>
        </p>
      ) : null}
    </ProseSection>
  );
}

export function renderSections(sections) {
  return sections.map((s) => <EditorialSection key={s.id} section={s} />);
}
