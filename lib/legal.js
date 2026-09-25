// Terms of Service and Privacy Policy.
//
// Adapted from the Basecamp open-source policies (github.com/basecamp/policies,
// CC BY 4.0) — the structure and the plain voice are theirs; every statement
// here was rewritten against what this product actually does, and the pages
// credit the licence at the foot.
//
// The rule for editing this file: a sentence may only claim what the code
// does. Where the old skeleton and the build disagreed, the build won. Checked
// against the build on 2026-09-22: plan limits (lib/plans.js), the trial and
// seats (lib/billing-actions.js), client and account deletion (the same file,
// and cred_delete_client / cred_delete_organization), exports
// (app/(app)/export, app/(app)/clients/[id]/export), signed download links
// (60s for one document, 600s for an export), the cookies the app sets
// (Supabase's session cookie, cred_client, sk_nav) and the Supabase region
// (us-east-2, Ohio).
//
// `body` is a list of blocks: a string is a paragraph, { list: [...] } is a
// bulleted list. LegalPage renders them.

export const SUPPORT_EMAIL = "support@sokndall.com";
export const PRIVACY_EMAIL = "privacy@sokndall.com";

// The day both documents took effect. TERMS_VERSION (lib/password-rules.js)
// is stamped on every sign-up and must match it.
export const EFFECTIVE_DATE = "2026-09-22";

const ATTRIBUTION = {
  text: "Adapted from the Basecamp open-source policies, used under CC BY 4.0.",
  href: "https://github.com/basecamp/policies",
  licenceHref: "https://creativecommons.org/licenses/by/4.0/",
};

