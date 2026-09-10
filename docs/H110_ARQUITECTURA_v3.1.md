# H110 / SOKNDALL — ARQUITECTURA DE SITIO v3.1

**7 sep 2026 · Agente SEO · Reemplaza a la v3 del 2 sep**

Marcado: **(a)** presentación de SEO consolidada · **(b)** investigación propia
verificable · **(c)** juicio profesional sin fuente dura.

La v3.1 incorpora los 8 SERPs que faltaban. **Ninguna de las 16 páginas tiene ya
longitud ni ángulo puestos a ojo.** Los cambios respecto de la v3 no son
cosméticos: se elimina una página, se reemplaza otra, y se resuelve un problema de
canibalización que la v3 tenía sin detectar.

Documentos que acompañan a este y son de lectura obligatoria para el copywriter:
`voice-and-evidence.md`, `faq-por-pagina.md`, `exclusiones.md`, `on-page-seo.md`.

---

## 1. EL PROBLEMA QUE APARECIÓ AL MEDIR LOS 8 SERPS

**Cinco páginas de la v3 apuntaban a lo que Google trata como un solo SERP (b).**

Solapamiento de URLs en el top 10:

| URL | `credentialing software` | `best credentialing software` | `provider enrollment software` | `credentialing tracking software` | `credentialing software cost` |
|---|---|---|---|---|---|
| symplr.com/products/symplr-provider | 2 | 4 | 1 | 1 | 5 |
| verisys.com/blog/best-credentialing-software | 1 | 3 | 3 | 2 | — |
| medtrainer.com/products/credentialing | 6 | 1 | 4 | 3 | — |
| withassured.com/blog/8-best-credentialing | 7 | 6 | 2 | 4 | 4 |
| klasresearch.com/compare/credentialing/139 | 4 | 2 | 6 | 6 | — |
| expirationreminder.com/blog/choosing | 3 | — | 7 | 5 | 7 |

Entre 60% y 80% de solapamiento. **Google considera estas consultas
sustancialmente la misma intención.** Publicar cinco páginas propias contra ese
SERP produce canibalización: se reparten señales y ninguna gana.

El principio ya estaba en la presentación consolidada **(a)** —keywords de la
misma intención van a una sola página— pero no se aplicó porque la v3 no tenía
los SERPs medidos.

### Resolución

| Página | Decisión | Base |
|---|---|---|
| `/` | **Se mantiene** como pilar del clúster software | (b) |
| `/best-credentialing-software` | **Se mantiene.** El SERP tiene Reddit, YouTube, KLAS y "People also ask": señales de comportamiento comparativo distinguible. CPC $43,54 lo justifica | (b) |
| `/payer-enrollment-software` | **Se mantiene**, pero se diferencia en flujo de enrollment, no en comparación de software. Su SERP tiene qgenda, credyapp y medallion, que no aparecen en los otros | (b) |
| `/credentialing-tracking-software` | **ELIMINADA.** SERP 90% idéntico a `credentialing software`, 90 de volumen, KD 32. No justifica página | (b) |
| `/pricing` | Persigue **solo** `credentialing software pricing` (110, transaccional). `credentialing software cost` (210, informacional, **CPC $0**, SERP de posts de blog) se absorbe en `/best-credentialing-software` | (b) |

**Nota sobre `credentialing software cost` (b):** su SERP no tiene ni una sola
página de precios — son diez posts de blog explicando rangos de costo. Una página
`/pricing` transaccional no rankea ahí. Su hogar natural es la comparación, que ya
tiene que discutir precios de competidores. Explica además por qué el post de
costo de MedTrainer rankea en los dos SERPs.

**Protocolo permanente contra canibalización:** antes de agregar cualquier página
nueva al sitio, comparar su top 10 contra el de las páginas existentes. Con más de
50% de solapamiento, no es una página nueva: es una sección de una existente.

---

## 2. LA OTRA CORRECCIÓN: EL PILOTO DE PAGADOR NO VA

La v3 proponía `/payer-enrollment/aetna-behavioral-health`. **Los datos la matan (b):**

- Volumen: 40. KD 33.
- Solo **2 variaciones de keyword** en total, sumando 60 de volumen.
- 6 de los 10 resultados son propiedades de Aetna (aetna.com, aetnabetterhealth,
  banneraetna). Terceros: medsolercm en #7 con Page AS 1, thecredentialing.com en
  #10.

