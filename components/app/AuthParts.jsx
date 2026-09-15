"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { inputClass } from "@/components/app/ui";

// The frame every access screen shares: sign up, sign in, forgot/reset password.
export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center text-lg font-semibold tracking-tight text-brand-700">
          Sokndall
        </Link>
        <div className="mt-6 rounded-xl border border-ink-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
          {children}
        </div>
        {footer && <div className="mt-4 text-center text-sm text-ink-700">{footer}</div>}
      </div>
    </main>
  );
}

export function GoogleButton({ onClick, label = "Continue with Google", disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 shadow-sm transition hover:bg-ink-50 disabled:opacity-60"
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
      or
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
