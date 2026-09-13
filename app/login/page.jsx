"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { buttonClass, inputClass } from "@/components/app/ui";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState("sign-in"); // "sign-in" | "sign-up"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setError(error.message);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const { data, error } =
      mode === "sign-in"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
          });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // With email confirmation on, sign-up returns no session until the link
    // in the confirmation email is clicked.
    if (mode === "sign-up" && !data.session) {
      setNotice(`We sent a confirmation link to ${email}. Open it to continue.`);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-12">
      <div className="w-full max-w-sm">
        <p className="text-center text-lg font-semibold tracking-tight text-brand-700">Sokndall</p>

        <div className="mt-6 rounded-xl border border-ink-200 bg-white px-6 py-7 shadow-sm">
          <h1 className="text-xl font-semibold text-ink-900">
            {mode === "sign-in" ? "Sign in" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-ink-500">Credential and payer enrollment tracking.</p>

          <button type="button" onClick={handleGoogle} className={`${buttonClass("secondary")} mt-6 w-full`}>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-ink-500">
            <div className="h-px flex-1 bg-ink-200" />
            or
            <div className="h-px flex-1 bg-ink-200" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              placeholder="Password"
              autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />

            {error && <p className="text-sm text-status-expired">{error}</p>}
            {notice && <p className="text-sm text-status-active">{notice}</p>}

            <button type="submit" disabled={loading} className={`${buttonClass("primary")} w-full`}>
              {loading ? "One moment…" : mode === "sign-in" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "sign-in" ? "sign-up" : "sign-in");
            setError(null);
            setNotice(null);
          }}
          className="mt-4 w-full text-center text-sm font-medium text-brand-600 hover:underline"
        >
          {mode === "sign-in" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </main>
  );
}