Cuarenta búsquedas mensuales con el SERP cerrado no sostienen una página de 2.000
palabras.

**Y al lado hay algo mucho mejor (b):** el clúster de `behavioral health
credentialing` tiene **294 variaciones de keyword sumando 3.500 de volumen**. La
v3 lo dimensionó en 310.

Dentro de ese clúster:

| Keyword | Vol | KD | CPC |
|---|---|---|---|
| `behavioral health credentialing services` | 170 | **6** | — |
| `aetna behavioral health credentialing` | 140 | 25 | — |
| `optum behavioral health provider credentialing phone number` | 210 | 25 | — |
| `carelon behavioral health provider credentialing phone number` | 210 | 48 | — |
| `arkansas bhcm ii credentialing organization` | 260 | n/a | — |

**El ángulo de pagador no muere: se relocaliza.** Aetna, Optum, Carelon y Magellan
pasan a ser secciones dentro de `/behavioral-health-credentialing`, que es donde
el SERP muestra que funciona.

### El hueco en el SERP de `behavioral health credentialing` (b)

Top 10: cigna.com (AS 24), uhcprovider.com (AS 14), blueshieldca.com (AS 12),
curemd.com (AS 11), masspartnership.com (AS 0), sonomacounty.gov (AS 11),
medtrainer.com (AS 9, 1 dominio de referencia), theraplatform.com (AS 10),
ccpcares.org (AS 0, un PDF), carelonbehavioralhealth.com (AS 30).

**Siete de diez son pagadores, condados o PDFs.** Solo tres son contenido de
tercero, y los tres tienen Page AS entre 9 y 11 con 1 a 7 dominios de referencia.

El lector busca una síntesis y Google le devuelve diez portales de pagador
distintos. **Nadie escribió la página que compara los procesos de los pagadores de
salud mental en un solo lugar.** Ese es el ángulo.

---

## 3. LA PÁGINA QUE SE AGREGA EN SU LUGAR

`/credentialing-services-for-therapists` — y viene con una advertencia.

| Keyword | Vol | KD | CPC |
|---|---|---|---|
| `insurance credentialing services for mental health providers` | 170 | **1** | **$66,88** |
| `credentialing services for mental health providers` | 140 | **5** | $43,30 |
| `therapist credentialing services` | 260 | **9** | $50,52 |
| `behavioral health credentialing services` | 170 | **6** | — |
| `credentialing companies for therapists` | 110 | 11 | $44,30 |
| `credentialing services for therapists` | 70 | 7 | $34,14 |

KD de 1 a 11 con CPC de $34 a $67. Es el conjunto más barato de ganar y más caro
de comprar de todo el proyecto.

**La advertencia, y es seria (c):** es intención de **servicio tercerizado**. Esa
gente quiere que alguien haga el trabajo. Sokndall no lo hace. `exclusiones.md`
prohíbe perseguir intención de servicio en todo el resto del sitio.

**Por qué acepto la excepción acá:** es exactamente donde el ancla de precio
aterriza. Alguien que busca cuánto cuesta un servicio de credentialing está
evaluando gastar $600-2.400 por proveedor al año. Una página que responda con
honestidad qué cuestan los servicios, cuándo valen la pena de verdad, y qué opción
queda para quien prefiere hacerlo con una herramienta de $79, convierte una
fracción legítima de ese tráfico.

**Es una hipótesis, no una certeza. Va con puerta de medición explícita:** si a 90
días la tasa de conversión a trial o a plantilla está por debajo del promedio de
las páginas de salud mental, **se despublica**. No se replica el patrón a otros
verticales hasta tener el dato.

---

## 4. MAPA DE PÁGINAS v3.1 — 20 páginas

### OLA 1 — Comercial · bloquea lanzamiento

| # | Ruta | Keyword | Vol | KD | CPC |
|---|---|---|---|---|---|
| 1 | `/` | `credentialing software` | 880 | 25 | $23,15 |
| 2 | `/pricing` | `credentialing software pricing` | 110 | 18 | — |
| 3 | `/best-credentialing-software` | `best credentialing software` | 390 | 22 | **$43,54** |
| 4 | `/credentialing-spreadsheet-template` | `credentialing spreadsheet template` | 20 | 0 | $5,70 |

### OLA 2 — Salud mental · el terreno más ganable

