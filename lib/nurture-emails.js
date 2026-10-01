// The template follow-up sequence, word for word from
// H110_NURTURE_EMAILS_Y_PEDIDO_DEV.md (Parte A, 2026-09-30). Plain text is the
// email; the HTML is the same text in <p>s with the pricing link as an <a>.
// No images, no tracking pixel: opens are not measured (the privacy policy
// doesn't cover it) — the pricing links carry UTM tags instead.
//
// Sent by app/api/cron/template-nurture. Day = days after the template was
// delivered.

const PRICING = (content) =>
  `https://sokndall.com/pricing?utm_source=nurture&utm_medium=email&utm_campaign=template_seq&utm_content=${content}`;

const SIGNATURE = ["Juan", "Sokndall"];

export const NURTURE_STEPS = [
  {
    step: "e1",
    day: 2,
    subject: "Setting up the tracker in 20 minutes",
    paragraphs: [
      ["Hi,"],
      ["You grabbed the credentialing spreadsheet a couple of days ago. Here is the order that gets it useful fastest:"],
      [
        "1. Providers tab first. One row per provider: name, NPI, TIN, the group they bill under. Everything else points back to this tab.",
        "2. Credentials tab next, but only the ones with a date on them: state license, DEA, malpractice, board certification. The expiry windows calculate themselves.",
        "3. CAQH tab: enter the last attestation date for each provider. The sheet counts the 120 days for you.",
        "4. Leave payer enrollment for last. It's the tab that takes the longest, and it's worth more once the credentials underneath it are current.",
      ],
      ["The Dashboard tab fills in on its own once 1-3 are done."],
      ["If something in the sheet doesn't make sense, reply to this email. I read every reply."],
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
      ["The spreadsheet works. I built it to work. But there are three things a file can't do, and they're the reason I built Sokndall:"],
      [
        "- It can't warn you. A date turning red only helps if someone opens the file that week.",
        "- It doesn't keep history. When a payer says \"we never received it\", the sheet shows the current status, not who followed up, when, or what they were told.",
        "- It doesn't catch mismatches. If a provider's name, NPI, TIN or address differs between their record and the group's, the sheet won't notice.",
      ],
      ["Sokndall is the same tracker with those three things added: email alerts before anything expires, a follow-up log for every payer application, and a weekly digest on Monday morning."],
      ["What it doesn't do: it holds no patient data, it doesn't connect to CAQH or payer portals, and it doesn't do primary source verification. It organizes the person doing the work."],
      ["The price is on the site, no sales call: $79/month for up to 3 providers, $299 for up to 15. 14-day trial, cancel inside the app.", { link: PRICING("e3") }],
      SIGNATURE,
    ],
  },
  {
    step: "e3b",
    day: 12,
    subject: "Tracking credentialing across several clients",
    paragraphs: [
      ["Hi,"],
      ["If you're keeping credentialing for more than one practice, the spreadsheet runs into a specific wall: one file per client, or one file where every client's providers and payers are mixed together. Neither warns you before something expires, and neither keeps the follow-up history a payer dispute needs."],
      [
        "Sokndall's Billing Co plan is built for that case:",
        "- Up to 50 providers across multiple tax IDs, each client kept separate.",
        "- Email alerts before any license, DEA, malpractice or CAQH attestation lapses.",
        "- A follow-up log on every payer application, and a weekly digest on Monday.",
        "- 10 users included.",
      ],
      ["What it doesn't do: it holds no patient data, it doesn't connect to CAQH or payer portals, and it doesn't do primary source verification."],
      ["$699/month, published, no sales call. 14-day trial, cancel inside the app.", { link: PRICING("e3b") }],
      SIGNATURE,
    ],
  },
  {
    step: "e4",
    day: 20,
    subject: "One question",
    paragraphs: [
      ["Hi,"],
      ["Last email from me unless you write back. One question:"],
      ["What are you using today to keep track of payer enrollment status? A sheet, the payer portals themselves, a tool, memory?"],
      ["Just reply with a line. I'm building Sokndall around how people actually do this, and the answers shape what comes next."],
      SIGNATURE,
    ],
  },
];

// Personal mailboxes get e3; any other domain — a practice, a billing or RCM
// company — gets e3b, the Billing Co version.
const PERSONAL_DOMAINS = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "outlook.com", "hotmail.com", "live.com",
  "icloud.com", "me.com", "aol.com", "proton.me", "protonmail.com", "msn.com",
]);

export function thirdStepFor(email) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  return PERSONAL_DOMAINS.has(domain) ? "e3" : "e3b";
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
