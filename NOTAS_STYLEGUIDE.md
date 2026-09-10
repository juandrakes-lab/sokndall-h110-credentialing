# NOTAS_STYLEGUIDE.md

Registro de lo que hubo que decidir para construir el sistema de componentes y
`/styleguide`, dónde `CATALOGO_SISTEMA.md` fue ambiguo, y dónde el catálogo y
`on-page-seo.md` se rozan. **Fuente autoritativa: `CATALOGO_SISTEMA.md`.** Nada
acá lo contradice; lo que no estaba ahí se resolvió con el criterio mínimo y se
anota como pregunta abierta.

---

## 1. DECISIONES QUE NO ESTABAN EN EL CATÁLOGO

### 1.1 Ubicación y theme config
- Sistema nuevo en `components/system/**` (separado de `components/site/**`, que
  es el otro design system de marketing, y de `app/(app)/**`, la app Tailwind).
- Tokens de §1 **agregados al único theme config del repo**, `app/globals.css`
  `@theme`, con nombres distintos de los de la app (`--color-ink` vs
  `--color-ink-900`, etc.) — no hay colisión. Valores hex exactos del catálogo.
- `/styleguide` en `app/styleguide/`. Ruta `noindex` por metadata **y** agregada
  a `DISALLOW` en `app/robots.js`. No entra a `app/sitemap.js` (lista manual).

### 1.2 Tipografía como clases, no como escala Tailwind
- `@theme --text-*` de Tailwind v4 no expresa el par tamaño-mobile / tamaño-desktop
  que pide §1.2 (`display` 44/36, `h1-editorial` 34/28). Se implementó como clases
  en `@layer components`: `.t-display .t-h1 .t-h2 .t-h3 .t-body .t-body-editorial
  .t-small .mono-data`. Los dos roles con variante mobile usan `clamp()`.
- Pesos: un regular + un medium (500), fijados en las clases. Nada de 600/700 (§1.2).
- `.mono-data`: `font-variant-numeric: tabular-nums` + `font-feature-settings:
  "tnum" 1`. 13px / 1.4.

### 1.3 Utilidades que el catálogo implica pero no nombra
- `.ratio-1x1 .ratio-4x3 .ratio-3x2 .ratio-16x9` — no hay clase Tailwind on-scale
  para 4:3 / 3:2 y los valores arbitrarios (`aspect-[4/3]`) están bloqueados por
  lint. En `@layer utilities`.
- `.corner-cut` — el corte diagonal del tratamiento TILE (§4). `clip-path` con
  corte de `1rem` (16px, on-scale) en la esquina superior derecha.

### 1.4 Portabilidad de superficie
- `.u-ink .u-muted .u-card .u-hair` + overrides bajo `.on-dark`. §5
  (`LandingTemplate`) alterna superficies clara/oscura, pero cada componente se
  escribe una sola vez. Estas clases dejan que un componente viva sobre `paper` o
  sobre `ink` sin una prop `variant`. No está en el catálogo; es el mecanismo para
  cumplir §5 sin duplicar componentes.
- `.sg-link`: color de link sobre claro = `ink-2` (petrol de marca), subrayado;
  sobre oscuro = `paper`. Ver §3 abajo (el catálogo no define color de link).

### 1.5 Lint (entregable 1)
- Reglas en `.eslintrc.json` vía `no-restricted-syntax` con selectores regex —
  **sin dependencia nueva**. Alcance: `components/system/**` + `app/styleguide/**`
  únicamente, para no tocar los otros dos sistemas de estilo del repo. Extenderlo
  al resto es trabajo posterior.
- Bloquea: `style={{}}` (ahí se escondería el box-shadow, el radio arbitrario y el
  hex), valores arbitrarios `[...]` en `className` y en template strings, literales
  hex, utilidades `shadow` / `ring` / `drop-shadow` / `blur` / `backdrop-blur` /
  `bg-gradient-*` / `from-|via-|to-`, `rounded-{sm..3xl, t, b, ...}` (deja pasar
  `rounded` = 4px y `rounded-full` para el avatar de `/about`), y `border-{2,4,8}`.
- `tabular-nums`: activado en `.mono-data` (entregable 1, último punto).
- **Huecos conocidos:** composición de `className` por template-literal / helper
  tipo `clsx` no está 100% cubierta (la convención del repo es string plano);
  pasos de espaciado fuera de escala (`p-5` = 20px, `p-7` = 28px) **no** están
  prohibidos uno por uno — solo lo arbitrario —, así que quedarse en los 10 pasos
  es en parte convención. `app/styleguide/tokens.reference.js` está **excluido**
  del lint para que la página de escalas pueda imprimir el hex literal como texto.

### 1.6 Primitivas (no son parte de los 28)
- `Heading` — `as` (semántico) y `styleClass` (tamaño visual) separados: una
  sección puede ser `<h3>` y verse como h2.
- `Cta` — único elemento que lleva ámbar de relleno (`tone="primary"`);
  `tone="secondary"` es hairline 1px.
