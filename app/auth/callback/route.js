import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth and email-confirmation links land here. `next` carries where the
// person was headed (choose a plan, accept an invitation); same-site only.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${target}`);
}
