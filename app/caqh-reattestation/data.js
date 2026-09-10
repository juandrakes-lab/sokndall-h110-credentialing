// `/caqh-reattestation` — copy verbatim from H110_COPY_TANDA_C_EDITORIAL.md,
// "PÁGINA 7". Replaces the pre-v3.1 copy entirely (the old page led with the
// rebrand and carried a StatedVsObserved block; v3.1 moves the rebrand to
// /caqh-provider-data-portal and has no such block here).
//
// Terminology: "CAQH Provider Data Portal", never "ProView" except where the
// rename itself is explained.

export const META = {
  title: "CAQH Reattestation: The 120-Day Rule, Fully Explained",
  description:
    "CAQH reattestation is required every 120 days whether or not anything changed. Nothing breaks visibly when it lapses, which is what makes it expensive.",
};

export const HEADER = {
  title: "CAQH reattestation is due every 120 days, and nothing tells you when you miss it",
  standfirst:
    "The cycle runs on the calendar rather than on changes to your profile. When it lapses, claims with payers you are already enrolled with keep processing normally, which is exactly why the damage stays invisible for weeks.",
  category: "Guide",
  date: "2026-09-08",
  readingTime: "7 min read",
  caption:
    "Attestation confirms the profile is accurate. Reattestation is the recurring 120-day cycle that keeps it active, and it is triggered by the calendar, not by an edit.",
};

export const CONTENTS = [
  { id: "how-often", label: "How often reattestation is required" },
  { id: "not-the-same", label: "Attestation is not reattestation" },
  { id: "invisible", label: "Why a lapse is invisible" },
  { id: "documents", label: "Expired documents block attestation" },
  { id: "ninety-day", label: "The 90-day rule that is not this one" },
  { id: "goes-wrong", label: "When it goes wrong" },
  { id: "limit", label: "What a tracker does not fix" },
];

export const SECTIONS = [
  {
    id: "how-often",
    heading: "How often the CAQH database requires attestation",
    paras: [
      "Every 120 days, without exception, whether or not anything in the profile has changed. Six independent sources agree on the figure and none of them records an exemption for an unchanged profile. The cycle is triggered by the date of your last attestation, so it moves every time you attest, and it does not reset when you edit a field without attesting.",
    ],
    figure: { value: "every 120 days", source: "drCredentialing", label: "DrCredentialing, 2026" },
  },
  {
    id: "not-the-same",
    heading: "Attestation and reattestation are not the same thing",
    paras: [
      "[Attestation is the formal act of confirming that your profile is one hundred per cent accurate. Reattestation is the recurring cycle that keeps the profile in an active state](src:contractingProviders), and it is triggered by the calendar rather than by a change in your data. That distinction is why a provider who has changed nothing in eight months is still out of compliance: there was nothing to update and the deadline arrived anyway.",
    ],
  },
  {
    id: "invisible",
    heading: "Why a lapsed profile does not announce itself",
    paras: [
      "[When the attestation expires, nothing visibly breaks](src:hireGaynell). Claims with payers you are already enrolled with keep processing. No email arrives from the payer. [The profile moves to an Expired state and the organisations you authorised stop being able to see current information](src:medsole), but none of that produces a signal on your side of the relationship.",
      "The damage surfaces weeks later, in a shape that does not look like a CAQH problem: a panel application that never advanced, or a recredentialing cycle that stopped quietly. By then the connection between the missed date and the stalled application is several weeks old and nobody is looking for it. This is the single mechanism that makes a 120-day calendar task worth a system.",
    ],
  },
  {
    id: "documents",
    heading: "An expired document blocks the whole attestation",
    paras: [
      "A malpractice certificate or a licence renewal that has expired inside the profile stops you attesting even when every other field is current. The five-minute task becomes a race for a document from a carrier or a board that is not in a hurry. Checking document expiry dates before opening the attestation, rather than during it, is the difference between five minutes and five days.",
    ],
  },
  {
    id: "ninety-day",
    heading: "The 90-day rule people confuse with this one",
    paras: [
      "[The Consolidated Appropriations Act requires participating providers to verify and attest to provider directory information every 90 days](src:bcbsNebraska) through the portal, even when nothing has changed. That is a different requirement with a different clock from the 120-day credentialing reattestation cycle, and the two are routinely reported as one. If a payer tells you that you are out of date and your 120-day cycle looks fine, this is usually why.",
    ],
  },
  {
    id: "goes-wrong",
    heading: "What to do when the attestation has already lapsed",
    paras: [
      "Attest immediately, then check what stopped while it was expired. Any panel application submitted during the lapsed period should be assumed stalled until a payer confirms otherwise, and a phone call is the only way to find out. Reattesting does not restart an application that stopped; it only removes the reason it stopped.",
      "If a document inside the profile is what is blocking the attestation, upload the replacement and reattest afterwards, because the attestation is what publishes the change to authorised organisations. A corrected document sitting in an unattested profile is not visible to any payer.",
      "If the reminder was going to a person who has left the practice, fix that before anything else. The most common version of this failure is not carelessness — it is a notification arriving in a former manager's inbox for four months while everyone assumes someone is receiving it.",
    ],
  },
  {
    id: "limit",
    heading: "What a tracker does not do about CAQH",
    paras: [
      "Sokndall does not connect to [the CAQH Provider Data Portal](/caqh-provider-data-portal), does not attest on your behalf, and does not read your profile. It holds the date of your last attestation, calculates the next due date at 120 days, and tells a named person before it passes. Everything on the portal side is still done by hand, in the portal, by you.",
    ],
    after: ["[The three published plans](/pricing)"],
  },
];

