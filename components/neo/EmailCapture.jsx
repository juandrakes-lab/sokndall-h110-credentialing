"use client";

import { useId, useState } from "react";

import { TEMPLATE_CTA } from "@/components/neo/templateCta";

/**
 * EmailCapture — the downloadable-template box.
 *
 * One field, one button, and microcopy that states what arrives and that one
 * click unsubscribes. Saying the unsubscribe terms in the same size as the
 * offer is the point: shrinking them into a footnote is exactly the behaviour
 * this product's copy criticises elsewhere.
 *
 * **Once per page, in the body flow.** On an editorial page `EditorialTemplate`
 * places it; on `/credentialing-spreadsheet-template` it is the hero's form.
 * Never in the sticky sidebar: that column collapses below ~1120px, so on a
 * phone the box would not exist, and an email box pinned beside the reader is
 * the aggressive-funnel pattern the whole site avoids.
 *
 * The field label, button and microcopy come from `templateCta.js` and are not
 * passed per page. `heading` is per page (the v3.1 copy writes one for each),
 * and `heading={null}` drops it where the surrounding block already says what
 * the box is — the template page's hero.
 *
 * Client only for the submitted state. The heading, the label, the button and
 * the microcopy are all in the server HTML.
 *
 * No backend yet: `action` posts nowhere and the submit handler shows the
 * acknowledgement locally. Wiring it to Resend is a separate piece of work.
 */
export default function EmailCapture({ heading = TEMPLATE_CTA.heading, id }) {
  const [done, setDone] = useState(false);
  const uid = useId();
  const inputId = `${uid}-email`;

  return (
    <form
      className="sk-ec"
      id={id}
      action={TEMPLATE_CTA.action}
      method="post"
      onSubmit={(e) => {
        e.preventDefault();
        setDone(true);
      }}
    >
      {heading ? <p className="sk-ec__t">{heading}</p> : null}

      <div className="sk-ec__f">
        <label className="sk-small" htmlFor={inputId}>
          {TEMPLATE_CTA.fieldLabel}
        </label>
        <input
          className="sk-ec__in"
          id={inputId}
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@practice.com"
        />
        <button type="submit" className="sk-btn sk-btn--primary sk-btn--sm sk-ec__btn">
          {TEMPLATE_CTA.buttonLabel}
        </button>
      </div>

      <p className="sk-small sk-ec__micro">{TEMPLATE_CTA.microcopy}</p>

      {done ? (
        <p className="sk-small sk-ec__done" role="status">
          Sent. Check your inbox for the file.
        </p>
      ) : null}
    </form>
  );
}
