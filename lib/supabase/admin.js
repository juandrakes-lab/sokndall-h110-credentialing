import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. Only ever use this from
// trusted server-only code with no end-user request context — today that
// means the cron routes under app/api/cron/, which need to iterate every
// org to send digests/alerts. Never import this from a page, a Server
// Action reachable by a logged-in user, or anything that runs with a
// specific user's request.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
