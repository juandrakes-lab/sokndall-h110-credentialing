// `/credentialing-spreadsheet-template` — copy verbatim from
// H110_COPY_TANDA_A_LANDING.md, "PÁGINA 4". Rebuilt from zero on
// LandingTemplate on 2026-09-10 (it was an `Article` solo page).
//
// The keyword lives in the <title>, the H2 and the file name; the copy never
// asks the reader to call themselves "the credentialing spreadsheet person"
// (BRIEF_COPY.md §4, as applied by the copy file).

export const META = {
  title: "Credentialing Spreadsheet Template, Free | Sokndall",
  description:
    "A free credentialing spreadsheet template with the formulas already in it: providers, credentials, payer enrollment, CAQH and a dashboard. No account.",
};

export const HERO = {
  title: ["The credentialing", "sheet, free"],
  sub:
    "Six tabs: providers, credentials, payer enrollment, CAQH, a dashboard that counts what is overdue, and a page on how to use it. Excel or Google Sheets.",
  strip: ["No account", "Excel or Google Sheets", "Formulas already in it", "One email address"],
};

// FieldInventory. Each tab in the copy is "Tab — fields"; the row card sets
// the tab as its title and the fields beside it, first letter capitalised
// because it now opens its own block. The two source links are on the words
// they source, per the copy's (f) note: the credential fields match the CAQH
// ProView quick reference published by the Maryland Department of Health, and
// the dashboard's 30/60/90 windows follow the CMS revalidation guidance.
export const FIELDS = {
  head: { title: ["What is in the", "credentialing", "spreadsheet template"] },
  items: [
    {
      title: "Providers",
      body: "Name, credential, NPI, specialty, location, start date, employment status, notes. Every other tab pulls names from here, so they stay consistent instead of drifting into three spellings of the same person.",
    },
    {
      title: "Credentials, one row per credential per provider",
      body: "[Type, issuing state or body, ID number, issue date, expiration date](src:marylandCaqh), days left, status, renewal started, responsible person, notes. Days left and status calculate themselves.",
    },
    {
      title: "Payer Enrollment, one row per provider per payer",
      body: "Payer, plan or network, request type, submitted date, how it was submitted, confirmation number, payer contact, status, last follow-up, days since follow-up, next follow-up due, effective date, payer provider ID or PTAN, group TIN, claims being held, notes.",
    },
    {
      title: "CAQH (DataSpring)",
      body: "CAQH provider ID, last attestation date, next attestation due, days left, status, profile complete, documents expiring inside the profile, notes. Next due is [the last attestation plus 120 days](/caqh-reattestation), calculated for you.",
    },
    {
      title: "Dashboard",
      body: "What you read on a Monday: what expired, [what expires in 30, 60 and 90 days](src:cmsRevalidation), attestations overdue, applications open, applications where the payer is waiting on you, applications quiet for 30 days, pairs with claims held.",
    },
  ],
};

export const LIMITS = {
  head: {
    title: ["Where a", "spreadsheet stops"],
    note:
      "It is a real tool and it will hold a small practice together. The limits below are structural, not a formula problem.",
  },
  items: [
    { title: "It will not remind you", body: "The dates are right and nothing tells you about them. You have to open it." },
    { title: "It keeps no history", body: "Someone overwrites a status and the previous one is gone for good." },
    { title: "The documents are elsewhere", body: "The COI and the payer letter sit in a folder. The row holds a number." },
    { title: "It cannot catch a mismatch", body: "Two disagreeing NPIs both sit there quietly. The payer will not." },
    { title: "It holds 40 rows a tab", body: "Room for a small practice, not for a growing one." },
  ],
  closing:
    "That is the failure mode, and it is not a wrong date sitting in the file. It is a right date sitting in a file nobody opened that week.",
};

export const ENOUGH = {
  head: { title: ["When this is", "enough, and when", "it stops being"] },
  paras: [
    "Two providers and three payers is six pairs plus a handful of credential rows. The sheet is the right tool for that, and buying software for it would be silly.",
    "Eight providers across twelve payers is 96 pairs, and this file holds 40 rows a tab. Add multi-state licensure and you are re-sorting every time someone asks a question. At that point the sheet is not tracking anything — it is where the tracking used to happen.",
    "There is a version that works longer: auto-calculated windows, separate views by role, escalation rules. Some practices build it. What it costs is the weeks spent building and maintaining it, on top of the work you already have.",
    "[Sokndall is that, already built](/): the same fields, the same logic, plus the email on Monday morning that a file cannot send you.",
  ],
};

export const FAQ = [
  {
    q: "What should a credentialing spreadsheet include?",
    a: "At minimum: one row per credential per provider with an expiration date and a calculated days-left column, and one row per provider per payer for enrollment, with a submitted date, a status, and the date of the last follow-up. Most homemade trackers have the first and not the second, which is why they catch expirations and miss applications that stopped moving.",
  },
  {
    q: "Is there a free credentialing tracker template?",
    a: "This one. Six tabs, the formulas already written, and no account required — an email address and the file arrives. It covers providers, credentials with calculated expiry windows, payer enrollment with a follow-up log, CAQH attestation dates on the 120-day cycle, a dashboard, and a page explaining how the whole thing fits together.",
  },
  {
    q: "Does the template work in Excel and Google Sheets?",
    a: "Both. The formulas are limited to functions that behave the same in each, so nothing breaks when you upload the file to Drive or download it back out again. Conditional formatting carries across as well. There is no macro, no script and no add-on, which is deliberate: an IT department will not have to approve anything.",
  },
  {
    q: "When does a spreadsheet stop being enough?",
    a: "When you can no longer answer what needs attention this week without opening the file and reading all of it. That is usually somewhere past forty provider-payer pairs, but the row count is not really what breaks. What breaks is that the sheet cannot tell you anything you did not think to ask, and follow-up is entirely made of things you forgot to ask about.",
  },
];

// The closing CTA sends the reader back to the one email box on the page (the
// hero form) rather than rendering a second one: one template CTA per page
// (DESIGN_RULES.md §9). Its label is the form's own button label.
export const CLOSING = {
  title: "Take the free file first, then decide",
  body: "It is free and it will tell you where you land. If it stops holding, the paid version is on [the pricing page](/pricing).",
};
