/**
 * Real content for every /styleguide demo — pulled verbatim (or lightly
 * trimmed) from H110_COPY_COMPLETO.md and H110_ARQUITECTURA_v3.md. No lorem,
 * no "Feature One". Where the source rendered something as bare bullets and a
 * component needs a paired field, the added half is drawn from adjacent copy
 * and flagged in NOTAS_STYLEGUIDE.md.
 */

// ── 3.1 ──────────────────────────────────────────────────────────────────
export const HERO = {
  title:
    "The credentialing tracker that tells you which applications went quiet. No demo call to find out what it costs.",
  subhead:
    "Sokndall tracks the credentials that expire and the payer applications that go quiet, for practices and billing companies with 1 to 50 providers.",
  primary: { label: "Start 14-day trial", href: "/pricing" },
  secondary: { label: "See all three plans", href: "/pricing" },
  microcopy: "No sales call. No quote request. No onboarding fee.",
};

export const PAGE_HEADER_EDITORIAL = {
  title: "CAQH reattestation: how the 120-day cycle works, and how the date gets lost",
  subhead:
    "Every 120 days, forever, for as long as you bill insurance. Here is how to find your next date, what happens when it passes, and why this is the deadline that most often goes unnoticed.",
  meta: ["Guide", "8 min read"],
};

export const PAGE_HEADER_COMPARISON = {
  title: "symplr pricing: what is public, what is not, and what it costs to find out",
  subhead:
    "symplr does not publish prices. Here is what can be verified, what has to be estimated, and what a smaller alternative costs — which is $79 to $699 a month, published.",
};

export const TOC = [
  { id: "sg-toc-1", label: "What reattestation is" },
  { id: "sg-toc-2", label: "Why the cadence confuses everyone" },
  { id: "sg-toc-3", label: "What happens when the date passes" },
  { id: "sg-toc-4", label: "How to calculate your next date" },
  { id: "sg-toc-5", label: "The trap: a document inside the profile expires" },
  { id: "sg-toc-6", label: "Why the date gets lost when tracked by hand" },
  { id: "sg-toc-7", label: "How a tracker handles this" },
];

// ── 3.2 ──────────────────────────────────────────────────────────────────
export const PROSE = {
  heading: "Credentialing software for practices that never had a credentialing department",
  paragraphs: [
    "The platforms built for health systems assume a credentialing committee, delegated authority, and someone whose entire job this is. You have a front-office lead who also handles this, a spreadsheet someone rebuilt last year, and a reminder that may or may not still be set.",
    "Sokndall is built for that. One provider or fifty. One person, or a small team, keeping track of what expires and what is still sitting at a payer.",
  ],
};

export const LABELLED = {
  heading: "The five cycles you are actually tracking",
  items: [
    {
      label: "State license",
      body: "One row per state a provider practices in. A multi-state telehealth panel means five or six separate dates, not one.",
    },
    {
      label: "DEA registration",
      body: "Three-year cycle, usually processed fast — until it isn't. One provider's renewal sat pending for a month with no way to speed it up.",
    },
    {
      label: "Malpractice (COI)",
      body: "Usually the quiet one: an expired policy inside a CAQH profile blocks the whole attestation, not just the malpractice line.",
    },
    {
      label: "Board certification",
      body: "Multi-year cycles mean it is easy to forget, and a lapse can affect hospital privileges and payer status at once.",
    },
    {
      label: "CAQH attestation",
      body: "Every 120 days is the clock. Miss it and payer records stop matching yours, and claims start bouncing for no obvious reason.",
    },
  ],
};

export const NUMBERED = {
  heading: "The stages, and where the time goes",
  steps: [
    { name: "Preparation", duration: "Days", body: "Documents, CAQH attested, payer authorized to view the profile." },
    { name: "Submission", duration: "An afternoon", body: "Through the payer portal, CAQH, PECOS, a clearinghouse, or a delegated roster." },
    { name: "Acknowledgement", duration: "Days to weeks", body: "The payer confirms receipt — and sometimes not at all unless you ask." },
    { name: "Verification and review", duration: "Weeks to months", body: "The long one. Almost entirely invisible from your side." },
    { name: "Contracting", duration: "Varies", body: "Some payers contract early and some at the end, so receiving one is not a reliable signal of progress." },
    { name: "Effective date and loading", duration: "Days", body: "Approval and being loaded into the claims system are two different events, and claims can reject in the gap between them." },
  ],
};

