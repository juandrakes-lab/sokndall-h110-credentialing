import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth, email-confirmation and password-reset links land here. `next` carries
// where the person was headed (choose a plan, accept an invitation, choose a
// new password); same-site only. An expired or reused link goes back to sign
// in with a plain explanation instead of an error page.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  if (searchParams.get("error")) return NextResponse.redirect(`${origin}/login?error=link`);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return NextResponse.redirect(`${origin}/login?error=link`);
  }

  return NextResponse.redirect(`${origin}${target}`);
}
