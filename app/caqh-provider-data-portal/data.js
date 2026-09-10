// `/caqh-provider-data-portal` — copy verbatim from
// H110_COPY_TANDA_C_EDITORIAL.md, "PÁGINA 8". New page on EditorialTemplate.
//
// Function: resolve the rebrand confusion and the CAQH-number lookup family.
// It does not compete for "caqh login" or its variants (exclusiones.md §4).
// Eleven FAQ questions: the whole lookup family lives here.

export const META = {
  title: "CAQH Provider Data Portal: The Rebrand, Your ID, Setup",
  description:
    "CAQH is now DataSpring and ProView is now the Provider Data Portal. Your CAQH ID did not change. Where to find it, and what the rebrand did not touch.",
};

export const HEADER = {
  title: "CAQH is now DataSpring, and almost nothing about your own profile actually changed",
  standfirst:
    "The parent organisation rebranded in June 2026 and the portal was renamed. Your CAQH ID, your login, your documents, your payer authorisations and your attestation schedule all carried over untouched. Here is what did change.",
  category: "Guide",
  date: "2026-09-08",
  readingTime: "10 min read",
  caption:
    "CAQH ProView is now the CAQH Provider Data Portal, at the same URL with the same login. The organisation behind it is DataSpring, powered by CAQH.",
};

export const CONTENTS = [
  { id: "changed", label: "What the rebrand changed" },
  { id: "unchanged", label: "What it did not change" },
  { id: "id", label: "Where your CAQH ID comes from" },
  { id: "lookup", label: "There is no public lookup" },
  { id: "register", label: "What you need to register" },
  { id: "authorisation", label: "Authorisation and who can see you" },
  { id: "goes-wrong", label: "When it goes wrong" },
  { id: "limit", label: "What a tracker does not fix" },
];

export const SECTIONS = [
  {
    id: "changed",
    heading: "What the DataSpring rebrand actually changed",
    paras: [
      "In June 2026 the Council for Affordable Quality Healthcare rebranded its parent organisation to DataSpring, powered by CAQH. The provider-facing system previously called CAQH ProView is now the CAQH Provider Data Portal. The CAQH name stays on the product; DataSpring is the organisation behind it. The product suite includes COB Smart, EnrollHub and DirectAssure alongside the portal.",
      "For a credentialing team the change is naming and nothing else. References to CAQH ProView in your own application forms, payer emails, staff instructions and vendor inventories should be updated to CAQH Provider Data Portal, because that is what the screen now says and what payers will increasingly use. Searching your own documentation under all three names is worth an afternoon once.",
    ],
  },
  {
    id: "unchanged",
    heading: "What the rebrand did not change",
    paras: [
      // Two independent sources per the copy's (f): Contracting Providers and
      // RCMGen both confirm same ID, same URL, same login, history intact.
      "[Your CAQH ID is the same number](src:contractingProviders). There is no re-registration, no new profile, no migration. [The URL is unchanged and your existing login still works](src:rcmgen). Documents, payer authorisations and attestation history all carried over automatically. The attestation schedule is unchanged at 120 days. A brand change creates no new credentialing status, and any message telling you otherwise is worth treating with suspicion.",
    ],
  },
  {
    id: "id",
    heading: "Where your CAQH Provider ID comes from",
    paras: [
      "There are exactly two ways to get one. If a health plan, hospital or other participating organisation invited you, the ID arrives in a welcome letter from them. If you self-registered through the portal, it arrives in a welcome email after registration completes. Since ProView launched, self-registration has not required a payer to start the process for you.",
      "That is also why the number is easy to lose: it arrives once, in an email or a letter, at the beginning of a process that then goes quiet for months. Practices that record it alongside the NPI at the moment it arrives do not have this problem. Everyone else has it about eighteen months later.",
    ],
  },
  {
    id: "lookup",
    heading: "There is no public CAQH number lookup",
    paras: [
      "People search for a CAQH number lookup expecting something like the NPI registry. It does not exist. The profile behind that number contains a social security number, a date of birth, malpractice history and licence data, so a public directory of them would be a different kind of problem entirely. The absence is a design decision rather than an oversight.",
      "What you can do instead: check the original welcome email or letter, ask the payer who invited you, or call the help desk at 888-599-1771 and identify yourself. Live chat is available through the portal, Monday to Friday, 8:30am to 6:30pm Eastern. The help desk asks for the Provider ID up front, which is unhelpful when the ID is what you have lost, so the phone route is the one that works.",
    ],
  },
  {
    id: "register",
    heading: "What you need before you start a profile",
    paras: [
      // The copy's (f): this list matches, nearly word for word, the CAQH
      // ProView quick reference published by the Maryland Department of
      // Health — so the link sits on the list itself.
      "The CAQH-supplied Provider ID, every current and previous practice location, and your identification numbers: social security number, NPI, DEA, licence number. Then [scanned copies of your CV, medical licence, DEA certificate, CDS certificate, IRS Form W-9, malpractice insurance face sheet, and a summary of any pending or settled malpractice cases](src:marylandCaqh). Budget an hour and a half to two hours, and know that the portal saves as you go.",
    ],
  },
  {
    id: "authorisation",
    heading: "Authorisation decides who can actually see you",
    paras: [
      "A complete profile is invisible to a payer that has not been authorised to read it. In the Authorization tab you can release your data to any organisation that requests access, or grant access one organisation at a time. Either way, the change only takes effect once you reattest — the attestation is what publishes it. A payer telling you it cannot find your profile is usually an authorisation problem rather than a data problem.",
    ],
  },
  {
    id: "goes-wrong",
    heading: "Duplicate profiles, dead email addresses, and lost IDs",
    paras: [
      "Duplicate accounts happen when a clinician self-registers and a payer separately creates a profile for them. Two profiles means payers read whichever one they were pointed at, and one of them is always out of date. The fix is a phone call to 888-599-1771 requesting a merge, and it takes a few days rather than minutes.",
      "If the account is tied to an email address nobody can access — a clinician who left, a practice domain that changed — you cannot fix it from inside the portal. That is also a call to the same number. Until it is fixed, every reminder the system sends goes somewhere nobody is reading, which is how a 120-day cycle turns into eight months.",
      "If a payer says your information is not current and your attestation date looks fine, check three things in order: whether the payer is authorised, whether a document inside the profile has expired, and whether the practice location under the relevant tax ID is present and active. A missing location under the right TIN stalls credentialing while the profile itself looks complete.",
    ],
  },
  {
    id: "limit",
    heading: "What a tracker does not do about the portal",
    paras: [
      "Sokndall does not connect to the CAQH Provider Data Portal, read it, or write to it. It stores your CAQH Provider ID next to the provider it belongs to, records the date of the last attestation, and counts to the next one. If your profile has a duplicate or a dead email address on it, no tracking tool will find that. A phone call will.",
    ],
    after: ["[The three published plans](/pricing)"],
  },
];