export const NEGATION = {
  heading: "What Sokndall does not do",
  intro: "Being clear now saves you a trial you were going to cancel.",
  items: [
    {
      claim: "No primary source verification.",
      explanation: "It does not query license boards for you. You verify; it records what you verified and when.",
    },
    {
      claim: "No connection to CAQH (DataSpring), PECOS or payer portals.",
      explanation: "You still work in the portals. Sokndall holds the dates, statuses and reference numbers the portals will not keep for you.",
    },
    {
      claim: "No patient data.",
      explanation: "No PHI enters the system — no BAA to negotiate, no security review to schedule before you can try it.",
    },
    {
      claim: "It does not do the work.",
      explanation: "It organizes the person doing it.",
    },
  ],
  closing:
    "Need someone to submit applications for you? That is a credentialing service, and it costs several times this. Sokndall is for the person already doing the work and losing track of it.",
};

export const DOCUMENTS = {
  heading: "The document list",
  items: [
    { doc: "State license", note: "For every state the provider will practice in, including telehealth states." },
    { doc: "DEA registration", note: "Plus any state controlled substance registration." },
    { doc: "NPI", note: "Individual (Type 1), and the group's (Type 2) if enrolling into a group." },
    { doc: "W-9", note: "With the exact legal name and TIN the group uses." },
    { doc: "Malpractice COI", note: "Current, with coverage limits meeting each payer's minimum." },
    { doc: "CAQH profile", note: "Complete and attested within the last 120 days, with every payer authorized to view it." },
    { doc: "Board certification", note: "Where the specialty or payer requires it." },
    { doc: "Work history", note: "Continuous, with gaps explained — most payers ask for five years." },
    { doc: "Government-issued ID", note: "And, where required, a signed attestation and release." },
    { doc: "Hospital privileges", note: "Or an admitting arrangement, where the payer or specialty requires one." },
  ],
};

export const ERRORS = {
  heading: "What sends you back to the start",
  items: [
    {
      error: "Legal name inconsistent between the individual record and the group record",
      consequence: "The application is returned for development rather than moved forward for review.",
    },
    {
      error: "Individual NPI where the group NPI belongs",
      consequence: "Claims process out-of-network until the loaded record is corrected — sometimes months later.",
    },
    {
      error: "An EIN change without resubmitting",
      consequence: "Enrollment generally has to be resubmitted to every payer, one at a time.",
    },
    {
      error: "A practice location in the application that does not match the one on file",
      consequence: "The application sits in review with no error surfaced on your side.",
    },
    {
      error: "Banking information for EFT that does not match the group record",
      consequence: "Approved funds stay held until the banking record matches — the last blocker after everything else clears.",
    },
  ],
};

// ── 3.3 ──────────────────────────────────────────────────────────────────
export const SOURCED_FIGURE = {
  // Rendered as a paragraph in the styleguide with two inline SourcedFigure spans.
  before: "Enrollment runs ",
  fig1: "60 to 120 days per provider per payer on a good day",
  src1: { label: "Aetna provider FAQ", href: "https://www.aetna.com/health-care-professionals/join-the-aetna-network.html" },
  mid: ", and much longer when something goes sideways. MedTrainer's own blog puts category cost at ",
  fig2: "$20 to $50 per user per month",
  src2: { label: "medtrainer.com", href: "https://www.medtrainer.com/blog/credentialing-software-cost/" },
  after: " — which for fifteen people is $3,600 to $9,000 a year.",
};

