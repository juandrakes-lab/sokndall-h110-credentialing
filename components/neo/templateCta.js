/**
 * The downloadable-template CTA — its words and its destination, in one place.
 *
 * There is exactly one of these boxes per page. Two things were wrong before
 * and both are fixed here rather than page by page:
 *
 *   1. **Two wordings for one request.** The sidebar box said "Email me the
 *      template" while the closing CTA said "Download the free template", for
 *      the same file and the same exchange. That is an error, not a variant:
 *      a reader who sees both reads two offers. One label now, from here.
 *   2. **Ten copies of a route.** The destination is going to change once the
 *      form has a backend, and changing it must not mean editing ten pages.
 *
 * The label says "email" and not "download" because email is what actually
 * happens: you give an address, the file arrives in it. A button that says
 * "download" and then asks for an address is the small dishonesty this site
 * spends the rest of its copy avoiding.
 *
 * **What a page may pass, and what it may not.** The approved v3.1 copy gives
 * each page its own heading for the box (H110_COPY_TANDA_B/C, "EmailCapture
 * heading"), so `heading` is per page. The field label, the button label and
 * the microcopy are identical in every copy file, so they live here and are
 * not passed in. Updated 2026-09-10 to the v3.1 wording: "Your email", and the
 * microcopy ending "at any time".
 *
 * `action` is where the form posts. It is "#" today — there is no backend, and
 * the component acknowledges locally — so wiring it to Resend is a one-line
 * change in this file. `href` is where a text link about the template points,
 * for the pages that link to it in prose rather than showing the box.
 */
export const TEMPLATE_CTA = {
  heading: "Get the free credentialing template",
  fieldLabel: "Your email",
  buttonLabel: "Email me the template",
  microcopy:
    "One email with the spreadsheet. A few things about credentialing after that, and one click unsubscribes at any time.",
  action: "#",
  href: "/credentialing-spreadsheet-template",
  /** Anchor text wherever a page links to the template instead of showing the
   *  box. Descriptive, never "download it here" (on-page-seo.md §6). */
  linkLabel: "The free credentialing spreadsheet template",
};

export default TEMPLATE_CTA;