export const TERMS = {
  title: "Terms of Service",
  final: true,
  updated: EFFECTIVE_DATE,
  attribution: ATTRIBUTION,
  summary: [
    "Sokndall is software for tracking provider credentials and payer enrollment applications. You enter the data; we keep it, work out what expires, and email you about it.",
    "We are not a credentialing service. We do not verify anything with a licensing board, and we never submit an application to a payer on your behalf.",
    "Plans are $79, $299 and $699 a month, with a 14-day trial. Payment is handled by Polar, the merchant of record.",
    "You can export everything at any time, and deleting your account deletes your data.",
  ],
  sections: [
    {
      id: "acceptance",
      heading: "Accepting these terms",
      body: [
        "This agreement is between Sokndall and the organization whose account you open — your practice or your billing company. If you open an account for an employer, you are telling us you may accept these terms on its behalf.",
        "Creating an account, whether with an email address or with Google, means accepting these terms. We record which version you accepted and when.",
        "If we change these terms, we post the new version here and email the account owner before it takes effect. Continuing to use Sokndall after that date means accepting the new version. If you would rather not, cancel before it takes effect and tell us — we refund the unused part of the period you already paid for.",
      ],
    },
    {
      id: "service",
      heading: "What Sokndall is, and what it is not",
      body: [
        "Sokndall records the credentials your providers hold, the dates they expire, and where each payer application stands. It flags what is expiring, what is overdue for a follow-up and what has gone quiet, and it emails you about those things on the schedule you set.",
        "Three things it is not:",
        {
          list: [
            "It is not a credentialing verification organization. It does not check a licence with a state board, a certification with a specialty board or a sanction list. What is in your account is what you or your team entered.",
            "It does not talk to payers. Nothing is submitted, uploaded or chased on your behalf. Every status in the matrix is one you set yourself, because you are the one who knows what the payer said.",
            "It is not legal, compliance or billing advice. Deciding whether a provider may see patients or bill a payer is your call, not the software's.",
          ],
        },
        "We add features and change how things look over time. If we remove something you rely on, we say so in advance by email.",
      ],
    },
    {
      id: "no-phi",
      heading: "No patient information",
      body: [
        "Sokndall holds provider data only: names, NPIs, licence and registration numbers, expiration dates, payer applications, the notes you write about them and the documents you upload.",
        "You must not put protected health information (PHI) or any other patient data into Sokndall — not in a note, not in a file name, not in an uploaded document.",
        "We do not sign Business Associate Agreements. That is not an oversight: the product is built so it never needs to hold PHI, and keeping it that way is part of why it costs what it costs. If patient data is uploaded anyway, that breaks these terms, and we may remove it or suspend the account.",
      ],
    },
    {
      id: "accounts",
      heading: "Accounts, people and access",
      body: [
        "The person who opens the account is its owner. The owner invites everyone else, decides who is an owner or a member, and — on Billing Co — which clients each person can see. Members reach only the clients they have been given.",
        `You are responsible for what the people you invite do in the account, and for keeping passwords private. Passwords must be at least twelve characters. Tell us at once, at ${SUPPORT_EMAIL}, if you think someone has got into your account who should not have.`,
        "Removing someone from the team removes their access immediately. Their name stays on the history of what they did, because a record that can be edited afterwards is not a record.",
      ],
    },
    {
      id: "plans-billing",
      heading: "Plans, trial and billing",
      body: [
        "There are three plans, billed monthly, at the prices published on the pricing page: Solo $79, Practice $299 and Billing Co $699 a month. Each plan sets how many providers you can track, how many people can sign in and how much document storage you get — Solo: 3 providers, 1 user, 1 GB. Practice: 15 providers, 3 users, 5 GB. Billing Co: 50 providers across all of your clients, 10 users, 20 GB.",
        "On Billing Co, people beyond the ten included cost $39 per person per month on the same subscription. Adding one is charged from the day you add it; removing one takes effect at the next renewal.",
        "Every plan starts with a 14-day trial. A card goes in when you choose the plan, nothing is charged during the trial, and the first charge falls on day 15 unless you cancel first. You can cancel from the billing portal, in Settings, at any time.",
        "When you cancel, the account keeps working until the end of the period you have paid for. After that it becomes read-only: you can still open it, read everything and export it, but not add or change anything. Non-payment has the same effect.",
        "Moving up a plan takes effect immediately. Moving down leaves any provider over the new limit read-only rather than deleting it. We do not delete your records to make them fit.",
        `Payments are handled by Polar, which is the merchant of record for every sale. Polar charges your card, adds sales tax or VAT where it applies, issues the invoice and handles refunds; your receipts come from Polar and its terms apply to the payment itself. Write to ${SUPPORT_EMAIL} about anything on a charge and we will sort it out with them.`,
        "If we change a price, the owner is told by email first, and an existing account keeps its current price for at least 30 days after that email.",
      ],
    },
    {
      id: "customer-data",
      heading: "Your data is yours",
      body: [
        "Everything you enter belongs to you. We use it to run the service for you — to show it back, work out the dates, send the alerts you asked for and answer your support questions — and for nothing else. We do not sell it, and we do not use it to train anything.",
        "You can take it with you at any time, including while the account is read-only: every list exports as a CSV, and each client exports as a ZIP holding its CSVs and a copy of every uploaded document.",
        "Deleting a client deletes its providers, credentials, applications, follow-up history and files. The only thing kept is a line saying that a client of that name was deleted, when, and by whom, so an owner can see what happened.",
        "Deleting the account ends the subscription with Polar, removes the stored files and deletes the organization and everything under it. There is no undo and no copy we can restore for you afterwards, so export first.",
        "We keep operational records that are not your content — the billing records Polar and we are required to keep, and server logs — as described in the Privacy Policy.",
      ],
    },
    {
      id: "third-party",
      heading: "Public registries",
      body: [
        "When you type an NPI, Sokndall can look it up in the NPI Registry (NPPES), the public directory the Centers for Medicare & Medicaid Services publishes, and offer to fill in the name, specialty and address it holds. What comes back is a proposal you accept or ignore, and we do not promise the registry is right or current.",
        "Sokndall does not scrape CAQH, payer portals or state licensing boards, and it does not sign in anywhere on your behalf. Everything else in your account is typed or imported by you.",
      ],
    },
    {
      id: "acceptable-use",
      heading: "Acceptable use",
      body: [
        "Use Sokndall lawfully and for what it is for. Do not try to reach another customer's data, probe or break the service, resell access, upload malware or patient data, or use the service to harass anyone.",
        "We may remove content that breaks these rules and, where it is serious or repeated, suspend the account. Where we can, we tell you first.",
      ],
    },
    {
      id: "availability",
      heading: "Availability",
      body: [
        "We work to keep Sokndall up and quick, and we do not promise a specific uptime figure. There is no service level agreement unless we have signed one with you in writing.",
        "Planned maintenance that means downtime is announced by email in advance where we can. Emergencies happen; in those we fix first and explain after.",
      ],
    },
    {
      id: "termination",
      heading: "Suspension and ending the agreement",
      body: [
        "You can cancel or delete the account whenever you like, from Settings. We can end this agreement with 30 days' notice by email if we stop offering the service or the plan you are on, and we refund the unused part of the period in that case.",
        "We can suspend an account immediately for non-payment, for a breach of the acceptable-use section, or where the law requires it. A suspended account is read-only while it is suspended.",
        "If an account ends without being deleted, its data stays read-only for 30 days so you can export it, and we may delete it after that.",
      ],
    },
    {
      id: "liability",
      heading: "Disclaimers and limits",
      body: [
        "Sokndall is provided as is. We do not warrant that it will be uninterrupted or error-free, and we do not warrant anything that depends on a payer, a board or a registry — including whether an application is approved, how long it takes, or whether a claim is paid.",
        "You are responsible for what you enter and for the decisions you make from it. The alerts are a help, not a guarantee: a date typed wrong produces an alert that is wrong, and email can be delayed or filtered.",
        "To the extent the law allows, neither party is liable for indirect, incidental or consequential damages, or for lost profits or revenue. Our total liability for any claim relating to the service is limited to what you paid us for it in the twelve months before the claim.",
        "Nothing here limits liability for fraud, or for anything else that cannot be limited by law.",
      ],
    },
    {
      id: "law",
      heading: "Disagreements, governing law and notices",
      body: [
        `If something goes wrong, write to ${SUPPORT_EMAIL} first and describe it. We answer, and we try to settle it by email within 30 days. Most things end there, and both of us have to try this before starting anything formal.`,
        "This agreement is governed by the laws of the State of Delaware, United States, without regard to its conflict-of-laws rules, and any dispute that survives the step above belongs to the state or federal courts sitting in Delaware.",
        `Legal notices go to ${PRIVACY_EMAIL}. Notices to you go to the account owner's email address, so keep it current.`,
        "If a part of these terms turns out to be unenforceable, the rest still stands.",
      ],
    },
  ],
};

