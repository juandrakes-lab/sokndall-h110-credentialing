import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buttonClass } from "@/components/app/ui";
import { signOut } from "@/app/(app)/actions";
import SubmitButton from "@/components/app/SubmitButton";
import { AuthShell } from "@/components/app/AuthParts";

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

  let view;
  if (!invite || invite.status !== "pending") {
    view = {
      title: invite?.status === "accepted" ? "Invitation already used" : invite?.status === "expired" ? "Invitation expired" : "Invitation not found",
      subtitle: "Ask the account owner to send you a new one.",
    };
  } else if (!user) {
    view = {
      title: `Join ${invite.org_name}`,
      subtitle: (
        <>
          You were invited as <strong className="font-medium text-ink-900">{invite.email}</strong>. Create a login with that
          address, or log in if you already have one.
        </>
      ),
      body: (
        <div className="mt-8 flex flex-col gap-3">
          <Link href={`/signup?email=${encodeURIComponent(invite.email)}&next=${encodeURIComponent(next)}`} className={buttonClass("primary")}>
            Create a login
          </Link>
          <Link href={`/login?email=${encodeURIComponent(invite.email)}&next=${encodeURIComponent(next)}`} className={buttonClass("secondary")}>
            I already have one — log in
          </Link>
        </div>
      ),
    };
  } else if (user.email.toLowerCase() !== invite.email) {
    view = {
      title: "Wrong login for this invitation",
      subtitle: (
        <>
          It was sent to <strong className="font-medium text-ink-900">{invite.email}</strong>, and you&apos;re signed in as {user.email}.
        </>
      ),
      body: (
        <form action={signOut} className="mt-8">
          <SubmitButton className={`${buttonClass("primary")} w-full`}>Sign out and switch</SubmitButton>
        </form>
      ),
    };
  } else {
    view = {
      title: `Join ${invite.org_name}`,
      subtitle: "You'll see the providers, enrollments and follow-ups your team works on.",
      body: (
        <>
          {sp.error && <p className="mt-4 text-sm text-status-expired">{ERRORS[sp.error] ?? "Something went wrong joining the account."}</p>}
          <form action={accept.bind(null, token)} className="mt-8">
            <SubmitButton className={`${buttonClass("primary")} w-full`}>Join {invite.org_name}</SubmitButton>
          </form>
        </>
      ),
    };
  }

  return (
    <AuthShell story={3} title={view.title} subtitle={view.subtitle}>
      {view.body}
    </AuthShell>
  );
}
