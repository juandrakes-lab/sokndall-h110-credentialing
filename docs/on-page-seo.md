# on-page-seo.md — Reglas de construcción de página, sokndall.com

**Versión 1.0 · 2 sep 2026 · Agente SEO**

Este archivo se lee **entero, en cada página que se escriba o se construya**, por el
agente de Copywriting y por el agente de Desarrollo. No se lee una vez y se recuerda.

No contiene decisiones de contenido. Para saber qué dice una página, cuál es su
keyword y qué secciones lleva, ver `H110_ARQUITECTURA_v3.md`.

Regla de conflicto: si la arquitectura y este archivo se contradicen, **manda la
arquitectura** y se reporta la contradicción al agente SEO.

---

## 0. VERIFICACIÓN OBLIGATORIA ANTES DE DAR UNA PÁGINA POR TERMINADA

Ninguna página está terminada hasta que estos cuatro comandos pasen contra
**producción**, no contra local:

```bash
# 1. La página existe y responde 200
curl -sI https://sokndall.com/<ruta> | head -1

# 2. El contenido está en el HTML crudo, sin ejecutar JavaScript
curl -sL -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://sokndall.com/<ruta> \
  | grep -c "<h1"        # debe devolver exactamente 1
curl -sL -A "Mozilla/5.0 (compatible; Googlebot/2.1)" https://sokndall.com/<ruta> \
  | grep -o "<h2[^>]*>[^<]*" # deben aparecer todos los H2 del brief

# 3. La página es estática, no dinámica
curl -sI https://sokndall.com/<ruta> | grep -i "x-vercel-cache\|x-nextjs-prerender"
# debe mostrar X-Vercel-Cache: HIT y X-Nextjs-Prerender: 1

# 4. Hay canonical autorreferencial
curl -sL https://sokndall.com/<ruta> | grep -o '<link rel="canonical"[^>]*>'
```

Si el punto 2 falla, **la página no existe para ningún buscador ni para ningún
modelo de lenguaje.** Es bloqueante, no una mejora pendiente.

---

## 1. RENDERIZADO

- **SSG obligatorio en las 21 páginas de marketing.** `next build` debe mostrar
  `○ (Static)` en todas. Cero rutas `ƒ (Dynamic)`.
- Prohibido en el render de servidor de una página de marketing: `cookies()`,
  `headers()`, `searchParams`, cualquier llamada a Supabase, cualquier
  `export const dynamic = 'force-dynamic'`.
- La lógica de sesión (redirigir a `/dashboard` si hay usuario logueado) va en
  cliente o en middleware, nunca en el render de la página.
- El `matcher` de `middleware.js` no debe incluir rutas de marketing. Solo
  `/dashboard`, `/providers`, `/payers`, `/enrollments`, `/credentials`,
  `/onboarding`, `/auth`.
- Todo texto que deba rankear o ser citado —precio, H1, H2, cuerpo, FAQ— va en
  componente de servidor. `'use client'` solo para interactividad real.

**Por qué importa más de lo normal acá:** los crawlers de sistemas de AI no
ejecutan JavaScript. Si el precio se renderiza en cliente, sokndall es invisible
justo en el canal donde su único diferenciador —publicar el precio— tendría más
valor.

## 2. HOST Y URLS

- Un solo host indexable: `https://sokndall.com`.
- `www.sokndall.com` → 308 permanente al ápice.
- Los dominios `*.vercel.app` devuelven `X-Robots-Tag: noindex` vía header.
- Una sola convención de barra final, aplicada de forma uniforme.
- Slugs en minúscula, con guiones, sin stop words, sin fechas, sin parámetros.
- Una URL por intención. Si dos páginas persiguen la misma intención, una de las
  dos se elimina o se fusiona — nunca se publican ambas.

## 3. TÍTULOS Y METADATOS

- `<title>` único por página, 50-60 caracteres, **con la keyword objetivo cerca
  del inicio**.
- `<meta name="description">` única por página, 150-160 caracteres, con la
  promesa concreta. Ninguna página hereda el fallback del layout raíz.
- `metadataBase` definido en el layout raíz apuntando a `https://sokndall.com`.
- `<link rel="canonical">` autorreferencial en las 21 páginas.
- Open Graph completo: `og:title`, `og:description`, `og:url`, `og:type`,
  `og:image` (1200×630). `twitter:card` en `summary_large_image`.
- `<html lang="en">`. El sitio es 100% inglés de EE.UU.

## 4. ENCABEZADOS

- **Exactamente un `<h1>` por página.** Ni cero ni dos.
- Jerarquía sin saltos: H1 → H2 → H3. Nunca H1 → H3.
- Los H2 llevan las keywords secundarias y las variantes de pregunta, sin
  forzarlas.
- **Patrón obligatorio de keyword en páginas comerciales:** cuando la keyword
  exacta compite con la promesa diferenciadora, la keyword va en el `<title>` y
  en el **primer H2**; el H1 queda libre para la premisa. Este patrón se aplica
  por default en toda página comercial, no solo en la home.
- Los H2 deben ser legibles fuera de contexto: un modelo de lenguaje extrae la
  estructura de H2 para responder. Un H2 que solo se entiende leyendo el párrafo
  anterior es un H2 desperdiciado.

## 5. CUERPO

- La keyword objetivo aparece en las primeras 100 palabras, de forma natural.
- **Respuesta directa en el primer párrafo bajo el primer H2.** Sin rodeo, sin
  introducción. Es lo que se extrae para AI Overviews y para ChatGPT.
