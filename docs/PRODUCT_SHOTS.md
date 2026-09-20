# Product shots on the marketing pages

Handoff note, 2026-09-19. Everything the schematics used to do on the landings
is now done by **product shots**: the app's own components, rebuilt in HTML,
fed the demo client's data. This file is the contract — read it before touching
`components/app/showcase/` or any figure on a landing.

## Where it lives

| File | What it is |
| --- | --- |
| `components/app/showcase/ProductShot.jsx` | The figure wrapper each page renders. Client component: it picks the wide or the narrow scene and hands it to `Stage`. Scenes are named with a **string**, because the pages are server components and a function cannot cross that boundary. |
| `components/app/showcase/Stage.jsx` | Scales a scene's fixed canvas to the figure's width. Caps the scale at 1; below `minScale` (0.5) it stops shrinking, anchors left and clips — that is the only case where anything is clipped. |
| `components/app/showcase/AppScreen.jsx` | A whole screen of the app: sidebar (foldable to its icon rail with `collapsed`, which moves the client into the top bar, exactly as `AppFrame` does), top bar, floating content block. Also exports the depth tokens `lift` / `chipLift` and the `Chip` floating card. |
| `components/app/showcase/scenes.jsx` | Every scene, wide and narrow. Named exports; `ProductShot` resolves them by name. |
| `components/app/showcase/parts.jsx` | Shared with the access screens' stories (`AuthStories`): the matrix `CHIP` classes, `PEOPLE` (the generic signed-in people and their Pexels portraits), the older `AppWindow`/`Float` used by the stories only. |

## Hard rules

1. **A shot is only ever scaled down.** Its canvas is at least as wide as the
   figure renders. Upscaled type blurs, which is what the first two attempts
   got wrong. No 3D tilt, no `perspective()`, for the same reason.
2. **One depth system.** `lift` for windows, cards and panels; `chipLift` for
   the small indicator cards. Never a bespoke shadow. Nothing animates: a
   transform animation inside a scaled canvas rasterizes blurry.
3. **No box around a shot** and no browser chrome. It sits on the section's own
   ground with its own shadow.
4. **A whole screen only when the section is about the screen** (today: the
   home's matrix section, the billing companies' client book). When the section
   is about a thing on the screen, show that thing — a card, a panel, a table.
   An `AppScreen` padded out with white space is a worse shot than a card.
5. **Every wide shot declares a `narrow` scene**, picked by viewport (≤640px).
   A whole screen is unreadable on a phone.
6. **Real data only.** The figures come from the demo Billing Co book in
   Supabase (Riverside Pediatrics PLLC, Lakeview Behavioral Health, Clinical
   Neuroscience Research Associates). Query it rather than inventing numbers;
   if a number cannot be sourced, leave it out. Provider names keep initials
   avatars (providers are records, never users); signed-in people are the
   generic `PEOPLE` with Pexels portraits — never the founder's name.
7. **Copy stays in the page's `data.js`.** A scene that carries approved words
   (`StatusPath`, `Stages`, `UsersProviders`) takes them as props.

## The figures

| Page · section | Scene (canvas) | Narrow | Shows |
| --- | --- | --- | --- |
| `/` hero | `HeroMatrix` 880×660 | `NarrowDashboard` 420×540 | The dashboard, sidebar folded: three stats, "Start here", the credentials breakdown; the pipeline bar floats below. |
| `/` "Three things" third card | `MondayDigest` 560×560 | — | The weekly digest as an email: sender, recipient, subject, two sections, the CTA. Sits **under** the white card (`.sk-layers__stack`), not inside it. |
| `/` "The matrix" | `HomeMatrix` 1240×760 | `NarrowMatrix` 460×580 | The whole enrollments screen: pipeline card + 5×5 matrix. Floating: a payer request and the stalled count. |
| `/payer-enrollment-software` statuses | `StatusPath` 1000×340 | `NarrowStatusPath` 380×560 | One application's path on the panel's own status chips, in an app card. Words from `TRACK`. |
| same, "Two steps" | `Stages` 560×440 | — | The two stages as two app cards. Words from `STAGES`. |
| same, effective date | `EffectiveDate` 620×620 | — | The application panel (status chips, details with the effective date highlighted, history) and a chip repeating the date. |
| same, "The matrix" | `EnrollmentMatrix` 780×580 | `NarrowMatrix` | The matrix card alone (6 providers × 3 payers) with the pipeline card under it. |
| `/for-billing-companies` hero figure | `ClientBook` 1160×760 | `NarrowClients` 440×520 | The clients screen, sidebar folded: four stats, the clients table with providers, follow-ups, renewals, an applications bar and the team. Floating: one coordinator's scoped access. |
| same, client reporting | `ClientReport` 800×660 | `NarrowReport` 440×560 | The providers card a client is sent: six providers, credential badge, applications bar. Floating: the CSV. |
| `/credentialing-spreadsheet-template` | `TemplateSheet` 1330×470 | `NarrowSheet` 460×420 | The free file's Credentials tab: its real columns, its example row, its colour legend, its six tabs. Source: the file in the founder's Drive (`Credentialing_Tracker_Template`), read 2026-09-19. |
| `/pricing` provider vs. user | `UsersProviders` 560×470 | — | Three users as portraits, forty providers as initials. Rows and caption from `UNITS_DIAGRAM`. |

## Working on them

- The site and the app now live on **one branch**, `feat/app-v3` (the marketing
  branch `design/landing-polish` was merged into it on 2026-09-19). Do not
  restart the two-branch split: it cost a CSS conflict already.
- Build and look at it: `preview_stop` → `rm -rf .next` → `npm run build` →
  `preview_start h110-app-v3-prod` (port 3101). Never build with a server up.
- Screenshot one figure in context:
  `MSYS_NO_PATHCONV=1 PORT=3101 WAIT=7000 NOCOOKIE=1 node .scratch/shot.mjs <out> 1440x1000 "/@js:document.querySelectorAll('figure.app-type')[0].scrollIntoView({block:'center'})"`
  (`.scratch/` is per-worktree and not committed; `NOCOOKIE=1` renders signed out.)
- Judge a shot at the size the page renders it, not zoomed in.

## Open, from the founder's reviews

- Phone versions were checked on three figures only; the rest of the narrow
  scenes have not been looked at on a real phone width.
- The home and `/payer-enrollment-software` matrix sections say each cell
  carries "the number of days since the last follow-up". The real cell carries
  the status plus a due dot and a stalled icon — no day count. Either the copy
  changes or the app does; the shots follow the app.
- `/pricing`'s units diagram and `/payer-enrollment-software`'s "Two steps" are
  concept diagrams, not screens. They use the app's visual system by the
  founder's call, and they are the two figures most likely to drift back into
  looking like plain boxes.
