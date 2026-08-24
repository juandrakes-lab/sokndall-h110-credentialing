"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";

export async function createPayer(formData) {
  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  const supabase = await createClient();
  const { error } = await supabase.from("payers").insert({
    org_id: org.id,
    name: formData.get("name")?.toString().trim(),
    payer_type: formData.get("payer_type")?.toString(),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/payers");
  revalidatePath("/enrollments");
  redirect("/payers");
}

export async function updatePayer(payerId, formData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("payers")
    .update({
      name: formData.get("name")?.toString().trim(),
      payer_type: formData.get("payer_type")?.toString(),
    })
    .eq("id", payerId);

  if (error) throw new Error(error.message);

  revalidatePath("/payers");
  revalidatePath("/enrollments");
  redirect("/payers");
}

export async function deletePayer(payerId) {
  const supabase = await createClient();
  const { error } = await supabase.from("payers").delete().eq("id", payerId);
  if (error) throw new Error(error.message);

  revalidatePath("/payers");
  revalidatePath("/enrollments");
  redirect("/payers");
}