export const PRICE_ANCHOR = {
  heading: "What this costs next to what you already pay to stay credentialed",
  claim:
    "Ongoing maintenance done for you — reattestation on the CAQH clock, recredentialing every two to three years, license and DEA renewals, roster updates.",
  figure: "$600 to $2,400",
  unit: "per provider per year (maintenance done for you, not per staff seat)",
  source: { label: "published industry ranges", href: "https://www.medtrainer.com/blog/credentialing-software-cost/" },
  calculation:
    "Outsourced maintenance for fifteen providers starts around $750 a month at the low end of the published range. Practice is $299 for the same fifteen — $19.93 per provider.",
};

export const PRICING_DISCLOSURE = {
  heading: "What is publicly known",
  lead:
    "symplr does not list prices for symplr Provider or any other module on its site. Pricing is quoted after a demo request, and terms are typically annual, negotiated per organization by module count, seat count and scope.",
  claims: [
    {
      text: "There is no reliable published figure to cite, from symplr or from independent sources — and that absence is the actual finding.",
      noSource: "No public figure — a category where the entry price cannot be known without a sales call is a category built around one.",
    },
    {
      text: "Pricing is configured per customer — which modules, how many seats, what integrations — closer to how a hospital buys an EHR than how a small practice buys a subscription.",
      source: { label: "symplr.com", href: "https://www.symplr.com/", rel: "noopener nofollow" },
    },
  ],
};

export const GOOD_FIT = {
  heading: "Who symplr is right for, and what that looks like day to day",
  paragraphs: [
    "A credentialing committee is a standing group, often physicians and administrators, that meets on a schedule to review and vote on each provider's file before they can practice or bill. If your organization runs one, or is required to by an accrediting body, you need software built around that workflow: routing files for review, tracking votes, keeping minutes tied to each provider's record.",
    "Privileging is a related but separate need — delineated lists of specific procedures each provider is approved to perform, routed to department chairs for sign-off. A practice that credentials providers to bill payers does not have this need; a hospital does, structurally, regardless of size.",
    "If any of that describes your organization, this comparison will not change your mind, and it should not.",
  ],
};

export const STATED_OBSERVED = {
  heading: "Stated timeline and observed timeline",
  stated:
    "Aetna's own materials describe credentialing as commonly running 60 to 90 days once a complete packet is received, on top of the up-to-45-day network-need review before that.",
  statedSource: {
    label: "aetna.com",
    href: "https://www.aetna.com/health-care-professionals/join-the-aetna-network.html",
  },
  observed: [
    {
      text: "Independent guides describing the full path — network review, contracting, credentialing, effective date — put the realistic total closer to 90 to 180 days end to end.",
      figure: "90–180 days",
    },
    {
      text: "Correcting an error on Aetna's side, once something is wrong, has taken one practice two months of sustained effort — a written escalation to every fax number, email address, PO box and portal contact they could find.",
      figure: "~2 months",
    },
  ],
};

// ── 3.4 ──────────────────────────────────────────────────────────────────
export const MATRIX = {
  heading: "The screen this is really about",
  note:
    "Providers down the side, payers across the top. One cell per pair, marked by status, showing days since last follow-up. The few that are stuck are visible in one look.",
  providers: ["Alvarez, R.", "Chen, M.", "Okafor, T.", "Bianchi, L.", "Reyes, D."],
  payers: ["Aetna", "BCBS", "Cigna", "UHC", "Medicare"],
  cells: {
    "Alvarez, R.|Aetna": { k: "approved", days: 0 },
    "Alvarez, R.|BCBS": { k: "review", days: 12 },
    "Alvarez, R.|Cigna": { k: "action", days: 3 },
    "Alvarez, R.|UHC": { k: "review", days: 9 },
    "Alvarez, R.|Medicare": { k: "approved", days: 0 },
    "Chen, M.|Aetna": { k: "review", days: 21 },
    "Chen, M.|BCBS": { k: "submitted", days: 6 },
    "Chen, M.|Cigna": { k: "quiet", days: 34 },
    "Chen, M.|UHC": { k: "approved", days: 0 },
    "Chen, M.|Medicare": { k: "review", days: 14 },
    "Okafor, T.|Aetna": { k: "approved", days: 0 },
    "Okafor, T.|BCBS": { k: "review", days: 8 },
    "Okafor, T.|Cigna": { k: "submitted", days: 4 },
    "Okafor, T.|UHC": { k: "none" },
    "Okafor, T.|Medicare": { k: "approved", days: 0 },
    "Bianchi, L.|Aetna": { k: "review", days: 18 },
    "Bianchi, L.|BCBS": { k: "action", days: 2 },
    "Bianchi, L.|Cigna": { k: "review", days: 11 },
    "Bianchi, L.|UHC": { k: "review", days: 7 },
    "Bianchi, L.|Medicare": { k: "submitted", days: 5 },
    "Reyes, D.|Aetna": { k: "approved", days: 0 },
    "Reyes, D.|BCBS": { k: "approved", days: 0 },
    "Reyes, D.|Cigna": { k: "review", days: 16 },
    "Reyes, D.|UHC": { k: "none" },
    "Reyes, D.|Medicare": { k: "approved", days: 0 },
  },
};

