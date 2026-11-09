"use server";

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
