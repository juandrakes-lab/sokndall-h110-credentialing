// /modio-health-pricing — content for the shared competitor-pricing template
// (see /symplr-pricing/data.js for the section-order rule all three follow).

export const KNOWN = [
  "Modio does not publish prices for OneView on modiohealth.com. The site's own copy asks visitors to complete a form to receive a quote and an information kit — no figure appears before that. Subscription terms are arranged per organization.",
  "Figures circulating on review sites and comparison posts vary widely and are not company-published. None of them are treated as a quote here.",
  "This is common for data-verification platforms specifically, more so than for simple SaaS tools — pricing often scales with data volume and verification frequency, not just seat count, which makes a flat published number harder to give honestly even if a company wanted to.",
];

// Expanded from two paragraphs to four: the added middle paragraph defines
// what primary source verification actually is and names the liability it
// carries, so the claim that Sokndall "does not do that at all" lands as an
// informed distinction rather than a dismissal.
export const STRENGTHS = [
  "OneView is a credentialing data platform. It pulls provider details from public and primary-source data — NPI, DEA, license numbers, education history, OIG exclusion status — so a provider's profile fills itself in rather than someone typing it from documents by hand.",
  "Primary source verification means confirming a credential directly with the body that issued it, rather than trusting the copy a provider submits. A license number gets checked against the state board's own record, not just recorded as text. That is meaningfully different work from tracking a date, and it is the part of credentialing that carries the most liability if it is done wrong — a provider practicing on a fabricated or revoked license is a problem no tracker, including Sokndall, is built to catch.",
  "OneView also stores documents with permissions, tracks expirables including CAQH reattestation dates, and runs monthly exclusion monitoring — checking providers against federal and state exclusion lists on an ongoing basis, not just at hiring.",
  "If primary source verification and automated exclusion monitoring are the part of your work that actually hurts, that is the product built for it, and Sokndall does not do that at all — it assumes you have already verified, and records what you verified and when.",
];

export const FIT = [
  "Modio sells to hospital administrators, credentialing departments, group practices and staffing organizations, and also runs a credentialing service (Modio XCS) that does the submissions for you — its own materials cite enrollment averaging 60 days versus a 120-day industry standard, and cases of recovering revenue that credentialing gaps had cost. That is a service business layered on the software, not just a tracker.",
  "Whether the software customer base itself includes much volume in the two-to-ten-physician range is not something Modio publishes a breakdown of, and no independent source here confirms it either way. That is worth asking directly on a demo call — how many customers your size are on it, and who supports them — rather than assuming an answer this page cannot verify.",
];

export const THIRD_OPTION = [
  "Modio verifies. Sokndall tracks. And underneath both sits the option neither of them is: paying someone to physically maintain your credentials — reattest, renew, resubmit — which published estimates put at $600 to $2,400 per provider per year.",
  "If you need primary source verification and exclusion monitoring pulled automatically, that is Modio's job. If you need someone else to do the maintenance work entirely, that is the $600–$2,400/year category, and it is a legitimate choice on its own terms. If your actual problem is that you do not know which of your fourteen open payer applications went quiet, and nobody tells you before an attestation lapses, that is a tracking problem, and it costs $79 to $699 a month here.",
];

// New section, between the third-option framing and the price table.
export const QUESTIONS = [
  "How verification actually works for licenses outside major databases — some state boards and international credentials are harder to verify automatically, and it is worth knowing whether those cases need manual work on your end regardless of which platform you use.",
  "What “monthly exclusion monitoring” actually checks against, and whether that list matches what your state requires you to screen against.",
  "Whether pricing scales with provider count, with verification volume, or with both — and what happens to the price if your provider count doubles.",
  "If you are also considering Modio XCS, the service layer: what exactly is included, what the realistic timeline looks like for your specialty and state, and what happens if a submission stalls — who owns following up.",
  "And the same question that applies everywhere in this category: what does exporting your data look like if you switch platforms later.",
];

export const FAQ_ITEMS = [
  {
    q: "Does Modio publish pricing anywhere?",
    a: "Not publicly. You request a quote.",
  },
  {
    q: "Can I use both?",
    a: "You could, though for most practices under fifty providers the overlap is not worth two subscriptions.",
  },
  {
    q: "Does Sokndall do primary source verification?",
    a: "No, and it says so on every page.",
  },
  {
    q: "What is the actual difference between verification and tracking?",
    a: "Verification confirms a credential is real by checking with whoever issued it. Tracking records the dates and statuses you already know, and tells you when something needs attention. Most small practices need tracking daily and verification occasionally — at hiring and at renewal, not continuously.",
  },
  {
    q: "If I only need occasional verification, is Modio overkill?",
    a: "Possibly, depending on volume. That is a fair question to ask directly on a demo call rather than assume either way.",
  },
];
