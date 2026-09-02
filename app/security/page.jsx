import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Security — Sokndall",
  description:
    "Sokndall holds provider credentials and payer enrollment records. It does not hold PHI, which removes most of what usually stands between you and starting.",
  path: "/security",
  type: "article",
});

// Short, no keyword target, objection-handling page — this exists to answer
// one question quickly, not to persuade at length. No masthead kicker, no
// lead image, no sidebar: a plain narrow column is the whole design here.
export default function SecurityPage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-solo-shell">
        <header style={{ paddingTop: 56 }}>
          <h1 className="lp-h1" style={{ marginBottom: 16 }}>
            No patient data, no BAA, no security review before you can try it
          </h1>
          <p className="lp-lead" style={{ margin: 0 }}>
            Sokndall holds provider credentials and payer enrollment records. It does not hold PHI, which removes
            most of what usually stands between you and starting.
          </p>
          <hr className="lp-article-rule" style={{ marginTop: 40 }} />
        </header>

        <article className="lp-article-main">
          <section>
            <h2>What is in the system</h2>
            <p>
              Provider names, NPIs, license and registration numbers, expiration dates, malpractice policy details,
              CAQH IDs, payer application statuses, reference numbers and your notes about follow-ups. Documents you
              choose to attach — licenses, COIs, payer letters.
            </p>
          </section>

          <section>
            <h2>What is not</h2>
            <p>No patient names, no patient records, no claims data, no clinical information. Nothing that meets the definition of protected health information.</p>
            <p>
              This is a product decision, not an oversight: no patient data means no PHI, and no PHI is the reason
              there is no BAA to negotiate, no HIPAA security review to schedule, and no compliance sign-off standing
              between you and a trial.
            </p>
          </section>

          <section>
            <h2>How it is protected</h2>
            <p>
              Data is isolated by organization at the database level — a Billing Co client&rsquo;s records are not
              reachable from another client&rsquo;s login, enforced the same way regardless of plan. Encryption in
              transit is standard for the entire stack. Documents are stored with the same per-organization isolation
              as everything else, capped at 10MB per file, with total storage by plan: 1GB (Solo), 5GB (Practice),
              20GB (Billing Co). Email alerts and the weekly digest are sent through Resend.
            </p>
          </section>

          <section>
            <h2>Your data on the way out</h2>
            <p>Export everything to CSV at any time, including after cancelling. There is no export fee and no request process.</p>
          </section>

          <section>
            <h2>What if the company shut down tomorrow</h2>
            <p>
              This is a fair question to ask about any vendor, and a more pointed one when the vendor is a single
              founder. There is no scenario in which your data becomes unreachable — export to CSV works the same way
              whether the product is thriving or winding down, and it is not a feature that depends on anyone being
              available to process a request. If Sokndall ever stopped operating, the honest answer is that support
              would stop, not that your records would disappear or lock you out.
            </p>
            <p>
              That is a smaller promise than an enterprise vendor with a business-continuity clause in a contract can
              make, and it is worth being clear about the difference rather than implying otherwise.
            </p>
          </section>
        </article>
      </div>

      <SiteFooter variant="slim" />
    </div>
  );
}
