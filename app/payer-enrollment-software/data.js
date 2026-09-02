// /payer-enrollment-software content.

export const STATUSES = [
  {
    state: "not_started",
    means: "Provider is on the roster, application is not in",
    doThis: "Gather documents, confirm the CAQH profile is attested",
  },
  {
    state: "submitted",
    means: "It went in, nobody has looked at it",
    doThis: "Nothing yet. Wait out the payer's stated window",
  },
  {
    state: "in_review",
    means: "Someone at the payer has it",
    doThis: "Follow up on a schedule, not on a feeling",
  },
  {
    state: "info_requested",
    means: "The payer is waiting on you",
    doThis: "Clear it today. This is the expensive one",
    hot: true,
  },
  {
    state: "approved",
    means: "You have an effective date",
    doThis: "Confirm the date, check whether you can backdate claims",
  },
  {
    state: "denied",
    means: "It is over for now",
    doThis: "Record why. It matters when you reapply",
  },
];

// One application's timeline, plotted on a 190-day track — the outer limit one
// payer's own auto-reply quotes before anything happens at all.
export const TIMELINE_DAYS = 190;
export const TIMELINE_NODES = [
  { day: 0, cap: "Submitted", lb: "day 0", on: true, align: "at-start" },
  { day: 60, cap: "Stated floor", lb: "day 60", on: true },
  { day: 120, cap: "Stated ceiling", lb: "day 120", on: true },
  { day: 182, cap: "Effective date", lb: "day 182", end: true, align: "at-end" },
];

// Each row: what a follow-up actually records. `who` renders bold.
export const LOG_ROWS = [
  {
    date: "Nov 14",
    lead: "Called the provider line.",
    who: "Reached Dana R.",
    tail: "Application received, not yet assigned to a reviewer.",
    ref: "REF 4471-0093",
  },
  {
    date: "Dec 09",
    lead: "Called again.",
    who: "Reached Marcus T.",
    tail: "In review, no action needed on our side.",
    ref: "REF 4471-0118",
  },
  {
    date: "Jan 21",
    lead: "Portal shows no change.",
    who: "No one reached.",
    tail: "Left a callback request.",
    ref: "no reference given",
  },
  {
    date: "Feb 27",
    lead: "Called.",
    who: "Reached Dana R.",
    tail: "A W-9 had been needed since December. Nobody told us. Sent the same day.",
    ref: "REF 4471-0204",
  },
];

// C-3: the three negations were bare titles over nothing. As cards they each
// carry what you do instead — the middle one especially, which without a reason
// read as an arbitrary limitation rather than a deliberate constraint.
export const CLOSING_POINTS = [
  {
    title: "It does not submit applications.",
    body: "You still work in the payer's own portal — Sokndall holds the record of what happened there, not the submission itself.",
  },
  {
    title: "It does not connect to payer portals.",
    body: "No login, no scraping, no unofficial integration that could break the day a payer changes their system.",
  },
  {
    title: "It does not chase anyone for you.",
    body: "The follow-up queue tells you who is due for a call. Making the call is still yours.",
  },
];
