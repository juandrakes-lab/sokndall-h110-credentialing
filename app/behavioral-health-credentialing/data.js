// `/behavioral-health-credentialing` — copy verbatim from
// H110_COPY_TANDA_C_EDITORIAL.md, "PÁGINA 6". New page on EditorialTemplate.
//
// The finding that organises the page: three of the four large payers
// credential behavioral health through an entity separate from their medical
// brand, with its own phone line. One section per payer, with how to reach it
// (the copy's answer to the "…provider credentialing phone number" searches).
// Headway and Alma are mentioned without chasing their brand keywords.

export const META = {
  title: "Behavioral Health Credentialing, Payer by Payer in 2026",
  description:
    "Optum, Evernorth, Carelon, Aetna and Magellan each credential behavioral health differently. What changes at each one, and the number that reaches them.",
};

export const HEADER = {
  title: "Behavioral health credentialing runs through a different door at almost every payer",
  standfirst:
    "Three of the four largest payers handle mental health credentialing through a separate entity with its own phone line, its own portal and its own form. Using the medical channel is the most common avoidable delay in the process.",
  category: "Guide",
  date: "2026-09-08",
  readingTime: "9 min read",
  caption:
    "Optum routes through Provider Express, Cigna through Evernorth, Carelon operates as its own company. Magellan has no national credentialing line at all.",
};

export const CONTENTS = [
  { id: "pattern", label: "The separate-entity pattern" },
  { id: "optum", label: "Optum Behavioral Health" },
  { id: "cigna-evernorth", label: "Cigna and Evernorth" },
  { id: "carelon", label: "Carelon Behavioral Health" },
  { id: "aetna", label: "Aetna behavioral health" },
  { id: "magellan", label: "Magellan, and why it is different" },
  { id: "intermediaries", label: "The intermediary platforms" },
  { id: "goes-wrong", label: "When it goes wrong" },
];

