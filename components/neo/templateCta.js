/**
 * The downloadable-template CTA — its words and its destination, in one place.
 *
 * There is exactly one of these boxes per editorial page, and it appears at
 * 70–80% of the reading column. Two things were wrong before and both are
 * fixed here rather than page by page:
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
 * `action` is where the form posts. It is "#" today — there is no backend, and
 * the component acknowledges locally — so wiring it to Resend is a one-line
 * change in this file. `href` is where a text link about the template points,
 * for the pages that link to it in prose rather than showing the box.
 */
export const TEMPLATE_CTA = {
  heading: "Get the free credentialing template",
  buttonLabel: "Email me the template",
  microcopy:
    "One email with the spreadsheet. A few notes on credentialing after that, and one click unsubscribes.",
  action: "#",
  href: "/credentialing-spreadsheet-template",
  /** Anchor text wherever a page links to the template instead of showing the
   *  box. Descriptive, never "download it here" (on-page-seo.md §6). */
  linkLabel: "The free credentialing spreadsheet template",
};

export default TEMPLATE_CTA;
