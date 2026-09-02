// /credential-expiration-tracking content.

// The section's own claim, drawn: "Ten providers is not ten dates."
// One 10-provider panel across twelve months. `fixed` = licenses, DEA,
// malpractice and board certifications falling due that month; `caqh` = the
// 120-day attestation clock, which alone accounts for 30 of the 55 dates and is
// why no month is ever empty.
export const CADENCE = [
  { m: "Jan", fixed: 2, caqh: 3 },
  { m: "Feb", fixed: 1, caqh: 2 },
  { m: "Mar", fixed: 3, caqh: 3 },
  { m: "Apr", fixed: 2, caqh: 2 },
  { m: "May", fixed: 2, caqh: 3 },
  { m: "Jun", fixed: 3, caqh: 2 },
  { m: "Jul", fixed: 1, caqh: 3 },
  { m: "Aug", fixed: 2, caqh: 2 },
  { m: "Sep", fixed: 3, caqh: 3 },
  { m: "Oct", fixed: 2, caqh: 2 },
  { m: "Nov", fixed: 2, caqh: 3 },
  { m: "Dec", fixed: 2, caqh: 2 },
];

// D-2: rewritten to 19-22 words each so the cards sit at one height, and so no
// body restates the cycle chip beside its own name. CAQH and board
// certification now carry a consequence instead of repeating their cycle.
export const CYCLES = [
  {
    name: "State license",
    cycle: "Cycle varies by state",
    body: "One row per state a provider practices in. A multi-state telehealth panel means five or six separate dates, not one.",
  },
  {
    name: "DEA registration",
    cycle: "Every 3 years",
    body: "Three-year cycle, usually processed fast — until it isn't. One provider's renewal sat pending for a month with no way to speed it up.",
    linkHref: "/dea-renewal-tracking",
    linkLabel: "DEA renewal tracking",
  },
  {
    name: "Malpractice (COI)",
    cycle: "Usually annual",
    body: "Usually the quiet one: an expired policy inside a CAQH profile blocks the whole attestation, not just the malpractice line.",
    linkHref: "/caqh-reattestation",
    linkLabel: "CAQH reattestation",
  },
  {
    name: "Board certification",
    cycle: "Multi-year",
    body: "Multi-year cycles mean it is easy to forget, and a lapse can affect hospital privileges and payer status at once.",
  },
  {
    name: "CAQH attestation",
    cycle: "Every 120 days",
    body: "Every 120 days is the clock. Miss it and payer records stop matching yours, and claims start bouncing for no obvious reason.",
    linkHref: "/caqh-reattestation",
    linkLabel: "CAQH reattestation",
  },
];

// Five credentials, five derived states — the whole status system in one view.
export const DERIVED_ROWS = [
  { name: "State license — CA", date: "Mar 14, 2027", state: "active", count: "198d" },
  { name: "Malpractice (COI)", date: "Oct 21, 2026", state: "expiring", count: "54d" },
  { name: "DEA registration", date: "Sep 21, 2026", state: "due", count: "24d" },
  { name: "CAQH attestation", date: "Sep 06, 2026", state: "urgent", count: "9d" },
  { name: "Board certification", date: "Aug 12, 2026", state: "expired", count: "16d ago" },
];

export const LADDER = [
  { num: "90", unit: "days", tone: "var(--cell-calm-mark)", body: "It is on the radar. Nothing to do yet." },
  { num: "60", unit: "days", tone: "var(--gold)", body: "Start the renewal this week. State boards are not fast." },
  { num: "30", unit: "days", tone: "#d68a2c", body: "The renewal should already be submitted." },
  {
    num: "14 / 7",
    unit: "days",
    tone: "var(--cell-stuck-mark)",
    body: "This is now urgent, and someone specific owns it.",
  },
];

export const DIGEST_LINES = [
  { tx: "Expired now", ct: "2", hot: true },
  { tx: "Expiring in 30 days", ct: "7" },
  { tx: "Attestations overdue", ct: "1", hot: true },
  { tx: "Applications with no follow-up in 30+ days", ct: "5" },
  { tx: "Provider-payer pairs with claims on hold", ct: "3" },
];

export const MULTI_STATE = [
  { st: "California", date: "Mar 14, 2027", state: "active", count: "198d" },
  { st: "Arizona", date: "Jan 30, 2027", state: "active", count: "155d" },
  { st: "Nevada", date: "Nov 08, 2026", state: "expiring", count: "72d" },
  { st: "Oregon", date: "Oct 19, 2026", state: "expiring", count: "52d" },
  { st: "Washington", date: "Sep 24, 2026", state: "due", count: "27d" },
  { st: "Idaho", date: "Sep 04, 2026", state: "urgent", count: "7d" },
];
