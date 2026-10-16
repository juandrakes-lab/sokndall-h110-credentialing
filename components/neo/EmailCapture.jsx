"use client";

import { useActionState, useEffect, useId, useState } from "react";

import { TEMPLATE_CTA } from "@/components/neo/templateCta";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution";
import { requestTemplate } from "@/lib/template-lead-actions";

const CLICK_ID = /^[A-Za-z0-9_-]{1,200}$/;

// The ad click id (gclid / msclkid): from this page's address, or else from
// the campaign cookie SiteAnalytics wrote on the page the visitor landed on,
// so it survives a click through to another page. No cookie of its own.
function clickIds(q) {
  let saved = {};
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(`${ATTRIBUTION_COOKIE}=`));
    if (raw) saved = JSON.parse(decodeURIComponent(raw.slice(ATTRIBUTION_COOKIE.length + 1))) ?? {};
  } catch {}
  const pick = (key) => [q.get(key), saved[key]].find((v) => typeof v === "string" && CLICK_ID.test(v)) ?? "";
  return { gclid: pick("gclid"), msclkid: pick("msclkid") };
}

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
 * Client only for the form states. The heading, the label, the button and
 * the microcopy are all in the server HTML.
 *
 * Posts to the `requestTemplate` Server Action, which stores the address and
 * emails the template through Resend. "Sent" only appears once Resend has
 * accepted the email; a failure says so. The page path, UTM parameters,
 * referrer and ad click id ride along in hidden fields so the leads can be
 * read by page and source (template_funnel_weekly) and counted back on the ad
 * platforms (scripts/export-offline-conversions.mjs).
 */
export default function EmailCapture({ heading = TEMPLATE_CTA.heading, id }) {
  const [state, formAction, pending] = useActionState(requestTemplate, null);
  const [origin, setOrigin] = useState({});
  const uid = useId();
  const inputId = `${uid}-email`;

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setOrigin({
      source_path: window.location.pathname,
      utm_source: q.get("utm_source") ?? "",
      utm_medium: q.get("utm_medium") ?? "",
      utm_campaign: q.get("utm_campaign") ?? "",
      utm_term: q.get("utm_term") ?? "",
      utm_content: q.get("utm_content") ?? "",
      referrer: document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "",
      ...clickIds(q),
    });
  }, []);

  const sent = state?.status === "sent";

  return (
    <form className="sk-ec" id={id} action={formAction}>
      {heading ? <p className="sk-ec__t">{heading}</p> : null}

      {Object.entries(origin).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

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
          disabled={pending}
        />
        <button
          type="submit"
          className="sk-btn sk-btn--primary sk-btn--sm sk-ec__btn"
          disabled={pending}
          aria-busy={pending}
        >
          {pending ? "Sending…" : TEMPLATE_CTA.buttonLabel}
        </button>
      </div>

      <p className="sk-small sk-ec__micro">{TEMPLATE_CTA.microcopy}</p>

      <div aria-live="polite">
        {!pending && sent ? (
          <p className="sk-small sk-ec__done" role="status">
            Sent. It comes from Juan at hello@sokndall.com. Check your inbox (and the spam folder, the first time).
          </p>
        ) : null}
        {!pending && state?.status === "error" ? (
          <p className="sk-small sk-ec__err" role="alert">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
