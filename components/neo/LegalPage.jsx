import Shell from "@/components/neo/Shell";
import InstitutionalTemplate from "@/components/neo/Institutional";
import { PageHeader, ProseSection } from "@/components/neo/EditorialBits";

// Terms and Privacy on the institutional mould (one column, no CTA). While a
// document isn't final (lib/legal.js), each section shows what it will cover,
// under a plain "draft" notice — never presented as the finished text.
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
            dateLabel={doc.updated ? "Updated" : undefined}
          />
        }
      >
        {doc.sections.map((s) => (
          <ProseSection key={s.id} id={s.id} heading={s.heading}>
            {doc.final && s.body ? (
              s.body
            ) : (
              <ul>
                {s.covers.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
          </ProseSection>
        ))}
      </InstitutionalTemplate>
    </Shell>
  );
}
