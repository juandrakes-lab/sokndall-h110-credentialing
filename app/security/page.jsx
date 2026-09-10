import Shell from "@/components/neo/Shell";
import InstitutionalTemplate from "@/components/neo/Institutional";
import { PageHeader, ProseSection } from "@/components/neo/EditorialBits";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Security — Sokndall",
  description:
    "Sokndall holds provider credentials and payer enrollment records. It does not hold PHI, which removes most of what usually stands between you and starting.",
  path: "/security",
  type: "article",
});

// The sample page for InstitutionalTemplate. ~430 words, one 36rem column, no
// image slot (an illustration of "we do not hold patient data" would be an
// invention), and no CTA anywhere on the page — this one answers a purchase
// objection, and closing it with a sales ask would undo the answer.
//
// Two claims here are still gated, from the copy brief and unchanged by this
// rebuild: the "no BAA" phrasing needs Legal sign-off before publication, and
// the protection section deliberately states only what the functional scope
// confirms — no encryption-at-rest claim, no hosting location, no backup
// policy, no third-party certification, until development confirms each one.
export default function SecurityPage() {
  return (
    <Shell>
      <InstitutionalTemplate
        header={
          <PageHeader
            title="No patient data, no BAA, no security review before you can try it"
            standfirst="Sokndall holds provider credentials and payer enrollment records. It does not hold PHI, which removes most of what usually stands between you and starting."
            date="2026-09-06"
            dateLabel="Updated"
          />
        }
      >
        <ProseSection id="in-the-system" heading="What is in the system">
          <p>
            Provider names, NPIs, license and registration numbers, expiration dates, malpractice
            policy details, CAQH IDs, payer application statuses, reference numbers and your notes
            about follow-ups. Documents you choose to attach &mdash; licenses, COIs, payer letters.
          </p>
        </ProseSection>

        <ProseSection id="not-in-the-system" heading="What is not">
          <p>
            No patient names, no patient records, no claims data, no clinical information. Nothing
            that meets the definition of protected health information.
          </p>
          <p>
            This is a product decision, not an oversight: no patient data means no PHI, and no PHI
            is the reason there is no BAA to negotiate, no HIPAA security review to schedule, and no
            compliance sign-off standing between you and a trial.
          </p>
        </ProseSection>

        <ProseSection id="protection" heading="How it is protected">
          <p>
            Data is isolated by organization at the database level &mdash; a Billing Co
            client&rsquo;s records are not reachable from another client&rsquo;s login, enforced the
            same way regardless of plan. Encryption in transit is standard for the entire stack.
            Documents are stored with the same per-organization isolation as everything else, capped
            at 10MB per file, with total storage by plan: 1GB (Solo), 5GB (Practice), 20GB (Billing
            Co). Email alerts and the weekly digest are sent through Resend.
          </p>
        </ProseSection>

        <ProseSection id="export" heading="Your data on the way out">
          <p>
            Export everything to CSV at any time, including after cancelling. There is no export fee
            and no request process.
          </p>
        </ProseSection>

        <ProseSection id="continuity" heading="What if the company shut down tomorrow">
          <p>
            This is a fair question to ask about any vendor, and a more pointed one when the vendor
            is a single founder. There is no scenario in which your data becomes unreachable &mdash;
            export to CSV works the same way whether the product is thriving or winding down, and it
            is not a feature that depends on anyone being available to process a request. If
            Sokndall ever stopped operating, the honest answer is that support would stop, not that
            your records would disappear or lock you out.
          </p>
          <p>
            That is a smaller promise than an enterprise vendor with a business-continuity clause in
            a contract can make, and it is worth being clear about the difference rather than
            implying otherwise.
          </p>
        </ProseSection>
      </InstitutionalTemplate>
    </Shell>
  );
}
