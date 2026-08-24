"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setEnrollmentStatus(providerId, payerId, status) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("enrollments")
    .upsert(
      { provider_id: providerId, payer_id: payerId, status },
      { onConflict: "provider_id,payer_id" }
    );

  if (error) throw new Error(error.message);

  revalidatePath("/enrollments");
}
