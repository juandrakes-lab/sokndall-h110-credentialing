"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { emailError } from "@/lib/validation";
import { TERMS_VERSION, passwordChecks } from "@/lib/password-rules";
import { AuthField, AuthShell, Captcha, Divider, GoogleButton, PasswordChecklist, PasswordInput, captchaRequired, safeNext } from "@/components/app/AuthParts";

export default function SignupPage() {
  return (
    <Suspense>
      <Signup />
    </Suspense>
  );
}

function signupErrors(v) {
  const e = {};
  if (!v.first_name.trim()) e.first_name = "Enter your first name.";
  if (!v.last_name.trim()) e.last_name = "Enter your last name.";
  if (!v.email.trim()) e.email = "Enter your work email.";
  else if (emailError(v.email)) e.email = emailError(v.email);
  if (!passwordChecks(v.password, { email: v.email, name: v.first_name }).every((c) => c.ok)) e.password = "The password doesn't meet the requirements below.";
  if (!v.confirm) e.confirm = "Type the password again.";
  else if (v.confirm !== v.password) e.confirm = "The two passwords don't match.";
  if (!v.terms) e.terms = "Accept the Terms and Privacy Policy to continue.";
  return e;
}

// The first screen of Sokndall for a newcomer (alcance §10.1, step 1): who you
// are, then choose a plan. A login that came from an invitation goes back to
// it (?next=/invite/…) instead.
function Signup() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const next = safeNext(params.get("next")) ?? "/start";
  const callback = `${typeof window === "undefined" ? "" : window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  const [v, setV] = useState({ first_name: "", last_name: "", email: params.get("email") ?? "", password: "", confirm: "", terms: false });
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState(null);
  const [loading, setLoading] = useState(false);

  const errors = signupErrors(v);
  const show = (f) => (attempted || touched[f] ? errors[f] : null);
  const set = (f) => (e) => setV((s) => ({ ...s, [f]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const blur = (f) => () => setTouched((t) => ({ ...t, [f]: true }));
  const checks = passwordChecks(v.password, { email: v.email, name: v.first_name });

  async function google() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback } });
    if (error) setError("Google sign-up isn't available right now. Use your email instead.");
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (Object.keys(errors).length) {
      setAttempted(true);
      const first = ["first_name", "last_name", "email", "password", "confirm", "terms"].find((f) => errors[f]);
      document.getElementById(`su-${first}`)?.focus();
      return;
    }
    if (captchaRequired() && !captcha) {
      setError("Complete the check above the button.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: v.email.trim().toLowerCase(),
      password: v.password,
      options: {
        emailRedirectTo: callback,
        captchaToken: captcha ?? undefined,
        data: { first_name: v.first_name.trim(), last_name: v.last_name.trim(), full_name: `${v.first_name.trim()} ${v.last_name.trim()}`, terms_version: TERMS_VERSION, terms_accepted_at: new Date().toISOString() },
      },
    });
    setLoading(false);

    if (error) {
      // Never confirm or deny that an account exists for an address.
      if (/registered|exists/i.test(error.message)) {
        setError("We couldn't create an account with this email. If you already have one, sign in or reset your password.");
      } else if (/password/i.test(error.message)) {
        setError("That password isn't accepted. Choose a longer one with letters and numbers.");
      } else if (/rate|many/i.test(error.message)) {
        setError("Too many attempts from this connection. Wait a few minutes and try again.");
      } else {
        setError("Something went wrong creating your account. Try again in a minute.");
      }
      return;
    }
    // With email confirmation on, there's no session until the link is opened.
    if (!data.session) {
      setSentTo(v.email.trim());
      return;
    }
    router.push(next);
    router.refresh();
  }

  if (sentTo) {
    return (
      <AuthShell title="Check your inbox" subtitle={`We sent a confirmation link to ${sentTo}. Open it to continue — it's valid for 24 hours.`}>
        <p className="mt-5 text-sm text-ink-500">Didn&apos;t get it? Check spam, or wait a minute and sign up again with the same address.</p>
      </AuthShell>
    );
  }

  const signInHref = `/login${params.toString() ? `?${params.toString()}` : ""}`;

  return (
    <AuthShell
      title="Create your account"
      subtitle="14 days free. Your card goes in on the next step; you're not charged until day 15."
      footer={
        <>
          Already have an account?{" "}
          <Link href={signInHref} className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <div className="mt-6">
        <GoogleButton onClick={google} label="Sign up with Google" />
        <p className="mt-2 text-center text-xs text-ink-500">
          By continuing with Google you accept the{" "}
          <Link href="/terms" target="_blank" className="underline">Terms</Link> and{" "}
          <Link href="/privacy" target="_blank" className="underline">Privacy Policy</Link>.
        </p>
      </div>
      <Divider />

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <AuthField id="su-first_name" label="First name" error={show("first_name")}>
            <input id="su-first_name" value={v.first_name} onChange={set("first_name")} onBlur={blur("first_name")} autoComplete="given-name" className={inputClass} />
          </AuthField>
          <AuthField id="su-last_name" label="Last name" error={show("last_name")}>
            <input id="su-last_name" value={v.last_name} onChange={set("last_name")} onBlur={blur("last_name")} autoComplete="family-name" className={inputClass} />
          </AuthField>
        </div>
        <AuthField id="su-email" label="Work email" error={show("email")}>
          <input id="su-email" type="email" value={v.email} onChange={set("email")} onBlur={blur("email")} autoComplete="email" className={inputClass} />
        </AuthField>
        <AuthField id="su-password" label="Password" error={show("password")}>
          <PasswordInput id="su-password" value={v.password} onChange={set("password")} onBlur={blur("password")} autoComplete="new-password" />
        </AuthField>
        <PasswordChecklist checks={checks} />
        <AuthField id="su-confirm" label="Confirm password" error={show("confirm")}>
          <PasswordInput id="su-confirm" value={v.confirm} onChange={set("confirm")} onBlur={blur("confirm")} autoComplete="new-password" />
        </AuthField>
        <div className="flex flex-col gap-1">
          <label className="flex items-start gap-2 text-sm text-ink-700">
            <input id="su-terms" type="checkbox" checked={v.terms} onChange={set("terms")} className="mt-0.5 h-4 w-4 accent-brand-700" />
            <span>
              I accept the <Link href="/terms" target="_blank" className="font-medium text-brand-600 hover:underline">Terms</Link> and the{" "}
              <Link href="/privacy" target="_blank" className="font-medium text-brand-600 hover:underline">Privacy Policy</Link>.
            </span>
          </label>
          {show("terms") && <p role="alert" className="text-xs text-status-expired">{show("terms")}</p>}
        </div>

        <Captcha onToken={setCaptcha} />
        {error && <p role="alert" className="text-sm text-status-expired">{error}</p>}

        <SubmitButton pending={loading} className={`${buttonClass("primary")} w-full`}>
          {loading ? "Creating your account…" : "Create account"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
