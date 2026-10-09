// The template follow-up sequence. Copy approved by Juan; source of truth is
// H110_CONVERSION_EMAILS_v1.md (2026-10-05), which replaced e1, e3, e3b and e4
// of H110_NURTURE_EMAILS_Y_PEDIDO_DEV.md (2026-09-30). Plain text is the
// email; the HTML is the same text in <p>s with the pricing link as an <a>.
// No images, no tracking pixel: opens are not measured (the privacy policy
// doesn't cover it) — the pricing links carry UTM tags instead.
//
// Sent by app/api/cron/template-nurture. Day = days after the template was
// delivered.

// The pricing links go through /r/<step> (app/r/[step]/route.js), which
// counts the click per day and step — nothing per person — and redirects to
// /pricing with utm_source=nurture … utm_content=<step>.
const PRICING = (step) => `https://sokndall.com/r/${step}`;

const SIGNATURE = ["Juan", "Sokndall"];

export const NURTURE_STEPS = [
  {
    step: "e1",
    day: 2,
    subject: "Setting up the tracker in 20 minutes",
    paragraphs: [
      ["Hi,"],
      ["You grabbed the credentialing spreadsheet a couple of days ago, so here's the order I'd fill it in:"],
      [
        "1. Providers tab first. One row per provider, name written \"Last, First\", plus NPI, specialty, start date and status. The other tabs pull names from this one.",
        "2. Then Credentials, one row per credential. Start with whatever expires: state license, DEA, malpractice, board certification. Once you type the expiration date, Days Left and Status fill themselves in.",
        "3. Then the CAQH tab. Put in each provider's last attestation date and the sheet counts the 120 days to the next one.",
        "4. Payer Enrollment goes last. It takes the longest, and it's more useful once the credentials under it are up to date.",
      ],
      ["Row 2 on each tab is a grey example. Delete it when you start. After that the Dashboard tab fills in on its own. I'd open it every Monday."],
      ["If something in the sheet doesn't make sense, just reply. I read every reply."],
      SIGNATURE,
    ],
  },
  {
    step: "e2",
    day: 6,
    subject: "The expiration that costs the most money",
    paragraphs: [
      ["Hi,"],
      ["Of everything in the tracker, the date that causes the most damage isn't the license or the DEA. It's the CAQH re-attestation, every 120 days."],
      ["When it lapses, nothing visibly breaks. Payers keep pulling the old profile. The first sign is usually a denied or delayed claim, and by the time someone traces it back, the A/R is 60+ days old: work that was done and not paid."],
      [
        "Two things that help, with or without any software:",
        "- Put each provider's next attestation date on a calendar the day you update the sheet, not \"later\".",
        "- When an address, TIN or group affiliation changes, re-attest that week. A payer record that doesn't match CAQH is the most common reason a clean claim bounces.",
      ],
      SIGNATURE,
    ],
  },
  {
    step: "e3",
    day: 12,
    subject: "What the spreadsheet can't do",
    paragraphs: [
      ["Hi,"],
      ["The spreadsheet does its job, and I'd rather you use it than nothing. But there are things a file can't do, and they're why I built Sokndall."],
      ["A file can't warn you. A date turns red, but only someone who opens the sheet that week sees it."],
      ["It also forgets. When a payer says \"we never received it,\" the sheet shows today's status. It doesn't show who called them, when, what reference number they gave, or what they asked for."],
      ["And it won't notice when a provider's name, NPI or address doesn't match the NPI Registry or the group's record. That mismatch is one of the most common reasons an application gets sent back."],
      ["Sokndall emails you before things expire, starting 90 days out. Every payer application gets a call log with reference numbers. When you enter an NPI it checks it against the registry. And on Monday morning you get a list of the follow-ups due that week."],
      ["You wouldn't start over, either. Upload this same spreadsheet as it is under Import / Export, and your providers, credentials, CAQH dates and payer applications come in with it."],
      ["It doesn't hold patient data, it doesn't connect to CAQH or payer portals, and it doesn't do primary source verification. You still do the work. It keeps track of it."],
      [
        "Which plan you need depends mostly on how many tax IDs you keep separate:",
        "- One practice, up to 3 providers: Solo, $79 a month.",
        "- One practice, up to 15 providers: Practice, $299 a month.",
        "- More than one tax ID, or you credential for client practices: Billing Co, $699 a month, up to 50 providers.",
      ],
      ["The prices are on the site and there's no sales call. The trial is 14 days, nothing is charged before day 15, and you can cancel from Settings.", { link: PRICING("e3") }],
      SIGNATURE,
    ],
  },
  {
    step: "e3b",
    day: 12,
    subject: "Tracking credentialing across several clients",
    paragraphs: [
      ["Hi,"],
      ["If you keep credentialing for more than one practice, a spreadsheet leaves you two options: one file per client, or one file where everyone's providers and payers are mixed together. Neither one warns you before something expires, and neither keeps the follow-up history you need when a payer says they never got the application."],
      ["Billing Co is the Sokndall plan for that. It's also the only plan that keeps separate tax IDs apart."],
      ["Each client is set up as its own practice, with its own providers, payers and documents, and each user only sees the clients you give them. You get email alerts starting 90 days before a license, DEA, malpractice policy or CAQH attestation lapses. Every payer application has a call log with reference numbers, and on Monday you get one digest covering all your clients."],
      ["It covers up to 50 providers across all your clients and includes 10 users. Each user after that is $39 a month."],
      ["It doesn't hold patient data, it doesn't connect to CAQH or payer portals, and it doesn't do primary source verification."],
      ["The price is $699 a month, published on the site, and there's no sales call. 14-day trial, nothing charged before day 15, cancel from Settings.", { link: PRICING("e3b") }],
      SIGNATURE,
    ],
  },
  {
    step: "e4",
    day: 20,
    subject: "One question",
    paragraphs: [
      ["Hi,"],
      ["A quick question, and I'm asking because I want to know:"],
      ["What do you use today to keep track of payer enrollment status? A spreadsheet, the payer portals themselves, some tool, memory?"],
      ["One line back is plenty. I'm building Sokndall around how people actually do this, and what you tell me changes what I build next."],
      ["From here on I'll write about once a week, with one practical thing about credentialing each time. If that's more email than you want, the unsubscribe link at the bottom takes one click."],
      SIGNATURE,
    ],
  },
  // The weekly notes (H110_CONVERSION_EMAILS_v2.md). Each one says where the
  // reader knows us from, gives one thing that helps without buying anything,
  // and ends with a single line about Sokndall.
  {
    step: "e5",
    day: 27,
    subject: "When a payer asks for more information",
    paragraphs: [
      ["Hi,"],
      ["A few weeks ago you grabbed the credentialing spreadsheet from Sokndall. This week's note is about the status that costs the most: \"info requested.\""],
      ["When a payer asks for something, the application usually stops until they get it. Some won't wait long. Medicare, for one, gives you 30 days to answer a development request before it can reject the application, and then you start over."],
      [
        "What helps:",
        "- Write down exactly what they asked for, the date and the reference number, in the row for that application. Not just in your inbox.",
        "- Send it the same week and ask them to confirm they received it.",
        "- Set a follow-up a week out. \"We sent it\" isn't the same as \"they attached it to the file.\"",
      ],
      ["In the spreadsheet that's the Info Requested status, and the Dashboard counts them under \"Payer waiting on YOU.\" In Sokndall, the request stays at the top of the application and on your Monday list until someone marks it resolved:", { link: PRICING("e5") }],
      SIGNATURE,
    ],
  },
  {
    step: "e6",
    day: 34,
    subject: "Hiring a provider? Start the paperwork early",
    paragraphs: [
      ["Hi,"],
      ["Another short one, since you have the credentialing spreadsheet from Sokndall."],
      ["When someone new joins, the payer side usually takes longer than the hiring did. A payer can take 90 to 120 days from a complete application to an effective date, and visits before that date often can't be billed in network."],
      [
        "So it pays to start the day the offer is signed, 90 to 150 days before their first day. Collect these first, because everything else waits on them:",
        "- Type 1 NPI, with the practice address up to date in NPPES",
        "- CAQH profile complete, your practice added, and the profile attested",
        "- State license, plus DEA and any state controlled substance registration if they prescribe",
        "- Malpractice certificate of insurance",
        "- CV with month and year on every job (most payers want a short explanation for any gap over 6 months)",
        "- W-9 for the group they'll bill under",
      ],
      ["The template's Dashboard has a \"Providers pending start\" line for exactly this. Sokndall gives every new provider a checklist that shows what's still missing before you submit, and it only counts a credential as ready if it hasn't expired:", { link: PRICING("e6") }],
      SIGNATURE,
    ],
  },
  {
    step: "e7",
    day: 41,
    subject: "Medicare revalidation: where to look up the date",
    paragraphs: [
      ["Hi,"],
      ["This week's note from Sokndall, where you got the credentialing spreadsheet, is about a date that's easy to lose because it only comes around every five years."],
      ["Medicare makes providers and groups revalidate their enrollment, usually every 5 years. If the due date passes without it, CMS can deactivate billing privileges, and claims stop until it's sorted out."],
      [
        "Two things worth doing now:",
        "- Look up each provider and the group on CMS's Medicare revalidation list (search \"Medicare revalidation lookup\"). Due dates show up there months ahead. \"TBD\" means no date has been set yet.",
        "- Check that the correspondence address in PECOS is one somebody actually reads. That's where the revalidation notice goes.",
      ],
      ["Then put the date in the sheet so it sits next to everything else that expires."],
      ["In Sokndall each payer application has its own revalidation cycle (Medicare defaults to 5 years), and the due date shows up with your other upcoming expirations:", { link: PRICING("e7") }],
      SIGNATURE,
    ],
  },
  {
    step: "e8",
    day: 48,
    subject: "What to write down on every payer call",
    paragraphs: [
      ["Hi,"],
      ["You've had the Sokndall credentialing spreadsheet for about seven weeks now. This one is short."],
      ["Most follow-up calls to a payer end the same way. Someone says it's \"in process\" and gives you a reference number. Two months later a different rep says there's no record of it. What saves you then is what you wrote down the first time:"],
      [
        "- Date and time, and the rep's name",
        "- The reference number",
        "- What they said the status is, in their words if you can",
        "- What they asked for, if anything",
        "- When they told you to call back",
      ],
      ["And two questions worth asking every time: \"Is anything else missing from the file?\" and \"When should we expect a decision?\""],
      ["The spreadsheet has one column for the last follow-up, so each call writes over the one before. Sokndall keeps every call as its own entry with the reference number, and suggests the next follow-up a week out:", { link: PRICING("e8") }],
      SIGNATURE,
    ],
  },
];