| # | Ruta | Keyword | Vol | KD | CPC |
|---|---|---|---|---|---|
| 5 | `/insurance-credentialing-for-therapists` | `insurance credentialing for therapists` | 390 | **12** | $39,33 |
| 6 | `/behavioral-health-credentialing` | `behavioral health credentialing` | 140 | **16** | $29,07 |

### OLA 3 — CAQH

| # | Ruta | Keyword | Vol | KD | CPC |
|---|---|---|---|---|---|
| 7 | `/caqh-reattestation` | `caqh reattestation` | 170 | **13** | $8,41 |
| 8 | `/caqh-provider-data-portal` | `caqh provider data portal` | 12.100 | 26 | $6,35 |

### OLA 4 — Producto y segmento

| # | Ruta | Keyword | Vol | KD | CPC |
|---|---|---|---|---|---|
| 9 | `/payer-enrollment-software` | `provider enrollment software` | 390 | **20** | $27,21 |
| 10 | `/provider-credentialing-checklist` | `provider credentialing checklist` | 210 | **9** | $4,77 |
| 11 | `/for-billing-companies` | sin keyword — página de segmento | — | — | — |

### OLA 5 — Intercepción de precio de competidores

| # | Ruta | Keyword | Vol | KD | CPC |
|---|---|---|---|---|---|
| 12 | `/medtrainer-pricing` | `medtrainer pricing` | 90 | 26 | $33,77 |
| 13 | `/symplr-pricing` | `symplr pricing` | 30 | 22 | $8,66 |
| 14 | `/modio-health-pricing` | `modio health pricing` | 20 | 9 | $16,30 |

### OLA 6 — Bajo puerta de medición

| # | Ruta | Keyword | Vol | KD | CPC |
|---|---|---|---|---|---|
| 15 | `/credentialing-services-for-therapists` | `therapist credentialing services` | 260 | **9** | $50,52 |

### PERMANENTES

`/about` · `/security` · `/terms` · `/privacy` (indexables) · `/login` y rutas de
app (`noindex, nofollow`).

### ELIMINADAS respecto de la v3

`/credentialing-tracking-software` (canibalización) ·
`/payer-enrollment/aetna-behavioral-health` (volumen 40, SERP cerrado).

Se eliminan además, ya desde la v3: `/dea-renewal-tracking`,
`/credential-expiration-tracking`, el hub `/payer-enrollment/` y las guías de
Medicare, BCBS y Cigna.

---

## 5. BRIEFS POR PÁGINA

Toda longitud sale del top 3 real del SERP correspondiente **(b)**.

### 1 · `/` — Home · 900-1.300 palabras

- **Keyword:** `credentialing software` · **Secundarias:** `healthcare
  credentialing software` (590), `medical credentialing software` (480),
  `credentialing software for small business`
- **SERP:** #1 es un post de blog de verisys con **Page AS 8 y 4 dominios de
  referencia**. #5 tiene Page AS 3 y un backlink. symplr (AS 48) está en #2.
- **Patrón de keyword:** `credentialing software` en `<title>` y primer H2. H1
  libre para la premisa invertida.
- **Ángulo:** ninguno de los que rankea escribe para la práctica que nunca tuvo
  departamento de credentialing. Todos asumen comité y autoridad delegada.
- **Obligatorio:** precio visible en HTML crudo · `SoftwareApplication` + `Offer`
  con $79/$299/$699 · sección de qué no hace.
- **Absorbe:** todo el vocabulario de tracking y expiración que antes tenía página
  propia.
- **Enlaza a:** 2, 3, 4, 9

### 2 · `/pricing` · 800-1.100 palabras

- **Keyword:** `credentialing software pricing` (110, KD 18, transaccional).
  **No perseguir `credentialing software cost`** — ver sección 1.
- **Obligatorio:** costo por proveedor **corregido a $26,33 / $19,93 / $13,98**
  (las cifras de la v2, $26/$13/$8, están mal) · las dos anclas con fuente
  linkeada y unidad declarada · condiciones del trial · FAQ con `FAQPage`
- **Anclas vigentes (b):** tercerización $600-2.400 por proveedor/año ·
  categoría $3.600-9.000/año para 15 usuarios, según el propio blog de MedTrainer
- **Advertencia de unidades, no negociable:** MedTrainer cuenta *usuarios*
  (asientos), sokndall cuenta *proveedores* (registros). El copy debe declarar qué
  mide cada cifra. Presentarlas como equivalentes repetiría el error que hizo
  descartar el ancla anterior.

