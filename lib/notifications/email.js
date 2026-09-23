import { businessDate, daysLabel, daysUntil, formatDate } from "@/lib/credentials";
import { ENROLLMENT_STATUS_LABELS } from "@/lib/enrollments";

// Email bodies for alerts and the weekly digest. Inline styles and tables
// only — that's what mail clients render. Every email has a plain-text twin.

const COLORS = {
  red: { fg: "#b91c1c", bg: "#fef2f2" },
  amber: { fg: "#b45309", bg: "#fffbeb" },
  neutral: { fg: "#475569", bg: "#f1f5f9" },
};
const INK = "#0f172a";
const MUTED = "#64748b";
const BRAND = "#0e2a2e";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const SITE = () => (process.env.NEXT_PUBLIC_SITE_URL || "https://sokndall.com").replace(/\/$/, "");

// Email clients do not render SVG, so the logo goes as a 2x PNG
// (public/brand/sokndall-logotype-email.png); its alt keeps the name when
// images are blocked.
// Links in an email point at the live site; the in-app preview passes its own
// origin so they open in the app being looked at.
let base = null;
export function appUrl(path = "/dashboard") {
  return `${base ?? SITE()}${path}`;
}
function withBase(baseUrl, render) {
  base = baseUrl ? baseUrl.replace(/\/$/, "") : null;
  try {
    return render();
  } finally {
    base = null;
  }
}

function pill(text, tone) {
  const c = COLORS[tone] ?? COLORS.neutral;
  return `<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${c.bg};color:${c.fg};font-size:12px;font-weight:600;white-space:nowrap">${esc(text)}</span>`;
}

function layout({ heading, intro, body, cta }) {
  return `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${INK}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px">
<tr><td style="padding:24px 28px 8px"><img src="${appUrl("/brand/sokndall-logotype-email.png")}" width="140" height="20" alt="Sokndall" style="display:block;border:0;color:${BRAND};font-size:18px;font-weight:700"></td></tr>
<tr><td style="padding:8px 28px 0;font-size:20px;font-weight:700">${esc(heading)}</td></tr>
<tr><td style="padding:6px 28px 16px;font-size:14px;line-height:1.5;color:${MUTED}">${esc(intro)}</td></tr>
${body}
<tr><td style="padding:20px 28px 28px"><a href="${esc(cta.href)}" style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:10px 18px;border-radius:8px">${esc(cta.label)}</a></td></tr>
</table>
<p style="font-size:12px;color:${MUTED};margin:16px 0 0">You get this because you're on a Sokndall account. The account owner can change the alert days in Settings.</p>
</td></tr></table></body></html>`;
}

function section(title, rowsHtml) {
  if (!rowsHtml) return "";
  return `<tr><td style="padding:8px 28px 0;font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${MUTED}">${esc(title)}</td></tr>
<tr><td style="padding:6px 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e2e8f0">${rowsHtml}</table></td></tr>`;
}

