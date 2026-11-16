import Link from "next/link";
import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/org";
import { cookies } from "next/headers";
import AppFrame from "@/components/app/AppFrame";
import { NAV_COOKIE } from "@/components/app/ui";
import { PLANS } from "@/lib/plans";
import { fontVars } from "@/components/app/fonts";
import { weekEndISO } from "@/lib/enrollments";
import { accountAccess } from "@/lib/billing";
import { signOut } from "./actions";
import SubmitButton from "@/components/app/SubmitButton";
import AccessMessage from "@/components/app/AccessMessage";
import DemoBar from "@/components/app/DemoBar";
import { DEMO_EVENTS, demoEmail, tickDemo } from "@/lib/demo";
import { sendEmail } from "@/lib/resend";

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
  const { supabase, supabaseAll, user, org, role, practice, clients, client, multiClient } = await getAppContext();

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
      : { tone: access.writable ? "amber" : "red", text: <AccessMessage access={access} /> };
  const cardless = access.state === "cardless_trial" || access.state === "cardless_ended";

  // A demo account: its own bar instead of the billing banner, the prepared
  // moments applied as they come due, and their emails if the visitor opted in.
  let demoBar = null;
  if (org.demo) {
    const open = access.state === "demo";
    const due = open ? await tickDemo(supabaseAll) : [];
    if (due.length && org.demo.contact_email) {
      for (const key of due) {
        const e = DEMO_EVENTS[key];
        if (!e) continue;
        await sendEmail({
          to: org.demo.contact_email,
          ...demoEmail(`Sokndall demo: ${e.title.toLowerCase()}`, [e.body, `Open the demo from the link you were sent to see it.`, "Juan", "Sokndall"]),
        }).catch(() => {});
      }
    }
    const demo = { ...org.demo, events_done: [...(org.demo.events_done ?? []), ...due] };
    // "Since your last visit" (pedido 2026-11-16): what changed after the
    // previous session ended — payer requests that arrived and applications
    // that crossed the 30 days, both read from the sample data itself.
    let since = null;
    if (open && demo.prev_seen_at) {
      const prev = new Date(demo.prev_seen_at);
      const [{ count: requests }, { count: stalled }] = await Promise.all([
        supabaseAll.from("cred_enrollments").select("id", { count: "exact", head: true }).eq("status", "info_requested").gt("pending_request_at", prev.toISOString()),
        supabaseAll
          .from("cred_enrollments")
          .select("id", { count: "exact", head: true })
          .in("status", ["submitted", "in_review", "info_requested"])
          .gt("status_changed_at", new Date(prev.getTime() - 30 * 86400000).toISOString())
          .lte("status_changed_at", new Date(Date.now() - 30 * 86400000).toISOString()),
      ]);
      since = { requests: requests ?? 0, stalled: stalled ?? 0 };
    }
    demoBar = <DemoBar demo={demo} open={open} since={since} />;
  }

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
        photo={user.user_metadata?.photo_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || null}
        email={user.email}
        trial={access.state === "trial" ? access.message : null}
        signOut={signOut}
        owner={role === "owner"}
        help={{
          org: org.name,
          plan: PLANS[org.plan]?.label ?? org.plan,
          client: multiClient ? client?.name ?? null : null,
        }}
        banner={
          demoBar ??
          (banner && (
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
                    {cardless ? "Add a card" : access.writable ? "Billing" : "Choose a plan"}
                  </Link>
                )}
              </div>
            </div>
          ))
        }
      >
        {children}
      </AppFrame>
    </div>
  );
}
