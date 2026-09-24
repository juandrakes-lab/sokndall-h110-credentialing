"use server";

import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";

// The free-template form (components/neo/EmailCapture). Signed-out visitors
// post here; the anon key can only reach template_leads through the three
// security definer functions in 20260924000000_template_leads.sql, never the
// table itself — no service-role client in a request path.
//
// The form only says "sent" when Resend accepted the email. A repeat request
// is sent again (someone who lost the email asks twice), except inside ten
// minutes of the last send, which answers "sent" without a second copy so the
// form can't be turned on someone else's inbox.

const TEMPLATE_URL = "https://docs.google.com/spreadsheets/d/1oB5qRAYgkcRr21yqr2NMkKMsVYoneZwwFr3OLs6ejO8/copy";
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const field = (formData, name, max) => {
  const value = formData.get(name)?.toString().trim() ?? "";
  return value ? value.slice(0, max) : null;
};

export async function requestTemplate(_prev, formData) {
  const email = field(formData, "email", 254)?.toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return { status: "error", message: "That doesn't look like an email address. Check it and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("capture_template_lead", {
      p_email: email,
      p_source_path: field(formData, "source_path", 300),
      p_utm_source: field(formData, "utm_source", 200),
      p_utm_medium: field(formData, "utm_medium", 200),
      p_utm_campaign: field(formData, "utm_campaign", 200),
      p_referrer: field(formData, "referrer", 1000),
    })
    .single();
  if (error) {
    console.error(`template lead capture failed: ${error.message}`);
    return { status: "error", message: "We couldn't send it just now. Try again in a minute." };
  }
  if (!data.should_send) return { status: "sent" };

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sokndall.com";
  const unsubscribeUrl = `${site}/unsubscribe?t=${data.unsubscribe_token}`;
  try {
    await sendEmail({
      to: email,
      subject: "Your credentialing spreadsheet template",
      text: [
        "Here is the credentialing spreadsheet template you asked for.",
        "",
        `Make your own copy: ${TEMPLATE_URL}`,
        "",
        "It opens in Google Sheets and asks you to make a copy, which is yours to edit. File > Download gets you an Excel version.",
        "",
        "Sokndall",
        "",
        `Unsubscribe: ${unsubscribeUrl}`,
      ].join("\n"),
      html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#0e2a2e;max-width:520px">
<p>Here is the credentialing spreadsheet template you asked for.</p>
<p><a href="${TEMPLATE_URL}" style="display:inline-block;background:#0e2a2e;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:600">Make your own copy</a></p>
<p>It opens in Google Sheets and asks you to make a copy, which is yours to edit. File &gt; Download gets you an Excel version.</p>
<p>Sokndall</p>
<p style="font-size:12px;color:#5b6b6d;margin-top:28px">You're getting this because this address asked for the template at sokndall.com. <a href="${unsubscribeUrl}" style="color:#5b6b6d">Unsubscribe</a></p>
</div>`,
      headers: {
        "List-Unsubscribe": `<${site}/api/unsubscribe?t=${data.unsubscribe_token}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
  } catch (err) {
    console.error(`template email failed: ${err.message}`);
    return { status: "error", message: "We couldn't send it just now. Try again in a minute." };
  }

  await supabase.rpc("mark_template_lead_delivered", { p_lead_id: data.lead_id, p_token: data.unsubscribe_token });
  return { status: "sent" };
}

// The unsubscribe page's button, and the one-click POST mail clients make.
export async function unsubscribe(token) {
  if (!/^[0-9a-f-]{36}$/i.test(token ?? "")) return false;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("unsubscribe_template_lead", { p_token: token });
  if (error) {
    console.error(`unsubscribe failed: ${error.message}`);
    return false;
  }
  return data === true;
}
