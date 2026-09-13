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
