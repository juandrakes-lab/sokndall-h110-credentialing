// `/insurance-credentialing-for-therapists` — copy verbatim from
// H110_COPY_TANDA_C_EDITORIAL.md, "PÁGINA 5". New page on EditorialTemplate.
//
// Vocabulary: "paneling", not "enrollment" (voice-and-evidence.md §3.4). The
// one use of "primary source verification" on the site is here, describing
// what the payer does — not as a Sokndall value proposition.
import { source } from "@/components/neo/editorialRender";

export const META = {
  title: "Insurance Credentialing for Therapists: The Real Timeline",
  description:
    "How long paneling actually takes, how to tell whether a panel is closed before you apply, and why the effective date is the only date that lets you bill.",
};

export const HEADER = {
  title: "Getting paneled takes three to four months, and most of that is waiting on someone else",
  standfirst:
    "What happens between the day you submit and the day you can bill, why the approval date is not the date that matters, and how to find out whether a panel is closed before you spend a month finding out the slow way.",
  category: "Guide",
  date: "2026-09-08",
  readingTime: "11 min read",
  caption:
    "Paneling with a commercial payer runs 90 to 120 days on a clean application. The waiting is unstructured, and that is the part nobody prepares you for.",
};

export const CONTENTS = [
  { id: "timeline", label: "How long paneling takes" },
  { id: "closed-panels", label: "Closed panels, and how to find out first" },
  { id: "after-submit", label: "What happens after you submit" },
  { id: "effective-date", label: "The effective date is the billing date" },
  { id: "caqh", label: "CAQH is where most delays start" },
  { id: "goes-wrong", label: "When it goes wrong" },
  { id: "limit", label: "What a tracker does not fix" },
];