export const SECTIONS = [
  {
    id: "pattern",
    heading: "Why behavioral health has its own door",
    paras: [
      "Optum runs behavioral health through Provider Express rather than the general UnitedHealthcare provider portal. Cigna's behavioral arm became Evernorth Behavioral Health, Inc. on 1 September 2021 and is a separate legal entity with its own provider information form. Carelon Behavioral Health operates as its own company inside Elevance. Three separate corporate structures, three separate credentialing paths.",
      "The consequence is practical rather than administrative. Applications sent to the medical credentialing line at these companies do not get forwarded — they sit, or they are declined for the wrong reason, and the clinician spends six weeks assuming the payer is slow. No payer publishes a warning about this and no competitor page in this SERP mentions it.",
    ],
  },
  {
    id: "optum",
    heading: "Optum Behavioral Health",
    paras: [
      "The behavioral line is [877-614-0484](src:umrOptum), which is not the general UnitedHealthcare provider number. Applications and status live in [Provider Express](src:behaveHealth). For group and organisational credentialing there is a separate email address, [BHSCredentialing@optum.com](src:optumSanDiego), which is worth using when you are enrolling a practice rather than a single clinician.",
      "Optum requires a complete and attested CAQH profile including facility licences, accreditation, malpractice coverage and NPI information. It also [evaluates network need by geographic area and specialty](src:behaveHealth) before accepting new providers, and it recommends checking availability in Provider Express before you apply. Processing runs [roughly 60 to 90 days](src:behaveHealth) from a complete application.",
    ],
  },
  {
    id: "cigna-evernorth",
    heading: "Cigna behavioral health is Evernorth",
    paras: [
      "Since September 2021, Cigna Behavioral Health, Inc. has been Evernorth Behavioral Health, Inc. The behavioral number is 1-800-926-2273, distinct from Cigna's medical provider line at 1-800-882-4462. Recruitment runs through BehavioralProviderRecruitment@evernorth.com, and the application uses the Evernorth Behavioral Health Provider Information Form rather than Cigna's standard medical form.",
      "[Evernorth publishes up to 90 days](src:evernorth) from a complete application, and it advises calling before applying to confirm the network accepts your licence type in your state. That call is a availability check, and it is the same advice Optum gives in a different form. Two of the largest behavioural payers both consider the check a prerequisite rather than an optional courtesy.",
    ],
  },
  {
    id: "carelon",
    heading: "Carelon Behavioral Health",
    paras: [
      "The [National Provider Services Line is 800-397-1630](src:carelonContact), Monday to Friday, 8am to 8pm Eastern. Carelon works through CAQH: if you already have a profile, you add Carelon Behavioral Health as an authorised organisation and keep the attestation current. Status tracking happens through Availity, under submitted applications, rather than through a Carelon portal of its own.",
      "Carelon publishes one rule the others do not, and it carries a deadline. [If a third party reports information that conflicts with what you declared, you have seven calendar days](src:carelonJoin) from the notification to submit a correction in writing. Seven days is short enough that a notification landing in an inbox nobody reads is the whole failure, and it is the strongest argument on this page for a named owner per payer relationship.",
    ],
  },
  {
    id: "aetna",
    heading: "Aetna behavioral health",
    paras: [
      "Aetna runs one credentialing line, 1-800-353-1232, with a behavioral health option inside it rather than a separate number. Applications go through CAQH, with the profile complete and attested before you apply. [Published processing runs 60 to 120 days](src:behaveHealth) depending on the source, with 90 to 120 the range cited most often.",
      "Aetna also states the rule that matters most for billing: [the in-network effective date is the date the contract is fully executed](src:clinicalDocsAetna), not the date the application went in. Recredentialing then runs on a 36-month cycle. The most common causes of delay Aetna names are incomplete CAQH profiles, missing documentation, and backlog in its own verification office.",
    ],
  },
  {
    id: "magellan",
    heading: "Magellan has no national credentialing line",
    paras: [
      "This is a finding rather than a gap in the research. Magellan does not centralise credentialing contact: each state has its own Network Management contact, and the number you need depends on where the clinician practises. Magellan of Louisiana, for example, publishes 318-524-8829. There is no single number that works everywhere.",
      "The general line, 1-800-788-4005, is portal support rather than credentialing, and calling it for a credentialing question produces a redirect at best. The right move is the Network Contacts directory by state, and the right expectation is that Magellan behaves like several regional payers that share a name. Any page that gives you one Magellan credentialing number is guessing.",
    ],
  },
  {
    id: "intermediaries",
    heading: "Headway, Alma, and what they change",
    paras: [
      "Platforms like Headway and Alma panel clinicians under their own contracts, which removes the process described on this page and replaces it with theirs. That is a real option and for some solo practices it is the right one. What it also does is make the panel relationship theirs rather than yours, which matters if you later want to leave, and it changes the economics per session in a way worth calculating before signing rather than after.",
    ],
  },
  {
    id: "goes-wrong",
    heading: "What to do when a behavioral application stalls",
    paras: [
      "First, confirm you used the behavioral channel. An application sitting with the medical credentialing team at Optum, Cigna or Elevance is not going to be forwarded, and the number you called is the fastest thing to check. If it was the wrong one, resubmitting through the right channel is faster than escalating the wrong one.",
      "Second, check [the CAQH profile](/caqh-reattestation) for expired documents rather than for missing fields. A lapsed malpractice certificate blocks attestation while everything else looks complete, and an unattested profile stops all four of these payers without generating a message from any of them.",
      "Third, if the payer reported a data conflict, find out when. Carelon's seven-day correction window runs from the notification, not from when you noticed it, and the same principle applies wherever a payer sets a response deadline you did not know had started.",
    ],
  },
  {
    id: "limit",
    heading: "What this page cannot tell you",
    paras: [
      "No payer publishes acceptance rates, first-pass approval rates or how often a panel reopens, and no third-party source with transparent methodology exists for any of them. Anything you read that ranks payers by ease of credentialing is inference presented as data. What is public is process and contact information, which is what this page contains and where it stops.",
    ],
    // The copy places the /pricing link ("the three published plans") beside
    // the email box, since this limit section does not name Sokndall. The box
    // holds no paragraph of its own, so the link closes this section instead.
    after: ["[The three published plans](/pricing)"],
  },
];

