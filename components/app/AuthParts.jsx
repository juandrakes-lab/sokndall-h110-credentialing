"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { inputClass } from "@/components/app/ui";
import AuthStories from "@/components/app/AuthStories";
import Logo from "@/components/brand/Logo";

// The frame every access screen shares — sign up, log in, forgot/reset
// password, choosing a plan, an invitation. The form on the app ground; on
// a laptop, a petrol panel on the right with short stories of the product
// (AuthStories) that stays put while the form scrolls. On a phone only the form.
const STEPS = ["Your account", "Plan and payment", "Your practice"];

// `panel={false}` gives the whole width to content that needs it (the three plans).
export function AuthShell({ title, subtitle, children, footer, eyebrow, step, wide = false, panel = true, story = 0 }) {
  return (
    <main className={`app-ground app-type grid min-h-screen lg:gap-4 lg:p-4 ${panel ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)]" : ""}`}>
      <div className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:min-h-[calc(100vh-2rem)] lg:py-4">
        <Link href="/" className="flex w-fit items-center py-2 text-brand-700">
          <Logo className="h-[15px] w-auto" />
        </Link>

        <div className={`mx-auto flex w-full flex-1 flex-col justify-center py-10 ${wide ? (panel ? "max-w-3xl" : "max-w-5xl") : "max-w-[400px]"}`}>
          {step && (
            <ol className="mb-6 flex items-center gap-2" aria-label={`Step ${step} of ${STEPS.length}: ${STEPS[step - 1]}`}>
              {STEPS.map((label, i) => (
                <li key={label} className="flex items-center gap-2">
                  <span className={`h-1.5 rounded-full ${i + 1 === step ? "w-8 bg-brand-700" : i + 1 < step ? "w-4 bg-brand-500" : "w-4 bg-ink-200"}`} />
                </li>
              ))}
              <li className="ml-1 text-xs font-medium text-ink-500">
                Step {step} of {STEPS.length} · {STEPS[step - 1]}
              </li>
            </ol>
          )}
          {eyebrow}
          {title && <h1 className="text-[2rem] font-normal leading-[1.1] tracking-[-0.03em] text-ink-900">{title}</h1>}
          {subtitle && <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">{subtitle}</p>}
          {children}
          {footer && <div className="mt-8 text-sm text-ink-700">{footer}</div>}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-500">
          <span>© {new Date().getFullYear()} Sokndall</span>
          <span className="flex gap-4">
            <Link href="/security" className="hover:text-ink-900">Security</Link>
            <Link href="/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link href="/terms" className="hover:text-ink-900">Terms</Link>
          </span>
        </div>
      </div>

      {panel && (
        <aside className="auth-panel sticky top-4 hidden h-[calc(100vh-2rem)] overflow-hidden rounded-[28px] lg:block">
          <AuthStories start={story} />
        </aside>
      )}
    </main>
  );
}

export function GoogleButton({ onClick, label = "Continue with Google", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 transition hover:bg-ink-50 disabled:opacity-60"
    >
      <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
      </svg>
      {label}
    </button>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-ink-500">
      <div className="h-px flex-1 bg-ink-200" />
      or with email
      <div className="h-px flex-1 bg-ink-200" />
    </div>
  );
}

// A labelled input with its error; `children` goes to the right of the label.
export function AuthField({ id, label, error, hint, aside, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-ink-700">
          {label}
        </label>
        {aside}
      </div>
      <div className={error ? "[&_input]:border-status-expired [&_input]:ring-2 [&_input]:ring-status-expired-bg" : ""}>{children}</div>
      {error ? <p role="alert" className="text-xs text-status-expired">{error}</p> : hint && <p className="text-xs text-ink-500">{hint}</p>}
    </div>
  );
}

// Password input with a show/hide toggle (instead of relying on retyping).
export function PasswordInput({ id, value, onChange, onBlur, autoComplete, name }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name ?? id}
        type={shown ? "text" : "password"}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        className={`${inputClass} pr-16`}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        className="absolute inset-y-0 right-2 my-auto h-7 rounded px-2 text-xs font-medium text-ink-500 hover:bg-ink-100 hover:text-ink-900"
        aria-label={shown ? "Hide password" : "Show password"}
      >
        {shown ? "Hide" : "Show"}
      </button>
    </div>
  );
}

export function PasswordChecklist({ checks }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs" aria-label="Password requirements">
      {checks.map((c) => (
        <li key={c.key} className={`flex items-center gap-1.5 ${c.ok ? "text-status-active" : "text-ink-500"}`}>
          <span aria-hidden="true">{c.ok ? "✓" : "○"}</span>
          {c.label}
        </li>
      ))}
    </ul>
  );
}

// Cloudflare Turnstile (bot check), only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is
// set — Supabase's CAPTCHA protection must be switched on with the matching
// secret at the same time (launch checklist). Without the key it renders
// nothing and forms work as before.
export function Captcha({ onToken }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const box = useRef(null);
  const uid = useId();

  useEffect(() => {
    if (!siteKey || !box.current) return;
    let widget;
    const render = () => {
      widget = window.turnstile?.render(box.current, { sitekey: siteKey, callback: onToken, "expired-callback": () => onToken(null) });
    };
    if (window.turnstile) render();
    else {
      const s = document.createElement("script");
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.onload = render;
      document.head.appendChild(s);
    }
    return () => widget && window.turnstile?.remove(widget);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- render once
  }, [siteKey]);

  if (!siteKey) return null;
  return <div ref={box} id={`captcha-${uid}`} className="min-h-[65px]" />;
}

export const captchaRequired = () => Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

// Only same-site paths: never bounce a sign-in to another origin.
export function safeNext(value) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : null;
}