- `Placeholder` — caja gris sólida a la relación de aspecto correcta con el texto
  del tratamiento (BLEED / FLOAT / TILE).
- `StateMark` — impone "forma + etiqueta de texto + cifra en mono" para
  `StatusTable`, `MatrixSchematic` y `AlertLadder`.

### 1.7 Otras
- **`SiteHeader` hairline en scroll:** el catálogo pide "hairline al hacer scroll,
  no sombra". Detectar scroll haría a `SiteHeader` cliente, y §2.1/§3.1 reservan
  cliente para 3 componentes. Se envió con hairline inferior permanente de 1px;
  la variante scroll-reveal queda diferida.
- **`nav` / `footer` items** (`components/system/navData.js`): el catálogo no los
  define. Set provisional derivado de las rutas de `H110_ARQUITECTURA_v3.md §6`.
  Necesita aprobación.
- **`mono-data` — dónde sí y dónde no.** Solo en columnas que se comparan
  verticalmente: índice de `NumberedSteps`, umbral de día de `AlertLadder`, conteo
  de `StatusTable`, días de `MatrixSchematic`, columna de precio de `PricingTable`,
  y las escalas del styleguide. **No** en: la cifra de `PriceAnchorSourced` (valor
  inline único, no columna), el precio de `PlanCardSet` (cards en fila, no
  columna), labels, eyebrows, metadatos. Las cifras del lado "observed" de
  `StatedVsObserved` son borderline (se apilan) — quedaron en mono; revisar.
