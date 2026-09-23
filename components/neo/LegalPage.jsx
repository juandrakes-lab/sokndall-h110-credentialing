import Shell from "@/components/neo/Shell";
import InstitutionalTemplate from "@/components/neo/Institutional";
import { PageHeader, ProseSection } from "@/components/neo/EditorialBits";

// Terms and Privacy on the institutional mould (one column, no CTA). A final
// document (lib/legal.js) opens with its plain-language summary, then the
// sections — a `body` of blocks, where a string is a paragraph and
// { list: [...] } is a bulleted list — and closes with the licence credit for
// the policies it was adapted from. A document that is not final still renders
// as the visible outline it used to be.
function Blocks({ body }) {
  return body.map((block, i) =>
    typeof block === "string" ? (
      <p key={i}>{block}</p>
    ) : (
      <ul key={i}>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  );
}

export default function LegalPage({ doc }) {
  return (
    <Shell>
      <InstitutionalTemplate
        header={
          <PageHeader
            title={doc.title}
            standfirst={
              doc.final
                ? undefined
                : "Draft. The final text is being written; this outline shows what each section will say. It is not yet the agreement in force."
            }
            date={doc.updated ?? undefined}
            dateLabel={doc.updated ? (doc.final ? "In effect since" : "Updated") : undefined}
          />
        }
      >
        {doc.final && doc.summary ? (
          <section className="sk-legal__sum" aria-label="In short">
            <p className="sk-micro">In short</p>
            {doc.summary.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
        ) : null}

        {doc.sections.map((s) => (
          <ProseSection key={s.id} id={s.id} heading={s.heading}>
            {doc.final && s.body ? (
              <Blocks body={s.body} />
            ) : (
              <ul>
                {s.covers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </ProseSection>
        ))}

        {doc.attribution ? (
          <p className="sk-legal__credit sk-small">
            <a href={doc.attribution.href} rel="noopener noreferrer nofollow" target="_blank">
              Adapted from the Basecamp open-source policies
            </a>
            , used under{" "}
            <a href={doc.attribution.licenceHref} rel="noopener noreferrer nofollow license" target="_blank">
              CC BY 4.0
            </a>
            .
          </p>
        ) : null}
      </InstitutionalTemplate>
    </Shell>
  );
}
