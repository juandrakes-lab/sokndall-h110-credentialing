"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchNppes, NPPES_FAILURE_MESSAGES } from "@/lib/nppes";

// Live NPI Registry lookup for the forms. Signed-in users only, so the app
// never acts as an open proxy to CMS.
export async function lookupNpi(npi) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Your session expired — sign in again." };

  const result = await fetchNppes(npi);
  if (!result.ok) return { ok: false, message: NPPES_FAILURE_MESSAGES[result.reason] };
  return { ok: true, record: result.record };
}
