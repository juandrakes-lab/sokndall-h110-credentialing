# TANDA A — PÁGINAS DE MOLDE LANDING

**Páginas 1, 2, 4, 9, 11 de la arquitectura v3.1**
`/` · `/pricing` · `/credentialing-spreadsheet-template` ·
`/payer-enrollment-software` · `/for-billing-companies`

Medido contra la sección **"Copy limits — Sokndall home"** de `COPY_LIMITS.md`.
Rangos por tipo de slot. `[SIN MEDIR]` = componente que no existe en la home.

Voz auditada contra `voice-and-evidence.md` §2.6 — cero adjetivos de la lista
prohibida en las cinco páginas. FAQ literales de `faq-por-pagina.md`.

---

## ⚠ CONFLICTO QUE AFECTA A LAS 15 PÁGINAS — decidilo una vez

`faq-por-pagina.md` regla 4: **cada respuesta entre 40 y 90 palabras**, porque es
el rango que los sistemas de AI extraen limpio.

`COPY_LIMITS.md`, respuesta de FAQ: **≤117 caracteres** en la home, **96-185** en
la variante comparación. Ciento diecisiete caracteres son unas 20 palabras.

Los dos documentos piden cosas incompatibles, por un factor de tres.

**Resolví a favor de las 40-90 palabras**, por dos razones: `COPY_LIMITS.md` dice
literalmente que el acordeón no tiene restricción de altura y que ese número es
guía de forma, no tope; y la extracción para AI Overviews es una de las razones
por las que el proyecto existe. **Todas las respuestas de FAQ de esta entrega
exceden el número de `COPY_LIMITS.md` a propósito**, y llevan su conteo de
palabras al lado para que se vea contra qué las medí.

Si preferís lo contrario, se reescriben las 40 respuestas del sitio, no estas
cinco páginas. Por eso lo pongo acá arriba y no enterrado en una página.

---
---

# PÁGINA 1 · `/` — Home

Keyword `credentialing software` (880, KD 25) · 900-1.300 palabras
**Absorbe** el vocabulario de tracking y expiración de la página eliminada.

## Metadatos

```
<title>                 (56)  50–60               Credentialing Software With a Published Price | Sokndall
meta description       (153)  150–160             Credentialing software for small practices. Track what
                                                  expires and which payer applications went quiet. $79 to
                                                  $699 a month, published, and no demo call.
```

## Sección 1 — Hero

```
H1 línea 1              (18)  18 actual           Credentialing that
H1 línea 2              (25)  23 actual           tells you what went quiet
                                                  ↳ +2 sobre lo medido; la línea 2 ya envuelve a propósito
Subhead                (177)  133–195             Sokndall tracks the credentials that expire and the
                                                  payer applications that go quiet, for practices and
                                                  billing companies with 1 to 50 providers. $79 to $699 a
                                                  month, published.
CTA primario            (18)  —                   Start 14-day trial
CTA secundario          (19)  —                   See all three plans
Strip 1                 (12)  ≤42                 No demo call
Strip 2                 (16)  ≤42                 No quote request
Strip 3                 (20)  ≤42                 Price list published
Strip 4                 (20)  ≤42                 Cancel before day 15
Caption esquema        (117)  71–135              This is the data model, not a screenshot. Sokndall is in
                                                  development and no interface is shown anywhere on this
                                                  site.
```

## Sección 2 — Keyword + el problema en dinero

```
Eyebrow                 (28)  ≤30                 Built for the small practice
H2 línea 1              (13)  ≤21                 Credentialing
H2 línea 2              (16)  ≤21                 software, priced
H2 línea 3               (9)  ≤21                 in public
Intro note             (144)  92–179              Sokndall is credentialing software for practices that
                                                  never had a credentialing department. It tracks what
                                                  expires and what is stuck at a payer.
Aside claro            (148)  115–165             The platforms built for health systems assume a
                                                  credentialing committee and delegated authority. You
                                                  have a front-office lead who also handles this.

Row-card 1 título       (21)  ≤23                 A revalidation lapses
Row-card 1 cuerpo       (72)  47–86               Medicare pays nothing for the deactivated period. None
                                                  of it comes back.
Row-card 2 título       (22)  ≤23                 An attestation expires
Row-card 2 cuerpo       (63)  47–86               Nothing breaks visibly. The payer sends no warning of
                                                  any kind.
Row-card 3 título       (18)  ≤23                 An NPI loads wrong
Row-card 3 cuerpo       (64)  47–86               Everything pays out of network until someone finally
                                                  catches it.
Closing line           (122)  116–219             None of the three is complicated. Each one is the same
                                                  thing: a date nobody was watching, or an application
                                                  nobody chased.
```

**Cambio de fondo.** Los cuerpos 1 y 2 pasan de anécdota a mecanismo con fuente.

- Card 1: CMS confirma que Medicare **no reembolsa servicios prestados durante
  una desactivación** por revalidación perdida — a diferencia del enrollment
  inicial, que sí admite algo de retroactividad. `(f)` CredyApp / 42 CFR 424.540.
  Reemplaza el "tres meses de pagos retenidos" que venía de `(v18)`.
- Card 2: el fallo silencioso de CAQH — los claims con pagadores ya enrolados
  siguen procesándose, no llega aviso, el daño es invisible durante semanas.
  `(f)` HireGaynell. Reemplaza a `(v29)` como cita.
- Card 3: se mantiene como ilustración, no como estadística, según la
  instrucción sobre `(v22/v23)`.

## Sección 3 — Las tres capas · absorbe tracking y expiración

```
H2 línea 1              (21)  ≤21                 Three things, tracked
H2 línea 2              (12)  ≤21                 in one place
Stat caption            (50)  44–84               Alerts at 90, 60, 30, 14 and 7 days before expiry.

Wide título             (37)  ≤45                 Enrollment applications that go quiet
Wide cuerpo             (90)  57–108              One record per provider per payer. Info requested is the
                                                  costly one: the payer never asks.
Tall título             (23)  ≤26                 Credentials that expire
Tall cuerpo             (77)  59–85               Status derives itself from the expiration date, not from
                                                  someone remembering.
Tall lista 1            (22)  ≤31                 State licenses and DEA
Tall lista 2            (15)  ≤31                 Malpractice COI
Tall lista 3            (19)  ≤31                 Board certification
Tall lista 4            (26)  ≤31                 CAQH attestation, 120 days
Tall lista 5            (21)  ≤31                 Medicare revalidation
Small 1 título          (20)  ≤25                 The Monday follow-up
Small 1 cuerpo          (66)  41–80               One digest a week: what expires, what is overdue, what
                                                  went quiet.
Small 2 título          (17)  ≤25                 One row per state
Small 2 cuerpo          (56)  41–80               A multi-state panel is where a spreadsheet breaks first.
```

