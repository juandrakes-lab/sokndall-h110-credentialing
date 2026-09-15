// Terms of Service and Privacy Policy — the structure and the facts each
// section has to state, taken from how the product actually works. The legal
// text itself is still to be written (and reviewed by a lawyer); until then
// the pages render these sections as a visible draft, marked noindex, and
// sign-ups record TERMS_VERSION = "draft" (lib/password-rules.js).
//
// To finish: write `body` for every section, set `final: true` and the date,
// bump TERMS_VERSION to that date.

export const TERMS = {
  title: "Terms of Service",
  final: false,
  updated: null,
  sections: [
    { id: "acceptance", heading: "Accepting these terms", covers: ["Who the agreement is between (Sokndall and the account owner's organization).", "Creating an account or using Google sign-in means accepting; the acceptance date and version are recorded."] },
    { id: "service", heading: "What Sokndall is", covers: ["Software to track provider credentials, expirations and payer enrollment status, entered by the customer.", "Not a credentialing verification service (CVO), not legal or compliance advice, and no guarantee that any payer approves an application.", "Status changes are always made by the customer; Sokndall does not submit anything to payers."] },
    { id: "no-phi", heading: "No patient information", covers: ["The service is for provider data only. Customers must not upload protected health information (PHI) or any patient data.", "Sokndall does not sign Business Associate Agreements because it is not built to hold PHI."] },
    { id: "accounts", heading: "Accounts and users", covers: ["The owner is responsible for who they invite; members' access and client subsets are set by the owner.", "Keeping passwords secret; notifying us of unauthorized use."] },
    { id: "plans-billing", heading: "Plans, trial and billing", covers: ["Plans: Solo $79, Practice $299, Billing Co $699 per month; limits per plan (providers, users, storage).", "14-day free trial with a card; the first charge is on day 15 unless cancelled before.", "Billing Co additional users: $39 per user per month, charged on the same subscription, prorated when added, reduced at the next renewal when removed.", "Payments are processed by Polar as merchant of record; sales tax/VAT is added where it applies.", "Upgrades take effect immediately; downgrades leave providers over the new limit read-only, nothing deleted.", "Cancel any time from the billing portal; access continues until the end of the paid period, then the account is read-only."] },
    { id: "customer-data", heading: "Your data", covers: ["The customer owns the data it enters; Sokndall uses it only to provide the service.", "Export is always available (CSV, and a full ZIP per client), including when the account is read-only.", "Deleting the account or a client deletes its data and files permanently; only a minimal record of the deletion is kept."] },
    { id: "third-party", heading: "Public registries and third-party services", covers: ["NPI Registry (NPPES) lookups are proposals the customer confirms; Sokndall does not guarantee the registry's accuracy.", "No scraping of payer portals, CAQH or state boards."] },
    { id: "acceptable-use", heading: "Acceptable use", covers: ["No unlawful use, no attempts to access other customers' data, no reverse engineering or abuse of the service."] },
    { id: "availability", heading: "Availability and changes", covers: ["Reasonable efforts to keep the service available; no specific uptime commitment unless agreed in writing.", "How changes to the service and to these terms are announced."] },
    { id: "termination", heading: "Suspension and termination", covers: ["When we may suspend (non-payment, abuse) and what happens to the data."] },
    { id: "liability", heading: "Disclaimers and limitation of liability", covers: ["Service provided as is; cap on liability (e.g. fees paid in the prior 12 months) — to be set by counsel."] },
    { id: "law", heading: "Governing law and contact", covers: ["Governing law and venue — to be set by counsel.", "Contact address for legal notices."] },
  ],
};

export const PRIVACY = {
  title: "Privacy Policy",
  final: false,
  updated: null,
  sections: [
    { id: "who", heading: "Who we are", covers: ["Sokndall, contact details, and that this policy covers the website and the app."] },
    { id: "collect", heading: "What we collect", covers: ["Account data: name, work email, password (stored hashed by Supabase Auth) or Google sign-in identity.", "Customer content: provider names, NPIs, licenses and registration numbers, credentials, payer enrollment records, notes and uploaded documents. No patient data.", "Billing: handled by Polar; we receive plan, subscription status and customer name/email, never card numbers.", "Technical: IP address and basic logs for security and abuse prevention."] },
    { id: "use", heading: "How we use it", covers: ["To provide the service, send the deadline alerts and weekly digest the customer configures, and bill.", "No selling of personal data; no advertising use of customer content."] },
    { id: "processors", heading: "Who processes it for us", covers: ["Supabase (database, authentication, file storage), Vercel (hosting), Polar (payments, merchant of record), Resend (email delivery), Google (sign-in, when chosen), CMS NPI Registry (public lookups of NPIs typed by the customer).", "Where each is located / data transfer basis — to be completed."] },
    { id: "cookies", heading: "Cookies", covers: ["Only what's needed to keep you signed in and remember the open client; no advertising cookies in the app."] },
    { id: "retention", heading: "Retention and deletion", covers: ["Data is kept while the account exists; deleting a client or the account removes its data and files; minimal deletion record kept.", "How long logs and billing records are kept (billing records as required by law)."] },
    { id: "security", heading: "Security", covers: ["Isolation between accounts and clients enforced in the database, private file storage with short-lived links, no PHI by design."] },
    { id: "rights", heading: "Your rights", covers: ["Access, correction, deletion, export; how to exercise them; state privacy laws (e.g. CCPA) where they apply."] },
    { id: "children", heading: "Children", covers: ["The service is for businesses and not directed to children."] },
    { id: "changes", heading: "Changes and contact", covers: ["How changes are announced; contact for privacy questions."] },
  ],
};
