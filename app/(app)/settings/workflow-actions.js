"use server";

import { revalidatePath } from "next/cache";
import { getAppContext } from "@/lib/org";

export async function saveWorkflowOptions(_prev, formData) {
  const { supabaseAll, role } = await getAppContext();
  if (role !== "owner") return { error: "Only the account owner can change this." };
  const days = Number(formData.get("at_risk_days"));
  const rtb = formData.get("ready_to_bill") === "on";
  const { error } = await supabaseAll.rpc("cred_set_workflow_options", { p_at_risk_days: days, p_ready_to_bill: rtb });
  if (error) return { error: error.message.replace(/^[A-Z_]+: /, "") };
  revalidatePath("/", "layout");
  return { saved: true, days, rtb };
}
