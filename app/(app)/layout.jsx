import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { cookies } from "next/headers";
import AppFrame from "@/components/app/AppFrame";
import { NAV_COOKIE } from "@/components/app/ui";
import { fontVars } from "@/components/app/fonts";
import { weekEndISO } from "@/lib/enrollments";
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
    <main className="flex min-h-screen items-center justify-center app-ground app-type px-5">
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
  const { supabase, user, org, role, practice, clients, client, multiClient } = await getAppContext();

  if (!user) redirect("/login");
  // A login without an account chooses a plan first; an account without its
  // practice finishes onboarding.
  if (!org) redirect("/start");
  // A member whose clients were all archived or deleted: nothing to work on,
  // said plainly instead of an error.
  if (role !== "owner" && clients.length === 0) return <NoClients email={user.email} />;
  if (!practice) redirect("/onboarding");

  const displayName = user.user_metadata?.full_name || [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(" ") || user.user_metadata?.name || null;
  const access = accountAccess(org);
  const banner =
    access.state === "trial" || access.state === "active"
      ? null
      : { tone: access.writable ? "amber" : "red", text: access.message };

  const [cookieStore, { count: followUps }] = await Promise.all([
    cookies(),
    // The sidebar's badge: applications whose follow-up is due this week or
    // overdue (the same rule as the Follow-ups queue).
    supabase
      .from("cred_enrollments")
      .select("id, cred_providers!inner(status)", { count: "exact", head: true })
      .eq("cred_providers.status", "active")
      .not("next_follow_up_date", "is", null)
      .lte("next_follow_up_date", weekEndISO()),
  ]);

  return (
    <div className={fontVars}>
      <AppFrame
        initialCollapsed={cookieStore.get(NAV_COOKIE)?.value === "collapsed"}
        showClients={multiClient}
        counts={{ followUps: followUps ?? 0 }}
        clients={clients.map((c) => ({ id: c.id, name: c.name }))}
        activeClientId={client?.id}
        workspaceName={clients.length > 1 ? client?.name ?? practice.legal_name : practice.legal_name}
        displayName={displayName}
        photo={user.user_metadata?.avatar_url || user.user_metadata?.picture || null}
        email={user.email}
        trial={access.state === "trial" ? access.message : null}
        signOut={signOut}
        banner={
          banner && (
            <div
              role="status"
              className={`border-b px-4 py-3 text-sm sm:px-8 ${
                banner.tone === "red"
                  ? "border-status-expired/20 bg-status-expired-bg text-status-expired"
                  : "border-status-expiring/20 bg-status-expiring-bg text-status-expiring"
              }`}
            >
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
                <span>{banner.text}</span>
                {role === "owner" && (
                  <Link href="/settings?tab=billing" className="font-medium underline">
                    {access.writable ? "Billing" : "Choose a plan"}
                  </Link>
                )}
              </div>
            </div>
          )
        }
      >
        {children}
      </AppFrame>
    </div>
  );
}