- Párrafos de 2 a 4 líneas. Sin muros de texto.
- Voz activa. Segunda persona.
- Nivel de lectura: grado 8-10. El comprador es personal administrativo con poco
  tiempo, no un lector técnico.
- Longitud: **la que indique el brief de la página en la arquitectura**, derivada
  del top 3 real del SERP. No hay un mínimo genérico de 1.500 palabras.
- Cero cifras sin fuente linkeada. Toda estimación se marca como estimación en el
  texto visible, no solo en un comentario.

## 6. ENLAZADO INTERNO

- 3 a 5 enlaces internos salientes por página.
- Anchor descriptivo. Prohibido "click here", "learn more", "read more".
- Toda página de contenido enlaza al menos una vez a una página comercial.
- Toda página comercial enlaza al menos una vez a `/pricing`.
- Breadcrumbs en las páginas dentro de subcarpeta, con `BreadcrumbList` schema.
- Ninguna página huérfana: toda página del sitemap debe recibir al menos un
  enlace interno desde otra página.

## 7. ENLACES EXTERNOS

- 2 a 4 enlaces externos por página de contenido, a fuente autoritativa y
  primaria: CMS, CAQH/DataSpring, juntas estatales, portales de pagador.
- Se abren en pestaña nueva con `rel="noopener"`.
- Enlaces a competidores: `rel="nofollow"`. Enlaces a fuentes oficiales: normal.
- **Este es el sustituto de la autoridad de autor.** El sitio no tiene un
  credentialing specialist certificado detrás; la credibilidad se construye con
  densidad de fuentes primarias citadas, no con una biografía.

## 8. SCHEMA (JSON-LD, en `<head>`, en el HTML crudo)

- `Organization` en el layout raíz, en todas las páginas.
- `SoftwareApplication` + `Offer` en `/` y `/pricing`. **Los precios del schema
  deben coincidir exactamente con los precios visibles.** Vigentes: $79 / $299 /
  $699 USD mensuales.
- `FAQPage` en toda página que tenga sección FAQ. Las preguntas del schema deben
  ser literalmente las que aparecen en pantalla.
- `Article` en las páginas de guía, con `datePublished` y `dateModified` reales.
- `BreadcrumbList` en páginas dentro de subcarpeta.
- **Prohibido `LocalBusiness`.** No hay intención local en este nicho y no hay
  presencia física que declarar.
- Validar cada página en el Rich Results Test antes de dar por terminada.

## 9. IMÁGENES

- `alt` descriptivo en todas. Sin relleno de keywords.
- Nombre de archivo descriptivo con guiones.
- WebP, comprimidas, bajo 200 KB.
- `width` y `height` explícitos para evitar CLS.
- Lazy loading en todo excepto la imagen del hero.

## 10. INDEXACIÓN

- `app/robots.js` con: `Allow: /` por default; allow explícito para `Googlebot`,
  `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`,
  `Google-Extended`; `Disallow` para `/dashboard`, `/providers`, `/payers`,
  `/enrollments`, `/credentials`, `/onboarding`, `/auth`, `/login`; directiva
  `Sitemap`.
- **No bloquear `GPTBot` sin consultar al agente SEO.**
- Verificar que no coexistan `public/robots.txt` y `app/robots.js`.
- `app/sitemap.js` con las 21 rutas de marketing. Excluye toda ruta de aplicación.
- `noindex, nofollow` en `/login` y en el layout de todas las rutas de aplicación.
- El checkout de Polar no debe generar URLs indexables.
- Verificar en el panel de Vercel que no estén activos Bot Protection, Attack
  Challenge Mode ni Deployment Protection en producción.

## 11. RENDIMIENTO

- Lighthouse en móvil: Performance ≥ 90, SEO = 100, Accesibilidad ≥ 90.
- LCP bajo 2,5 s. CLS bajo 0,1. INP bajo 200 ms.
- Fuentes con `next/font`, autoalojadas, con `display: swap`.
- Cero peticiones de red bloqueantes arriba del pliegue.

## 12. LO QUE ESTÁ EXPRESAMENTE PROHIBIDO

- Comprar backlinks, PBNs, intercambios de enlaces, cualquier paquete de enlaces.
- Cifras inventadas o estimadas presentadas como hechos.
- Citas textuales de usuarios de Reddit o de cualquier foro en el sitio.
- Contenido generado a escala sin revisión, o páginas creadas por plantilla sin
  investigación real por página.
- Reclamar credenciales, certificaciones o experiencia clínica que no existen.
- Publicar precios de competidores como si fueran precio de lista cuando el
  competidor no lo publica.

---

## APÉNDICE — Checklist rápido por página

```
[ ] curl a producción devuelve 200
[ ] H1 presente, exactamente uno, en el HTML crudo
[ ] Todos los H2 del brief presentes en el HTML crudo
[ ] X-Nextjs-Prerender: 1 (la página es estática)
[ ] title único, 50-60 car., keyword al inicio
[ ] meta description única, 150-160 car.
[ ] canonical autorreferencial
[ ] Open Graph + twitter:card completos
[ ] Keyword objetivo en las primeras 100 palabras
[ ] Respuesta directa en el primer párrafo bajo el primer H2
[ ] Longitud dentro del rango del brief
[ ] 3-5 enlaces internos con anchor descriptivo
[ ] 2-4 enlaces externos a fuente primaria
[ ] JSON-LD correcto y validado en Rich Results Test
[ ] Imágenes con alt, WebP, dimensiones explícitas
[ ] Página presente en sitemap.xml
[ ] Lighthouse móvil: SEO 100, Performance ≥ 90
[ ] Cero cifras sin fuente linkeada
```