- **`EmailCapture` sin backend.** `onSubmit` muestra un estado de gracias en
  cliente. Conectar a Resend / a una API route está fuera de alcance ("NO
  construir ninguna página del sitio todavía").
- **`ErrorList` — contenido.** `H110_COPY_COMPLETO.md` (Medicare §8) trae estos
  ítems como bullets pelados (solo el error). La mitad `consequence` de cada ítem
  en `/styleguide` se compuso desde el copy adyacente de esa misma página. El copy
  real de la página debe entregar las dos mitades.
- **`MatrixSchematic` — datos.** Sintéticos. El copy da la forma ("15 proveedores
  × 12 payers = 180 celdas, las seis trabadas visibles de un vistazo"), no un
  dataset. Se usó 5×5 con exactamente 2 celdas de acción para respetar el
  presupuesto de ámbar.
- **Regla de ámbar "no más de dos veces en una vista":** se interpretó *vista* =
  un bloque `Spec` (un demo de componente), donde el máximo real es 2
  (`EmailCapture` con sus dos variantes; `MatrixSchematic` con 2 celdas de acción;
  `AlertLadder` 14 + 7). En el scroll completo de la página el agregado es
  necesariamente mayor porque cada componente de conversión tiene un CTA primario.
  La leyenda de `MatrixSchematic` se des-ambarizó (es documentación, no un estado
  vivo) para mantener esa vista en 2.
- **`<img>` y no `next/image`**, con `width`/`height`/`alt` explícitos
  (`on-page-seo.md §9`). `@next/next/no-img-element` queda como *warning*, no rompe
  el build. Revisar cuando haya arte real (§5 abajo).

---

## 2. DONDE EL CATÁLOGO FUE AMBIGUO

- **§3.1 `PageHeader`** — "obligatoria en editorial, justificada en comparación".
  Se modeló con prop `variant`. Editorial sin imagen renderiza un placeholder
  etiquetado + `console.warn` en dev; no falla duro. Los componentes de política
  `prohibida` simplemente no definen prop de imagen.
- **§3.2 `ProseSection`** — "imagen justificada… debe explicar por qué". Blando:
  si se pasa `image` sin `imageJustification`, warning en dev; la justificación se
  imprime como `figcaption`. El caso "explicar la omisión" no tiene superficie en
  el componente — va en las notas de la página.
- **§3.3 `SourcedFigure`** — "link… en color de marca". "Color de marca" no es un
  token con nombre. Se usó `ink-2` (el petrol más oscuro). **Confirmar** que es el
  color de link buscado.
- **§3.4 `StatusTable`** — "máximo un badge relleno por fila". Se implementó como
  `StateMark` (forma + etiqueta + conteo mono), nunca una píldora rellena; la fila
  enfatizada usa cambio de superficie. Si "badge relleno" se refiere
  específicamente al `StatusBadge` de la rampa del handoff §5.4, ese componente no
  se entregó acá (ver conflicto 2 abajo) y habría que cablearlo.
- **§3.4 `AlertLadder`** — el catálogo dice que el 90 es neutro y no nombra color
  para 60/30/14/7. Se eligió: 60/30 neutro (`u-ink`), 14/7 ámbar (requiere acción
  ahora). El 30 ("debería estar ya enviada") es discutiblemente también acción —
  abierto.
- **§3.5 `PlanCardSet`** — "etiqueta opcional". Se usó exactamente la misma cadena
  que la etiqueta de fila del medio de `PricingTable` ("Most complete for a group
  practice"). La regla dura fija esa cadena para `PricingTable`; se asumió que
  también aplica a `PlanCardSet`.
- **§3.5 `EmailCapture` "sidebar derecho (página 16)" vs. §5 `EditorialTemplate`
  "sin CTAs intercalados — solo al final".** Se trató el `EmailCapture` de la
  página 16 como elemento de sidebar (vive en el `aside`, como el TOC), no como un
  CTA inline — compatibles. Las plantillas todavía no lo componen; la página 16 lo
  hará.
- **§5 `EditorialTemplate` "TOC sticky 280–300px".** Con `max-w-5xl` (1024) y
  split 3/1, el `aside` cae ~240px, por debajo del spec. Se dejó así a esta
  fidelidad; al construir editoriales reales, ensanchar el contenedor o la
  proporción de columnas.
- **§3.6 `RelatedGuides`** — "imagen: justificada" pero son "3 enlaces". No se
  agregó slot de imagen por card (serían 3 thumbnails); omitido, coherente con
  "justificada".
- **Encabezado del catálogo** — dice que deriva de "INVENTARIO_FORMAS.md (31
  formas)" y "H110_ARQUITECTURA_v3.md (18 páginas)". La arquitectura v3 en mano
  mapea 16 estratégicas + 5 permanentes = 21, y el inventario previo catalogó 34
  formas. Los números no cierran — anotado, no bloqueante (la lista de §3 es
  explícita de todos modos).

---

## 3. CONFLICTOS ENTRE EL CATÁLOGO Y `on-page-seo.md`

1. **Un solo `<h1>` por página (`on-page-seo.md §4`) vs. componentes que
   normalmente son el h1.** No hay conflicto real, pero se deja constancia: la
   propia `/styleguide` tiene un `<h1>` ("Sokndall visual system") y degrada
   `Hero` y `PageHeader` a `<h3>` con la prop `as`, así que la página del catálogo
   no viola §4 aunque muestre dos componentes que en una página real son el h1.

2. **`on-page-seo.md §8` exige `Organization` (layout), `SoftwareApplication` +
   `Offer` en `/` y `/pricing`, y `Article` en las guías.** Los 28 componentes
   solo emiten schema donde el catálogo lo pide: `FaqBlock` → `FAQPage`,
   `Breadcrumbs` → `BreadcrumbList`. `Organization`, `SoftwareApplication`/`Offer`
   y `Article` son responsabilidad de la capa de página, no de la de componentes.
   **Flag para que ninguna página asuma que un componente lo provee.**

3. **Cifras de costo por proveedor.** `on-page-seo.md §8` fija los precios de plan
   en $79/$299/$699 y exige que el `Offer` schema coincida con lo visible — eso se
   usa. El costo *por proveedor* no está en on-page-seo; `H110_ARQUITECTURA_v3.md
   §3` da $26,33 / $19,93 / $13,98 y llama obsoletos a los redondos $26 / $20 /
   $14 de `H110_COPY_COMPLETO.md`. `/styleguide` usa los decimales de la v3. El
   archivo de copy todavía muestra los redondos — reconciliar en el copy antes de
   construir `/pricing`.

4. **`on-page-seo.md §1` "todo texto que deba rankear va en componente de
   servidor" vs. los 3 componentes cliente.** Resuelto como dice el catálogo
   (§2.1): `FaqBlock` / `TableOfContents` / `EmailCapture` son cliente solo por la
   interactividad y todo el texto está en el HTML SSR (`<dd hidden>` con la
   respuesta, links de nav renderizados en servidor, labels estáticos del form).
   Merece un chequeo explícito `curl -A Googlebot | grep` por página real
   (`on-page-seo.md §0`) cuando alguna las use.

5. **`on-page-seo.md §9` "lazy loading en todo excepto la imagen del hero".** Los
   componentes todavía no ponen `loading` en `<img>` (no hay imágenes reales).
   Cuando entre el arte, las imágenes lead de `Hero` / `PageHeader` necesitan
   `loading="eager"` y el resto `loading="lazy"`. No cableado.

6. **`on-page-seo.md §11` fuentes con `next/font`, autoalojadas, `display: swap`
   vs. catálogo §6.1 "tipografía sin decidir".** Se dejó un stack de sistema.
   Cuando se elija la familia, cablear `next/font` en el layout raíz — las clases
   `.t-*` referencian `var(--font-sans)`, así que solo cambia el token.

7. **`on-page-seo.md §6` "3 a 5 enlaces internos por página"** es regla de
   composición de página. `SiteFooter` + `RelatedGuides` + `Breadcrumbs` + links
   inline de `SourcedFigure` / prosa son los vehículos, pero nada fuerza el conteo
   en la capa de componente.

---

## 4. VERIFICACIÓN PENDIENTE (no bloqueante para el sistema, sí para páginas)

- `next build` debe mostrar `/styleguide` como `○ (Static)`.
- `npm run lint` debe pasar con las reglas nuevas activas sobre `components/system/**`.
- Cuando una página real use `FaqBlock` / `TableOfContents` / `EmailCapture`:
  `curl -sL -A "Googlebot" <url> | grep -c "<h1"` = 1 y todas las respuestas de
  FAQ presentes en el HTML crudo.
