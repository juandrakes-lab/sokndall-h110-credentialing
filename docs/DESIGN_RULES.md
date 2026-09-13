# DESIGN_RULES.md — Reglas de construcción visual, sokndall.com

**v1 · Agente de diseño · §9-§11 agregadas 6 sep 2026**

Este archivo se lee **entero, en cada página que se construya**. No se lee una
vez y se recuerda.

No contiene valores. Los valores están en `TOKENS.md` y en `components/neo/neo.css`.
No contiene límites de texto. Están en `COPY_LIMITS.md`.

Regla de conflicto: si este archivo y el código de un componente se contradicen,
**manda el código** y se reporta la contradicción.

---

## 0. VERIFICACIÓN OBLIGATORIA ANTES DE DAR UNA PÁGINA POR TERMINADA

Ninguna página está terminada hasta que estos cinco checks pasen:

```bash
# 1. Cero valores fuera del sistema en el código de la página
grep -nE '#[0-9a-fA-F]{3,8}' app/<ruta>/page.jsx        # debe devolver 0
grep -nE 'style=\{\{' app/<ruta>/page.jsx               # debe devolver 0
grep -nE '\[[0-9]+px\]' app/<ruta>/page.jsx             # debe devolver 0

# 2. Cero componentes nuevos sin registrar
#    Todo elemento visual sale de components/neo/ o entra al catálogo primero.

# 3. Capturas a 390px, 768px y 1440px. Las tres, sin excepción.

# 4. Cada slot de texto dentro de su rango en COPY_LIMITS.md

# 5. next build muestra la ruta como ○ (Static)
```

Si el punto 1 falla, la página está fuera del sistema y la próxima corrección
la va a romper. Es bloqueante, no una mejora pendiente.

---

## 1. LO QUE NO SE DECIDE POR PÁGINA

El agente que construye una página **elige qué secciones usar y en qué orden**.
No elige cómo se ven. Todo lo siguiente ya está resuelto:

- Color, tipografía, espaciado, radio y sombra → `TOKENS.md`
- Tratamiento de tarjeta blanca vs. gris → §3
- Ritmo de bandas → §4
- Política de imagen → §5

Un componente nuevo solo se crea si el contenido genuinamente no encaja en
ninguno existente. Cuando se crea, entra al catálogo con su política de imagen
declarada, antes de usarse.

## 2. LO QUE NUNCA CAMBIA, EN NINGUNA PÁGINA

1. **El producto no existe y no se simula.** Ningún mockup de interfaz, ninguna
   captura, ningún dashboard inventado. El esquema de la matriz es de baja
   fidelidad deliberada y lleva su nota visible de que no es una captura.
2. **Cero cifras sin fuente linkeada en la misma línea.** Nunca en nota al pie.
   Toda estimación se marca como estimación en el texto visible.
3. **El estado nunca se comunica solo por color.** Siempre glifo + etiqueta de
   texto + cifra. Quitar el color no debe perder información.
   *Enmienda 12 sep 2026 (celdas binarias):* en una tabla comparativa donde la
   celda solo puede ser "Included" o "Not included", alcanza con el símbolo si
   los dos difieren por forma y no solo por color (✓ en disco petróleo / × en
   círculo gris) y la palabra queda como texto para lectores de pantalla
   (`.sk-sr`). No aplica a estados de seguimiento (los seis de enrollment, los
   cinco de credencial): esos siguen con glifo + etiqueta visible + cifra.