### 3 · `/best-credentialing-software` · 1.800-2.400 palabras

- **Keyword:** `best credentialing software` (390, KD 22, **CPC $43,54**,
  comercial pura) · **Secundarias:** `best provider credentialing software` (260),
  `credentialing software programs` (390, $44,33), **`credentialing software cost`
  (210)**
- **Por qué es la página de mayor retorno (b):** el #1 es la **página de producto**
  de MedTrainer. Google sirve una página de producto para una consulta de
  comparación porque nadie escribió una comparación decente. El SERP tiene
  "People also ask", "Discussions and forums" y un hilo de r/credentialing en #10.
- **Absorbe la intención de costo.** Debe incluir una sección de rangos de costo
  de la categoría con fuentes, que es lo que rankea en el SERP de
  `credentialing software cost`.
- **Formato:** comparación honesta y real, con sokndall **y** competidores, con
  sección de "para quién sí es adecuado" cada uno. Una comparación que solo gana
  sokndall no rankea y no convierte.
- **Regla dura:** ninguna cifra de competidor sin fuente linkeada. Toda estimación
  marcada como tal en el texto visible.

### 4 · `/credentialing-spreadsheet-template` · 700-1.000 palabras

- **Keyword:** `credentialing spreadsheet template` (20, KD 0)
- **Expectativa de SEO: ninguna (b).** 94 resultados en todo Google, top 10 con
  Page AS 0: Pinterest, Etsy, Facebook, DocHub.
- **Función real:** captura de email **y activo enlazable**. Es lo único del sitio
  con potencial de ganar enlaces naturales. Su canal es r/CodingandBilling y
  r/MedicalCoding, no Google.
- Descarga arriba del pliegue, sin fricción.

### 5 · `/insurance-credentialing-for-therapists` · 2.000-2.600 palabras

- **Keyword:** `insurance credentialing for therapists` (390, KD 12, CPC $39,33)
- **Secundarias:** `therapist credentialing` (260, KD 15), `insurance paneling for
  therapists` (140, KD 10), `how to get paneled with insurance as a therapist`
  (110, KD 13), `getting credentialed with insurance companies` (140, KD 12)
- **SERP — el más débil medido (b):** Page AS de 0 a 13 en todo el top 10. Dos
  URLs con **cero backlinks y cero dominios de referencia** en página 1. Hay AI
  Overview, "Discussions and forums" y un hilo de r/therapists en #10.
- **El hueco (b):** rankean SimplePractice, TheraPlatform, TherapyPMS, Supanote y
  Ensora — **todos software de gestión de práctica con un post de blog. Ninguno
  vende tracking de credentialing.** No hay competidor real en ese SERP.
- **Vocabulario:** "paneling", no "enrollment". Ver `voice-and-evidence.md` §3.4.
- **Excluir:** toda intención de formación profesional. Ver `exclusiones.md` §2.
- **Debe responder de verdad:** cuánto tarda el paneling · qué pagadores están
  cerrados a nuevos terapeutas y cómo se sabe · qué pasa entre la solicitud y la
  fecha efectiva · por qué la fecha efectiva, no la de aprobación, determina desde
  cuándo se factura.

### 6 · `/behavioral-health-credentialing` · 2.200-2.800 palabras

- **Keyword:** `behavioral health credentialing` (140, KD 16, CPC $29,07) ·
  **Clúster completo: 294 variaciones, 3.500 de volumen (b)**
- **Secundarias:** `mental health credentialing` (170, KD 24), `credentialing for
  mental health providers` (170, KD 14), `aetna behavioral health credentialing`
  (140, KD 25), `optum behavioral health credentialing` (70, KD 29)
- **SERP (b):** 7 de 10 son pagadores, condados o PDFs. Los tres terceros
  —curemd, medtrainer, theraplatform— tienen Page AS 9-11 con 1 a 7 dominios.
- **El ángulo (b):** el lector busca una síntesis y Google le devuelve diez
  portales de pagador distintos. Nadie comparó los procesos de los pagadores de
  salud mental en un solo lugar.
- **Estructura obligatoria: una sección por pagador** — Optum Behavioral,
  Carelon, Magellan, Aetna, Cigna — con qué cambia respecto del enrollment médico
  general, y **cómo se contacta a cada uno.** Este último punto sale de un
  hallazgo de keywords: `optum behavioral health provider credentialing phone
  number` (210) y `carelon...` (210). La gente busca cómo comunicarse y no lo
  encuentra.