export const TEMPLATE_HEADING = "A free template with a CAQH tab: ID, last attestation, next due";

export const FAQ = [
  {
    q: "What is CAQH Provider Data Portal?",
    a: "It is the online system where clinicians enter, update and verify their professional and practice information and share it with the organisations they authorise. It stores licences, training certificates and liability insurance documents, flags errors, and sends reminders when it is time to confirm the information. Most commercial payers read credentialing data from it rather than asking you directly.",
  },
  {
    q: "What is the CAQH Provider Data Portal?",
    a: "It is the current name for what used to be called CAQH ProView. The rename came with the June 2026 rebrand of the parent organisation to DataSpring. Same URL, same login, same profile, same 120-day attestation cycle. If you have documentation that still says ProView, it is describing this system.",
  },
  {
    q: "What is CAQH?",
    a: "The Council for Affordable Quality Healthcare, a non-profit alliance of health plans, now operating under the parent brand DataSpring. Its best-known product is the Provider Data Portal, which lets a clinician maintain one credentialing profile that many payers can read instead of completing a separate application for each one.",
  },
  {
    q: "What does CAQH stand for?",
    a: "The Council for Affordable Quality Healthcare. As of the June 2026 rebrand the organisation trades as DataSpring, powered by CAQH, so the acronym survives inside the product name rather than as the organisation's own. Most payers, forms and provider communications still say CAQH, and will for some time.",
  },
  {
    q: "What is a CAQH number?",
    a: "A CAQH Provider ID is the unique number attached to your profile in the Provider Data Portal. Payers use it to locate and read your credentialing data. It is not a licence, a credential or a public identifier like an NPI — it is an account number for a database, and it did not change in the rebrand.",
  },
  {
    q: "How do I find my CAQH number?",
    a: "Check the welcome email or letter you received when the profile was created — from the payer that invited you, or from the portal if you self-registered. If that is gone, ask any payer you are already enrolled with, since they hold it. Failing both, call 888-599-1771 and identify yourself. There is no public lookup tool and there is not going to be one.",
  },
  {
    q: "How do I get a CAQH number?",
    a: "Either a health plan invites you and sends a welcome letter containing the ID, or you self-register through the portal and receive it by email when registration completes. Self-registration does not require a payer to start the process. There is no cost to the provider, and completing the profile afterwards takes about an hour and a half to two hours.",
  },
  {
    q: "What is a CAQH ID?",
    a: "The same thing as a CAQH number — the identifier for your profile in the Provider Data Portal. Both terms appear in payer communications and neither is more official. It stayed the same through the DataSpring rebrand, so an ID recorded years ago is still the correct one today.",
  },
  {
    q: "Is CAQH ProView the same as CAQH Provider Data Portal?",
    a: "Yes. ProView was renamed the CAQH Provider Data Portal, and the functionality, URL and login are unchanged. The confusion is worth clearing up because both names are still in circulation: payer forms, staff instructions and older guides say ProView, while the screen itself now says Provider Data Portal. They are the same system.",
  },
  {
    q: "What is CAQH for providers?",
    a: "It is the way you fill in your credentialing information once instead of once per payer. You maintain a single profile, authorise the organisations that may read it, and reattest every 120 days to keep it active. What it does not do is credential you: payers still run their own verification and their own contracting on top of the data they read.",
  },
  {
    q: "Do nurse practitioners need a CAQH?",
    a: "If you intend to be in network with commercial payers, effectively yes. The portal is not limited to physicians — nurse practitioners, physician assistants, therapists and other licensed practitioners all maintain profiles, and payers read them the same way. Requirements vary by payer and by state, so the practical answer is to ask each payer you plan to apply to.",
  },
];

export const CLOSE = {
  href: "/credentialing-spreadsheet-template",
  label:
    "The free template stores the CAQH ID beside the provider it belongs to, which is the least glamorous and most useful thing on the sheet.",
};

export const RELATED = [
  {
    href: "/caqh-reattestation",
    title: "CAQH reattestation and the 120-day rule",
    hook: "Why a lapsed profile breaks nothing visibly, and stalls everything underneath.",
  },
  {
    href: "/provider-credentialing-checklist",
    title: "The provider credentialing checklist, and the documents it needs",
    hook: "Everything the portal asks you to upload, in the order it asks for it.",
  },
  {
    href: "/behavioral-health-credentialing",
    title: "Behavioral health credentialing, payer by payer",
    hook: "Four major payers, all reading the same profile before they will act on you.",
  },
];