export const STATUS_TABLE = {
  heading: "Six statuses, and only one of them is your problem right now",
  rows: [
    { status: "Not started", shape: "·", count: "02", meaning: "Provider is on the roster, application is not in.", do: "Gather documents, confirm the CAQH profile is attested." },
    { status: "Submitted", shape: "◇", count: "03", meaning: "It went in, nobody has looked at it.", do: "Wait out the payer's stated window." },
    { status: "In review", shape: "●", count: "11", meaning: "Someone at the payer has it.", do: "Follow up on a schedule, not on a feeling." },
    { status: "Info requested", shape: "◆", count: "02", meaning: "The payer is waiting on you.", do: "Clear it today. This is the expensive one.", emphasis: true, action: true },
    { status: "Approved", shape: "✓", count: "27", meaning: "You have an effective date.", do: "Confirm the date, check whether you can backdate claims." },
    { status: "Denied / Withdrawn", shape: "×", count: "01", meaning: "It is over for now.", do: "Record why. It matters when you reapply." },
  ],
};

export const ALERT_LADDER = {
  heading: "90, 60, 30, 14, 7",
  steps: [
    { day: "90", label: "It is on the radar", body: "Nothing to do yet." },
    { day: "60", label: "Start the renewal this week", body: "State boards are not fast." },
    { day: "30", label: "The renewal should already be submitted", body: "If it is not, this is now the priority." },
    { day: "14", label: "This is urgent", body: "Someone specific owns it.", action: true },
    { day: "7", label: "Escalate", body: "The responsible person and their manager both hear about it.", action: true },
  ],
};

export const FAILURE = {
  heading: "The NPI mismatch",
  mechanism:
    "A group practice enrolls, and the individual NPI (Type 1) ends up loaded where the group NPI (Type 2) belongs, or the record ties to a combination that does not reflect the group. On your side, everything looks approved.",
  symptom:
    "Claims process out-of-network. Providers in this situation have collected out-of-network payments and lost revenue for the entire period it took to correct — and reaching a human at provider services takes repeated attempts.",
  catchEarly:
    "As soon as you have an effective date, check benefits in the portal using each NPI/TIN combination you would actually bill under. If only one returns anything, or it is not the one you bill with, the record is loaded wrong. Raise it in writing and keep the reference number.",
};

// ── 3.5 ──────────────────────────────────────────────────────────────────
export const PRICING_TABLE = {
  heading: "The whole price list",
  rows: [
    { name: "Solo", price: "$79", period: "/mo", providers: "up to 3 providers" },
    { name: "Practice", price: "$299", period: "/mo", providers: "up to 15 providers", middle: true },
    { name: "Billing Co", price: "$699", period: "/mo", providers: "up to 50 across clients" },
  ],
  cta: { label: "Start 14-day trial", href: "/pricing" },
};