export const PRIVACY = {
  title: "Privacy Policy",
  final: true,
  updated: EFFECTIVE_DATE,
  attribution: ATTRIBUTION,
  summary: [
    "We collect what we need to run Sokndall: who you are, the provider and payer data you enter, and basic technical records.",
    "We do not sell personal data, and we never use what you enter to advertise anything.",
    "A handful of companies process data for us — Supabase, Vercel, Polar, Resend, and Google if you sign in with it — and they are all listed below.",
    `You can export everything at any time, and deleting your account deletes it. Questions: ${PRIVACY_EMAIL}.`,
  ],
  sections: [
    {
      id: "who",
      heading: "Who we are and what this covers",
      body: [
        "Sokndall makes credentialing and payer enrollment tracking software. This policy covers the marketing site at sokndall.com and the application you sign in to.",
        "For the data you enter about your providers, you are the controller and we are the processor: it is your data, and we handle it on your instructions. For your own account and billing details, we are the controller.",
        `Write to ${PRIVACY_EMAIL} about anything in this policy.`,
      ],
    },
    {
      id: "collect",
      heading: "What we collect",
      body: [
        {
          list: [
            "Account: your first and last name, your work email address and a password, which is stored hashed by Supabase Auth and never in a form we can read. If you sign in with Google instead, we receive your name, email address and profile picture from Google. A profile photo of your own is optional.",
            "What you enter: your practice or client details, your providers' names, NPIs, CAQH IDs, licence and registration numbers with their dates, payer applications and their history, the notes and phone logs you write, and the documents you upload. No patient data belongs here, and the Terms forbid it.",
            "Billing: your plan, subscription status and the name and email on the subscription, which come back to us from Polar. Card numbers go to Polar and never reach us.",
            "The free template: if you ask for the credentialing spreadsheet on the site, we keep the email address you give us, the page you asked from, the campaign tags in that page's address (utm_source, utm_medium, utm_campaign) and the site that sent you there, if any. Nothing else. We use the address to send the template and, unless you unsubscribe, an occasional email about credentialing; every one of those emails has a one-click unsubscribe link, and unsubscribing stops them for good. We also use it to count how many template requests later became accounts.",
            "Technical: IP address, browser and basic request logs, kept for security and abuse prevention, and a record that an alert or digest email was sent to a given address, so the same email is not sent twice.",
          ],
        },
      ],
    },
    {
      id: "use",
      heading: "How we use it",
      body: [
        "To run the service: show you your data, work out what expires and what has gone quiet, send the alert and digest emails on the schedule you choose, and keep the account working.",
        "To bill you, through Polar.",
        "To support you when you write in, which sometimes means looking at your account to answer the question you asked.",
        "To keep the service safe: spotting abuse, debugging, and meeting a legal obligation when one applies.",
        "We do not sell personal data. We do not use what you enter for advertising, and we do not use it to train machine-learning models.",
      ],
    },
    {
      id: "processors",
      heading: "Who processes data for us",
      body: [
        {
          list: [
            "Supabase — database, sign-in and file storage. Your data sits in Supabase's US East (Ohio) region.",
            "Vercel — hosting for the site and the application, and cookieless visit counts on the marketing pages.",
            "Polar — payments and merchant of record: it charges the card, handles tax and issues invoices.",
            "Resend — delivery of the emails we send you: alerts, the weekly digest, password resets, invitations and the free template.",
            "Google — only if you choose to sign in with Google.",
            "Cloudflare — the bot check on the sign-in and sign-up forms, where it is switched on.",
            "Centers for Medicare & Medicaid Services — when you look up an NPI, that number is sent to the public NPI Registry (NPPES) to fetch the public record.",
          ],
        },
        "These companies are in the United States, and so are we. If you are in the EEA or the UK, that means your data is transferred to the United States, and we rely on the standard contractual clauses our processors offer for those transfers.",
        "We do not add processors quietly. If this list changes, this page changes with it.",
      ],
    },
    {
      id: "cookies",
      heading: "Cookies and tracking",
      body: [
        "The application sets three cookies, all of them necessary: the Supabase session cookie that keeps you signed in, one that remembers which client you have open, and one that remembers whether the sidebar is folded. There are no advertising cookies inside the application, and no analytics or session-recording tool in it.",
        "The marketing pages at sokndall.com, including the sign-in and sign-up pages, use Vercel Web Analytics to count visits: which page was seen, the referring site, and the country, browser and device type. It sets no cookies and keeps no identifier that follows you from one day to the next, and it is not loaded anywhere inside the application.",
        "If you reach a marketing page through a link that carries campaign tags — the utm_source, utm_medium, utm_campaign and utm_term parameters in the address, or an ad click id (gclid from Google, msclkid from Microsoft) — we set one first-party cookie, sk_attr, that keeps those tags and the page you landed on for 30 days. Nobody else can read it. If you then start a subscription, those tags are saved with your account, so we know which campaign an account came from. A visit without campaign tags sets no such cookie.",
        "When we start advertising we will add the Reddit and Google advertising tags to the marketing pages only, so we can tell which campaign a sign-up came from. They will never be added to the application, and they will never see what you keep in it. We will update this section, and offer the opt-out those tags require, on the day they go in.",
        "We honour the Global Privacy Control signal for the advertising tags described above.",
      ],
    },
    {
      id: "retention",
      heading: "Keeping and deleting",
      body: [
        "Your content is kept while your account exists. Deleting a client deletes its records and files, leaving only a line saying a client of that name was deleted, when and by whom. Deleting the account ends the subscription, removes the stored files and deletes everything under the organization. Neither can be undone, so export first.",
        "If an account ends without being deleted, it stays read-only for 30 days so you can export, and we may delete it after that.",
        "Server and security logs are kept for up to 90 days. The record that an email was sent lives with the account and goes when it goes. Billing records are kept by Polar, and by us where the law requires, for as long as tax rules demand.",
      ],
    },
    {
      id: "security",
      heading: "How it is protected",
      body: [
        "Every account is separated from every other account in the database itself, with row-level security, and on Billing Co each client is separated from the rest the same way. There is no path in the application that steps around it.",
        "Uploaded documents live in private storage. A download link is made when you click and expires in a minute; an export's links expire in ten. Nothing is publicly addressable.",
        "Connections are encrypted in transit, passwords must be at least twelve characters and are stored hashed, and sign-in can require a bot check.",
        "The strongest protection is the one in the Terms: there is no patient data here to lose.",
        "If we ever have a breach that affects your data, we tell the account owner by email without undue delay, and describe what happened and what we are doing about it.",
      ],
    },
    {
      id: "rights",
      heading: "Your rights",
      body: [
        "You can see everything we hold about your account inside the application, correct it there, export it as CSV or ZIP, and delete it by deleting the client or the account.",
        `Depending on where you live, you may also have the right to ask for a copy of your personal data, to have it corrected or deleted, to object to or restrict how we use it, and not to be treated differently for asking. Write to ${PRIVACY_EMAIL} and we answer within 30 days. We may need to check that you are who you say you are first.`,
        "We do not sell personal information, and we do not share it for cross-context behavioural advertising, as those terms are used in California and other state privacy laws. If that ever changes because of the advertising tags described above, this policy will say so before it happens.",
        "If you are a provider whose details sit in someone's account, that account belongs to the practice or billing company that entered them. Ask them first; we will pass a request on to them and help them answer it.",
      ],
    },
    {
      id: "children",
      heading: "Children",
      body: ["Sokndall is a business tool and is not directed to anyone under 18. We do not knowingly collect data from children, and if we learn that we have, we delete it."],
    },
    {
      id: "changes",
      heading: "Changes and contact",
      body: [
        "When this policy changes we update the date at the top, and we email the account owner before a material change takes effect.",
        `Privacy questions and requests: ${PRIVACY_EMAIL}. Anything else about the product: ${SUPPORT_EMAIL}.`,
      ],
    },
  ],
};
