import { SUPPORT_EMAIL } from "@/lib/legal";

// Thin wrapper over the Resend REST API (no SDK dependency needed for one
// call). Server-only: RESEND_API_KEY must never be exposed to the client.
//
// Everything we send answers to support@: the alerts and the digest go out
// from a no-reply sender, and someone who hits reply on one of them is asking
// for help — that reply should reach a person.
export async function sendEmail({ to, cc, subject, html, text, replyTo = SUPPORT_EMAIL }) {
  const from = process.env.RESEND_FROM_EMAIL ?? "";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: from.includes("<") ? from : `Sokndall <${from}>`,
      to,
      ...(cc ? { cc } : {}),
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject,
      html,
      ...(text ? { text } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }

  return res.json();
}
