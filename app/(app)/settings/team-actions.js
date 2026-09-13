"use server";

import { createHash, randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { sendEmail } from "@/lib/resend";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

async function origin() {
  const h = await headers();
  return process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
}

// Owner invites a teammate (alcance §4.3: blocked at the plan's user N+1).
// The link carries a random token; only its hash is stored. The link is also
// shown to the owner, so an invitation works even if the email is missed.
export async function inviteMember(_prev, formData) {
  const { supabase, org, role, user } = await getAppContext();
  if (role !== "owner") return { error: "Only the account owner can invite people." };

  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { fieldErrors: { email: "Enter an email address." } };
  if (email === user.email.toLowerCase()) return { fieldErrors: { email: "That's you — you're already on the account." } };

  const token = randomBytes(24).toString("base64url");
  const { error } = await supabase.from("cred_invitations").insert({
    org_id: org.id,
    email,
    token_hash: createHash("sha256").update(token).digest("hex"),
  });

  if (error) {
    if (error.message.includes("USER_LIMIT_REACHED")) {
      return { error: `Your plan includes ${org.user_limit} user${org.user_limit === 1 ? "" : "s"}, and all are taken or invited.` };
    }
    if (error.message.includes("ALREADY_MEMBER")) return { fieldErrors: { email: "That person is already on the account." } };
    if (error.code === "23505") return { fieldErrors: { email: "There's already a pending invitation for that address." } };
    return { error: `Couldn't create the invitation: ${error.message}` };
  }

  const link = `${await origin()}/invite/${token}`;
  let emailed = true;
  try {
    await sendEmail({
      to: email,
      subject: `${org.name} invited you to Sokndall`,
      html: `<p>${esc(user.email)} invited you to join <strong>${esc(org.name)}</strong> on Sokndall, where the team tracks provider credentials and payer enrollments.</p><p><a href="${esc(link)}">Accept the invitation</a></p><p>The link works for 14 days.</p>`,
      text: `${user.email} invited you to join ${org.name} on Sokndall.\n\nAccept: ${link}\n\nThe link works for 14 days.`,
    });
  } catch {
    emailed = false;
  }

  revalidatePath("/settings");
  return { saved: Date.now(), link, email, emailed };
}

export async function revokeInvitation(invitationId) {
  const { supabase, role } = await getAppContext();
  if (role !== "owner") return;
  await supabase.from("cred_invitations").delete().eq("id", invitationId);
  revalidatePath("/settings");
}

export async function removeMember(userId) {
  const { supabase, role } = await getAppContext();
  if (role !== "owner") return;
  const { error } = await supabase.rpc("cred_remove_member", { p_user_id: userId });
  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}
