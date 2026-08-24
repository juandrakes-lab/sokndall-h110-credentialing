"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createOrganization(formData) {
  const name = formData.get("name")?.toString().trim();
  if (!name) return;

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_organization", { org_name: name });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}
