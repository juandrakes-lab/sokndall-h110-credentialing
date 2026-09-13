import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonClass } from "@/components/app/ui";
import { signOut } from "@/app/(app)/actions";

export const metadata = { title: "Join a team — Sokndall", robots: { index: false, follow: false } };

async function accept(token) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.rpc("cred_accept_invitation", { p_token: token });
  if (error) redirect(`/invite/${token}?error=${encodeURIComponent(error.message.split(":")[0])}`);
  redirect("/dashboard");
}

const ERRORS = {
  INVITATION_INVALID: "This invitation is no longer valid.",
  INVITATION_OTHER_EMAIL: "This invitation was sent to a different email address.",
  ALREADY_MEMBER: "This login already belongs to a Sokndall account, so it can't join another one.",
  USER_LIMIT_REACHED: "The account has no free seats left. Ask the owner to make room.",
};

// The link in an invitation email. The token itself is the permission to see
// which account it's for; joining also requires signing in as the invited address.
export default async function InvitePage({ params, searchParams }) {
  const { token } = await params;
  const sp = await searchParams;
  const supabase = await createClient();

  const [{ data: rows }, { data: auth }] = await Promise.all([
    supabase.rpc("cred_invitation_preview", { p_token: token }),
    supabase.auth.getUser(),
  ]);
  const invite = rows?.[0];
  const user = auth?.user;
  const next = `/invite/${token}`;

  let body;
  if (!invite || invite.status !== "pending") {
    body = (
      <>
        <h1 className="text-xl font-semibold text-ink-900">
          {invite?.status === "accepted" ? "Invitation already used" : invite?.status === "expired" ? "Invitation expired" : "Invitation not found"}
        </h1>
        <p className="mt-2 text-sm text-ink-500">Ask the account owner to send you a new one.</p>
      </>
    );
  } else if (!user) {
    body = (
      <>
        <h1 className="text-xl font-semibold text-ink-900">Join {invite.org_name}</h1>
        <p className="mt-2 text-sm text-ink-500">
          You were invited as <strong className="text-ink-900">{invite.email}</strong>. Create a login with that address,
          or sign in if you already have one.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link href={`/login?mode=signup&email=${encodeURIComponent(invite.email)}&next=${encodeURIComponent(next)}`} className={buttonClass("primary")}>
            Create a login
          </Link>
          <Link href={`/login?email=${encodeURIComponent(invite.email)}&next=${encodeURIComponent(next)}`} className={buttonClass("secondary")}>
            I already have one — sign in
          </Link>
        </div>
      </>
    );
  } else if (user.email.toLowerCase() !== invite.email) {
    body = (
      <>
        <h1 className="text-xl font-semibold text-ink-900">Wrong login for this invitation</h1>
        <p className="mt-2 text-sm text-ink-500">
          It was sent to <strong className="text-ink-900">{invite.email}</strong>, and you&apos;re signed in as {user.email}.
        </p>
        <form action={signOut} className="mt-6">
          <button type="submit" className={buttonClass("secondary")}>
            Sign out and switch
          </button>
        </form>
      </>
    );
  } else {
    body = (
      <>
        <h1 className="text-xl font-semibold text-ink-900">Join {invite.org_name}</h1>
        <p className="mt-2 text-sm text-ink-500">You&apos;ll see the providers, enrollments and follow-ups your team works on.</p>
        {sp.error && <p className="mt-4 text-sm text-status-expired">{ERRORS[sp.error] ?? "Something went wrong joining the account."}</p>}
        <form action={accept.bind(null, token)} className="mt-6">
          <button type="submit" className={`${buttonClass("primary")} w-full`}>
            Join {invite.org_name}
          </button>
        </form>
      </>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5">
      <div className="w-full max-w-md">
        <p className="text-center text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>
        <div className="mt-6 rounded-xl border border-ink-200 bg-white px-6 py-7 shadow-sm">{body}</div>
      </div>
    </main>
  );
}
