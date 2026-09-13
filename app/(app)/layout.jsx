import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import AppNav from "@/components/app/AppNav";
import { signOut } from "./actions";

// The entire authenticated app is per-user and behind a redirect — never index it.
export const metadata = {
  title: "Sokndall",
  robots: { index: false, follow: false },
};

export default async function AppLayout({ children }) {
  const { user, org, practice } = await getAppContext();

  if (!user) redirect("/login");
  // No organization, or an organization whose practice isn't set up yet:
  // finish onboarding before anything else.
  if (!org || !practice) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-ink-50 lg:flex">
      <aside className="border-b border-ink-200 bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-6 py-4 lg:block lg:py-6">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-brand-700">
            Sokndall
          </Link>
          <p className="hidden truncate text-xs text-ink-500 lg:mt-1 lg:block" title={practice.legal_name}>
            {practice.legal_name}
          </p>
        </div>

        <div className="pb-3 lg:flex-1 lg:pb-0">
          <AppNav />
        </div>

        <div className="hidden border-t border-ink-100 px-6 py-4 lg:block">
          <p className="truncate text-xs text-ink-500" title={user.email}>
            {user.email}
          </p>
          <form action={signOut}>
            <button type="submit" className="mt-1 text-sm font-medium text-ink-700 hover:text-ink-900">
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:pl-60">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">{children}</div>
        <div className="border-t border-ink-200 px-5 py-4 text-center lg:hidden">
          <form action={signOut}>
            <button type="submit" className="text-sm text-ink-500">
              Sign out ({user.email})
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