- **Mencionar las plataformas intermediarias** (Headway, Alma) sin perseguir sus
  keywords de marca como objetivo.
- **Diferenciación contra la página 5 (c):** la 5 es el proceso desde la
  perspectiva del terapeuta individual. Esta es de pagadores y redes específicas
  de salud mental.
- **Hay carrusel de video en este SERP.** No se puede tomar. Ver `exclusiones.md` §8.

### 7 · `/caqh-reattestation` · 1.400-1.900 palabras

- **Keyword:** `caqh reattestation` (170, KD 13) · **Secundarias:** `caqh
  attestation` (590, KD 27), `how often does the caqh database require provider
  attestation` (50, **KD 1**)
- **SERP (b):** dataspring.com en #1 y #2. **El #3 es
  `caqh.org/.../provider-user-guide_OLD.pdf`** — la guía obsoleta de la propia
  CAQH en página 1. Posiciones 5 a 10 con Page AS 0.
- **El ángulo (b):** la documentación oficial está desactualizada y Google no
  tiene nada mejor que ofrecer.
- **Obligatorio:** el mecanismo completo de por qué un perfil vencido hace rebotar
  claims. No la conclusión — el mecanismo.

### 8 · `/caqh-provider-data-portal` · 1.600-2.200 palabras

- **Keyword:** `caqh provider data portal` (12.100, KD 26) · **Secundarias — la
  familia lookup:** `caqh number lookup` (480, KD 17), `lookup caqh number` (390,
  KD 9), `caqh id lookup` (260, KD 11), `how do i find my caqh number` (140,
  **KD 2**), `what is caqh provider data portal` (50, KD 12), `caqh mistakes`
  (140, KD 5)
- **SERP — el más delgado del proyecto (b): solo 32 resultados en todo Google**,
  contra 104-135 de los demás. Densidad competitiva **0,03**.
- **Dato que define la página (b):** `thecredentialing.com` está en #2 con **Page
  AS 15 y 3 dominios de referencia**, y recibe **2.900 visitas mensuales**. Un
  post de blog de un tercero le gana a las páginas de la propia organización. Las
  posiciones 5 y 6 son PDFs de caqh.org con Page AS 0.
- **También ya hay un tercero persiguiendo el ángulo del rebrand:**
  `revantagehbs.com/caqh-to-dataspring-provider-...` en #8, con Page AS 0 y 15
  visitas. Confirma el ángulo y muestra que está mal ejecutado.
- **Función:** resolver la confusión del rebrand y la familia de búsqueda de
  número.
- **Expectativa calibrada (b):** el grueso del volumen del clúster CAQH es
  navegacional. El objetivo real son las ~1.400 búsquedas de la familia lookup y
  de proceso.
- **No hacer:** competir por `caqh login` ni variantes. Ver `exclusiones.md` §4.

### 9 · `/payer-enrollment-software` · 1.300-1.700 palabras

- **Keyword:** `provider enrollment software` (390, KD 20, CPC $27,21) ·
  **Secundarias:** `payer enrollment software` (50, KD 14), `payer enrollment`
  (140, KD 10)
- **SERP (b):** symplr #1 (AS 48), withassured #2 (AS 13), verisys #3 (AS 8),
  medtrainer #4, qgenda #5 (AS 42), credyapp #8. Solapa fuerte con el SERP de la
  home — **la diferenciación es obligatoria, no opcional.**
- **Cómo se diferencia (c):** esta página es sobre el **flujo de enrollment**, no
  sobre comparar software. Los estados de una solicitud, la bitácora de
  seguimiento, la alerta de solicitud estancada, y la detección de
  inconsistencias de datos (nombre, NPI, TIN, dirección) entre el registro del
  proveedor y el del grupo. Cero lenguaje de comparación de vendors: eso vive en
  la página 3.
- **Obligatorio:** la distinción entre credentialing y provider enrollment, que es
  una de las consultas del SERP.
- **Declaración de límite:** el software no envía solicitudes por vos. Ningún
  competidor lo hace tampoco.

### 10 · `/provider-credentialing-checklist` · 1.200-1.600 palabras

- **Keyword:** `provider credentialing checklist` (210, **KD 9**) ·
  **Secundarias:** `provider credentialing checklist template` (50, KD 2),
  `provider credentialing checklist template excel` (30, KD 5), `provider
  onboarding and credentialing checklist` (30, KD 2)