4. **El amarillo es señal, no decoración.** Solo CTA primario, estados que
   requieren acción y el único destacado por sección de §18. Nunca ordinal,
   viñeta, eyebrow ni marcador de página activa. Desde el 12 sep 2026 es un
   amarillo claro (`--amber` #F2C14E, antes el mostaza #C88A2E): lleva texto
   negro a 12,5:1. Como no puede dibujar una línea sobre blanco, los bordes de
   los estados de acción usan `--amber-line` (#B38314), y el anillo de foco
   sobre claro es petróleo (sobre oscuro, amarillo).
5. **Sin logos, capturas ni adjetivos peyorativos de competidores.**
6. **Sin ubicación, credencial, certificación ni experiencia que no exista.**
7. **Los precios de plan son $79 / $299 / $699** y coinciden exactamente con el
   schema. El costo por proveedor es $26,33 / $19,93 / $13,98.
8. **La etiqueta del plan del medio es "Most complete for a group practice".**
   Nunca otra, nunca "Most popular".

## 3. SUPERFICIES

- La página es blanca y de ancho completo. **Ninguna sección tiene fondo gris de
  canto a canto.** Desde el 11 sep 2026 existe una tercera superficie: el
  **bloque gris** (`surface="block"`), redondeado y con margen lateral como los
  bloques oscuros. El ritmo es blanco → bloque gris → bloque o tarjeta oscura.
- Ninguna línea divisoria entre secciones. La separación es el margen vertical.
- El gris (`--paper`) existe solo como relleno de tarjeta.
- **Blanco vs. gris es jerarquía, no decoración.** La tarjeta blanca lleva el
  contenido principal; la gris lleva el soporte, el contexto o el cierre.
  Si no podés decir cuál de los dos es un bloque, el bloque está mal ubicado.
- Las secciones oscuras son bloques con margen lateral y esquina redondeada,
  no franjas de canto a canto. Excepciones: el hero y el footer, que van a
  sangre y con esquina recta.

## 4. COMPOSICIÓN

- **Tarjetas en fila horizontal exigen textos de largo similar. Tarjetas
  apiladas verticalmente, no.** Cuando los textos varían de largo, apilá.
  No obligues al copy a calzar tres textos idénticos.
- Ninguna tarjeta se estira en vertical más allá de su contenido para llenar
  una celda. Si queda hueco, la grilla está mal, no el texto.
- Toda tarjeta tiene separación visible de sus vecinas. Tres tarjetas pegadas
  se leen como un bloque.
- ~~Alturas emparejadas entre tarjetas contiguas del mismo grupo.~~
  **Derogado 6 sep 2026.** Contradecía la viñeta anterior de esta misma
  sección: emparejar alturas *es* estirar una tarjeta más allá de su
  contenido. Manda la viñeta anterior. Las alturas son naturales; una tarjeta
  con título de una línea queda más baja que sus vecinas y no se rellena, y
  las de dos líneas nunca se recortan para igualar a la corta. Llegar a dos
  líneas es trabajo de copy, no de layout, y no tiene solución de CSS.

## 5. IMÁGENES Y HUECOS RESERVADOS

- **Todo hueco reservado declara su relación de aspecto y no la cambia cuando
  entre la imagen real.** Es lo que permite llenar los huecos sin rehacer nada.
- Un hueco reservado es un hueco: no se llena con texto de relleno, ícono
  decorativo ni diagrama abstracto inventado.
- ~~Un bloque que lleva contenido real (la escalera de alertas, el esquema de la
  matriz) **no es un hueco reservado.** No confundir.~~
  **Reemplazado 11 sep 2026 (decisión del fundador).** Los esquemas de producto
  (matriz, recorrido de estados, estructura de clientes) viven **dentro** de un
  `ScreenSlot`: el marco cerrado de la pantalla de producto que los va a
  reemplazar. Hoy el marco muestra el esquema con su nota de "no es una
  captura"; mañana, la captura real al ratio que el marco declara. Un marco sin
  esquema queda vacío, rayado, con la etiqueta de qué pantalla va ahí. Ver §16.
- Fotografía, cuando exista: documental, personas haciendo algo concreto.
  Prohibido sonrisas a cámara, gente señalando gráficos, apretones de manos,
  equipos en sala de juntas. `/about` nunca lleva stock.
- Iconos: relleno sólido, sin caja ni fondo detrás.

## 6. UN SOLO SISTEMA DE ENUMERACIÓN POR SECCIÓN

Ícono o número, nunca los dos en el mismo bloque.

## 7. RESTRICCIONES DE RENDER

Heredadas de `on-page-seo.md`, repetidas acá porque se olvidan al maquetar:

- Componentes de servidor por defecto. `'use client'` solo en FAQ (acordeón),
  TOC (scroll spy), captura de email (form) y, desde el 11 sep 2026, la barra
  flotante (`FloatingNav`: en la home aparece al pasar el hero). Sus links van
  en el HTML del servidor; el script solo decide si se ve.
- En esos tres, **el texto va en el HTML crudo**, no montado por JS.
- El nivel de heading es una prop, nunca hardcodeado. Un solo `<h1>` por página.
- Imágenes en WebP bajo 200 KB, con `width`/`height` explícitos y `alt`
  descriptivo. `loading="eager"` solo en la imagen del hero.

## 8. CUANDO ALGO SE CORRIGE

Toda corrección termina en un cambio en un componente compartido o en una línea
de este archivo. Una corrección que vive solo en el chat se repite en la
próxima página.

## 9. LOS DOS CTAs — NO SON EL MISMO ELEMENTO

Se confundieron una vez y la confusión cuesta una ronda entera. Tienen nombre
propio para que no vuelva a pasar.

**CTA de plantilla** — caja gris, campo de email y botón. `EmailCapture`, con
texto y destino desde `components/neo/templateCta.js`.

- **Va siempre por email. Nunca lleva a una página.** Das una dirección, llega
  el archivo. Un botón que dice "download" y después pide un email es la
  pequeña deshonestidad que el resto del sitio evita.
- Una sola por página, en el cuerpo del artículo, al final del bloque de
  argumento donde el lector ya entendió por qué la plantilla le sirve — **no a
  un porcentaje fijo de la columna.** En comparativas, ese punto es antes del
  bloque de precio. En artículos, después de explicar el problema y antes de la
  sección de cierre.
- **Nunca en la columna sticky.** Esa columna colapsa bajo ~980px, así que un
  CTA ahí no existe en móvil; y una caja de email fija al lado del lector
  mientras lee es el embudo agresivo que el sitio entero evita. La columna
  sticky lleva índice y nada más.

**CTA de producto** — banda azul, "Start 14-day trial" + "See what is included",
junto a la tabla de precios.

- **Solo en páginas que publican precio propio**, que hoy son las comparativas.
- Posición: después de la tabla de precios y **antes** del FAQ.
- **Nunca en un artículo informativo.** Una guía cierra con un solo enlace
  suave (`EditorialClose`): quien quiera la versión automatizada lo sigue, y
  quien vino por la respuesta no recibe ningún pedido.

**Los dos juntos, nunca.** No van en la misma caja ni consecutivos sin
contenido entre medio. Si el layout los deja pegados, hace falta separación de
sección real — margen vertical, no un encabezado.

## 10. ARTÍCULOS RELACIONADOS

- Va en las páginas editoriales. **No va en `/security` ni en `/about`.**
- **Exactamente 3 tarjetas, siempre**, y el componente tira error si no son 3.
  El conteo fijo es lo que impide que la fila termine con un hueco.
- **Un bloque, un encabezado, sin partir por tipo.** Nada de dos parrillas
  "Guías" y "Comparativas": quien busca qué leer después no sabe ni le importa
  sobre qué plantilla corre una página.
- **El orden es la jerarquía.** La primera es la más relacionada. Ninguna
  tarjeta se agranda para señalarlo.
- **Título calibrado para dos líneas.** Los números están en `COPY_LIMITS.md`
  (este archivo no lleva límites de texto); la regla es: hay un mínimo además
  del máximo, y el mínimo es el que evita la línea única. Un título por debajo
  se **alarga con contexto real** — es trabajo de copy y no tiene solución de
  CSS. Si no se puede alargar sin falsear de qué trata la página, esa tarjeta
  queda más baja que las otras dos: **nunca se recortan las de dos líneas para
  igualar a la corta**, y nunca se rellena con un fragmento de la bajada más
  puntos suspensivos. Por eso el mínimo avisa y no bloquea — bloquear
  prohibiría el caso que esta misma regla permite.
- El tipo va como eyebrow chico dentro de la tarjeta, y **su valor sale de
  `components/neo/pageKinds.js`, indexado por ruta** — nunca un string escrito
  a mano por página, para que una página lleve la misma etiqueta desde donde
  sea que la enlacen. Nunca una fecha. Sobre de dónde salen los cuatro valores,
  leer §12: no es lo que se asumió.
- **Toda la tarjeta es el enlace:** un solo `<a>` envuelve imagen, eyebrow,
  título y bajada, con `cursor: pointer` en la tarjeta entera. El título va en
  `--black`, **sin subrayado y sin color de link** — marcarlo como hipervínculo
  dentro de una tarjeta que ya es entera el enlace dice "esta palabra es el
  link" de algo que es todo link. El azul subrayado queda reservado para
  enlaces sueltos en el cuerpo del texto (las citas de fuente).
- Anchor descriptivo. Prohibido "read more", "learn more", "click here"
  (`on-page-seo.md` §6, que también fija el tope: 3-5 enlaces internos
  salientes por página, y el cuerpo ya gasta varios).
- Hueco de imagen arriba, 3:2, vacío y con su ratio declarado.

## 11. ALCANCE REAL DE `EditorialTemplate` — LEER ANTES DE ESTIMAR

`EditorialTemplate` **cubre 4 páginas hoy, no 10.** Toda corrección a la
plantilla llega a estas cuatro y a ninguna más:

`/caqh-reattestation` · `/symplr-pricing` · `/modio-health-pricing` ·
`/medtrainer-pricing`

- `/best-credentialing-software` no existe todavía: no tiene copy aprobado.
- Las cinco de `/payer-enrollment*` y `/credentialing-spreadsheet-template`
  siguen sobre `Article`, que es otro componente. **Migrarlas es tarea aparte y
  no está hecha.**

## 12. TAXONOMÍA DE TIPO DE PÁGINA — APROBADA

**Aprobada 6 sep 2026.** Definida en el proceso de diseño, **no heredada de la
arquitectura** — esto reemplaza la nota de la ronda anterior, que la presentaba
como pendiente de confirmar su origen. El origen quedó confirmado: es propia.

`H110_ARQUITECTURA_v3.md` clasifica por ola (1-5, Permanentes) y por clúster de
keyword. No tiene campo de formato ni de tipo de página en ninguna de sus
tablas; la única mención de layout en todo el archivo es una nota en prosa
dentro de un brief suelto, y aparece una vez. Ola y clúster son ejes de
planificación de SEO: le sirven a quien decide qué construir primero y no le
dicen nada al lector que decide qué abrir después.

La definición vive en `components/neo/pageKinds.js`, indexada por ruta. Cinco
valores:

| Valor | Qué es |
|---|---|
| `Guide` | Contenido de referencia, para leer, no para convertir |
| `Comparison` | El precio de un competidor nombrado, argumentado por secciones |
| `Pricing` | Nuestra propia tabla de precios — solo `/pricing` la tiene |
| `Template` | La planilla descargable |
| `Product` | Qué hace el producto para un trabajo concreto, y para quién |

**`Product` se agregó el 6 sep 2026** al resolver que las tres páginas de
producto estaban etiquetadas `Guide` sin serlo. Quedaron así:

- `/payer-enrollment-software` → **Product**
- `/credentialing-tracking-software` → **Product**
- `/for-billing-companies` → **Product**

`Pricing` era la otra candidata y es incorrecta para las tres: una tarjeta que
dice `Pricing` promete una tabla de precios del otro lado, y ninguna de estas
tres la tiene — enlazan a `/pricing` para eso. Una etiqueta que promete algo
que el destino no tiene es el mismo defecto que vendría a reemplazar.

`/credential-expiration-tracking` salió del mapa: se borró del repo el 6 sep
2026 junto con el hub `/payer-enrollment/` y las cuatro guías de pagador, por
ser estrategia anterior ya reemplazada en la arquitectura vigente.


## 13. TODA CABECERA DE SECCIÓN LLEVA PASTILLA

**11 sep 2026, decisión del fundador, siguiendo la referencia.** Cada sección
de una landing abre con la pastilla (`.sk-pill`, tinta con etiqueta blanca),
incluidas las bandas oscuras y el FAQ. Es la marca de color que abre la sección.

- El texto de la pastilla es una etiqueta estructural de 1-3 palabras, como
  "FAQ". Nunca repite el H2. Cuando el copy aprobado no la trae, se escribe y se
  anota en DESIGN_DECISIONS.md como pendiente de revisión del copy.
- Nunca ámbar (§2 regla 4).
- El kit avisa en desarrollo (`console.warn`) cuando una cabecera no la trae.

## 14. NINGUNA SECCIÓN DEJA LA MITAD DERECHA VACÍA

Reclamado por el fundador el 28 ago 2026 sobre la piel anterior, resuelto ahí
(`design-system/guidelines/section-layout.html`) y perdido en la reconstrucción
neo; vuelto a reclamar el 11 sep. Una sección de texto usa una de cuatro
distribuciones, elegida por lo que lleva:

| Distribución | Cuándo |
|---|---|
| **split** — titular a la izquierda, texto a la derecha | Un argumento sin nada que mostrar |
| **media** — titular y texto de un lado, `ScreenSlot` del otro (`flip` invierte) | La sección describe una pantalla del producto |
| **stack** — titular a la izquierda, columna de tarjetas a la derecha | Una lista corta que cabe al lado de su titular |
| **grid** — titular arriba, tarjetas en fila | 2-4 ítems de largo parecido (§4) |

No todas las secciones llevan visual: cada `ScreenSlot` es una pantalla que
alguien va a tener que capturar. La distribución *split* es la respuesta
correcta para un argumento.

## 15. RITMO DE BANDAS: NO MÁS DE TRES BLANCAS SEGUIDAS

Una landing no pone más de tres secciones blancas seguidas entre el hero y el
cierre. La cuarta pasa a bloque oscuro (`surface="ink"`). Cuál pasa es criterio
de composición y se anota en DESIGN_DECISIONS.md.

Desde el 11 sep 2026 una sección con una tarjeta oscura (`InkTile`) de al menos
un tercio del ancho cuenta como oscura, y un bloque gris corta la serie de
blancas. Las secciones oscuras ya no son cajas de canto a canto con contenido
adentro: son una tarjeta oscura al lado de tarjetas claras (la referencia VELD).
Solo el hero y el cierre siguen siendo bloques oscuros enteros.

## 16. LOS HUECOS DE PANTALLA (`ScreenSlot`)

- Todo visual del producto en una landing vive en un `ScreenSlot`: marco
  redondeado, barra con la etiqueta "Screen" + qué pantalla va + el ratio.
- Sin cromo de ventana: nada de puntitos de semáforo ni barra de URL. Eso
  vestiría el marco de interfaz, que §2 regla 1 prohíbe.
- Con esquema adentro, la nota de "no es una captura" es obligatoria: el
  componente tira error sin ella.
- Las páginas no se publican hasta que todos los huecos tengan su pantalla
  real (decisión del 11 sep 2026), así que las etiquetas quedan visibles: son
  la lista de producción de capturas.

## 17. DEGRADADOS: SOLO DE UN TONO, SOLO EN DOS LUGARES

**11 sep 2026, aprobado por el fundador.** Reemplaza el "sin degradados en
ninguna parte" de TOKENS.md.

- ~~**Botones:** degradado de un solo tono.~~ **Retirado 12 sep 2026:** el
  fundador pidió superficie plana y moderna. Los botones son planos, con una
  sombra neutra que da profundidad; sin brillo propio ni luz simulada.
- **Bloques y tarjetas oscuras:** un brillo suave de verde medio en una esquina,
  y las texturas de líneas de la familia del hero.
- Nunca dos colores distintos en un degradado. Nunca en texto ni en tarjetas
  claras. El contraste del texto se mide sobre el tramo más oscuro.

## 18. EL AMARILLO COMO COLOR DE ELEMENTO — UNO POR SECCIÓN

**11 sep 2026, aprobado.** Amplía §2 regla 4 sin derogarla.

- Amarillo sólido: los CTAs, y **como mucho un elemento por sección** que
  represente nuestra oferta (nuestra cifra). El plan destacado **no** va en
  amarillo: su borde y su etiqueta van en petróleo, y el amarillo queda para
  el botón (12 sep 2026).
- Nunca en datos ni en estados. El ámbar tintado (`--amber-tint` + borde) sigue
  siendo exclusivo de los estados que piden acción.
- Nunca texto ámbar sobre fondo claro (2,7:1).

## 19. FOTOGRAFÍA EN LANDINGS

**11 sep 2026, aprobado.** Levanta el "sin fotografía en una landing" para:
el hero de la home y los huecos de imagen que el fundador definió en la home
(no los `ScreenSlot`, que son para pantallas del producto y nunca llevan stock).
Fuente: Pexels, vía `lib/pexels.js` del lado del servidor; archivos en
`public/landing/` como WebP < 200 KB; crédito del fotógrafo visible junto a la
imagen. Dirección de §5 sin cambios: documental, nadie mirando a cámara.

## 20. LAS MARCAS DE LA MARCA VAN EN EL COLOR PRINCIPAL

**12 sep 2026.** Íconos, viñetas y el disco con tilde de las listas de un plan
van en petróleo (`--ink`), no en el tono medio. El tono medio (`--accent`)
queda solo donde tiene que distinguirse del texto negro: la línea de marca de
un H2 y las cifras grandes.

---

## APÉNDICE — Checklist por página

```
[ ] Cero hex, cero style inline, cero valores arbitrarios
[ ] Cero componentes nuevos sin registrar en el catálogo
[ ] Ninguna sección con fondo gris; ninguna línea entre secciones
[ ] Blanco vs. gris justificable como jerarquía en cada bloque
[ ] Ninguna tarjeta estirada más allá de su contenido
[ ] Separación visible entre tarjetas contiguas
[ ] Un solo sistema de enumeración por sección
[ ] Huecos reservados con ratio declarado, vacíos
[ ] Ámbar solo en CTA primario, estados de acción y foco
[ ] Estados con glifo + etiqueta + cifra, no solo color
[ ] Toda cifra con fuente linkeada en la misma línea
[ ] Cada slot dentro de su rango en COPY_LIMITS.md
[ ] Un solo CTA de plantilla, por email, en el cuerpo; ninguno en la sticky
[ ] CTA de producto solo si la página publica precio propio
[ ] Relacionados: 3 tarjetas, eyebrow desde pageKinds.js, título sin subrayar
[ ] Pastilla en cada cabecera de sección (§13)
[ ] Ninguna sección con la mitad derecha vacía (§14)
[ ] No más de tres secciones blancas seguidas (§15)
[ ] Todo visual de producto dentro de un ScreenSlot con su etiqueta (§16)
[ ] Capturas a 390 / 768 / 1440
[ ] next build → ○ (Static)
```