El ciclo de 120 días entra en la lista de la tall-card: es el vocabulario de
expiración que la página eliminada llevaba y que el brief 1 manda absorber acá.
`(f)` seis fuentes independientes, `research-proceso.md` §2.

## Sección 4 — La matriz

```
H2 línea 1              (18)  ≤21                 The screen this is
H2 línea 2              (12)  ≤21                 really about
Diagram note           (184)  180–356             Low-fidelity schematic of the data model. It is not a
                                                  screenshot, and no product interface exists yet.
                                                  Providers run down the side, payers across the top, and
                                                  one cell holds each pair.
Bullet 1               (104)  72–137              Every cell carries a status and the number of days since
                                                  the last follow-up on that provider-payer pair.
Bullet 2               (100)  72–137              Fifteen providers across twelve payers is 180 cells. The
                                                  six that are stuck are visible in one look.
Bullet 3               (118)  72–137              A spreadsheet can hold that data. It cannot show it to
                                                  you this way, and it will never tell you which cell went
                                                  quiet.
Aside título            (25)  ≤110                Where the sheet gives out
Aside cuerpo           (148)  81–153              A sheet answers what you ask it. The follow-up problem
                                                  is the opposite: you need the rows you have not thought
                                                  about in a month to raise their hand.
```

## Sección 5 — Ancla de precio (banda oscura)

```
H2 línea 1              (14)  ≤21 (16 actual)     What this work
H2 línea 2              (15)  ≤21 (13 actual)     costs elsewhere
Aside oscuro           (268)  253–302             Three published cost anchors sit around this product,
                                                  and they do not measure the same thing. One counts
                                                  providers handed to an outside team. One counts staff
                                                  seats inside software. The third one is this product.
                                                  Every figure below states which unit it is counting in.

Figura 1 label          (37)  ≤50                 $600 to $2,400 per provider, per year
Figura 1 nota           (85)  54–106              Outsourced ongoing maintenance. Unit: one provider, per
                                                  year. Medicotech and Medwave.
Figura 2 label          (33)  ≤50                 $3,600 to $9,000 a year, 15 users
Figura 2 nota           (79)  54–106              MedTrainer's own published category guidance. Unit:
                                                  staff seats, not providers.
Figura 3 label          (27)  ≤50                 $3,588 a year, 15 providers
Figura 3 nota           (78)  54–106              Sokndall Practice at $299 a month. Unit: providers
                                                  tracked. That is $239 each.
Cierre del ancla       (139)  113–216             Read the middle figure carefully: a seat is a person on
                                                  your staff, a provider is a record being tracked. The
                                                  two never line up one to one.
```

## Sección 6 — Precio visible

```
H2 línea 1              (15)  ≤21                 The whole price
H2 línea 2              (18)  ≤21                 list, on this page
Plan 1 desc             (37)  ≤48                 One provider or a small solo practice
Plan 1 feat 1           (17)  ≤46                 Up to 3 providers
Plan 1 feat 2           (29)  ≤46                 $26.33 per provider per month
Plan 2 tag              (34)  ≤58 (FIJO)          Most complete for a group practice
Plan 2 desc             (37)  ≤48                 A group with one person handling this
Plan 2 feat 1           (18)  ≤46                 Up to 15 providers
Plan 2 feat 2           (29)  ≤46                 $19.93 per provider per month
Plan 3 desc             (40)  ≤48                 Separate client organizations, one login
Plan 3 feat 1           (33)  ≤46                 Up to 50 providers across clients
Plan 3 feat 2           (29)  ≤46                 $13.98 per provider per month
Plan 3 feat 3           (37)  ≤46                 Client data isolated from client data
Nota de precio         (161)  ≤184                Fourteen-day trial, card up front, cancel yourself from
                                                  Settings before day 15 and nothing is charged. Full
                                                  terms and the three cost anchors on the pricing page.
```

## Sección 7 — Qué no hace

```
H2 línea 1              (13)  ≤21                 What Sokndall
H2 línea 2              (11)  ≤21                 does not do
Intro note             (118)  92–179              Being clear about this now saves you a trial you were
                                                  going to cancel in week two anyway, and saves us both
                                                  the email.
Ítem 1 título           (18)  ≤23 (2 líneas ok)   It does not verify
Ítem 1 cuerpo           (75)  47–86               It does not query license boards. You verify; it records
                                                  what you verified.
Ítem 2 título           (20)  ≤23                 No portal connection
Ítem 2 cuerpo           (69)  47–86               You still work inside CAQH (DataSpring), PECOS and the
                                                  payer portals.
Ítem 3 título           (15)  ≤23                 No patient data
Ítem 3 cuerpo           (68)  47–86               No PHI enters the system, so there is no BAA to
                                                  negotiate to try it.
Ítem 4 título           (23)  ≤23                 It does not do the work
Ítem 4 cuerpo           (76)  47–86               It organizes the person already doing it, and shows what
                                                  they lost track of.
Closing line           (116)  116–219             If you need someone to submit applications for you, that
                                                  is a credentialing service and it costs several times
                                                  this.
```

`exclusiones.md` §6 aplicada: el ítem 1 ya no dice "primary source verification"
como etiqueta propia. El término señala al segmento de health systems y no se usa
como propuesta de valor; el mecanismo se describe sin nombrarlo.

## Sección 8 — FAQ (`FAQPage`)

Preguntas literales de `faq-por-pagina.md`, página 1.

Q1  (31 car.)  What is credentialing software?
    Credentialing software tracks two things that otherwise live in a
    spreadsheet: the credentials each provider holds and when they expire, and
    the enrollment applications sitting with each payer. It does not verify
    anything with a licensing board and it does not file applications for you.
    It records what you checked and when, tells you what is due next, and
    flags an application that has not moved.
    → 66 palabras · 398 car.

Q2  (42 car.)  How much does credentialing software cost?
    Sokndall is $79, $299 or $699 a month, published on this page, which works
    out to $26.33, $19.93 and $13.98 per provider. Most of the category
    publishes nothing: symplr, Modio Health, MedTrainer and CredentialStream
    all route you to a demo before naming a number. MedTrainer's own blog puts
    the category at $3,600 to $9,000 a year for fifteen users, counted in
    staff seats rather than providers.
    → 66 palabras · 395 car.

Q3  (71 car.)  Can CLM software track credentialing requirements and expiration dates?
    Contract lifecycle management software tracks contracts, and a payer
    contract is one artifact in credentialing rather than the whole record. It
    will not hold a state license renewal, a DEA registration, a malpractice
    certificate or a CAQH attestation date, and it has no concept of an
    application waiting on a payer. Some practices run CLM for the contract
    half and something else for everything underneath it.
    → 66 palabras · 410 car.

Q4  (68 car.)  How customizable are credentialing workflows in healthcare software?
    In the enterprise tools, very. That flexibility is what a credentialing
    committee and a delegated agreement need, and it is also why those systems
    take months to configure. Sokndall makes the opposite trade: fixed fields,
    fixed statuses, and an alert ladder at 90, 60, 30, 14 and 7 days. You can
    change the alert intervals and the named owner of each item. You cannot
    design your own workflow.
    → 68 palabras · 393 car.