export const TEMPLATE_HEADING = "A free tracker with one row per payer and a follow-up log";

export const FAQ = [
  {
    q: "What credential do you need for behavioral health?",
    a: "A state licence at the independent practice level for your discipline — LCSW, LPC, LMFT, licensed psychologist, or a psychiatric prescriber's licence — plus an NPI, malpractice coverage, and a CAQH Provider Data Portal profile. Payers set their own floor on licence type and several will not panel pre-licensed or associate-level clinicians at all, which is a question worth asking before applying rather than after.",
  },
  {
    q: "How to credential with Idaho behavioral health",
    a: "State Medicaid behavioral health programmes run through the state's contracted managed care organisation, and that contract changes periodically, so the correct starting point is the current Idaho Medicaid provider enrollment page rather than any third-party summary. For the commercial payers, Idaho is no different from anywhere else: Optum through Provider Express, Cigna through Evernorth, Carelon through Availity.",
  },
  {
    q: "How to request assistance for the credentialing process for behavioral health services",
    a: "Each payer has a behavioral-specific contact, and it is usually not the number on the general provider page. Optum is 877-614-0484 with BHSCredentialing@optum.com for groups. Evernorth is 1-800-926-2273 and BehavioralProviderRecruitment@evernorth.com. Carelon is 800-397-1630. Aetna uses 1-800-353-1232 with a behavioral option. Magellan is regional, by state.",
  },
  {
    q: "How to get credentialed with insurance companies for mental health",
    a: "Attest your CAQH profile, check that the panel is open for your licence type in your state, then apply through the behavioral channel rather than the medical one. Optum and Evernorth both recommend the availability check before the application. Expect 90 to 120 days for commercial payers, and confirm the effective date in writing when approval arrives, because that date is what determines billing.",
  },
  {
    q: "How do I contact Optum behavioral health provider credentialing?",
    a: "877-614-0484 is the behavioral health line, and it is a different number from the general UnitedHealthcare provider line. For group or organisational credentialing rather than an individual clinician, the email is BHSCredentialing@optum.com. Applications and status both live in Provider Express, which is Optum's behavioral portal and not the general UnitedHealthcare provider portal.",
  },
  {
    q: "How do I contact Carelon behavioral health provider credentialing?",
    a: "800-397-1630 is the National Provider Services Line, open Monday to Friday, 8am to 8pm Eastern. Carelon credentials through CAQH — you add Carelon Behavioral Health as an authorised organisation on your profile and keep the attestation current. Application status is tracked through Availity under submitted applications, rather than through a Carelon portal.",
  },
  {
    q: "Is Optum behavioral health credentialing different from Optum medical credentialing?",
    a: "Yes, and treating them as the same is a common source of delay. Behavioral health has its own phone line, its own portal in Provider Express, and its own network adequacy assessment by geography and specialty. An application submitted through the general medical channel does not get routed across. The same separation exists at Cigna, where behavioral is Evernorth, and at Elevance, where it is Carelon.",
  },
];

export const CLOSE = {
  href: "/credentialing-spreadsheet-template",
  label:
    "The free tracking template has a payer tab with a contact column, so the right number is recorded once instead of found again each time.",
};

export const RELATED = [
  {
    href: "/insurance-credentialing-for-therapists",
    title: "Insurance credentialing for therapists, start to finish",
    hook: "The timeline, closed panels, and why the effective date is the only date that pays.",
  },
  {
    href: "/caqh-reattestation",
    title: "CAQH reattestation and the 120-day rule",
    hook: "All four behavioral payers pull from the same profile. It expires on a calendar.",
  },
  {
    href: "/credentialing-services-for-therapists",
    title: "What credentialing services cost, and when they are worth it",
    hook: "Five payers at once is the case where paying someone starts to make sense.",
  },
];
