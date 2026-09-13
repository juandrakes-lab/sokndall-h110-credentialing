"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";

export async function updateOrganization(_prev, formData) {
  const { supabase, org, role } = await getAppContext();
  if (role !== "owner") return { error: "Only the account owner can change these settings." };

  const name = formData.get("name")?.toString().trim();
  const interval = Number(formData.get("caqh_reattestation_interval_days"));
  const fieldErrors = {};
  if (!name) fieldErrors.name = "Enter a name.";
  if (!Number.isInteger(interval) || interval < 30 || interval > 365) {
    fieldErrors.caqh_reattestation_interval_days = "Enter a number of days between 30 and 365.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  // Only these two columns are writable by the customer; plan and limits are
  // not (column privileges in the Fase 1 migration).
  const { error } = await supabase
    .from("cred_organizations")
    .update({ name, caqh_reattestation_interval_days: interval })
    .eq("id", org.id);
  if (error) return { error: `Couldn't save: ${error.message}` };

  revalidatePath("/", "layout");
  return { notice: "Saved. CAQH due dates were recalculated." };
}

// The alert ladder (alcance §3.11): days before a deadline when an email goes
// out. Expired items always alert once on top of these.
export async function updateAlertDays(_prev, formData) {
  const { supabase, org, role } = await getAppContext();
  if (role !== "owner") return { error: "Only the account owner can change these settings." };

  const raw = formData.get("alert_days")?.toString() ?? "";
  const parts = raw.split(/[\s,;]+/).filter(Boolean);
  const days = [...new Set(parts.map(Number))].sort((a, b) => b - a);

  if (parts.length === 0 || days.some((d) => !Number.isInteger(d) || d < 1 || d > 365)) {
    return { fieldErrors: { alert_days: "Enter whole numbers of days between 1 and 365, separated by commas." } };
  }
  if (days.length > 8) return { fieldErrors: { alert_days: "Up to 8 alert days." } };

  const { error } = await supabase.from("cred_organizations").update({ alert_days: days }).eq("id", org.id);
  if (error) return { error: `Couldn't save: ${error.message}` };

  revalidatePath("/settings");
  return { notice: `Saved. Alerts go out ${days.join(", ")} days before each deadline, and once when it's passed.`, value: days.join(", ") };
}