Q5  (66 car.)  How to choose credentialing software for a healthcare organization
    Start with the unit you are charged in, because that is where comparisons
    break: some vendors count staff seats and some count providers tracked,
    and the two never line up. Then ask whether the price is published at all.
    Then check whether the tool verifies credentials with the issuing board or
    records the verification you did. Three answers rule out most of the
    market before anyone books a demo.
    → 69 palabras · 399 car.

Q6  (64 car.)  Do I need credentialing software if I only have three providers?
    Probably not yet. Three providers across six payers is eighteen enrollment
    records and perhaps twenty credential rows, and a spreadsheet holds that
    without complaint. The free template on this site is built for exactly
    that size. What eventually breaks the sheet is not the row count. It is
    that the file cannot tell you which application went quiet while you were
    looking somewhere else.
    → 64 palabras · 388 car.

**Nota sobre Q5.** No es interrogativa: es la consulta tal como está registrada,
y `faq-por-pagina.md` regla 1 prohíbe reformularla. El schema `FAQPage` la acepta
igual —`name` no exige signo de pregunta— pero conviene que sepas que va a
renderizarse así en el acordeón.

## Cierre y footer

```
CTA heading             (33)  28–53               Fourteen days. No call, no quote.
CTA body                (97)  78–149              Card up front, cancel yourself before day 15. The price
                                                  you see here is the price on the invoice.
Footer blurb           (121)  112–145             Sokndall tracks provider credentials and payer
                                                  enrollment applications for small practices and billing
                                                  companies. No PHI.
```

## Enlaces y evidencia

Internos (brief 1: enlaza a 2, 3, 4, 9): `/pricing` · `/best-credentialing-software`
· `/credentialing-spreadsheet-template` · `/payer-enrollment-software`.

Externos: CMS revalidación, vía `hhs.gov/guidance/document/provider-enrollment-
and-certification-revalidations-renewing-your-enrollment-0` (`follow`) ·
MedTrainer guía de costo, vía `medtrainer.com/blog/average-cost-to-credential-
a-physician-provider-2/` (`nofollow`) · Medicotech, vía `medicotechllc.com/
physician-credentialing-cost/` (`nofollow`) · Medwave, vía `medwave.io/2026/03/
how-much-does-medical-credentialing-cost/` (`nofollow`). Las dos últimas
citadas en la Sección 5 al resolver la Figura 1 — verificadas y con URL
confirmada en esta pasada.

Citas migradas de `(v#)` a `(f)` según `research-proceso.md` §4: el mecanismo de
revalidación perdida, el fallo silencioso de CAQH, y el rango de plazo. Ninguna
cifra de esta página descansa ya en el barrido.

---
---

# PÁGINA 2 · `/pricing`

Keyword `credentialing software pricing` (110, KD 18) · 800-1.100 palabras
**No perseguir** `credentialing software cost` — vive en la página 3.

## Metadatos

```
<title>                 (60)  50–60               Credentialing Software Pricing, Published in Full |
                                                  Sokndall
meta description       (150)  150–160             Credentialing software pricing published in full: $79,
                                                  $299 or $699 a month, with every feature in every plan.
                                                  No quote process and no demo call ever.
```

## Sección 1 — PageHeader

```
H1                            [SIN MEDIR]         No quote to get. No call to book.
Subtítulo                     [SIN MEDIR]         Three plans, three prices, no quote process. Every plan
                                                  has every feature. The difference is how many providers
                                                  you track, and whether you track them for your own
                                                  practice or for clients.
```

