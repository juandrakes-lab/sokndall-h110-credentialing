"use client";

import { useState } from "react";

/**
 * 3.5 EmailCapture — one field + button + microcopy on what you get and that
 * one click unsubscribes. Two variants: `embedded` (above the fold, page 4)
 * and `sidebar` (page 16, where it is the only 90-day-gate metric).
 * Client only for submit handling; the offer, the label and the microcopy
 * are all in the server HTML.
 * Image policy: prohibida.
 */
export default function EmailCapture({
  variant = "embedded",
  heading = "Get the free credentialing template",
  buttonLabel = "Email me the template",
  microcopy = "One email with the file. We send a few things about credentialing after that, and one click unsubscribes.",
  action = "#",
}) {
  const [done, setDone] = useState(false);
  const inputId = `ec-${variant}`;

  const wrap =
    variant === "sidebar"
      ? "grid gap-3 border u-hair rounded p-4"
      : "grid gap-4 border u-hair rounded p-6 md:grid-cols-2 md:items-center md:gap-8";

  return (
    <form
      className={wrap}
      action={action}
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <div className="grid gap-1">
        <span className="t-body u-ink">{heading}</span>
        <span className="t-small u-muted">{microcopy}</span>
      </div>
      <div className="grid gap-2">
        <label htmlFor={inputId} className="t-small u-muted">
          Work email
        </label>
        <div className="flex gap-2">
          <input
            id={inputId}
            type="email"
            name="email"
            required
            autoComplete="email"
            className="min-w-0 flex-1 rounded border u-hair bg-paper-2 px-3 py-2 t-small u-ink"
          />
          <button
            type="submit"
            className="rounded border border-signal bg-signal u-ink px-4 py-2 t-small"
          >
            {buttonLabel}
          </button>
        </div>
        {done && (
          <p className="t-small u-muted" role="status">
            Check your inbox — the file is on its way.
          </p>
        )}
      </div>
    </form>
  );
}
