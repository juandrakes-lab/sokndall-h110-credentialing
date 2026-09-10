// `/credentialing-services-for-therapists` — copy verbatim from
// H110_COPY_TANDA_C_EDITORIAL.md, "PÁGINA 15". New page on EditorialTemplate.
//
// UNDER A MEASUREMENT GATE (architecture v3.1 §3, §8): service intent, the one
// controlled exception to exclusiones.md §3. If at 90 days its conversion to
// trial or template is below the average of pages 5 and 6, it is unpublished
// and the pattern is not replicated. The premise is mandatory: answer
// honestly when hiring a service is the right call — so the three situations
// where it is come first in the body, not as a paragraph at the end.

export const META = {
  title: "Therapist Credentialing Services: Cost and When to Use One",
  description:
    "What credentialing services cost for a therapy practice, the three situations where paying for one is the right call, and the case for doing it yourself.",
};

export const HEADER = {
  title: "Credentialing services cost $1,500 to $5,000 a clinician, and sometimes that is the right price",
  standfirst:
    "What a credentialing service charges, what it takes off your desk, and the three situations where hiring one is the correct decision rather than the expensive one. Also the case for not hiring one, which is shorter.",
  category: "Guide",
  date: "2026-09-08",
  readingTime: "8 min read",
  caption:
    "Initial outsourcing runs $1,500 to $5,000 per clinician across core payers, and $600 to $2,400 per clinician per year to maintain afterwards.",
};

export const CONTENTS = [
  { id: "cost", label: "What services cost" },
  { id: "when-right", label: "When hiring one is right" },
  { id: "when-not", label: "When it is not" },
  { id: "cannot-do", label: "What a service cannot do either" },
  { id: "questions", label: "Questions to ask before signing" },
  { id: "goes-wrong", label: "When it goes wrong" },
];

export const SECTIONS = [
  {
    id: "cost",
    heading: "What credentialing services actually cost",
    paras: [
      "[Initial outsourcing across core payers runs $1,500 to $5,000 per clinician. Ongoing maintenance — recredentialing cycles, CAQH upkeep, revalidation — runs $600 to $2,400 per clinician per year](src:medicotech). Both figures are published by independent sources and both are per provider rather than per practice, which matters the moment you have more than one clinician.",
      "For a solo therapist adding three panels, the initial figure is roughly a month of one client's weekly sessions. For a group of six, it is a genuine budget line. Neither number is unreasonable for the work involved, and neither is a bargain. What they buy is somebody else making the phone calls.",
    ],
    figure: { value: "$1,500 to $5,000 per provider", source: "medicotech", label: "Medicotech, 2026" },
  },
  {
    id: "when-right",
    heading: "Three situations where a service is the right call",
    paras: [
      "You are opening with multiple payers at once. Five panels started simultaneously is five availability checks, five channels, five follow-up schedules and five effective dates, in a period when you are also seeing clients and setting up a practice. This is the case where a service earns its fee outright, and it is the most common good reason to hire one.",
      "You are adding clinicians on a schedule. A group hiring two or three people a year has a recurring process rather than a project, and it either needs a person whose job includes this or an outside team. Doing it in the evenings works until the third hire and then stops working, usually at the worst moment.",
      "Something has already gone wrong and you do not know where. A stalled application, a denied panel, an effective date that does not match what you were told — untangling that is a specific skill and it is worth paying for once, even if you handle everything else yourself afterwards.",
    ],
  },
  {
    id: "when-not",
    heading: "When paying for a service is the expensive answer",
    paras: [
      "One clinician adding one or two panels, with time to make a phone call every fortnight, does not need one. The process is long rather than difficult, and the skill it demands is following up on a schedule rather than expertise. Paying $1,500 to have someone else attest a CAQH profile and submit two forms is buying back evenings, which is a legitimate purchase but should be understood as what it is.",
    ],
  },
  {
    id: "cannot-do",
    heading: "What a credentialing service cannot do either",
    paras: [
      "It cannot open a closed panel. [Optum evaluates network need by geography and specialty before accepting anyone](src:behaveHealth), and no vendor relationship changes that arithmetic. A service that implies otherwise is selling something it does not control.",
      "It cannot make a payer move faster. Ninety to a hundred and twenty days is the processing window and it applies equally to an application submitted by a specialist and one submitted by you. What a service reduces is the number of applications that are wrong on arrival, which is a real saving and a different claim.",
      "It also does not remove your responsibility for the record. The CAQH profile is yours, the licence expiry dates are yours, and if the relationship ends you need to know where everything stood. A practice that outsourced for three years and cannot answer what its effective dates are has bought less than it thinks.",
    ],
  },
  {
    id: "questions",
    heading: "Questions worth asking before you sign anything",
    paras: [
      "Is the fee per clinician or per practice, and does it change when you add someone? Both figures published for this category are per provider, so a quote that sounds like a practice rate is either mispriced or scoped more narrowly than you think.",
      "What happens after the initial submissions — is maintenance included, extra, or not offered? Initial and ongoing are separately priced in every published range, and the second one is where a relationship either continues sensibly or quietly lapses.",
      "Who owns the CAQH profile login, and what do you get if you leave? A service that holds the credentials and hands back nothing has made leaving expensive in a way that never appears in the quote.",
      "What do they report, and how often? A monthly list of application statuses with dates is the minimum that lets you tell whether anything is happening. Its absence is the single most common complaint about this category.",
    ],
  },
  {
    id: "goes-wrong",
    heading: "What to do when the service is not delivering",
    paras: [
      "Ask for the confirmation numbers and the dates of the last contact with each payer. Those exist or they do not, and the answer tells you more than any status update. A service that cannot produce them for a specific application has not been following up on it.",
      "Check your own CAQH profile directly. It is your login and your profile, and its attestation date is visible to you without anyone's permission. An expired attestation while paying for maintenance is a concrete failure rather than a matter of interpretation.",
      "Before ending the relationship, get every effective date, every payer provider ID, and every reference number out in writing. Reconstructing that afterwards is far harder than requesting it while somebody is still contractually obliged to answer.",
    ],
  },
  {
    id: "limit",
    heading: "The obvious conflict of interest on this page",
    paras: [
      "This page is published by a company selling a $79-a-month tracking tool, which is a different purchase from a $3,000 service and not a substitute for it. A tracker does not make phone calls or submit applications. If what you need is somebody to do the work, buy that. The reason this page exists is that plenty of practices buy a service when what they were missing was a record of what had been done.",
    ],
    after: ["[The three published plans](/pricing)"],
  },
];

