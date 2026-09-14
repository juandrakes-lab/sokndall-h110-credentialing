import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import AppNav from "@/components/app/AppNav";
import ClientSwitcher from "@/components/app/ClientSwitcher";
import { accountAccess } from "@/lib/billing";
import { signOut } from "./actions";
import SubmitButton from "@/components/app/SubmitButton";

// The entire authenticated app is per-user and behind a redirect — never index it.
export const metadata = {
  title: "Sokndall",
  robots: { index: false, follow: false },
};

function NoClients({ email }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5">
      <div className="max-w-md text-center">
        <p className="text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>
        <h1 className="mt-6 text-xl font-semibold text-ink-900">No clients to work on right now</h1>
        <p className="mt-2 text-sm text-ink-500">
          The clients you had access to were archived or removed from the account. Ask the account owner to give you
          access to a client — you&apos;ll see it here as soon as they do.
        </p>
        <form action={signOut} className="mt-6">
          <SubmitButton className="text-sm text-ink-500 hover:text-ink-900">Sign out ({email})</SubmitButton>
        </form>
      </div>
    </main>
  );
}

export default async function AppLayout({ children }) {
  const { user, org, role, practice, clients, client, multiClient } = await getAppContext();

  if (!user) redirect("/login");
  // A login without an account chooses a plan first; an account without its
  // practice finishes onboarding.
  if (!org) redirect("/start");
  // A member whose clients were all archived or deleted: nothing to work on,
  // said plainly instead of an error.
  if (role !== "owner" && clients.length === 0) return <NoClients email={user.email} />;
  if (!practice) redirect("/onboarding");

  const access = accountAccess(org);
  const banner =
    access.state === "trial" || access.state === "active"
      ? null
      : { tone: access.writable ? "amber" : "red", text: access.message };

  return (
    <div className="min-h-screen bg-ink-50 lg:flex">
      <aside className="border-b border-ink-200 bg-white lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-6 py-4 lg:block lg:py-6">
          <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-brand-700">
            Sokndall
          </Link>
          {clients.length < 2 && (
            <p className="hidden truncate text-xs text-ink-500 lg:mt-1 lg:block" title={practice.legal_name}>
              {practice.legal_name}
            </p>
          )}
        </div>

        {clients.length > 1 && (
          <div className="px-6 pb-4">
            <ClientSwitcher clients={clients.map((c) => ({ id: c.id, name: c.name }))} activeId={client.id} />
          </div>
        )}

        <div className="pb-3 lg:flex-1 lg:pb-0">
          <AppNav showClients={multiClient} />
        </div>

        <div className="hidden border-t border-ink-100 px-6 py-4 lg:block">
          {access.state === "trial" && <p className="mb-2 text-xs text-ink-500">{access.message}</p>}
          <p className="truncate text-xs text-ink-500" title={user.email}>
            {user.email}
          </p>
          <form action={signOut}>
            <SubmitButton className="mt-1 text-sm font-medium text-ink-700 hover:text-ink-900">
              Sign out
            </SubmitButton>
          </form>
        </div>
      </aside>

      <main className="min-w-0 flex-1 lg:pl-60">
        {banner && (
          <div
            role="status"
            className={`border-b px-5 py-3 text-sm sm:px-8 ${
              banner.tone === "red"
                ? "border-status-expired/30 bg-status-expired-bg text-status-expired"
                : "border-status-expiring/30 bg-status-expiring-bg text-status-expiring"
            }`}
          >
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
              <span>{banner.text}</span>
              {role === "owner" && (
                <Link href="/settings#billing" className="font-medium underline">
                  {access.writable ? "Billing" : "Choose a plan"}
                </Link>
              )}
            </div>
          </div>
        )}
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-10">{children}</div>
        <div className="border-t border-ink-200 px-5 py-4 text-center lg:hidden">
          <form action={signOut}>
            <SubmitButton className="text-sm text-ink-500">
              Sign out ({user.email})
            </SubmitButton>
          </form>
        </div>
      </main>
    </div>
  );
}