// Domains Juan has confirmed are billing / RCM companies get e3b. Everyone
// else gets e3, which lets the reader pick a plan by tax IDs: a practice
// manager writes from a company domain too, so "not Gmail" is not "billing
// company". Add a domain only after checking what the company does.
const BILLING_DOMAINS = new Set(["savistarcm.com"]);

export function thirdStepFor(email) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return BILLING_DOMAINS.has(domain) ? "e3b" : "e3";
}

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// One step → { subject, text, html }, with the same unsubscribe footer as the
// template email.
export function renderNurtureEmail(stepKey, unsubscribeUrl) {
  const step = NURTURE_STEPS.find((s) => s.step === stepKey);
  const textBlocks = step.paragraphs.map((lines) =>
    lines.map((l) => (typeof l === "string" ? l : l.link)).join("\n")
  );
  const htmlBlocks = step.paragraphs.map((lines) =>
    `<p>${lines
      .map((l) => (typeof l === "string" ? escapeHtml(l) : `<a href="${l.link}" style="color:#0e2a2e">${escapeHtml(l.link)}</a>`))
      .join("<br>")}</p>`
  );
  return {
    subject: step.subject,
    text: [...textBlocks, "", `Unsubscribe: ${unsubscribeUrl}`].join("\n\n"),
    html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#0e2a2e;max-width:520px">
${htmlBlocks.join("\n")}
<p style="font-size:12px;color:#5b6b6d;margin-top:28px">You're getting this because this address asked for the template at sokndall.com. <a href="${unsubscribeUrl}" style="color:#5b6b6d">Unsubscribe</a></p>
</div>`,
  };
}
