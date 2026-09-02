// /medtrainer-pricing — content for the shared competitor-pricing template
// (see /symplr-pricing/data.js for the section-order rule all three follow).
// This page runs one section longer than the other two: "what it does well"
// and "where the bundle stops making sense" are split into their own
// sections rather than combined, because the copy's whole argument is the
// contrast between them.

export const KNOWN = [
  "MedTrainer does not publish a price list on its own site for the credentialing module. Third-party software directories show fragments — one lists a starting figure of $4 per user per month tied to its course library, not the credentialing product; others list it only as custom pricing, contact for a quote. Neither is a reliable number to build a comparison on, so this page does not attempt one.",
  "What is consistent across every source: MedTrainer is sold as a bundle. Credentialing is one of three modules (learning, credentialing, compliance), and the pricing structure is built around which modules an organization needs, not a per-module list price.",
];

// Expanded from two paragraphs to three: the added middle paragraph explains
// what the other two modules actually do (not just names them), so the
// "three products in one subscription" framing is demonstrated rather than
// asserted, and the closing line now names the bundle's real advantage
// (one vendor relationship) instead of just conceding the training piece.
export const STRENGTHS = [
  "MedTrainer sells credentialing alongside a compliance learning management system and document and policy management. Organizations that buy it are usually solving all three at once.",
  "The learning management piece handles required training — HIPAA, OSHA, infection control, and whatever else a state or accreditor mandates — with tracking of who completed what and when, which matters for survey readiness. The policy and document management piece keeps a practice's internal policies current, versioned, and attested to by staff, which is its own recurring administrative burden in any regulated setting. Credentialing sits alongside both.",
  "If your organization needs all three, buying them as one subscription with one login and one vendor relationship is a real advantage over stitching together three separate tools. That is a genuine reason to choose MedTrainer, and nothing here is arguing against it for organizations that need the bundle.",
];

export const WHERE_IT_STOPS = [
  "If your training and policy management already work — or you do not need them — you are paying for a compliance platform to get a credentialing tracker.",
  "That is the only comparison this page is making. It is not about quality. It is about scope you are paying for and not using.",
];

export const FIT = [
  "Multi-location organizations with recurring compliance training requirements, policy attestation obligations, and credentialing on top. Ambulatory groups, surgery centers, and organizations preparing for accreditation surveys where training records and credentialing files get reviewed together.",
];

// New section, between Fit and the price table.
export const QUESTIONS = [
  "Whether pricing is truly modular — can you buy credentialing alone at a lower tier, or does the quote always include the full bundle regardless of what you actually need.",
  "How the compliance training content gets updated when a regulation changes, and whether that is included or a separate cost.",
  "Whether the credentialing module, specifically, handles payer enrollment tracking or only internal credential and license management — bundled platforms sometimes cover one and not the other, and it is easy to assume both are included.",
  "What the actual onboarding timeline looks like for all three modules together versus rolling them out one at a time.",
  "And again: what exporting your data looks like, for all three modules, if you ever need to leave.",
];

export const PRICE_INTRO =
  "Credential tracking and payer enrollment tracking. No LMS, no policy management, no PHI. $79 to $699 a month, published, with a 14-day trial — a fraction of what outsourced credentialing maintenance runs ($600–$2,400 per provider per year), because there is no person on the other end doing the work. It is a tracker, not a service.";

export const FAQ_ITEMS = [
  {
    q: "Does MedTrainer publish pricing anywhere?",
    a: "Not a list price for the credentialing module. Figures that circulate on third-party directories are tied to other parts of the bundle and are not a reliable comparison point.",
  },
  {
    q: "Do I lose compliance training if I use Sokndall?",
    a: "Yes — Sokndall has none. It is a credentialing and enrollment tracker only.",
  },
  {
    q: "Can I see Sokndall without a demo?",
    a: "Yes. Price is published and the trial is self-serve.",
  },
  {
    q: "Does MedTrainer's credentialing module track payer enrollment, or just internal credentials?",
    a: "Worth confirming directly — bundled platforms vary on this, and it changes whether MedTrainer alone covers what a billing-focused practice actually needs day to day.",
  },
  {
    q: "Could I use MedTrainer for training and compliance, and Sokndall for enrollment tracking?",
    a: "That is a reasonable split if the compliance training is the part of MedTrainer you actually value — nothing about either product requires the other.",
  },
];
