import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// `clientOrgId` scopes every client-level read to that client (Billing Co's
// active client): it travels as the x-cred-client header, which the SELECT
// policies narrow to. It can only narrow — RLS still decides what the user
// may see at all.
export async function createClient({ clientOrgId } = {}) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      ...(clientOrgId ? { global: { headers: { "x-cred-client": clientOrgId } } } : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render; the middleware below
            // is what actually refreshes the session cookie on navigation.
          }
        },
      },
    }
  );
}
