"use server";

import { createHash, randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/resend";
import { emailError } from "@/lib/validation";
import { JUAN_EMAIL, demoEmail } from "@/lib/demo";

// Demo accounts only (lib/demo.js). Every call no-ops for a real account:
// cred_demo_log finds no demo for the caller and writes nothing.

const SECTIONS = ["dashboard", "clients", "providers", "enrollments", "follow-ups", "reports", "report", "documents", "settings", "import-export", "export"];

export async function logDemoVisit(pathname) {
  const section = String(pathname ?? "").split("/")[1];
  if (!SECTIONS.includes(section)) return;
  const supabase = await createClient();
  await supabase.rpc("cred_demo_log", { p_kind: "visit", p_detail: section });
}

export async function logDemoBlocked(feature) {
  const supabase = await createClient();
  await supabase.rpc("cred_demo_log", { p_kind: "blocked", p_detail: String(feature).slice(0, 60) });
}

// The opt-in: this demo's alerts by email for its 3 days.
export async function saveDemoEmail(_prev, formData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  if (email && emailError(email)) return { error: emailError(email) };
  const supabase = await createClient();
  const { error } = await supabase.rpc("cred_demo_set_email", { p_email: email });
  if (error) return { error: "That couldn't be saved. Try again in a minute." };
  if (email) await supabase.rpc("cred_demo_log", { p_kind: "email", p_detail: "left an email" });
  revalidatePath("/", "layout");
  return { saved: email ? "saved" : "removed" };
}

// "Load my real data": tells Juan (he does the import), signs out of the demo
// and goes to the normal 14-day trial sign-up. Nothing from the demo is copied.
export async function loadRealData(_prev, formData) {
  const { org, supabaseAll } = await getAppContext();
  if (!org?.demo) redirect("/dashboard");
  const email = (formData.get("email")?.toString().trim() || org.demo.contact_email || "").toLowerCase();
  if (!email || emailError(email)) return { error: email ? emailError(email) : "Enter the email for your account." };

  await supabaseAll.rpc("cred_demo_set_email", { p_email: email });
  await supabaseAll.rpc("cred_demo_log", { p_kind: "load_real", p_detail: "asked to load real data" });
  await sendEmail({
    to: JUAN_EMAIL,
    replyTo: email,
    ...demoEmail(`${org.demo.firm} wants to load its real data`, [
      `From the ${org.demo.firm} demo: they asked to move to a real account.`,
      `Email: ${email}`,
      "They're on their way to the normal 14-day trial sign-up. Offer to do the import for them.",
    ]),
  }).catch(() => {});

  await supabaseAll.auth.signOut();
  redirect(`/signup?email=${encodeURIComponent(email)}`);
}

// --- The first-session guide (pedido 2026-11-16, demo onboarding) --------

// Step 1: the follow-up on the stalled application, from the guide itself.
// Through the visitor's own session (RLS decides it is theirs), whichever
// client is open.
export async function guideLogFollowUp(_prev, formData) {
  const { org, supabaseAll } = await getAppContext();
  if (!org?.demo) return { error: "Only in the demo." };
  const enrollmentId = formData.get("enrollment_id")?.toString();
  const outcome = formData.get("outcome")?.toString().trim();
  const next = formData.get("next_follow_up_date")?.toString();
  const today = formData.get("contact_date")?.toString();
  if (!outcome) return { error: "Write what happened, in a few words." };
  if (!next || !/^\d{4}-\d{2}-\d{2}$/.test(next) || (today && next < today)) return { error: "Pick the next follow-up date." };
  const { error } = await supabaseAll
    .from("cred_communications")
    .insert({ enrollment_id: enrollmentId, contact_date: today, channel: "phone", outcome: outcome.slice(0, 500) });
  if (error) return { error: "That couldn't be saved. Try again." };
  await supabaseAll.from("cred_enrollments").update({ next_follow_up_date: next }).eq("id", enrollmentId);
  await supabaseAll.rpc("cred_demo_guide", { p_state: "step2" });
  revalidatePath("/", "layout");
  return { saved: true, next };
}

// Step 2: a live link for that client, opened as the client would see it.
export async function guideShowClient(formData) {
  const { org, supabaseAll } = await getAppContext();
  if (!org?.demo) redirect("/home");
  const clientId = formData.get("client_id")?.toString();
  const token = randomBytes(32).toString("base64url");
  const { error } = await supabaseAll.rpc("cred_create_live_link", {
    p_client_org_id: clientId,
    p_token_hash: createHash("sha256").update(token).digest("hex"),
  });
  if (error) redirect("/reports");
  await supabaseAll.rpc("cred_demo_guide", { p_state: "done" });
  revalidatePath("/", "layout");
  redirect(`/status/${token}?from=demo`);
}

export async function guideSkip() {
  const supabase = await createClient();
  await supabase.rpc("cred_demo_guide", { p_state: "skipped" });
  revalidatePath("/", "layout");
}

// "Ask Juan a question": straight to hello@, answered by email.
export async function askJuan(_prev, formData) {
  const { org, supabaseAll } = await getAppContext();
  if (!org?.demo) return { error: "Only in the demo." };
  const question = formData.get("question")?.toString().trim().slice(0, 1000);
  const email = (formData.get("email")?.toString().trim() || org.demo.contact_email || "").toLowerCase();
  if (!question) return { error: "Write your question." };
  if (email && emailError(email)) return { error: emailError(email) };
  await supabaseAll.rpc("cred_demo_log", { p_kind: "ask", p_detail: question.slice(0, 200) });
  const sent = await sendEmail({
    to: JUAN_EMAIL,
    ...(email ? { replyTo: email } : {}),
    ...demoEmail(`Question from the ${org.demo.firm} demo`, [
      `${org.demo.lead_name ?? "The visitor"} (${org.demo.firm}) asked from the demo:`,
      question,
      email ? `Reply to: ${email}` : "They left no email: answer through LinkedIn.",
    ]),
  })
    .then(() => true)
    .catch(() => false);
  if (!sent) return { error: "That didn't go through. Try again in a minute." };
  return { sent: true };
}