function row({ href, title, detail, right }) {
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px">
<a href="${esc(href)}" style="color:${INK};text-decoration:none;font-weight:600">${esc(title)}</a>
<div style="color:${MUTED};font-size:13px;margin-top:2px">${esc(detail)}</div></td>
<td align="right" style="padding:10px 0 10px 12px;border-bottom:1px solid #e2e8f0;vertical-align:top">${right}</td></tr>`;
}

const who = (i) => (i.client ? `${i.who} (${i.client})` : i.who);

function deadlineRow(i) {
  const tone = i.days <= 14 ? "red" : i.days <= 30 ? "amber" : "neutral";
  return row({
    href: appUrl(i.path),
    title: who(i),
    detail: `${i.what} · due ${formatDate(i.date)}`,
    right: pill(daysLabel(i.days), tone),
  });
}

// One alert email: the items that reached a new rung today.
export function renderAlertEmail(orgName, items, { baseUrl } = {}) {
  return withBase(baseUrl, () => alertEmail(orgName, items));
}

function alertEmail(orgName, items) {
  const worst = items.some((i) => i.severity === "red") ? "red" : items.some((i) => i.severity === "amber") ? "amber" : "neutral";
  const expired = items.filter((i) => i.level === "expired").length;
  const subject =
    expired > 0
      ? `${expired} expired: action needed — ${orgName}`
      : `${items.length} deadline${items.length === 1 ? "" : "s"} coming up — ${orgName}`;

  const html = layout({
    heading: expired ? "Something has expired" : "Deadlines coming up",
    intro:
      worst === "red"
        ? "These need action now — a lapsed credential turns visits into denied claims."
        : worst === "amber"
          ? "These need action soon: a renewal can take weeks."
          : "Coming up on the calendar, with room to plan.",
    body: section("Due", items.map(deadlineRow).join("")),
    cta: { href: appUrl("/dashboard"), label: "Open the dashboard" },
  });

  const text = [
    `${subject}`,
    "",
    ...items.map((i) => `- ${who(i)}: ${i.what}, due ${formatDate(i.date)} (${daysLabel(i.days)})`),
    "",
    `Dashboard: ${appUrl("/dashboard")}`,
  ].join("\n");

  return { subject, html, text };
}

const LIMIT = 15;

function moreRow(n, path) {
  return n > 0
    ? `<tr><td colspan="2" style="padding:10px 0;font-size:13px"><a href="${esc(appUrl(path))}" style="color:${BRAND}">and ${n} more</a></td></tr>`
    : "";
}

// The Monday digest.
export function renderDigestEmail(orgName, digest, { baseUrl } = {}) {
  return withBase(baseUrl, () => digestEmail(orgName, digest));
}

function digestEmail(orgName, { queue, stalled, expirations }) {
  const subject = `Your week: ${queue.length} follow-up${queue.length === 1 ? "" : "s"}, ${expirations.length} expiring — ${orgName}`;

  const queueRows =
    queue
      .slice(0, LIMIT)
      .map((e) => {
        const days = e.next ? daysUntil(e.next) : 0;
        return row({
          href: appUrl(e.path),
          title: `${who(e)} · ${e.payer}`,
          detail: `${ENROLLMENT_STATUS_LABELS[e.status]}${e.lastRef ? ` · last ref. ${e.lastRef}` : ""}`,
          right: pill(days < 0 ? `Overdue since ${formatDate(e.next)}` : formatDate(e.next), days < 0 ? "red" : "neutral"),
        });
      })
      .join("") + moreRow(queue.length - LIMIT, "/follow-ups");

  const stalledRows =
    stalled
      .slice(0, LIMIT)
      .map((e) =>
        row({
          href: appUrl(e.path),
          title: `${who(e)} · ${e.payer}`,
          detail: `${ENROLLMENT_STATUS_LABELS[e.status]} since ${formatDate(businessDate(e.changedAt))}`,
          right: pill("Stalled", "amber"),
        })
      )
      .join("") + moreRow(stalled.length - LIMIT, "/follow-ups");

  const expirationRows =
    expirations.slice(0, LIMIT).map(deadlineRow).join("") + moreRow(expirations.length - LIMIT, "/dashboard");

  const html = layout({
    heading: "Your week in credentialing",
    intro: "Who to call this week, what's stuck with a payer, and what expires in the next 90 days.",
    body:
      section(`Follow-ups this week · ${queue.length}`, queue.length ? queueRows : "") +
      section(`Stalled 30+ days · ${stalled.length}`, stalled.length ? stalledRows : "") +
      section(`Expiring in 90 days · ${expirations.length}`, expirations.length ? expirationRows : ""),
    cta: queue.length
      ? { href: appUrl("/follow-ups"), label: "Open this week's follow-ups" }
      : { href: appUrl("/dashboard"), label: "Open the dashboard" },
  });

  const text = [
    subject,
    "",
    `FOLLOW-UPS THIS WEEK (${queue.length})`,
    ...queue.map((e) => `- ${who(e)} · ${e.payer}: ${ENROLLMENT_STATUS_LABELS[e.status]}, follow up ${formatDate(e.next)}`),
    "",
    `STALLED 30+ DAYS (${stalled.length})`,
    ...stalled.map((e) => `- ${who(e)} · ${e.payer}: ${ENROLLMENT_STATUS_LABELS[e.status]} since ${formatDate(businessDate(e.changedAt))}`),
    "",
    `EXPIRING IN 90 DAYS (${expirations.length})`,
    ...expirations.map((i) => `- ${who(i)}: ${i.what}, due ${formatDate(i.date)} (${daysLabel(i.days)})`),
    "",
    `Follow-ups: ${appUrl("/follow-ups")}`,
  ].join("\n");

  return { subject, html, text };
}