export const PLAN_CARDS = {
  heading: "Three plans, three prices, no quote process",
  plans: [
    {
      name: "Solo",
      price: "$79",
      period: "/mo",
      perProvider: "$26.33",
      providerLimit: "Up to 3 providers",
      userLimit: "1 user",
      features: ["All credential tracking", "All payer enrollment tracking", "Weekly digest"],
      cta: { label: "Start 14-day trial", href: "/pricing" },
    },
    {
      name: "Practice",
      price: "$299",
      period: "/mo",
      perProvider: "$19.93",
      label: "Most complete for a group practice",
      providerLimit: "Up to 15 providers",
      userLimit: "Up to 3 users",
      features: ["Everything in Solo", "Spreadsheet import with preview"],
      cta: { label: "Start 14-day trial", href: "/pricing" },
    },
    {
      name: "Billing Co",
      price: "$699",
      period: "/mo",
      perProvider: "$13.98",
      providerLimit: "Up to 50 providers across all clients",
      userLimit: "Up to 10 users, scoped to assigned clients",
      features: ["Everything in Practice", "Separate client organizations", "One aggregate weekly view"],
      cta: { label: "Start 14-day trial", href: "/pricing" },
    },
  ],
};

export const TRIAL_TERMS = {
  heading: "How the trial works",
  items: [
    { label: "14 days, full product.", body: "Every feature, from day one — nothing held back for the trial." },
    { label: "Card up front.", body: "So you are not re-entering it when the trial ends and you decide to stay." },
    { label: "Cancel from Settings.", body: "Self-serve, no email required. The card is charged on day 15 if you do not." },
  ],
};

export const DUAL_CTA = {
  primary: { label: "Download the free credentialing template", href: "/credentialing-spreadsheet-template" },
  secondary: { label: "See what the automated version costs", href: "/pricing" },
  note: "The template does the same calculations. It just will not email you.",
};

export const EMAIL_CAPTURE = {
  heading: "A credentialing spreadsheet template that already has the formulas in it",
  buttonLabel: "Email me the template",
  microcopy:
    "One email with the file. We send a few things about credentialing after that, and one click unsubscribes.",
};

// ── 3.6 ──────────────────────────────────────────────────────────────────
export const FAQ = {
  heading: "Before you type your card number",
  items: [
    {
      q: "Do I have to talk to anyone to buy this?",
      a: "No. Pick a plan, enter a card, you are in. No demo, no quote, no onboarding call.",
    },
    {
      q: "What happens on day 15?",
      a: "The card is charged at the plan price. Cancel before then and it is not.",
    },
    {
      q: "Is my patient data safe in this?",
      a: "There is no patient data in it. Provider credentials and enrollment records only. No PHI, no BAA required.",
    },
    {
      q: "We already have a spreadsheet. Why change?",
      a: "Below roughly 40 provider-payer pairs, you may not need to. Past that the sheet stops being a tracker and becomes something you have to remember to read.",
    },
    {
      q: "Does this work for behavioral health, therapy, or allied health?",
      a: "Yes. Anyone who credentials with payers — therapists, BCBAs, dietitians, PTs, NPs, chiropractors — tracks the same things: licenses, CAQH, malpractice, and one application per payer.",
    },
    {
      q: "What if I go over my provider limit?",
      a: "You move up a plan. Nothing is locked or deleted while you decide.",
    },
  ],
};

export const RELATED = {
  heading: "Related guides",
  items: [
    {
      href: "/caqh-reattestation",
      title: "CAQH reattestation: the 120-day cycle",
      blurb: "How to find your next date and what happens when it passes.",
    },
    {
      href: "/provider-credentialing-checklist",
      title: "Provider credentialing checklist",
      blurb: "What every payer asks for, and the mismatches that restart the process.",
    },
    {
      href: "/payer-enrollment-software",
      title: "Payer enrollment software",
      blurb: "The six statuses of an application and the follow-up log.",
    },
  ],
};

export const BREADCRUMBS = [
  { label: "Home", href: "/" },
  { label: "Payer enrollment", href: "/payer-enrollment-software" },
  { label: "Aetna behavioral health" },
];