export const SECTIONS = [
  {
    id: "timeline",
    heading: "How long insurance paneling takes for a therapist",
    paras: [
      "Ninety to a hundred and twenty days per payer, per clinician, on an application with nothing wrong with it. [Aetna publishes 60 to 120 days](src:behaveHealth) depending on which of its documents you read, with 90 to 120 the range cited most often. [Optum quotes roughly 60 to 90 days](src:behaveHealth) from the point it receives a complete application. [Evernorth says up to 90 days](src:evernorth) from a complete submission.",
      "Those are the numbers the payers put in writing. What they describe is the processing window after everything is correct, which is not the same as the calendar time between deciding to get paneled and being able to bill. The gap between the two is made of documents that were not requested, a CAQH profile that was not attested, and a queue nobody told you about.",
    ],
    figure: { value: "90 to 120 days", source: "behaveHealth", label: "Aetna, via BehaveHealth" },
  },
  {
    id: "closed-panels",
    heading: "How to tell a panel is closed before you apply",
    paras: [
      "[Optum evaluates network need by geographic area and specialty](src:behaveHealth) before it accepts new providers, and it says so in its own documentation. That is the mechanism behind a closed panel: it is not a judgement about you, it is an arithmetic decision about how many clinicians of your license type already contract in your county. Optum recommends checking network availability in Provider Express before applying.",
      "[Evernorth gives the same advice](src:evernorth) in a different form: call before you apply to confirm the network is accepting your license type in your state. Two of the largest behavioral payers both tell you, in public, that the first step is a availability check rather than an application. Almost nobody does it, which is why a closed panel usually announces itself as three months of silence.",
      "A closed panel is also not permanent. Networks reopen when a county loses clinicians or when a plan wins a contract that changes its adequacy math. The practical consequence is that a decline is worth re-checking in six months rather than treating as final, and worth recording with a date so that someone remembers to re-check it.",
    ],
  },
  {
    id: "after-submit",
    heading: "What happens between submission and an answer",
    paras: [
      "Primary source verification runs first: the payer checks your license with the state board, your malpractice coverage with the carrier, your education with the institution, and your name against the federal exclusion lists. None of that involves you, and none of it generates an update you can see. It is also where an out-of-date CAQH profile stops the whole thing without anyone saying so.",
      "Contracting runs second, and it is a separate stage with separate people. A file that has cleared verification can sit in contracting for weeks. When you call and are told the application is in process, that phrase covers both stages and tells you nothing about which one. Asking which of the two it is in is the single most useful question in a follow-up call.",
    ],
  },
  {
    id: "effective-date",
    heading: "Why the effective date is the only date that pays",
    paras: [
      "[With Aetna, the in-network effective date is the date the contract is fully executed](src:clinicalDocsAetna). Not the date you submitted, not the date someone told you it was approved. Bill for sessions before that date and they process out of network or not at all, and the client gets a bill they were not expecting for work you already did.",
      "Some payers backdate and some do not, and which one you are dealing with is not something you can find out reliably in advance. What you can do is get the effective date in writing at the moment of approval, ask directly whether claims before it can be submitted, and record both answers against that payer. That question, asked once per panel, is worth more than any amount of process knowledge.",
    ],
  },
  {
    id: "caqh",
    heading: "Where most paneling delays actually start",
    paras: [
      "Aetna, Optum, Evernorth and Carelon all pull your profile from the CAQH Provider Data Portal, and all four require it complete and attested before they will act. The profile has to be [re-attested every 120 days](/caqh-reattestation) whether or not anything in it has changed, because the clock is the calendar rather than a data change.",
      "An expired document inside the profile blocks attestation even when everything else is current. A malpractice certificate that ran out last month will stop you attesting today, which turns a five-minute task into a scramble for a document from a carrier who is not in a hurry. Checking document expiry dates before opening the attestation is the whole trick.",
    ],
    svo: {
      caption: "What the payers publish, next to what the process actually takes",
      stated: [
        {
          text: "Optum: roughly 60 to 90 days from receipt of a complete application",
          source: source("behaveHealth", "Optum, via BehaveHealth"),
        },
        {
          text: "Evernorth: up to 90 days from a complete submission",
          source: source("evernorth", "Evernorth behavioral provider resource library"),
        },
      ],
      observed: [
        {
          figure: "90 to 120 days",
          text: "Aetna's own documentation puts commercial behavioral paneling at 60 to 120 days, with 90 to 120 the range cited most.",
        },
        {
          figure: "+120 days",
          text: "Neither figure starts counting until the application is complete, and completeness is judged by the payer after you submit.",
        },
      ],
      note: "The stated column is what each payer publishes. The observed column is the range across published sources, not a measurement of any one practice's experience.",
    },
  },
  {
    id: "goes-wrong",
    heading: "What to do when nothing has happened in six weeks",
    paras: [
      "Call and ask which stage the file is in: verification or contracting. Those are different departments and the answer changes what you do next. If it is verification, something in the profile is probably wrong or expired. If it is contracting, there is a queue and a person, and asking for the name of that person is reasonable.",
      "Ask for a reference number for the call and write down who you spoke to. When a payer later says the application was never received, that log is the only thing that settles it. [Carelon gives you seven calendar days](src:carelonJoin) to correct in writing any information a third party reported that conflicts with what you declared, which is a deadline you cannot meet if you did not know the notification arrived.",
      "If the answer is that the panel is closed, ask when the network last reviewed adequacy for your specialty in your county, and put a date six months out to ask again. A closed panel that is recorded with a date is a lead. A closed panel that is remembered vaguely is a dead end.",
    ],
  },
  {
    id: "limit",
    heading: "What a tracking tool does not fix here",
    paras: [
      "None of this gets faster because you tracked it. Sokndall does not submit an application, does not call a payer, does not verify a licence with a board, and cannot open a closed panel. What it does is hold the effective date, the reference number, the name of the person you spoke to, and the count of days since anyone last checked. The waiting is the same length. It is just no longer invisible.",
    ],
    // The copy's /pricing link, with its specified anchor (on-page-seo.md §6).
    // The phrase is not in the approved paragraph, so it closes the section on
    // its own line rather than being forced into the sentence.
    after: ["[The three published plans](/pricing)"],
  },
];

export const TEMPLATE_HEADING = "The free tracking template, built for one clinician or forty";

