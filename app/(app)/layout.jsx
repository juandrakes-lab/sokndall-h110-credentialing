import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/org";
import { signOut } from "./actions";

export default async function AppLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const org = await getCurrentOrg();
  if (!org) redirect("/onboarding");

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-ink-900">H110</span>
            <nav className="flex gap-4 text-sm text-ink-500">
              <Link href="/dashboard" className="hover:text-ink-900">
                Dashboard
              </Link>
              <Link href="/providers" className="hover:text-ink-900">
                Providers
              </Link>
              <Link href="/payers" className="hover:text-ink-900">
                Payers
              </Link>
              <Link href="/enrollments" className="hover:text-ink-900">
                Enrollments
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm text-ink-500">
            <span>{org.name}</span>
            <form action={signOut}>
              <button type="submit" className="hover:text-ink-900">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
