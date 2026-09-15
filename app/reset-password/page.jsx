"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { passwordChecks } from "@/lib/password-rules";
import { AuthField, AuthShell, PasswordChecklist, PasswordInput } from "@/components/app/AuthParts";

// Where the reset link lands (via /auth/callback, which opens a short
// recovery session). Without that session there's nothing to reset.
export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(undefined);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once
  }, []);

  const checks = passwordChecks(password, { email: user?.email, name: user?.user_metadata?.full_name });
  const passwordProblem = checks.every((c) => c.ok) ? null : "The password doesn't meet the requirements below.";
  const confirmProblem = !confirm ? "Type the password again." : confirm !== password ? "The two passwords don't match." : null;

  async function submit(e) {
    e.preventDefault();
    if (passwordProblem || confirmProblem) {
      setAttempted(true);
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(/same|different/i.test(error.message) ? "Choose a password you haven't used here before." : "Couldn't change the password. Ask for a new reset link and try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (user === undefined) return <AuthShell title="Reset your password" subtitle="One moment…" />;

  if (!user) {
    return (
      <AuthShell
        title="This link has expired"
        subtitle="Reset links work once and for one hour. Ask for a new one."
        footer={<Link href="/login" className="font-medium text-brand-600 hover:underline">Back to sign in</Link>}
      >
        <Link href="/forgot-password" className={`${buttonClass("primary")} mt-6 w-full`}>
          Send a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Choose a new password" subtitle={`For ${user.email}.`}>
      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4">
        <AuthField id="rp-password" label="New password" error={attempted ? passwordProblem : null}>
          <PasswordInput id="rp-password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </AuthField>
        <PasswordChecklist checks={checks} />
        <AuthField id="rp-confirm" label="Confirm new password" error={attempted ? confirmProblem : null}>
          <PasswordInput id="rp-confirm" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
        </AuthField>
        {error && <p role="alert" className="text-sm text-status-expired">{error}</p>}
        <SubmitButton pending={loading} className={`${buttonClass("primary")} w-full`}>
          {loading ? "Saving…" : "Save new password"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