**Corrección de `on-page-seo.md` §4.** El H1 anterior ("Credentialing software
pricing, published") cargaba la keyword exacta en el H1 en vez de dejarlo libre
para la premisa — es el patrón invertido de lo que la regla exige para toda
página comercial. Movido a un H1 de premisa; la keyword pasa al primer H2, abajo.

## Sección 2 — PlanCardSet

```
H2                       (54)  [SIN MEDIR]         Credentialing software pricing: three plans, published
Nombre / cifra 1              [SIN MEDIR]         Solo · $79/month
Desc plan 1             (37)  ≤48                 One provider or a small solo practice
Feature 1.1             (25)  ≤46                 Up to 3 providers, 1 user
Feature 1.2             (29)  ≤46                 $26.33 per provider per month
Feature 1.3             (42)  ≤46                 Every feature, including the weekly digest

Nombre / cifra 2              [SIN MEDIR]         Practice · $299/month
Tag plan 2              (34)  ≤58 (FIJO)          Most complete for a group practice
Desc plan 2             (37)  ≤48                 A group with one person handling this
Feature 2.1             (33)  ≤46                 Up to 15 providers, up to 3 users
Feature 2.2             (29)  ≤46                 $19.93 per provider per month
Feature 2.3             (18)  ≤46                 Everything in Solo

Nombre / cifra 3              [SIN MEDIR]         Billing Co · $699/month
Desc plan 3             (40)  ≤48                 Separate client organizations, one login
Feature 3.1             (37)  ≤46                 Up to 50 providers across all clients
Feature 3.2             (39)  ≤46                 Up to 10 users, scoped to their clients
Feature 3.3             (29)  ≤46                 $13.98 per provider per month
Feature 3.4             (37)  ≤46                 Client data isolated from client data

Nota de precio         (168)  ≤184                Every plan is monthly and cancels from Settings.
                                                  Fourteen-day trial, card up front, nothing charged
                                                  before day 15. What the per-provider figures compare
                                                  against, below.
```

## Sección 3 — Proveedor vs. usuario · OBLIGATORIA en esta página

```
H2                            ≤21/línea           A provider is not / a user, and the / difference is the
                                                  / whole comparison
                                                  ↳ 16 / 15 / 18 / 22 — la línea 4 se pasa por 1
Párrafo 1                     [SIN MEDIR]         A provider is a record being tracked: one clinician,
                                                  with their credentials and their enrollment
                                                  applications. A user is a person who logs in. A three-
                                                  person front office managing forty clinicians is three
                                                  users and forty providers. A solo practitioner who does
                                                  her own paperwork is one of each.
Párrafo 2                     [SIN MEDIR]         Sokndall charges by provider and includes users up to
                                                  each plan's limit, with one exception: past ten users
                                                  on Billing Co, each additional one is $39 a month.
                                                  MedTrainer states in its own FAQ that
                                                  its pricing scales with the number of users and modules.
                                                  Neither model is wrong. They are simply not comparable,
                                                  and every published comparison of this category that
                                                  puts two per-unit figures side by side without saying
                                                  which unit is measuring something it did not measure.
Cierre                        [SIN MEDIR]         When you ask a vendor what it costs, the first question
                                                  back should be yours: costs per what?
```

`(f)` MedTrainer documenta su lógica de precio —usuarios más módulos, basado en
utilización— en su propia FAQ de producto. Es el único de los cuatro que la
documenta. `COMPETIDORES_DATOS.md`.

`[SLOT CORTO]` — H2 línea 4 mide 22 contra ≤21. Alternativa que entra sin tocar
el componente: cortar en `A provider is not / a user, and that / is the whole /
comparison` (16 / 17 / 13 / 10).

## Sección 4 — PriceAnchorSourced ×4

```
H2                            ≤21/línea           What this costs / next to what you / already pay
                                                  ↳ 16 / 18 / 15
Aside oscuro           (276)  253–302             Four published figures, and they do not measure the same
                                                  thing. Two count providers handed to an outside team.
                                                  One counts staff seats inside software. The last one is
                                                  this product. Every figure states its unit, because that
                                                  is exactly where this comparison usually goes wrong.

Figura 1 label          (37)  ≤50                 $600 to $2,400 per provider, per year
Figura 1 nota           (85)  54–106              Outsourced ongoing maintenance. Unit: one provider, per
                                                  year. Medicotech and Medwave.
Figura 2 label          (35)  ≤50                 $1,500 to $5,000 per provider, once
Figura 2 nota           (82)  54–106              Full initial outsourcing across core payers. Unit: one
                                                  provider, once. Medicotech.
Figura 3 label          (33)  ≤50                 $3,600 to $9,000 a year, 15 users
Figura 3 nota           (79)  54–106              MedTrainer's own published category guidance. Unit:
                                                  staff seats, not providers.
Figura 4 label          (27)  ≤50                 $3,588 a year, 15 providers
Figura 4 nota           (77)  54–106              Sokndall Practice, $299 a month. Unit: providers
                                                  tracked. $239 each per year.
Cierre del ancla       (148)  113–216             Buying the work and tracking the work are different
                                                  purchases at different prices. If you want someone to
                                                  submit the applications, buy that instead.
```

Las cuatro con fuente linkeada. Ninguna `[PEND]`.

**Enlaces externos de esta página (`on-page-seo.md` §7):** Medicotech
(figuras 1 y 2), vía `medicotechllc.com/physician-credentialing-cost/`, y
MedTrainer (figura 3), vía `medtrainer.com/blog/average-cost-to-credential-a-
physician-provider-2/`. Los tres a `rel="nofollow"` por ser competidores o
guías de costo publicadas por un competidor. Dos dominios distintos, dentro
del rango 2-4 por página de contenido.

## Sección 5 — TrialTermsBlock

```
Headline                      [SIN MEDIR]         How the trial works
Ítem 1                        [SIN MEDIR]         14 days, full product — every feature from day one.
                                                  Nothing is held back for the trial.
Ítem 2                        [SIN MEDIR]         Card up front — so you are not re-entering it when the
                                                  trial ends and you decide to stay.
Ítem 3                        [SIN MEDIR]         Cancel from Settings — self-serve, no email required.
                                                  The card is charged on day 15 if you do not.
```

## Sección 6 — FAQ (`FAQPage`)

Preguntas literales de `faq-por-pagina.md`, página 2.

Q1  (42 car.)  How much does credentialing software cost?
    Sokndall costs $79, $299 or $699 a month. Across the rest of the category
    nobody publishes a number: symplr, Modio Health, MedTrainer and
    CredentialStream all require a demo first, and Capterra records all four
    as contact-vendor-for-pricing. The one public figure any of them offers is
    MedTrainer's own blog guidance of $3,600 to $9,000 a year for fifteen
    users, which counts seats rather than providers.
    → 64 palabras · 404 car.

Q2  (39 car.)  Is there a free credentialing software?
    Not a real one. What exists is the free tier of a larger product, or a
    spreadsheet template — and this site publishes one of those, with the
    formulas already in it. Sokndall has a fourteen-day trial rather than a
    free plan, because a permanently free tier of a tracking tool tends to
    mean the tracking stops working at the moment it starts mattering.
    → 64 palabras · 350 car.

Q3  (42 car.)  What happens if I cancel during the trial?
    Nothing is charged. The card goes in at signup so that nothing has to be
    re-entered later, but the first charge lands on day 15. Cancel from
    Settings before then and it does not happen. There is no cancellation
    form, no retention call, and no email you have to send to a person. Your
    data stays exportable as CSV either way.
    → 61 palabras · 324 car.

Q4  (39 car.)  Do you charge per provider or per user?
    Per provider. A provider is a clinician whose credentials and enrollments
    you track; a user is someone who logs in. Solo includes 3 providers and 1
    user, Practice 15 and 3, Billing Co 50 and 10. Users are included up to
    those limits rather than billed on top. Billing Co is the one exception:
    past ten users, each additional one is $39 a month.
    → 68 palabras · 378 car.

Q5  (27 car.)  Is there an onboarding fee?
    No. There is no setup fee, no implementation cost, no paid migration and
    no training package. Spreadsheet import is built into the product, with a
    preview before anything commits. This is worth asking every vendor in the
    category separately from the license price, because implementation and
    training are frequently quoted as their own line and are not always
    mentioned unprompted.
    → 60 palabras · 381 car.

Q6  (26 car.)  What counts as a provider?
    Anyone you track credentials or enrollment records for — physicians, nurse
    practitioners, physician assistants, therapists, BCBAs, dietitians,
    physical therapists. If they have an NPI and a payer relationship you are
    maintaining, they count. Mark someone inactive and they stop counting
    against your plan limit immediately, so a departing clinician does not
    keep occupying a slot.
    → 55 palabras · 380 car.

## Cierre

```
CTA heading             (28)  28–53               Start the fourteen-day trial
CTA body               (107)  78–149              Card up front, cancel yourself from Settings before day
                                                  15. Nothing on this page changes after you sign up.
```

---
---

# PÁGINA 4 · `/credentialing-spreadsheet-template`

Keyword `credentialing spreadsheet template` (20, KD 0) · 700-1.000 palabras
**Expectativa de SEO: ninguna.** Es captura de email y activo enlazable.
Canal real: r/CodingandBilling y r/MedicalCoding.

Advertencia de `BRIEF_COPY.md` §4 aplicada: nadie se llama a sí mismo "el del
credentialing spreadsheet". La keyword vive en el `<title>`, el H2 y el nombre
del archivo; el copy nunca le dice al lector que se identifique con esa etiqueta.

## Metadatos

```
<title>                 (51)  50–60               Credentialing Spreadsheet Template, Free | Sokndall
meta description       (150)  150–160             A free credentialing spreadsheet template with the
                                                  formulas already in it: providers, credentials, payer
                                                  enrollment, CAQH and a dashboard. No account.
```

## Sección 1 — Hero + DownloadForm

```
H1 línea 1              (17)  ≤17                 The credentialing
H1 línea 2              (11)  ≤17                 sheet, free
Subhead                (151)  133–195             Six tabs: providers, credentials, payer enrollment,
                                                  CAQH, a dashboard that counts what is overdue, and a
                                                  page on how to use it. Excel or Google Sheets.
Strip 1                 (10)  ≤42                 No account
Strip 2                 (22)  ≤42                 Excel or Google Sheets
Strip 3                 (22)  ≤42                 Formulas already in it
Strip 4                 (17)  ≤42                 One email address
Label del form                [SIN MEDIR]         Email me the template
Microcopy                     [SIN MEDIR]         One email with the file. We send a few things about
                                                  credentialing after that, and one click unsubscribes.
```

## Sección 2 — FieldInventory

```
H2                            ≤21/línea           What is in the / credentialing / spreadsheet template
                                                  ↳ 14 / 14 / 21 — keyword exacta partida por `<br>` autoral
Pestaña 1                     [SIN MEDIR]         Providers — name, credential, NPI, specialty, location,
                                                  start date, employment status, notes. Every other tab
                                                  pulls names from here, so they stay consistent instead
                                                  of drifting into three spellings of the same person.
Pestaña 2                     [SIN MEDIR]         Credentials, one row per credential per provider — type,
                                                  issuing state or body, ID number, issue date, expiration
                                                  date, days left, status, renewal started, responsible
                                                  person, notes. Days left and status calculate
                                                  themselves.
Pestaña 3                     [SIN MEDIR]         Payer Enrollment, one row per provider per payer —
                                                  payer, plan or network, request type, submitted date,
                                                  how it was submitted, confirmation number, payer
                                                  contact, status, last follow-up, days since follow-up,
                                                  next follow-up due, effective date, payer provider ID or
                                                  PTAN, group TIN, claims being held, notes.
Pestaña 4                     [SIN MEDIR]         CAQH (DataSpring) — CAQH provider ID, last attestation
                                                  date, next attestation due, days left, status, profile
                                                  complete, documents expiring inside the profile, notes.
                                                  Next due is the last attestation plus 120 days,
                                                  calculated for you.
Pestaña 5                     [SIN MEDIR]         Dashboard — what you read on a Monday: what expired,
                                                  what expires in 30, 60 and 90 days, attestations
                                                  overdue, applications open, applications where the payer
                                                  is waiting on you, applications quiet for 30 days, pairs
                                                  with claims held.
```

`(f)` los campos de las pestañas 1 y 2 —tipo, estado/organismo emisor, número
de ID, fecha de emisión, fecha de vencimiento— coinciden con la guía de
referencia rápida de CAQH ProView publicada por el Maryland Department of
Health, vía `health.maryland.gov` · el ciclo de revalidación de Medicare que
alimenta el dashboard (30/60/90 días) sale de CMS, vía `hhs.gov/guidance/
document/provider-enrollment-and-certification-revalidations-renewing-your-
enrollment-0`. Dos dominios, ambos institucionales, follow normal.

## Sección 3 — Dónde se termina la planilla

```
H2                            ≤21/línea           Where a / spreadsheet stops
                                                  ↳ 8 / 19
Intro note             (117)  92–179              It is a real tool and it will hold a small practice
                                                  together. The limits below are structural, not a formula
                                                  problem.
Ítem 1 título           (22)  ≤23                 It will not remind you
Ítem 1 cuerpo           (74)  47–86               The dates are right and nothing tells you about them.
                                                  You have to open it.
Ítem 2 título           (19)  ≤23                 It keeps no history
Ítem 2 cuerpo           (66)  47–86               Someone overwrites a status and the previous one is gone
                                                  for good.
Ítem 3 título           (27)  ≤23 (tolera 2 líneas)  The documents are elsewhere
Ítem 3 cuerpo           (69)  47–86               The COI and the payer letter sit in a folder. The row
                                                  holds a number.
Ítem 4 título           (26)  ≤23 (tolera 2 líneas)  It cannot catch a mismatch
Ítem 4 cuerpo           (64)  47–86               Two disagreeing NPIs both sit there quietly. The payer
                                                  will not.
Ítem 5 título           (22)  ≤23                 It holds 40 rows a tab
Ítem 5 cuerpo           (49)  47–86               Room for a small practice, not for a growing one.
Closing                (135)  116–219             That is the failure mode, and it is not a wrong date
                                                  sitting in the file. It is a right date sitting in a
                                                  file nobody opened that week.
```

## Sección 4 — Cuándo alcanza y cuándo deja de alcanzar

```
H2                            ≤21/línea           When this is / enough, and when / it stops being
                                                  ↳ 12 / 18 / 15
Párrafo 1                     [SIN MEDIR]         Two providers and three payers is six pairs plus a
                                                  handful of credential rows. The sheet is the right tool
                                                  for that, and buying software for it would be silly.
Párrafo 2                     [SIN MEDIR]         Eight providers across twelve payers is 96 pairs, and
                                                  this file holds 40 rows a tab. Add multi-state licensure
                                                  and you are re-sorting every time someone asks a
                                                  question. At that point the sheet is not tracking
                                                  anything — it is where the tracking used to happen.
Párrafo 3                     [SIN MEDIR]         There is a version that works longer: auto-calculated
                                                  windows, separate views by role, escalation rules. Some
                                                  practices build it. What it costs is the weeks spent
                                                  building and maintaining it, on top of the work you
                                                  already have.
Párrafo 4                     [SIN MEDIR]         Sokndall is that, already built: the same fields, the
                                                  same logic, plus the email on Monday morning that a file
                                                  cannot send you.
```

## Sección 5 — FAQ (`FAQPage`)

Preguntas literales de `faq-por-pagina.md`, página 4.

Q1  (48 car.)  What should a credentialing spreadsheet include?
    At minimum: one row per credential per provider with an expiration date
    and a calculated days-left column, and one row per provider per payer for
    enrollment, with a submitted date, a status, and the date of the last
    follow-up. Most homemade trackers have the first and not the second, which
    is why they catch expirations and miss applications that stopped moving.
    → 61 palabras · 363 car.

Q2  (47 car.)  Is there a free credentialing tracker template?
    This one. Six tabs, the formulas already written, and no account required
    — an email address and the file arrives. It covers providers, credentials
    with calculated expiry windows, payer enrollment with a follow-up log,
    CAQH attestation dates on the 120-day cycle, a dashboard, and a page
    explaining how the whole thing fits together.
    → 53 palabras · 333 car.

Q3  (50 car.)  Does the template work in Excel and Google Sheets?
    Both. The formulas are limited to functions that behave the same in each,
    so nothing breaks when you upload the file to Drive or download it back
    out again. Conditional formatting carries across as well. There is no
    macro, no script and no add-on, which is deliberate: an IT department will
    not have to approve anything.
    → 56 palabras · 320 car.

Q4  (42 car.)  When does a spreadsheet stop being enough?
    When you can no longer answer what needs attention this week without
    opening the file and reading all of it. That is usually somewhere past
    forty provider-payer pairs, but the row count is not really what breaks.
    What breaks is that the sheet cannot tell you anything you did not think
    to ask, and follow-up is entirely made of things you forgot to ask about.
    → 65 palabras · 359 car.

```
CTA heading             (37)  28–53               Take the free file first, then decide
CTA body               (109)  78–149              It is free and it will tell you where you land. If it
                                                  stops holding, the paid version is on the pricing page.
```

---
---

# PÁGINA 9 · `/payer-enrollment-software`

Keyword `provider enrollment software` (390, KD 20) · 1.300-1.700 palabras
Solapa fuerte con el SERP de la home: **la diferenciación es obligatoria.** Esta
página es sobre el flujo de enrollment. Cero lenguaje de comparación de vendors.

## Metadatos

```
<title>                 (60)  50–60               Provider Enrollment Software That Tracks the Wait |
                                                  Sokndall
meta description       (158)  150–160             Provider enrollment software for small practices: one
                                                  record per provider per payer, from submitted to the
                                                  effective date, plus a flag when nothing has moved.
```

## Sección 1 — Hero

```
H1 línea 1              (15)  ≤17                 Track the wait,
H1 línea 2              (17)  ≤17                 not the paperwork
Subhead                (155)  133–195             One record per provider per payer, from submitted to
                                                  effective date: status, confirmation number, who you
                                                  spoke to last, and how long since anyone checked.
Strip 1                 (12)  ≤42                 Six statuses
Strip 2                 (17)  ≤42                 30-day stall flag
Strip 3                 (27)  ≤42                 One follow-up log per payer
Strip 4                 (19)  ≤42                 $79 to $699 a month
```

## Sección 2 — Credentialing no es enrollment · OBLIGATORIA

```
H2                            ≤21/línea           Credentialing and / provider enrollment / are two steps
                                                  ↳ 18 / 20 / 14
Intro note             (157)  92–179              Credentialing is the verification: the payer confirms
                                                  you are who you say you are. Enrollment is being
                                                  accepted into the network and switched on for billing.
Párrafo                       [SIN MEDIR]         Most practices use the word credentialing for both, and
                                                  that is fine in conversation. It stops being fine when
                                                  you are trying to work out where a delay is sitting,
                                                  because the two stages fail differently. Verification
                                                  stalls on a document. Enrollment stalls on a contract, a
                                                  network adequacy decision, or a queue.
Closing                (126)  116–219             Being able to say which of the two you are waiting on is
                                                  the difference between a useful phone call and one that
                                                  goes nowhere.
```

## Sección 3 — El plazo

```
H2                            ≤21/línea           Submitting takes / an afternoon. The / next four months
                                                  / are the job
                                                  ↳ 17 / 20 / 16 / 11
Intro note             (123)  92–179              Enrollment runs 90 to 120 days per provider per payer on
                                                  a good path, and considerably longer when something goes
                                                  sideways.
Párrafo                       [SIN MEDIR]         Medicare through PECOS moves faster than commercial
                                                  payers when the application is clean. Medicaid varies so
                                                  widely by state that a national figure means nothing.
                                                  What all three share is that the waiting is
                                                  unstructured: no shared queue, no ticket number that
                                                  means anything to you, and no notification when the
                                                  payer needs something from your side.
Closing                (134)  116–219             Applications in this category do not usually get denied.
                                                  They sit, and the sitting stays invisible until somebody
                                                  goes looking for it.
```

`(f)` HOM RCM, vía `homrcm.com/blogs/provider-credentialing-and-enrollment-
guide` — el ciclo completo, credentialing a enrollment, corre entre 90 y 120
días · Assured, vía `withassured.com/blog/how-long-does-provider-
credentialing-take` — los pagadores comerciales caen en el rango de 90 a 120.
Ambos con URL confirmada. Retirados los datos de octubre-abril y de 60-190
días, que solo tenían respaldo en foro — `on-page-seo.md` §12 prohíbe linkear
ahí.

## Sección 4 — StatusTable

```
H2                            ≤21/línea           Six statuses, and / one of them is your / problem right
                                                  now
                                                  ↳ 18 / 20 / 18
Fila 1                        [SIN MEDIR]         Not started · Provider is on the roster, the application
                                                  is not in · Gather documents, confirm the CAQH profile
                                                  is attested
Fila 2                        [SIN MEDIR]         Submitted · It went in, nobody has looked at it ·
                                                  Nothing yet. Wait out the payer's stated window
Fila 3                        [SIN MEDIR]         In review · Someone at the payer has it · Follow up on a
                                                  schedule, not on a feeling
Fila 4                        [SIN MEDIR]         Info requested · The payer is waiting on you · Clear it
                                                  today. This is the expensive one
Fila 5                        [SIN MEDIR]         Approved · You have an effective date · Confirm it, and
                                                  check whether claims can be backdated
Fila 6                        [SIN MEDIR]         Denied or withdrawn · It is over for now · Record why.
                                                  It matters when you reapply
Closing                (117)  116–219             Info requested costs the most and hides the best,
                                                  because the payer frequently never tells you it is the
                                                  one waiting.
```

## Sección 5 — La fecha efectiva

```
H2                            ≤21/línea           Approved is not / the date you can / start billing
                                                  ↳ 16 / 18 / 16
Párrafo                       [SIN MEDIR]         With Aetna, the in-network effective date is the day the
                                                  contract is fully executed — not the day the application
                                                  went in, and not the day someone told you it was
                                                  approved. Bill against the wrong one and the claims come
                                                  back. Some payers allow backdating and some do not, and
                                                  you find out which after the fact.
Closing                (118)  116–219             Record the effective date the payer confirms, in
                                                  writing, and treat every other date in the process as
                                                  administrative.
```

`(f)` clinicaldocslibrary.com, vía `clinicaldocslibrary.com/insurance-billing/
credentialing-with-aetna/` — Reemplaza a `(v17)`
y a `(v24)` como respaldo, y evita el código de denegación B7, que quedó
`[VERIFICAR]` en la auditoría.

## Sección 6 — ErrorList

```
H2                            ≤21/línea           The mismatch that / stalls it quietly
                                                  ↳ 17 / 17
Intro note             (137)  92–179              A payer will not act on an application whose fields
                                                  disagree with each other, and nothing in the process
                                                  tells you that is what happened.
Ítem 1                        [SIN MEDIR]         Individual NPI against group NPI — the type 1 on the
                                                  provider record checked against the type 2 on the
                                                  practice record. This is the disagreement that quietly
                                                  pays everything out of network.
Ítem 2                        [SIN MEDIR]         TIN against the group record — the tax ID the
                                                  application was filed under checked against the one the
                                                  practice actually bills on. Change an EIN and this is
                                                  what breaks.
Ítem 3                        [SIN MEDIR]         Legal name against everything else — the name on the
                                                  license checked against the practice record. Middle
                                                  initials, suffixes and married names all count as a
                                                  mismatch to a payer.
Closing                (135)  116–219             Carelon gives you seven calendar days to correct a
                                                  conflicting record in writing. A flag you can see beats
                                                  a letter you did not expect.
```

`(f)` Carelon, vía `carelonbehavioralhealth.com/providers/join-our-network` —
si un tercero reporta información que entra en conflicto con lo
declarado, la corrección va por escrito dentro de los 7 días calendario. Es la
fuente pública que convierte esta sección de función de producto en mecanismo.

**Límite de la afirmación, para el maquetado:** compara campos entre registros
propios. No compara contra lo que el pagador tiene cargado — eso sería
verificación de fuente, que la sección 8 niega.

## Sección 7 — MatrixSchematic

```
H2                            ≤21/línea           Every provider, / every payer, / one screen
                                                  ↳ 16 / 13 / 10
Diagram note           (199)  180–356             Low-fidelity schematic of the data model. It is not a
                                                  screenshot, and no product interface exists yet.
                                                  Providers run down the side, payers across the top, and
                                                  one cell holds each provider-payer pair.
Bullet 1                (88)  72–137              Each cell carries a status and the number of days since
                                                  the last follow-up on that pair.
Bullet 2                (93)  72–137              Twelve providers across ten payers is 120 applications,
                                                  and most of the grid should be quiet.
Bullet 3                (82)  72–137              The few cells that are not quiet are the only ones that
                                                  need a decision this week.
Aside título            (27)  ≤110                Why the grid and not a list
Aside cuerpo           (137)  81–153              A list makes you read all 120 rows to find the six. The
                                                  grid puts the six where your eye lands first, which is
                                                  the only reason it exists.
```

## Sección 8 — Qué no hace

```
H2                            ≤21/línea           What it does / not do
                                                  ↳ 12 / 6
Ítem 1 título           (18)  ≤23                 It does not submit
Ítem 1 cuerpo           (80)  47–86               You still work in the payer's own portal. This holds the
                                                  record, not the filing.
Ítem 2 título           (20)  ≤23                 No portal connection
Ítem 2 cuerpo           (79)  47–86               No login, no scraping, no integration that breaks when a
                                                  payer changes systems.
Ítem 3 título           (16)  ≤23                 It chases nobody
Ítem 3 cuerpo           (69)  47–86               The queue says who is due for a call. Making the call is
                                                  still yours.
Closing                (129)  116–219             No tool in this category files applications for you. The
                                                  ones that say otherwise are describing a service with
                                                  software attached.
```

## Sección 9 — FAQ (`FAQPage`)

Preguntas literales de `faq-por-pagina.md`, página 9.

Q1  (28 car.)  What is provider enrollment?
    Provider enrollment is the process of being accepted into a payer's
    network and switched on for billing under a specific tax ID and location.
    It follows credentialing, which is the verification stage, and it ends
    with an effective date. Until that date exists and is confirmed, claims
    for that provider with that payer are either held, paid out of network, or
    written off.
    → 63 palabras · 372 car.

Q2  (69 car.)  What is the difference between credentialing and provider enrollment?
    Credentialing is verification: the payer confirms your license, education,
    board status, malpractice coverage and exclusion screening against the
    issuing sources. Enrollment is network participation and billing
    activation. A provider can be fully credentialed and still not be
    enrolled, which is the exact situation that produces months of denied
    claims while everyone involved believes the process finished.
    → 56 palabras · 408 car.

Q3  (36 car.)  How long does payer enrollment take?
    Ninety to a hundred and twenty days is the working figure for commercial
    payers on a clean application. Medicare through PECOS is often faster;
    Medicaid varies enough by state that a national number is not useful.
    Incomplete applications and stale CAQH profiles are the two most common
    reasons a file sits, and neither generates any notice from the payer.
    → 59 palabras · 355 car.

Q4  (58 car.)  What happens if a payer enrollment application goes quiet?
    Usually it is waiting on something the payer never asked you for. Sokndall
    flags any application with no recorded contact in thirty days, which is
    not a diagnosis — it is a prompt to call. The call is the only way to find
    out whether the file is progressing, sitting behind a document, or in a
    network that quietly stopped accepting new providers.
    → 63 palabras · 347 car.

Q5  (51 car.)  Can software submit enrollment applications for me?
    No. Not this one and not any of them. Every product in this category holds
    records and reminds you; the filing happens in the payer's own portal,
    under your login, by a person. A vendor that appears to submit for you is
    a credentialing service with software attached, and it is priced like a
    service — several times what a tracking tool costs.
    → 63 palabras · 343 car.

## Cierre

```
CTA heading             (35)  28–53               See the whole price list, published
CTA body                (99)  78–149              Three plans, published, no quote process. Fourteen-day
                                                  trial and you cancel yourself before day 15.
```

---
---

# PÁGINA 11 · `/for-billing-companies`

Sin keyword objetivo. Página de conversión. 900-1.300 palabras.
No perseguir `credentialing services for providers` — es intención de servicio.

## Metadatos

```
<title>                 (55)  50–60               Credentialing Software for Billing Companies | Sokndall
meta description       (153)  150–160             Run credentialing for six clients without six
                                                  spreadsheets: separate client organizations, isolated
                                                  data, one login, and one weekly view across the book.
```

## Sección 1 — Hero

```
H1 línea 1              (12)  ≤17                 Six clients,
H1 línea 2              (14)  ≤17                 not six sheets
Subhead                (146)  133–195             Separate client organizations, isolated data, one login,
                                                  one weekly view across all of them. $699 a month for up
                                                  to 50 providers across your book.
Strip 1                 (24)  ≤42                 Data isolated per client
Strip 2                 (34)  ≤42                 Switch clients without logging out
Strip 3                 (29)  ≤42                 Scoped access per coordinator
Strip 4                 (29)  ≤42                 $13.98 a provider at capacity
```

## Sección 2 — El problema

```
H2                            ≤21/línea           The problem is not / volume. It is that / nothing adds
                                                  up
                                                  ↳ 18 / 19 / 15
Intro note             (112)  92–179              Each client has their own file, their own naming, their
                                                  own way of recording a follow-up, and none of it totals.
Párrafo                       [SIN MEDIR]         Answering what needs attention this week means opening
                                                  six things and holding the answer in your head.
                                                  Answering it for a client on the phone means opening
                                                  theirs while they wait.
Closing                (121)  116–219             And when a coordinator leaves, whatever they knew about
                                                  where each application stood walks out of the building
                                                  with them.
```

## Sección 3 — La estructura

```
H2                            ≤21/línea           How the / structure works
                                                  ↳ 7 / 15
Ítem 1                        [SIN MEDIR]         Separate client organizations — each client's providers,
                                                  payers and records are isolated. Nothing bleeds between
                                                  them, and nothing shows a client's data to anyone
                                                  assigned elsewhere.
Ítem 2                        [SIN MEDIR]         Client switcher — move between clients without logging
                                                  out or re-authenticating.
Ítem 3                        [SIN MEDIR]         Scoped user access — assign a coordinator to two clients
                                                  and not the other four. Not everyone needs to see
                                                  everyone's queue.
Ítem 4                        [SIN MEDIR]         One aggregate view — across every client at once: how
                                                  many applications need follow-up this week, and how many
                                                  have been quiet for more than thirty days.
Ítem 5                        [SIN MEDIR]         Per-client follow-up queue — every coordinator opens
                                                  their Monday view already filtered to their own clients,
                                                  not the whole book.
```

`(f)` verificado contra el alcance funcional: cada organización cliente es su
propia entidad con proveedores, credenciales, enrollments, bitácoras y documentos
aislados por RLS.

## Sección 4 — El reporte

```
H2                            ≤21/línea           The report you can / send without / building it
                                                  ↳ 18 / 13 / 11
Párrafo                       [SIN MEDIR]         When a client asks where their enrollments stand, the
                                                  answer is a list with dates, statuses and the last
                                                  follow-up on each one. Not a recollection, and not an
                                                  afternoon of assembling.
Closing                (141)  116–219             That is also the report that justifies your invoice,
                                                  which is a different conversation than the one where you
                                                  explain that the payer is slow.
```

`(j)` — no hay ningún verbatim de dueño de billing company en el barrido. Esta
sección es juicio de copywriting sobre un comprador del que no hay voz directa.
Es la parte más flaca de la página.

## Sección 5 — PriceAnchorSourced

```
H2                            ≤21/línea           What the work / costs, and what / tracking it costs
                                                  ↳ 14 / 15 / 18
Figura 1 label          (37)  ≤50                 $600 to $2,400 per provider, per year
Figura 1 nota           (86)  54–106              Outsourced maintenance, the work you resell. Unit: one
                                                  provider, per year. Medicotech.
Figura 2 label          (32)  ≤50                 $699 a month, up to 50 providers
Figura 2 nota           (68)  54–106              Sokndall Billing Co. Unit: providers tracked across your
                                                  whole book.
Figura 3 label          (44)  ≤50                 $960 to $1,120 a month, one specialist
Figura 3 nota           (92)  54–106              One dedicated specialist per client. Unit: per
                                                  specialist hired, not per provider. Zedtreeo.
Cierre del ancla       (129)  113–216             The gap is not a discount. Buying the work and tracking
                                                  the work are different purchases, and only one of them
                                                  replaces a person.
```

**Enlaces externos de esta página (`on-page-seo.md` §7), corregidos en esta
pasada — antes tenía un solo dominio, por debajo del mínimo de 2:**

- Medicotech, vía `medicotechllc.com/physician-credentialing-cost/`.
- Zedtreeo, vía `zedtreeo.com/blog/medical-credentialing-outsourcing` — calcula
  el costo de contratar un especialista de credentialing dedicado a un libro de
  proveedores de un solo cliente ($960 a $1.120 al mes para una práctica de 5
  proveedores), que es el comprador exacto al que se dirige esta página, y una
  unidad distinta de la de Medicotech: persona contratada, no proveedor
  tercerizado.

Ambos `rel="nofollow"`. Dos dominios distintos, dentro del rango 2-4.

**Nota de honestidad sobre la fuente de Zedtreeo.** El mismo artículo calcula
también un ahorro de "85-88%" comparando ese especialista contra un costo
interno hipotético de $77.000-95.000 al año. **Esa comparación no se usa acá**:
compara contra personal interno, no contra tercerizar por proveedor, y sería
exactamente la clase de comparación de unidades distintas que la Sección 5 de
esta misma página ya identifica como el error a evitar. Se cita únicamente el
dato del especialista dedicado, con su unidad declarada en la misma línea.

## Sección 6 — La arquitectura, no el número

```
H2                            ≤21/línea           A different / architecture, not / a bigger number
                                                  ↳ 11 / 18 / 16
Párrafo                       [SIN MEDIR]         Every feature in the smaller plans is here. What is
                                                  different is the multi-client structure, and it is not
                                                  available on Solo or Practice — the isolation is built
                                                  into how the data is stored, not switched on afterwards.
```

## Sección 7 — FAQ (`FAQPage`)

Preguntas literales de `faq-por-pagina.md`, página 11. Sin volumen de búsqueda:
son objeciones de conversión, no consultas.

Q1  (58 car.)  Can one account manage credentialing for multiple clients?
    Yes, and that is what the Billing Co plan is for. Each client is a
    separate organization inside one login, with its own providers, payer
    records, follow-up logs and documents. You move between them without
    logging out. The aggregate view answers what needs attention this week
    across every client at once, which is the thing six separate spreadsheets
    cannot do at all.
    → 62 palabras · 368 car.

Q2  (47 car.)  How is client data separated between practices?
    At the database level, with row-level security rather than a filter in the
    interface. A coordinator assigned to two clients cannot query, export or
    see the other four, and there is no view in the product that combines
    client records except the aggregate follow-up count. This matters when a
    client asks the question directly, which they eventually will.
    → 58 palabras · 353 car.

Q3  (53 car.)  Can I bill credentialing tracking back to my clients?
    That is between you and your client agreement, and plenty of billing
    companies do. What the product gives you is the report that supports it:
    per client, per provider, per payer, with dates and the last follow-up on
    each application. Whether it appears on the invoice as a line item or sits
    inside your existing rate is your call, not a software question.
    → 63 palabras · 355 car.

## Cierre

```
CTA heading             (28)  28–53               Start the fourteen-day trial
CTA body                (98)  78–149              Card up front, cancel yourself from Settings before day
                                                  15. Full plan details on the pricing page.
```

---
---

# RESUMEN DE LA TANDA A

## Slots fuera de rango

| Página | Slot | Tipo | Necesito | Nota |
|---|---|---|---|---|
| `/pricing` | H2 sección 3, línea 4 | ≤21 | 22 | Alternativa que entra, incluida en la sección |
| Las cinco | Respuestas de FAQ | ≤117 | 250–550 | **Decisión de arriba** — ganan las 40-90 palabras |

## Fuentes

Ninguna cifra `[PEND]` en las cinco páginas. Todas las citas migradas de `(v#)`
a `(f)` con el link de `research-proceso.md` o `COMPETIDORES_DATOS.md`, según la
auditoría de §4. `(v17)` y su código B7 no aparecen en ninguna de estas páginas.

## Exclusiones aplicadas

- Ni `primary source verification`, ni `privileging`, ni `delegated
  credentialing`, ni `CVO` como propuesta de valor propia. Solo aparece
  `credentialing committee` en la home, y como contraste explícito con el
  segmento de health systems, que es el uso que `exclusiones.md` §6 permite.
- Ninguna página persigue variantes de login ni intención de servicio.
- Cero adjetivos de la lista de `voice-and-evidence.md` §2.6.
