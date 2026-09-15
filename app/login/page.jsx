"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClass, inputClass } from "@/components/app/ui";
import SubmitButton from "@/components/app/SubmitButton";
import { AuthField, AuthShell, Captcha, Divider, GoogleButton, PasswordInput, captchaRequired, safeNext } from "@/components/app/AuthParts";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

// Sign in. Newcomers start at /signup; old links to /login?mode=signup are
// forwarded there with their parameters.
function Login() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const next = safeNext(params.get("next")) ?? "/dashboard";

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [error, setError] = useState(params.get("error") === "link" ? "That link has expired or was already used. Sign in, or ask for a new one." : null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.get("mode") === "signup") {
      const rest = new URLSearchParams(params);
      rest.delete("mode");
      router.replace(`/signup${rest.toString() ? `?${rest}` : ""}`);
    }
  }, [params, router]);

  async function google() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setError("Google sign-in isn't available right now. Use your email and password.");
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (captchaRequired() && !captcha) {
      setError("Complete the check above the button.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
      options: { captchaToken: captcha ?? undefined },
    });
    setLoading(false);
    if (error) {
      // One message for a wrong email or a wrong password: never say which.
      if (/rate|many/i.test(error.message)) setError("Too many attempts. Wait a few minutes and try again, or reset your password.");
      else if (/confirm/i.test(error.message)) setError("Confirm your email first — open the link we sent you.");
      else setError("Email or password is incorrect.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  const signUpHref = `/signup${params.toString() ? `?${params.toString()}` : ""}`;

  return (
    <AuthShell
      title="Sign in"
      subtitle="Credential and payer enrollment tracking."
      footer={
        <>
          New to Sokndall?{" "}
          <Link href={signUpHref} className="font-medium text-brand-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mt-6">
        <GoogleButton onClick={google} />
      </div>
      <Divider />
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <AuthField id="li-email" label="Email">
          <input id="li-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={inputClass} />
        </AuthField>
        <AuthField
          id="li-password"
          label="Password"
          aside={
            <Link href="/forgot-password" onClick={() => { try { sessionStorage.setItem("sokndall-email", email); } catch {} }} className="text-xs font-medium text-brand-600 hover:underline">
              Forgot password?
            </Link>
          }
        >
          <PasswordInput id="li-password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </AuthField>
        <Captcha onToken={setCaptcha} />
        {error && <p role="alert" className="text-sm text-status-expired">{error}</p>}
        <SubmitButton pending={loading} className={`${buttonClass("primary")} w-full`}>
          {loading ? "Signing in…" : "Sign in"}
        </SubmitButton>
      </form>
    </AuthShell>
  );
}
