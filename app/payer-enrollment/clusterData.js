// The five pages in the payer-enrollment cluster (hub + four payer guides),
// shared so the sidebar's "related guides" and the end-of-article "Explore
// more guides" cards don't fork into five separate copies of the same list.

export const CLUSTER = [
  {
    name: "Payer enrollment: the overview",
    href: "/payer-enrollment",
    hook: "How enrollment differs from credentialing, the six stages, and what to do while you wait.",
  },
  {
    name: "Medicare",
    href: "/payer-enrollment/medicare",
    hook: "PECOS, the current CMS-855 forms, and what revalidation does to your payments when it goes past due.",
  },
  {
    name: "Aetna",
    href: "/payer-enrollment/aetna",
    hook: "The participation request path, and the NPI mismatch that has providers paid out-of-network for weeks.",
  },
  {
    name: "Blue Cross Blue Shield",
    href: "/payer-enrollment/blue-cross-blue-shield",
    hook: "Why it is really thirty-some separate companies, and how to tell which one you're applying to.",
  },
  {
    name: "Cigna / Evernorth",
    href: "/payer-enrollment/cigna",
    hook: "The behavioral health path through Evernorth, and the widest observed timeline of any major payer.",
  },
];

/** Every cluster page except the one you're on, capped at `limit`. Sidebar
 *  calls this with no limit (it can hold all of them); ExploreMore always
 *  wants exactly three. */
export function otherGuides(currentHref, limit) {
  const rest = CLUSTER.filter((g) => g.href !== currentHref);
  return typeof limit === "number" ? rest.slice(0, limit) : rest;
}
