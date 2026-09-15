"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { emailError } from "@/lib/validation";
import { AuthField, AuthShell, Captcha, captchaRequired } from "@/components/app/AuthParts";

// "Forgot password?": always the same answer, whether or not the address has
// an account — the page never reveals who is signed up. The link lands on
// /reset-password through /auth/callback.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setEmail(sessionStorage.getItem("sokndall-email") ?? "");
    } catch {}
  }, []);

  async function submit(e) {
    e.preventDefault();
    const problem = !email.trim() ? "Enter your email." : emailError(email);
    if (problem) {
      setError(problem);
      return;
    }
    if (captchaRequired() && !captcha) {
      setError("Complete the check above the button.");
      return;
    }
    setError(null);
    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
      captchaToken: captcha ?? undefined,
    });
    setLoading(false);
    if (error && /rate|many/i.test(error.message)) {
      setError("Too many requests. Wait a few minutes and try again.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your inbox"
        subtitle={`If an account exists for ${email.trim()}, we sent it a link to choose a new password. The link works for one hour.`}
        footer={<Link href="/login" className="font-medium text-brand-600 hover:underline">Back to sign in</Link>}
      >
        <p className="mt-5 text-sm text-ink-500">Nothing after a few minutes? Check spam, or make sure it&apos;s the email you signed up with.</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send you a link to choose a new password."
      footer={<Link href="/login" className="font-medium text-brand-600 hover:underline">Back to sign in</Link>}
    >
      <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4">
        <AuthField id="fp-email" label="Email">
          <input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
        </AuthField>
        <Captcha onToken={setCaptcha} />
        {error && <p role="alert" className="text-sm text-status-expired">{error}</p>}
        <SubmitButton pending={loading} className={`${buttonClass("primary")} w-full`}>
          {loading ? "Sending…" : "Send reset link"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