export const FAQ = [
  {
    q: "How to get credentialed with insurance companies",
    a: "Build and attest a CAQH Provider Data Portal profile first, because every major payer pulls from it. Then check network availability with each payer before applying, since a closed panel wastes months. Then submit through that payer's own channel — Provider Express for Optum, Evernorth's own form for Cigna, Availity for Carelon. Then follow up on a schedule rather than waiting for news that will not arrive.",
  },
  {
    q: "How do I get credentialed with insurance companies?",
    a: "The sequence is the same for every payer: attested CAQH profile, availability check, application through that payer's channel, then scheduled follow-up. What varies is the channel and the phone number, and behavioral health frequently uses a different one from the medical line at the same company. Getting the right channel on the first attempt removes weeks that never show up as a delay anywhere.",
  },
  {
    q: "How to get credentialed with insurance as a therapist",
    a: "Nothing about the process is specific to therapists except which entity handles you. Optum routes behavioral health through Provider Express, Cigna through Evernorth Behavioral Health, and Carelon operates as its own company. Using the general medical credentialing line at those companies is the most common avoidable delay in the whole process, and it produces silence rather than a redirect.",
  },
  {
    q: "How to get paneled with insurance as a therapist",
    a: "Paneling and credentialing describe the same process from different angles: credentialing is the payer verifying you, paneling is you joining their network and becoming billable. Check the panel is open, attest your CAQH profile, apply through the behavioral channel, and confirm the effective date in writing when the answer comes. Ninety to a hundred and twenty days is the working expectation.",
  },
  {
    q: "How long does insurance credentialing take for therapists?",
    a: "Ninety to a hundred and twenty days for commercial payers on a clean application. Optum publishes roughly 60 to 90 days from receipt of a complete file; Evernorth says up to 90; Aetna's documentation ranges from 60 to 120. All of those clocks start when the payer judges the application complete, which is why the calendar time from your side is reliably longer than the published figure.",
  },
  {
    q: "What is the cost of credentialing with insurance companies?",
    a: "Doing it yourself costs time rather than money — the CAQH Provider Data Portal is free to providers. Handing it to a service runs [$1,500 to $5,000 per provider](src:medicotech) for initial submissions across core payers, and $600 to $2,400 per provider per year to maintain afterwards. For a solo practice adding two or three panels, that is the real decision: several unpaid evenings, or roughly a month of one client's sessions.",
  },
  {
    q: "Which insurer makes it easiest for providers to get credentialed?",
    a: "No payer publishes a comparable success rate, so anyone ranking them is guessing. What is public is process: Optum tells you to check network availability first, Evernorth tells you to call before applying, and Carelon routes status through Availity rather than its own portal. Magellan is the outlier — it has no single national credentialing line, and the contact is regional by state.",
  },
  {
    q: "Does SimplePractice help with credentialing?",
    a: "SimplePractice is practice management software — scheduling, notes, billing — and it is a good version of that. It is not a credentialing tracker, and it does not submit applications or panel you with anyone. Several products that rank for credentialing questions are in the same position: they wrote a blog post about the subject because their customers ask, not because the product covers it.",
  },
  {
    q: "What is the easiest way for therapists to become credentialed?",
    a: "Doing the availability check before the application, and attesting the CAQH profile before either. Those two steps take an afternoon and remove the two most common causes of a file sitting for months. After that the process is not hard, it is long, and the only real skill is following up on a schedule instead of waiting for a payer to tell you something.",
  },
];

export const CLOSE = {
  href: "/credentialing-spreadsheet-template",
  label: "The free credentialing tracking template has a tab for paneling, with a follow-up log and a days-since column.",
};

export const RELATED = [
  {
    href: "/behavioral-health-credentialing",
    title: "Behavioral health credentialing, payer by payer",
    hook: "Optum, Evernorth, Carelon, Aetna and Magellan, with the number that reaches each.",
  },
  {
    href: "/caqh-reattestation",
    title: "CAQH reattestation and the 120-day rule",
    hook: "Why a lapsed profile breaks nothing visibly, and stalls everything underneath.",
  },
  {
    href: "/credentialing-services-for-therapists",
    title: "What credentialing services cost, and when they are worth it",
    hook: "The honest version: three situations where paying someone is the right call.",
  },
];