export const TEMPLATE_HEADING = "The free tracker, whether you hire someone or not";

export const FAQ = [
  {
    q: "How much do credentialing services cost?",
    a: "Initial outsourcing across core payers runs [$1,500 to $5,000 per clinician](src:medicotech). Ongoing maintenance afterwards runs $600 to $2,400 per clinician per year. Both are per provider rather than per practice, so a group of five is looking at five times those figures rather than a shared rate. Ask which of the two a quote covers, because the distinction is not always volunteered.",
  },
  {
    q: "What is the cost of credentialing with insurance companies?",
    a: "Nothing, if you do it yourself — the CAQH Provider Data Portal is free to providers and payers do not charge to process an application. The cost is time: an hour and a half to two hours to build the profile, then a follow-up call every fortnight per payer for three to four months. Paying someone else to absorb that runs $1,500 to $5,000 per clinician.",
  },
  {
    q: "Are credentialing services worth it?",
    a: "For a solo clinician adding one or two panels, usually not — the process is long rather than difficult. For someone opening with five payers at once, for a group adding clinicians on a schedule, or for untangling an application that has already gone wrong, they frequently are. The fee buys phone calls and attention, not speed: the payer's processing window is the same either way.",
  },
  {
    q: "What is the difference between a credentialing service and credentialing software?",
    a: "A service does the work — submits applications, follows up with payers, maintains profiles — and is priced per provider in the hundreds or thousands. Software holds the records and tells you what is due, and is priced at a fraction of that because it replaces a spreadsheet rather than a person. They are complements more often than alternatives, and buying the wrong one is common.",
  },
  {
    q: "Can I do my own insurance credentialing?",
    a: "Yes, and most solo practices do. You need an attested CAQH profile, the patience to check network availability before applying, and a system for following up every fortnight for three to four months per payer. None of that requires expertise. It requires that somebody remembers to do it on a schedule, which is the part that fails.",
  },
];

export const CLOSE = {
  href: "/credentialing-spreadsheet-template",
  label: "The free tracking template works the same whether you are doing this yourself or checking on someone you hired.",
};

export const RELATED = [
  {
    href: "/insurance-credentialing-for-therapists",
    title: "Insurance credentialing for therapists, start to finish",
    hook: "The timeline, closed panels, and why the effective date is the only date that pays.",
  },
  {
    href: "/behavioral-health-credentialing",
    title: "Behavioral health credentialing, payer by payer",
    hook: "The contact and process for each major payer, if you decide to do it yourself.",
  },
  {
    href: "/credentialing-spreadsheet-template",
    title: "The free credentialing spreadsheet template",
    hook: "Six tabs with the formulas already written. No account, one email address.",
  },
];
