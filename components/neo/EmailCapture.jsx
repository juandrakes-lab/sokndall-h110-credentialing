"use client";

import { useState } from "react";

import { TEMPLATE_CTA } from "@/components/neo/templateCta";

/**
 * EmailCapture — the downloadable-template box.
 *
 * One field, one button, and microcopy that states what arrives and that one
 * click unsubscribes. Saying the unsubscribe terms in the same size as the
 * offer is the point: shrinking them into a footnote is exactly the behaviour
 * this product's copy criticises elsewhere.
 *
 * **It lives in the reading column, once, at 70–80% of the article** — placed
 * there by `EditorialTemplate`, not by any page. It used to sit in the sticky
 * sidebar under the contents list, which was wrong twice over: that column
 * collapses below ~980px, so on a phone the box did not exist at all; and an
 * email box pinned beside the reader for the length of the article is the
 * aggressive-funnel pattern the whole site is built to avoid.
 *
 * Every word and the destination come from `templateCta.js`. Do not pass copy
 * in per page — that is how the two competing wordings got there.
 *
 * Client only for the submitted state. The heading, the label, the button and
 * the microcopy are all in the server HTML.
 *
 * No backend yet: `action` posts nowhere and the submit handler shows the
 * acknowledgement locally. Wiring it to Resend is a separate piece of work.
 */
export default function EmailCapture({
  heading = TEMPLATE_CTA.heading,
  buttonLabel = TEMPLATE_CTA.buttonLabel,
  microcopy = TEMPLATE_CTA.microcopy,
  action = TEMPLATE_CTA.action,
}) {
  const [done, setDone] = useState(false);

  return (
    <form
      className="sk-ec"
      action={action}
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      <p className="sk-ec__t">{heading}</p>

      <div className="sk-ec__f">
        <label className="sk-small" htmlFor="sk-ec-email">
          Work email
        </label>
        <input
          className="sk-ec__in"
          id="sk-ec-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@practice.com"
        />
        <button type="submit" className="sk-btn sk-btn--primary sk-btn--sm sk-ec__btn">
          {buttonLabel}
        </button>
      </div>

      <p className="sk-small sk-ec__micro">{microcopy}</p>

      {done ? (
        <p className="sk-small sk-ec__done" role="status">
          Sent. Check your inbox for the file.
        </p>
      ) : null}
    </form>
  );
}