- **SERP (b):** #1 verisys (AS 8), #2 physicianpracticespecialists (AS 7), y
  **dos PDFs de pagadores con Page AS 0 en posiciones 4 y 5**. Todo el top 10 va
  de AS 0 a 11.
- **Hallazgo que define el formato (b): el SERP tiene Image pack.** Google quiere
  un checklist visual. La página debe tener la checklist como elemento visual y
  descargable, no como texto corrido.
- **CPC $4,77 — expectativa de conversión modesta (c).** Su métrica de éxito es
  descarga de plantilla, no trial. Enlace fuerte a la página 4.

### 11 · `/for-billing-companies` · 900-1.300 palabras

- **Sin keyword limpia (b).** `credentialing services for providers` (390, KD 18,
  CPC $32,23) es intención de servicio tercerizado. No perseguirla.
- **Función:** página de segmento para tráfico ya en el sitio y para el plan
  Billing Co. Se optimiza para conversión, no para búsqueda.
- Multi-cliente, aislamiento de datos, y qué cambia en la conversación con el
  cliente.

### 12 · `/medtrainer-pricing` · 900-1.300 palabras

- **Keyword:** `medtrainer pricing` (90, KD 26, CPC $33,77)
- **SERP (b): 8 de 10 son páginas de medtrainer.com.** Terceros: **capterra.com
  #4, softwareadvice.com #6, g2.com #8, 360quadrants #10.**
- **Dos hallazgos que cambian el copy (b):**
  1. **MedTrainer tiene una página `/pricing/` y está en posición 1.** Pero la
     investigación confirma que no publica precio de lista: Capterra, SaaSworthy
     y FindLM coinciden en cotización a medida. **El ángulo exacto y honesto es:
     tienen una página de precios; no tiene precios.** Verificable por cualquiera
     que haga clic.
  2. **Cuatro directorios rankean en página 1 de la consulta de precio de un
     competidor.** Esto convierte la tarea de alta en directorios de "buena idea"
     a mecanismo concreto: un perfil de sokndall en Capterra, G2 y SoftwareAdvice
     **con precio publicado** puede aparecer en los SERPs de precio de los
     competidores.
- **No citar** el "$4 por usuario/mes" de SelectHub: es un cálculo propio de ese
  directorio dentro de su categoría de *Course Creation Software* —el módulo LMS,
  no el de credentialing—. No es precio de vendor.
- **Sí usable con fuente:** la orientación de costo del propio blog de MedTrainer
  ($20-50 por usuario/mes; $3.600-9.000 al año para 15 usuarios), con la
  advertencia de unidades. Y la reseña verificada de Capterra que describe
  contrato de un año con 30 días de aviso, **marcada como reseña de usuario, no
  como política publicada.**

### 13-14 · `/symplr-pricing` y `/modio-health-pricing` · 800-1.100 palabras cada una

- Estructura ya validada: qué se sabe y con qué fuente · estimación marcada ·
  **sección honesta de para quién sí es adecuado el competidor** · comparación de
  modelo de compra · precio propio visible.
- **Dato disponible para `/modio-health-pricing` (b):** Modio corre 27 keywords
  pagas con copy de anuncio que dice "Try our free demo today" y "Schedule a
  Demo". Es evidencia directa y citable del modelo de venta que sokndall no usa.
- No se agrega `/credentialstream-pricing`: 30 búsquedas no mueven nada.

### 15 · `/credentialing-services-for-therapists` · 1.600-2.200 palabras · BAJO PUERTA DE MEDICIÓN

- **Keyword:** `therapist credentialing services` (260, KD 9, CPC $50,52) ·
  **Secundarias:** `insurance credentialing services for mental health providers`
  (170, **KD 1**, CPC **$66,88**), `credentialing services for mental health
  providers` (140, KD 5), `behavioral health credentialing services` (170, KD 6)
- **SERP no verificado.** Longitud provisional derivada de la página 5, que
  comparte audiencia. **Marcada como estimación (c), a corregir cuando se mida.**
- **Premisa obligatoria y honesta:** qué cuestan los servicios de credentialing,
  cuándo valen la pena de verdad, y cuál es la alternativa para quien prefiere
  hacerlo con una herramienta. **Si la página no responde con honestidad cuándo
  conviene contratar un servicio, es publicidad disfrazada de guía y va a
  fallar.**
