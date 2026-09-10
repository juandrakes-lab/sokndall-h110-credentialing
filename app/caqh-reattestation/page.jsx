import Link from "next/link";

import Shell from "@/components/neo/Shell";
import EditorialTemplate from "@/components/neo/Editorial";
import {
  PageHeader,
  ProseSection,
  EditorialClose,
  StatedVsObserved,
  SourcedFigure,
  RelatedGuides,
} from "@/components/neo/EditorialBits";
import { CONTENTS, SOURCES, CADENCE, RELATED } from "./data";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "CAQH reattestation: how the 120-day cycle works — Sokndall",
  description:
    "Every 120 days, for as long as you bill insurance. How to find your next attestation date, what happens when it passes, and why this is the deadline that most often goes unnoticed.",
  path: "/caqh-reattestation",
  type: "article",
});

export default function CaqhReattestationPage() {
  return (
    <Shell>
      <EditorialTemplate
        contents={CONTENTS}
        header={
          <PageHeader
            title="CAQH reattestation: how the 120-day cycle works, and how the date gets lost"
            standfirst="Every 120 days, forever, for as long as you bill insurance. Here is how to find your next date, what happens when it passes, and why this is the deadline that most often goes unnoticed."
            category="Credentialing deadlines"
            date="2026-09-06"
            readingTime="6 min read"
          />
        }
        closing={
          <EditorialClose
            href="/pricing"
            label="Or see the automated version — from $79/mo"
          />
        }
        related={<RelatedGuides items={RELATED} />}
      >
        <ProseSection
          id="rebrand"
          heading="First: CAQH is now DataSpring, and ProView is now the Provider Data Portal"
        >
          <p>
            In June 2026 CAQH rebranded as DataSpring, powered by CAQH. The provider-facing portal
            previously called CAQH ProView is now the CAQH Provider Data Portal &mdash; same URL,
            same login, same profile, same documents, same attestation history. Nothing was migrated
            and nothing needs rebuilding, across all{" "}
            <SourcedFigure source={SOURCES.rebrand}>4.8 million provider records</SourcedFigure>.
          </p>
          <p>
            Earlier that year, in{" "}
            <SourcedFigure source={SOURCES.forProfit}>January 2026</SourcedFigure>, the organization
            converted from a nonprofit into a for-profit company held by shareholders affiliated
            with major health plans.
          </p>
          <p>
            For your reattestation, none of this changes anything operational. It matters here for
            one practical reason: guides that still say &ldquo;CAQH ProView&rdquo; were written
            before the change, and application forms and internal documentation referencing ProView
            should be updated to the current name.
          </p>
        </ProseSection>

        <ProseSection id="what" heading="What reattestation is">
          <p>
            Your CAQH profile is the record payers pull from when they credential or re-credential
            you. Reattestation is you confirming that the profile is still accurate. You are not
            re-entering anything &mdash; you are signing off that what is there is current.
          </p>
          <p>
            The cycle is <SourcedFigure source={SOURCES.portal}>120 days</SourcedFigure>. Attest,
            and the clock restarts from that date.
          </p>
        </ProseSection>

        <ProseSection id="cadence" heading="Why the cadence confuses everyone">
          <p>
            CAQH runs on 120 days. But payers and clearinghouses layer their own refresh
            expectations on top, and they do not agree with each other or with CAQH. Providers
            routinely report being told one interval by CAQH, a shorter one by one payer&rsquo;s
            platform, and a different one again by another.
          </p>

          <StatedVsObserved
            caption={CADENCE.caption}
            stated={CADENCE.stated}
            statedSource={CADENCE.statedSource}
            observed={CADENCE.observed}
            note={CADENCE.note}
          />

          <p>
            The practical rule: attest on the CAQH cycle, and treat any payer-specific request as an
            additional obligation rather than a replacement. If a payer says your data is stale and
            CAQH says you are current, the payer&rsquo;s record is what is holding up your claims.
          </p>
        </ProseSection>

        <ProseSection id="lapse" heading="What happens when the date passes">
          <p>
            Your profile status goes to expired. Payers that pull from it stop seeing current data.
            Depending on the payer, that means your record with them stops matching, and claims
            begin to reject for reasons that do not say &ldquo;your CAQH lapsed.&rdquo;
          </p>
          <p>
            That is what makes this deadline different from a license renewal. A lapsed license
            announces itself. A lapsed attestation shows up as a denial rate that creeps, and it is
            usually reconstructed backwards from the A/R report weeks later.
          </p>
          <p>
            The fix itself is quick &mdash; providers who have let a profile sit expired for months
            generally report updating it without difficulty. The cost is not the fix. It is the
            interval before anyone noticed.
          </p>
        </ProseSection>

        <ProseSection id="calculate" heading="How to calculate your next date">
          <p>
            Open the CAQH Provider Data Portal, find your last attestation date, add 120 days. That
            is your deadline. Put it somewhere that will tell you about it before it arrives, and
            set the reminder at least two weeks early, because attestation can be blocked by
            something else that is expired.
          </p>
        </ProseSection>

        <ProseSection
          id="documents"
          heading="The trap: a document inside the profile expires before the attestation does"
        >
          <p>
            You cannot attest to a profile containing expired documents. The one that catches people
            most often is malpractice coverage &mdash; particularly for providers who moved from an
            employer&rsquo;s policy to their own, or who left a group where someone else&rsquo;s
            team maintained the profile and the policy behind it.
          </p>
          <p>
            This is why the attestation date alone is not enough to track. You need the expiration
            dates of the documents inside the profile too, and those are on different cycles.
          </p>
        </ProseSection>

        <ProseSection id="lost" heading="Why the date gets lost when it is tracked by hand">
          <p>
            The date moves every time you attest, so a static calendar entry goes stale after the
            first cycle. It is owned by whoever set it up, so it disappears when that person changes
            roles or leaves. And the reminder emails arrive from a system that also sends other
            mail, so they get filtered, forwarded, or read by someone who assumes someone else is
            handling it.
          </p>
          <p>
            None of those are carelessness. They are what happens when a moving date lives in a
            place that does not move with it.
          </p>
        </ProseSection>

        <ProseSection id="tracker" heading="How a tracker handles this">
          <p>
            Record the last attestation date once. The next due date is that date plus 120 days,
            recalculated every time you attest, with the interval configurable if a payer holds you
            to something shorter. Alerts at 30 and 14 days, to a named person rather than a shared
            inbox. And the documents inside the profile get their own expiration rows, so an
            expiring COI surfaces before it blocks an attestation.
          </p>
          <p>
            The <Link href="/credentialing-spreadsheet-template">free template</Link> below does the
            same calculation. It just will not email you.
          </p>
        </ProseSection>
      </EditorialTemplate>
    </Shell>
  );
}