export const TEMPLATE_HEADING = "The free template has a CAQH tab that counts the 120 days for you";

export const FAQ = [
  {
    q: "How often does the CAQH database require provider attestation?",
    a: "Every 120 days. The requirement holds whether or not anything in the profile has changed, because the cycle is triggered by the date of your last attestation rather than by an edit. Editing a field without attesting does not reset the clock. Separately, the Consolidated Appropriations Act requires directory information to be verified every 90 days, which is a different rule with a different deadline.",
  },
  {
    q: "How often to reattest CAQH",
    a: "Every 120 days from your last attestation. Practically that is three times a year, and because the date moves each time you attest, it does not land on a fixed calendar month. This is the reason a manual reminder tends to drift: whoever set it last year set it against a date that has since moved twice.",
  },
  {
    q: "What is CAQH reattestation?",
    a: "Reattestation is the recurring confirmation that everything in your CAQH Provider Data Portal profile is still accurate, required on a 120-day cycle to keep the profile active. It is distinct from attestation itself, which is the formal act of confirming accuracy. Reattestation is what the calendar demands; attestation is what you do when you comply with it.",
  },
  {
    q: "What happens if you miss a CAQH reattestation?",
    a: "Nothing visible. The profile moves to an Expired state and authorised payers stop seeing current information, but claims with payers you are already enrolled with keep processing and no warning email arrives. The cost shows up weeks later as a panel application that never advanced or a recredentialing cycle that stopped, and by then the two events look unrelated.",
  },
  {
    q: "Is CAQH mandatory?",
    a: "Not by law, but effectively yes in practice. Most commercial payers require a complete and attested profile before they will process a credentialing application, and several will not accept one at all without it. The portal is free to providers. Whether you consider that mandatory depends on whether you intend to be in network with anyone.",
  },
  {
    q: "What is the CAQH re-attestation frequency?",
    a: "Every 120 days, measured from your last attestation rather than from a fixed date in the year. The frequency does not change if your profile is unchanged, and it does not change by payer — it is a property of the profile, not of any individual network relationship. Roughly three attestations a year, on a date that shifts each cycle.",
  },
];

export const CLOSE = {
  href: "/credentialing-spreadsheet-template",
  label:
    "The free template calculates the next attestation date from the last one, so the moving deadline stops being something to remember.",
};

export const RELATED = [
  {
    href: "/caqh-provider-data-portal",
    title: "The CAQH Provider Data Portal, after the rebrand",
    hook: "What changed when CAQH became DataSpring, and what did not change at all.",
  },
  {
    href: "/behavioral-health-credentialing",
    title: "Behavioral health credentialing, payer by payer",
    hook: "All four major behavioral payers pull from this profile before they will act.",
  },
  {
    href: "/provider-credentialing-checklist",
    title: "The provider credentialing checklist, and the documents it needs",
    hook: "What has to be current before an attestation will go through at all.",
  },
];