- **Puerta:** si a 90 días la conversión a trial o a plantilla está por debajo del
  promedio de las páginas 5 y 6, se despublica. No se replica a otros verticales
  hasta tener el dato.

---

## 6. ENLAZADO INTERNO

- `/` → 2, 3, 4, 9
- 3 → 2, 12, 13, 14
- 5 ↔ 6 ↔ 15, y las tres → 2 y 4
- 7 ↔ 8, y las dos → 5 y 9
- 9 → 4, 10, 2
- 10 → 4 (fuerte), 9
- 12, 13, 14 → 3, 2
- Ninguna página huérfana. 3-5 enlaces internos por página, anchor descriptivo.

---

## 7. TAREAS DE LANZAMIENTO

1. **Alta en Capterra, G2, SoftwareAdvice y GetApp, con precio publicado.**
   Justificación reforzada **(b):** los cuatro rankean en página 1 del SERP de
   `medtrainer pricing`, y las fuentes que los sistemas de AI citan sobre Modio
   Health son capterra.com (20 menciones), el sitio propio (17) y
   softwareadvice.com (15) — **un directorio cita más que el sitio del vendor.**
   Es gratis en tier básico, escrito, asíncrono, y no está en la lista de canales
   quemados.
2. **Google Search Console y Bing Webmaster Tools.** Pendiente desde tres fases
   atrás. Bloqueante para saber qué está indexado.
3. **Enviar `sitemap.xml`** en ambos.
4. **Publicar la plantilla en r/CodingandBilling y r/MedicalCoding.** Único vector
   de enlace natural disponible.
5. **Correr Site Audit de SEMrush** cuando el sitio esté desplegado, antes de que
   venza el trial.

---

## 8. PUERTAS DE MEDICIÓN

| Ola | A 90 días | Si falla |
|---|---|---|
| 2 (salud mental) | Rankea en top 20 para su keyword objetivo | Diagnosticar antes de replicar el molde a fisioterapia y odontología |
| 6 (página 15) | Conversión a trial o plantilla ≥ promedio de páginas 5 y 6 | Despublicar. No perseguir intención de servicio en ningún otro lado |
| 3 (CAQH) | Capturas de email desde la página 8 | No expandir el clúster CAQH |

---

## 9. EXPANSIONES DIFERIDAS — documentadas, no aprobadas

**Fisioterapia y odontología (b).** `dental credentialing services` (260, KD 3),
`dental credentialing software` (70, KD 3, $24,34), `dental insurance
credentialing services` (70, KD 1, $32,94), `physical therapy credentialing
services` (140, **KD 0**, $33,20), `insurance credentialing for physical
therapists` (50, KD 0, $30,72). Plantilla replicable de la página 5. **No se
construyen hasta que la página 5 rankee.**

**Medicare (b).** `how to become a medicare provider` (210, KD 8), `medicare
credentialing` (480, KD 22), `how to get credentialed with medicare` (70, KD 20).
SERP sin verificar y compite contra cms.gov.

**Eje pagador × estado (b).** `florida medicaid provider enrollment` (1.000,
KD 28), `va medicaid` (390, KD 24), `indiana medicaid` (260, KD 25), `texas
medicaid` (260, KD 28), `ohio medicaid` (170, KD 29), `california medicaid` (140,
KD 17). Extrapolado, 3.000-6.000 búsquedas mensuales a KD 17-37.

**Trampa a evitar (c):** el patrón programático de la presentación consolidada
**(a)** funciona porque dos ciudades son la misma página con el nombre cambiado.
**Medicaid de Florida y Medicaid de Texas son procesos genuinamente distintos** —
portal, requisitos y plazos distintos. No es un bucle: son 50 investigaciones.

---

## 10. PENDIENTES DEL AGENTE SEO

1. SERP de la página 15, para reemplazar su longitud estimada por una medida.
2. Revisión del copy entregado de las páginas que se conservan, contra estos
   briefs.
3. Auditoría de aplicación de la terminología ProView / Provider Data Portal en el
   cuerpo del copy existente.
4. Site Audit cuando el sitio esté arriba.

## 11. LO QUE NO ES DECISIÓN DEL AGENTE SEO

Precio, alcance de producto, estructura legal, entidad de `/about`, y el riesgo
legal de nombrar marcas de competidores en contenido comparativo. Si el
copywriter las escala, se redirigen a Juan.
