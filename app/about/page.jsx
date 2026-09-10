import Shell from "@/components/neo/Shell";
import InstitutionalTemplate from "@/components/neo/Institutional";
import { PageHeader, ProseSection } from "@/components/neo/EditorialBits";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About — Sokndall",
  description:
    "Credentialing and payer enrollment tracking software for medical practices and billing companies with 1 to 50 providers.",
  path: "/about",
  type: "article",
});

// The second InstitutionalTemplate page. Same narrow column, same absence of a
// CTA, plus the one image slot the template has — declared, empty, and 4:5.
//
// The photograph is the only place on this site where the art direction is a
// prohibition rather than a brief: a real photograph of the founder or of the
// desk this is actually built on, or nothing at all. Stock is not a weaker
// option here, it is a false one — the page's central claim is that one person
// runs this, and a stock team photograph contradicts it in the same screen.
//
// Note against the template's own spec: the copy runs to ~700 words, above the
// 300-600 band. The copy is authoritative and was not cut to fit; the section
// that pushes it over is the one the brief calls the most important on the
// page.
export default function AboutPage() {
  return (
    <Shell>
      <InstitutionalTemplate
        header={
          <PageHeader
            title="About Sokndall"
            standfirst="What this is, why it exists, and — since this matters more here than it would for a bigger company — who actually runs it and what happens if something happens to them."
            date="2026-09-06"
            dateLabel="Updated"
          />
        }
        portrait={{
          ratio: "4 / 5",
          alt: "The founder at the desk where Sokndall is built",
          direction:
            "A real photograph, never stock: the founder, or the actual desk this is built on. Available light, work visibly in progress, nobody posed and nobody smiling into the camera. No team, no boardroom, no handshake — the page says one person runs this, and the picture cannot contradict it.",
          caption:
            "Slot reserved at 4:5. It ships empty until a real photograph exists; a stock image here would contradict the page.",
        }}
      >
        <ProseSection id="what" heading="What this is">
          <p>
            Sokndall is credentialing and payer enrollment tracking software for medical practices
            and billing companies with 1 to 50 providers. It tracks credential expiration dates and
            the status of payer enrollment applications, and sends a weekly summary of what needs
            attention.
          </p>
          <p>
            It is priced at $79, $299 and $699 per month, published, with a 14-day trial and no
            sales process.
          </p>
        </ProseSection>

        <ProseSection id="why" heading="Why it exists">
          <p>
            Credentialing software is built for health systems, priced per provider per month, and
            sold through a demo. A practice with nine providers and one person handling
            credentialing does not need a committee workflow engine, and cannot justify what one
            costs.
          </p>
          <p>
            They end up on a spreadsheet. The spreadsheet works until it does not, and the failure
            is silent: a date nobody read, an application nobody followed up on, and a denial rate
            that climbs before anyone connects it to a form.
          </p>
        </ProseSection>

        <ProseSection
          id="niche"
          heading="How this niche got chosen, since that is a fair thing to ask"
        >
          <p>
            Sokndall was not built around a hunch or a personal story in healthcare. It came out of
            a systematic process of testing market niches against a hard bar: an idea only survives
            if there is evidence someone is already spending money solving the exact problem &mdash;
            a charge, a prepaid engagement, a signed letter of intent. Interest, waitlists, and
            upvotes do not count. Several other candidates were tested and rejected before this one,
            for reasons that had nothing to do with how interesting they sounded &mdash; one because
            the real bottleneck was human and organizational, not something software fixes; another
            because a mature, inexpensive tool already solved it well.
          </p>
          <p>
            Credentialing and payer enrollment tracking survived that bar because of a specific kind
            of evidence: freelancers on Upwork billing tens of thousands of dollars and thousands of
            hours doing exactly this work for practices, manually, on an ongoing basis. That is not
            a complaint. That is proof someone is already paying, in volume, for a problem a small
            piece of software can meaningfully help with.
          </p>
        </ProseSection>

        <ProseSection id="scope" heading="What it deliberately does not do">
          <p>
            No primary source verification. No payer portal integrations. No PHI. It does not submit
            applications and it does not chase payers. It organizes the person doing that work.
          </p>
        </ProseSection>

        <ProseSection id="who" heading="Who runs this, and what that means for you">
          <p>
            Sokndall is built and operated by a single founder, based in Panama City, Panama. There
            is no team, no support queue behind a chatbot pretending to be one, and no outsourced
            call center. When you email support, a person who actually built the product reads it.
          </p>
          <p>
            That has a real trade-off, and it is worth saying instead of hiding. Support is
            asynchronous and in writing &mdash; email, not phone, not live chat. Response times will
            not match a company with a support team working shifts. What you get in exchange is
            someone who knows the product completely, with no script and no tier-one queue standing
            between your question and an answer.
          </p>
          <p>
            The honest question underneath all of this is: what happens to my data and my
            subscription if something happens to the person running this? Two things are true
            regardless. Your data is yours &mdash; export to CSV at any time, from inside the
            product, with no request process and no fee, whether you are an active customer or you
            already cancelled. And nothing about the pricing or the trial depends on trusting a
            sales relationship &mdash; you can verify what the product does and what it costs
            without ever needing to reach a person first.
          </p>
          <p>
            Contact: <a href="mailto:hello@sokndall.com">hello@sokndall.com</a>
          </p>
        </ProseSection>
      </InstitutionalTemplate>
    </Shell>
  );
}
