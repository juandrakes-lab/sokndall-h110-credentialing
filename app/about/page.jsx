import "@/components/site/site.css";
import "@/components/site/site-article.css";
import SiteNav from "@/components/site/SiteNav";
import SiteFooter from "@/components/site/SiteFooter";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About — Sokndall",
  description:
    "Credentialing and payer enrollment tracking software for medical practices and billing companies with 1 to 50 providers.",
  path: "/about",
  type: "article",
});

// Short, no keyword target, entity-coherence page — answers "is this a real
// company" quickly. Same minimal single-column treatment as /security.
export default function AboutPage() {
  return (
    <div className="sokndall-landing lp-article-page">
      <SiteNav />

      <div className="lp-solo-shell">
        <header style={{ paddingTop: 56 }}>
          <h1 className="lp-h1" style={{ marginBottom: 16 }}>
            About Sokndall
          </h1>
          <p className="lp-lead" style={{ margin: 0 }}>
            What this is, why it exists, and &mdash; since this matters more here than it would for a bigger company
            &mdash; who actually runs it and what happens if something happens to them.
          </p>
          <hr className="lp-article-rule" style={{ marginTop: 40 }} />
        </header>

        <article className="lp-article-main">
          <section>
            <h2>What this is</h2>
            <p>
              Sokndall is credentialing and payer enrollment tracking software for medical practices and billing
              companies with 1 to 50 providers. It tracks credential expiration dates and the status of payer
              enrollment applications, and sends a weekly summary of what needs attention.
            </p>
            <p>It is priced at $79, $299 and $699 per month, published, with a 14-day trial and no sales process.</p>
          </section>

          <section>
            <h2>Why it exists</h2>
            <p>
              Credentialing software is built for health systems, priced per provider per month, and sold through a
              demo. A practice with nine providers and one person handling credentialing does not need a committee
              workflow engine, and cannot justify what one costs.
            </p>
            <p>
              They end up on a spreadsheet. The spreadsheet works until it does not, and the failure is silent: a
              date nobody read, an application nobody followed up on, and a denial rate that climbs before anyone
              connects it to a form.
            </p>
          </section>

          <section>
            <h2>How this niche got chosen, since that is a fair thing to ask</h2>
            <p>
              Sokndall was not built around a hunch or a personal story in healthcare. It came out of a systematic
              process of testing market niches against a hard bar: an idea only survives if there is evidence someone
              is already spending money solving the exact problem &mdash; a charge, a prepaid engagement, a signed
              letter of intent. Interest, waitlists, and upvotes do not count. Several other candidates were tested
              and rejected before this one, for reasons that had nothing to do with how interesting they sounded
              &mdash; one because the real bottleneck was human and organizational, not something software fixes;
              another because a mature, inexpensive tool already solved it well.
            </p>
            <p>
              Credentialing and payer enrollment tracking survived that bar because of a specific kind of evidence:
              freelancers on Upwork billing tens of thousands of dollars and thousands of hours doing exactly this
              work for practices, manually, on an ongoing basis. That is not a complaint. That is proof someone is
              already paying, in volume, for a problem a small piece of software can meaningfully help with.
            </p>
          </section>

          <section>
            <h2>What it deliberately does not do</h2>
            <p>
              No primary source verification. No payer portal integrations. No PHI. It does not submit applications
              and it does not chase payers. It organizes the person doing that work.
            </p>
          </section>

          {/* The most important section of the page, per the copy itself —
              given real visual weight (a tinted panel, larger body text)
              rather than treated as one more closing paragraph. */}
          <section className="lp-weighted">
            <h2>Who runs this, and what that means for you</h2>
            <p>
              Sokndall is built and operated by a single founder, based in Panama City, Panama. There is no team, no
              support queue behind a chatbot pretending to be one, and no outsourced call center. When you email
              support, a person who actually built the product reads it.
            </p>
            <p>
              That has a real trade-off, and it is worth saying instead of hiding. Support is asynchronous and in
              writing &mdash; email, not phone, not live chat. Response times will not match a company with a support
              team working shifts. What you get in exchange is someone who knows the product completely, with no
              script and no tier-one queue standing between your question and an answer.
            </p>
            <p>
              The honest question underneath all of this is: what happens to my data and my subscription if
              something happens to the person running this? Two things are true regardless. Your data is yours
              &mdash; export to CSV at any time, from inside the product, with no request process and no fee, whether
              you are an active customer or you already cancelled. And nothing about the pricing or the trial depends
              on trusting a sales relationship &mdash; you can verify what the product does and what it costs without
              ever needing to reach a person first.
            </p>
            <p>
              Contact: <a href="mailto:hello@sokndall.com">hello@sokndall.com</a>
            </p>
          </section>
        </article>
      </div>

      <SiteFooter variant="slim" />
    </div>
  );
}
