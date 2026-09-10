# DESIGN_DECISIONS.md — sokndall.com

Registro de criterio de composición, no de reglas. `DESIGN_RULES.md` fija lo
que nunca cambia; `INVENTARIO_FORMAS.md` lista qué componente usa cada
página. Este archivo dice **por qué** se eligió foto/hueco/cuadro en un caso
y no en otro, para que el razonamiento no viva solo en el `.jsx`.

Se apendea, nunca se reescribe entero. Cuando la misma decisión se repite en
3+ páginas, sube a `DESIGN_RULES.md` §8 como regla y las entradas redundantes
se borran de acá — este archivo es para lo que todavía no es regla.

Formato fijo por entrada:

```
## <ruta> — <sección o componente>
Fecha: <AAAA-MM-DD>
Decisión: <qué elegiste>
Razón: <por qué, 1-2 líneas>
Regla de DESIGN_RULES.md que aplica: <número, si hay>
```

---

## / — Hero, columna derecha (`.sk-hero__media`)
Fecha: 2026-09-06
Decisión: hueco reservado con esquema de baja fidelidad (la matriz
proveedor × pagador), no foto documental, no mockup de interfaz.
Razón: el producto no existe todavía. Un mockup de interfaz simularía una
pantalla real y contradice la promesa central de la marca (nada se pasa
por alto). Un esquema declarado como tal no promete una interfaz que no
existe.
Regla de DESIGN_RULES.md que aplica: §2 regla 1 (producto no se simula).

## Todas las páginas de EditorialTemplate — imagen de cabecera
Fecha: 2026-09-06
Decisión: hueco reservado a ratio fijo (2.33 sobre 1280px, cae a 3:2 bajo
760px), vacío, sin foto ni placeholder de contenido.
Razón: el molde exige imagen de cabecera en las 10 páginas por igual
(artículo y comparación comparten estructura); qué imagen específica va
ahí es una decisión posterior a que exista el copy final y el criterio de
qué mostrar por página — no una decisión de layout.
Regla de DESIGN_RULES.md que aplica: §5 (todo hueco reservado declara su
ratio y va vacío). El `Editorial.jsx` renderiza `.sk-ed__headslot` a 21:9
salvo que `header` traiga `image`, así que el hueco lo impone el molde, no
cada `page.jsx`. La dirección de arte vive en
`docs/image-brief-marketing-pages.md`, no en la página.

## EditorialTemplate — tarjetas de artículos relacionados
Fecha: 2026-09-06
Decisión: hueco reservado 3:2 en cada tarjeta (mismo ratio que
`.sk-quad__img`), vacío. No se llena con la imagen de cabecera del
artículo referenciado hasta que esas 10 imágenes existan.
Razón: reusar la cabecera recortada es la decisión de contenido ya
tomada, pero las 10 imágenes de cabecera todavía no están compuestas —
llenar el hueco ahora con un placeholder distinto sería inventar
contenido que se va a tener que reemplazar dos veces.
Regla de DESIGN_RULES.md que aplica: §10 (`RelatedGuides`: exactamente 3
tarjetas, hueco de imagen arriba a 3:2, vacío y con su ratio declarado).

---

## / — Sección 2 (`SplitListSection`), bloque izquierdo `.sk-slot--grey`
Fecha: 2026-09-06
Decisión: hueco reservado gris relleno, sin ratio propio: toma su altura
de la pila de `RowCard` que tiene al lado. No foto, no esquema, no
repetición de la matriz.
Razón: la sección son los tres modos de falla ("late revalidation",
"lapsed attestation", "mis-loaded NPI"). No hay pantalla de producto para
"tres formas de dejar de cobrar", y una foto de una consulta que no cobra
cae justo en lo que §5 prohíbe (gente señalando gráficos, oficina
compungida). La matriz ya carga el hero y la Sección 4; usarla acá otra
vez la gasta tres veces en el mismo scroll. El bloque va gris y no blanco
porque es **soporte** de las tarjetas que llevan el contenido real (§3);
si fuera blanco reclamaría ser el contenido principal. Que su altura la
fije la vecina y no un ratio es deliberado: acá la restricción real es
emparejar la pila de tarjetas, no un recuadro de imagen. Misma maniobra
que el `.sk-quad__d` de la Sección 3.
Regla de DESIGN_RULES.md que aplica: §5 (hueco vacío, no relleno de
texto/ícono), §3 (blanco = principal / gris = soporte), §2 regla 1
(producto no se simula). Se aparta de §5 en un punto: el hueco no declara
ratio — la altura es de la grilla, más estable acá que un `aspect-ratio`.

## / — Sección 3 (`QuadSection`), tarjeta ancha `.sk-quad__img` (3:2)
Fecha: 2026-09-06
Decisión: el hueco de imagen 3:2 va en la tarjeta de columna uno
("Credentials that expire") y en ninguna de las otras dos del quad. Sangra
a los tres bordes de la tarjeta (cancela `--card-pad`), fondo `--tint-2`,
redondeado en las cuatro esquinas.
Razón: de los tres bloques de `LAYER_BLOCKS`, el de columna uno es el de
menos texto (una oración, sin lista), así que su tarjeta tiene aire
vertical que las otras dos no tienen — la imagen llena ese aire sin
estirar nada (§4). La columna dos ("Applications that go quiet") ya está
llena: el copy más largo más una lista de tres puntos clavada abajo;
meterle imagen la empuja más allá de su contenido. La columna tres chica
("The Monday follow-up") es una línea a propósito (`.sk-layer`, ícono en
la esquina) — agregarle imagen la infla para igualar a las vecinas, que
es exactamente el emparejado de alturas que §4 derogó. O sea: la imagen
va donde hay holgura, no como decoración repartida.
Regla de DESIGN_RULES.md que aplica: §5 (ratio declarado, vacío), §4 (nada
se estira más allá de su contenido; derogación del emparejado de alturas).

## / — Sección 3 (`QuadSection`), slot inferior `.sk-quad__d`
Fecha: 2026-09-06
Decisión: hueco reservado blanco (`variant="card"`), sin ratio, en columna
tres / fila dos. Queda vacío; no recibe un cuarto bloque de contenido.
Razón: el copy tiene tres capas, no cuatro (`LAYER_BLOCKS.length === 3`).
Columnas uno y dos ocupan las dos filas; la columna tres se parte en la
tarjeta chica (fila uno) más este slot (fila dos). El cuarto recuadro es
consecuencia de que la grilla de tres columnas necesita que la columna
tres baje hasta la misma línea de base que las dos de altura completa —
no es un slot de contenido que el copywriter dejó en blanco. Llenarlo con
una cuarta "capa", un dato o un diagrama inventado es la fabricación que
`SIGUIENTE_FASE.md` y §5 prohíben. Va blanco y no gris porque se sienta
entre las tarjetas blancas del quad, al mismo peso visual; será el hueco
de una imagen real emparejada con la capa "credentials expire". No declara
ratio: la altura la da la grilla (`grid-template-rows: auto 1fr`), que acá
lo ata a la altura de la columna uno.
Regla de DESIGN_RULES.md que aplica: §5 (un hueco es un hueco, no relleno),
§3 (blanco entre blancos). Se aparta de §5 en el ratio, por lo mismo que
el `.sk-slot--grey` de la Sección 2 — ver esa entrada.

## /caqh-reattestation — `StatedVsObserved` (tabla "Stated vs Observed")
Fecha: 2026-09-06
Decisión: es contenido genuino, no hueco de imagen. Bloque `.sk-svo` con
fila "Stated" (los 120 días publicados de CAQH, con fuente linkeada) y
fila "Observed" (dos casos reportados por proveedores, 60d y 90d, cifra en
`.sk-num` más texto, más un `note` de procedencia).
Razón: lleva información que existe hoy y que **es el argumento de la
sección** — el desacuerdo entre el intervalo que CAQH publica y los que a
un proveedor efectivamente le exigen. Está armado con copy aprobado
(`data.js` `CADENCE`) y cifras con fuente. Un hueco reservado es para arte
que todavía no existe (§5); esto es contenido terminado.
Qué lo distingue de la matriz de la home: la matriz **también** es
contenido genuino, no un hueco — pero es un esquema de baja fidelidad que
**hace de suplente de una pantalla de producto que no existe todavía**,
lleva su nota visible de "not a product screenshot" (`MatrixNote`), usa
datos sintéticos (función `score()` determinista, conteos de celda
calibrados) y, por la regla "los diagramas se reemplazan con capturas
reales, no con mockups mejor dibujados", **se va a reemplazar por una
captura** cuando la pantalla exista. `StatedVsObserved` no suplanta nada:
es evidencia editorial, final, y no se reemplaza nunca por una captura.
Uno es un placeholder con fidelidad para una UI futura; el otro es
mobiliario de prosa permanente. Además el lado "Observed" se deja
deliberadamente sin tratamiento de cita tintada / testimonio (mismo
cuerpo, mismo borde izquierdo, sin tarjeta) — vestirlo de testimonio
sería discutir con tipografía. Esa restricción es propia del proyecto, sin
referencia de catálogo.
Regla de DESIGN_RULES.md que aplica: §5 (contenido real ≠ hueco
reservado), §2 regla 1 (la matriz no simula producto: de ahí su nota),
§2 regla 2 (toda cifra con fuente en la misma línea).

## /symplr-pricing — desviación del patrón de las otras dos comparativas
Fecha: 2026-09-06
Decisión: las tres comparativas (`symplr`, `modio`, `medtrainer`) corren
sobre `EditorialTemplate variant="comparison"` con el mismo marco, la
misma cola fija (precio → CTA → FAQ → relacionados), el mismo hueco de
cabecera 21:9 vacío y el mismo cuerpo de `EditorialCta` palabra por
palabra. **Solo `symplr` se aparta:** es la única que usa
`SourcedPricingDisclosure` (dos veces) y `PurchaseModelCompare`, y la única
que lleva una estimación en página (`<SourcedFigure estimate>` en la
sección de precio). `modio` y `medtrainer` renderizan todo el cuerpo como
`ProseSection` + `GoodFitSection`.
Razón: no es decisión de diseño — es forma del copy, y está anotado en los
comentarios de `modio` y `medtrainer`. El copy aprobado de `symplr` está
escrito como filas claim/status/source; el de las otras dos está escrito
como párrafos, y recomponer prosa aprobada en filas de claim es reescritura
de copy, no migración de plantilla. Así que `symplr` es la página que
**prueba** esos dos componentes; las otras dos quedan en prosa hasta que
(si) se reescriba el copy. `medtrainer` está marcada como la mejor
candidata a `SourcedPricingDisclosure` (documenta su propia lógica de
precio) y aun así se deja en prosa por la misma razón — la desviación es
puramente "symplr lo tiene", y es provisional. Tratamiento de imagen:
idéntico en las tres — hueco de cabecera vacío, sin logos ni capturas
(los componentes no tienen prop de imagen).
Regla de DESIGN_RULES.md que aplica: §11 (alcance real de
`EditorialTemplate`: 4 páginas). El resto es la política "la forma es el
argumento" de los docstrings de `ComparisonBits`, no una regla numerada.

## Componentes fuera de catálogo durante el ensamblado
Fecha: 2026-09-06
Decisión: dos piezas se crearon para páginas que todavía no tienen copy
aprobado y viven probadas fuera de su ruta destino.
- `MultiVendorComparison` (`ComparisonBits.jsx`) pertenece **solo** a
  `/best-credentialing-software`, que no existe aún. Se ejercita en
  `/styleguide/comparison`, ruta `noindex` y fuera del sitemap. Política
  de imagen declarada al crearla: **ninguna** — sin logos, sin capturas;
  un proveedor es su nombre en texto. El componente no tiene prop de
  imagen, así que la prohibición de §2 regla 5 queda impuesta por
  estructura, no por disciplina. Ninguna celda vacía: `{ notPublished:
  true }` o tira error. Nada estimado en la tabla (una estimación necesita
  su base en una oración, y una celda no la carga).
- `GoodFitSection` (`ComparisonBits.jsx`) delega en `ProseSection` y no
  agrega marcado. Existe para **nombrar el slot** "para quién es el
  competidor" y darle lugar a la prohibición (nada de tarjeta, tinte ni
  aside con borde: eso lo leería como concesión de compromiso). Sin prop
  de imagen — hereda la política de `ProseSection` (sin slot de imagen por
  defecto).
Razón: `SIGUIENTE_FASE.md` prohíbe inventar un componente a mitad de tanda;
estos dos entraron al catálogo con su política de imagen declarada **antes**
de usarse, que es lo que §1 pide. El resto de `ComparisonBits`
(`SourcedPricingDisclosure`, `PurchaseModelCompare`) siguen el mismo
patrón: reciben nombres de proveedor como texto, sin prop de imagen.
Regla de DESIGN_RULES.md que aplica: §1 (un componente nuevo entra al
catálogo con su política de imagen declarada), §2 regla 5 (sin logos ni
capturas de competidores).

## /pricing · /payer-enrollment-software · /for-billing-companies — todavía no sobre `LandingTemplate`
Fecha: 2026-09-06
Decisión: estas tres NO usan `LandingTemplate` ni su kit de secciones
(`PlanSection`, `SplitListSection`, etc.). Arman a mano con `HeroPanel` +
`Footer`, funciones `Head()` locales y clases `.sk-sec` / `.sk-panel` /
`.sk-cta`.
Razón: es **estado de ensamblado, no decisión de composición** — se anota
acá para que nadie cite la maqueta a mano de `/pricing` como precedente.
Según `SIGUIENTE_FASE.md`, estas páginas recibieron la piel nueva en una
corrida vieja sobre estructura sin auditar y hay que **reconstruirlas de
cero** sobre el molde aprobado de la home, no editarlas. Hasta que eso
pase, su composición interna no es referencia de nada.
`/credentialing-spreadsheet-template` sigue sobre el componente `Article`
(`variant="solo"`), no sobre `EditorialTemplate` — eso sí es lo previsto
por §11, no una desviación.
Regla de DESIGN_RULES.md que aplica: §11 (qué molde cubre qué páginas);
`SIGUIENTE_FASE.md` para el estado.

## /security vs /about — el slot de retrato
Fecha: 2026-09-06
Decisión: `InstitutionalTemplate` tiene un solo slot de imagen (retrato
4:5). `/about` lo usa, vacío y declarado. `/security` lo omite por
completo.
Razón: misma plantilla, decisión opuesta por página. En `/about` el
retrato es una **prohibición**, no un brief: foto real del fundador o del
escritorio donde esto se construye, o nada — stock no es opción más débil,
es opción falsa, porque la página dice que la corre una sola persona y una
foto de equipo la desmiente en la misma pantalla. En `/security` una
ilustración de "no tenemos datos de pacientes" sería inventar una imagen
de una ausencia; la página es de "baja ambición visual por diseño", así
que no lleva slot. Nota aparte: el copy de `/about` corre a ~700 palabras,
por encima de la banda 300–600 del molde; no se recortó porque la sección
que lo pasa de largo es la que el brief llama la más importante de la
página.
Regla de DESIGN_RULES.md que aplica: §5 (foto documental real, `/about`
nunca lleva stock; un hueco no se llena con ilustración inventada).

---

## Nota de consolidación — 2026-09-06

Se revisó si alguna decisión ya se repite igual en 3+ páginas para subirla
a `DESIGN_RULES.md` §8. Ninguna todavía: las entradas de arriba son casos
de criterio distintos entre sí, no repeticiones. El candidato más cercano
es "hueco de cabecera 21:9 vacío", pero es **una** entrada (el molde lo
renderiza, no cada página) y ya está cubierto por §5 más el propio
`Editorial.jsx`. Revisar de nuevo cuando se ensamble la tanda de producto
sobre `LandingTemplate`.

---

# Corrida v3.1 — las 15 páginas (2026-09-10)

Entradas de la corrida que construye el mapa de `H110_ARQUITECTURA_v3.1.md` §4.
Primero los componentes (Paso A), declarados antes de su primer uso; después
las decisiones por página, en el orden en que se construyeron.

## LandingTemplate — `PlanListSection` (componente nuevo)
Fecha: 2026-09-10
Decisión: la lista de precios pasa a ser una lista vertical, un plan por fila
(tarjeta blanca: nombre y precio a la izquierda, descripción y features al
medio, botón de trial a la derecha). El plan del medio conserva el borde
ámbar y la etiqueta montada sobre el borde superior, y el componente tira
error si esa etiqueta no es literalmente "Most complete for a group
practice". `PlanSection` (tres tarjetas) queda en el kit sin uso en el mapa.
Razón: la regla de la corrida es precios en lista vertical, no en tres
cards. Tres tarjetas lado a lado piden lectura "bueno/mejor/el mejor" y
obligan a tres descripciones de largo distinto a columnas iguales, que es lo
que §4 manda apilar.
Política de imagen: ninguna. Sin hueco, sin ícono, sin ilustración.
Regla de DESIGN_RULES.md que aplica: §2 reglas 7 y 8, §4 (apilar cuando los
textos varían de largo).

## LandingTemplate — `ProseBandSection` (componente nuevo)
Fecha: 2026-09-10
Decisión: sección de párrafos corridos: `SectionHead` (H2 + nota de
introducción) arriba, 1-4 párrafos a 68ch alineados al borde izquierdo del
H2, y una línea de cierre opcional. Sin tarjeta y sin cambio de superficie.
Razón: el copy de las páginas de producto (`/payer-enrollment-software`,
`/for-billing-companies`, `/pricing`, la plantilla) trae secciones que son
un argumento en prosa, no ítems paralelos. Partirlas en row-cards inventa un
paralelismo que el copy no tiene; meterlas en `SplitListSection` gasta un
hueco reservado en una sección que no tiene nada que mostrar.
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §1 (componente nuevo solo si el copy no
encaja en ninguno existente), §3 (ninguna sección con fondo gris).

## LandingTemplate — `StatusTableSection` (componente nuevo)
Fecha: 2026-09-10
Decisión: tabla de tres columnas (estado · qué significa · qué hacer) para
los seis estados de una solicitud. Cada estado es un `.sk-mark` con glifo +
etiqueta escrita; solo "Info requested" lleva relleno y borde ámbar (es el
único estado que pide acción del lector). Los glifos reusan el vocabulario
de la matriz donde se solapan (● in review, ▲ info requested, ✓ approved).
Razón: el copy entrega seis filas de tres campos: es una tabla, no seis
tarjetas. **No lleva columna de cifra**: §2 regla 3 pide glifo + etiqueta +
cifra, pero acá la tabla describe estados, no cuenta solicitudes, y una
cifra por fila sería inventada. La cifra vive en la matriz de la misma
página, que sí la tiene (días desde el último contacto).
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 regla 3 (estado nunca solo por
color) y regla 4 (ámbar solo en estados de acción, como relleno, nunca
texto). Se aparta de la regla 3 en la cifra, por la razón de arriba.

## HeroPanel — slot `form` (extensión)
Fecha: 2026-09-10
Decisión: `HeroPanel` acepta `form`, que ocupa la columna derecha cuando no
hay `figure`. Solo lo usa `/credentialing-spreadsheet-template`, que pone ahí
el `EmailCapture`. De paso se reemplazó el `style` inline que el hero usaba
sin figura por la clase `.sk-hero__top--solo`.
Razón: el brief de la página 4 pide la plantilla arriba del pliegue y la
regla de la corrida pide que la plantilla vaya siempre por email. El form
es el CTA de plantilla de esa página (el único), no un segundo elemento.
Política de imagen: el slot no lleva imagen. La columna derecha de un hero
de landing lleva esquema o formulario, nunca foto de personas.
Regla de DESIGN_RULES.md que aplica: §9 (CTA de plantilla por email, uno por
página), §7 (sin estilos inline).

## QuadSection — cuarto bloque de contenido (extensión)
Fecha: 2026-09-10
Decisión: el copy v3.1 de la home trae cuatro tarjetas para la Sección 3
(wide, tall, "The Monday follow-up" y "One row per state"). La cuarta se
apila bajo la chica en la fila uno de la columna tres; el hueco reservado
blanco `.sk-quad__d` conserva la fila dos y sigue vacío.
Razón: la corrida exige que los huecos reservados de la home sigan vacíos
como están. Darle el hueco a la cuarta tarjeta lo habría consumido.
Política de imagen: sin cambio — `.sk-quad__img` 3:2 y `.sk-quad__d` siguen
vacíos.
Regla de DESIGN_RULES.md que aplica: §5.

## FigureBandSection — figura escrita en la etiqueta, y cuatro figuras (extensión)
Fecha: 2026-09-10
Decisión: `value` pasa a ser opcional. El copy v3.1 escribe cada ancla como
una sola frase en el slot de etiqueta ("$600 to $2,400 per provider, per
year"); cuando no hay `value`, la etiqueta toma el paso `.sk-body--lg` (16px, semibold) de la escala — `.sk-h4` partía una etiqueta de 37 caracteres en dos líneas a 1280px, medido
y no se parte la frase en cifra + unidad. La nota acepta el enlace de
fuente, que así queda en la misma tarjeta que la cifra. Con cuatro figuras
(`/pricing`) la grilla es 2 × 2.
Razón: partir la frase aprobada en dos piezas tipográficas es reescribirla;
dejarla a 13px la vuelve pie de foto. Cuatro en fila a 1200px pone cada
etiqueta en cuatro líneas.
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 regla 2 (cifra con fuente en la
misma línea), §4.

## SectionHead — pie de cifra sin cifra (extensión)
Fecha: 2026-09-10
Decisión: si una sección trae `statCaption` y no `stat`, el pie se
renderiza solo en la columna derecha, como aparte.
Razón: el copy de la Sección 3 de la home entrega "Stat caption: Alerts at
90, 60, 30, 14 and 7 days before expiry." sin ninguna cifra que lo acompañe.
No se inventa una cifra para ponerle arriba.
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 regla 2.

## `rich.jsx` + `sources.js` + `schema.jsx` (infraestructura, no visual)
Fecha: 2026-09-10
Decisión: el copy de los `data.js` escribe los enlaces como
`[texto](/ruta)` o `[texto](src:clave)`. `sources.js` es el registro único
de fuentes externas y decide el `rel` (competidores y directorios de
reseñas `nofollow`, fuentes oficiales normal). `schema.jsx` arma el JSON-LD
(Organization, SoftwareApplication + Offer, FAQPage, Article) leyendo los
mismos datos que la página, para que el schema no pueda decir otra cosa que
la pantalla. Las fuentes que el copy nombra solo por dominio llevan
`pending: true` y apuntan a la raíz de ese dominio.
Razón: §2 regla 2 exige la fuente en la misma línea que la cifra, y
on-page-seo.md §7 exige `nofollow` en competidores; decidirlo una vez por
fuente evita que dependa de quién tipeó el enlace.
Política de imagen: no aplica.
Regla de DESIGN_RULES.md que aplica: §2 regla 2, §8.

## / — home reconstruida sobre el copy v3.1
Fecha: 2026-09-10
Decisión: la composición de la home se mantiene (hero con matriz → split
list → quad → matriz → ancla → precios → qué no hace → FAQ → cierre) y todo
el contenido sale de `app/homeData.js`, copiado del Tanda A. `Landing.jsx` y
`landingData.js` (que reexportaba copy de la piel forest) se borraron.
Los cuatro huecos reservados siguen vacíos con su ratio: hero (ocupado por
el esquema, como antes), `.sk-slot--grey` de la Sección 2, `.sk-quad__img`
3:2 y `.sk-quad__d`. Sin fotografía.
Faltantes del copy y qué se hizo en cada caso:
- Sección 3: el copy da "Stat caption" sin cifra. Se renderiza el pie solo;
  no se inventa la cifra (ver entrada de `SectionHead`).
- Sección 4: sin kicker para la tarjeta aparte; no se renderiza eyebrow.
- Sección 8: el copy no trae H2 para el FAQ. Se usa la etiqueta estructural
  "Frequently asked questions" que ya imprime `EditorialTemplate`, partida
  en dos líneas por el presupuesto de `.sk-h2` (`FAQ_HEADING` en neoData).
  Aplica igual a las cinco landings.
- Cierre: el copy da título y cuerpo, no botones. Se reusan los dos labels
  aprobados del hero ("Start 14-day trial" / "See all three plans"), que son
  la misma acción.
- Se quitó la etiqueta "Provider × payer — schematic" que el hero traía
  sobre la matriz: no está en el copy v3.1 y el pie aprobado ya dice qué es.
Regla de DESIGN_RULES.md que aplica: §5, §2 regla 1.

## /pricing · /payer-enrollment-software · /for-billing-companies — reconstruidas de cero
Fecha: 2026-09-10
Decisión: las tres se reescribieron sobre `LandingTemplate` y el kit, sin
mirar su composición anterior (entrada del 2026-09-06, que queda
superada). Ninguna lleva fotografía ni figura en el hero: `/pricing` abre
con la premisa y pasa directo a la lista de precios; las otras dos abren con
su franja de cuatro y dejan la matriz (en `/payer-enrollment-software`) para
su propia sección, dibujada a otra densidad que la de la home (6 × 5, tres
celdas de acción) para que dos páginas del molde no repitan el mismo
gráfico.
Se aparta de la home en: el par de CTAs del hero de 9 y 11 reusa los labels
aprobados de la home porque el copy de esas páginas no trae ninguno;
`/pricing` no lleva CTA en el hero (cada fila de precio ya tiene el suyo).
Los encabezados de columna de la tabla de estados ("Status", "What it
means", "What to do") son etiquetas estructurales: el copy da las tres
partes de cada fila pero no la fila de encabezado.
Regla de DESIGN_RULES.md que aplica: §1, §2 reglas 3-4, §4.

## /credentialing-spreadsheet-template — de `Article` a `LandingTemplate`
Fecha: 2026-09-10
Decisión: la página deja el molde `Article solo` y pasa a `LandingTemplate`,
como manda la corrida (página 4 en la tanda de landing). La plantilla se
ofrece arriba del pliegue con el `EmailCapture` en la columna derecha del
hero (slot `form`), que es el único CTA de plantilla de la página. El cierre
no repite la caja: su botón lleva el label del form y ancla a él
(`#get-template`). Sin descarga directa en ninguna parte.
Las dos fuentes externas que pide el copy (Maryland Department of Health,
CMS) van sobre las palabras que respaldan, dentro de las pestañas 2 y 5.
Regla de DESIGN_RULES.md que aplica: §9 (un CTA de plantilla, por email).

## EditorialTemplate — FAQ en artículos, posición del CTA de plantilla, footer v3.1 (extensión)
Fecha: 2026-09-10
Decisión: el FAQ se renderiza también en la variante artículo, dentro de la
columna de lectura después del cuerpo, con su propia entrada al final del
índice ("Frequently asked questions", etiqueta estructural del molde). Así
cuerpo y FAQ comparten el marco de dos columnas con índice sticky y la página
pasa a una sola columna a ancho completo desde el bloque de relacionados.
El `EmailCapture` toma su heading de la página (`templateCtaHeading`: el copy
v3.1 escribe uno por página) y, en las seis guías, va antes de la última
sección del cuerpo (`templateCtaAt="before-last"`), que en todas es el límite
declarado: "después de explicar el problema y antes de la sección de cierre"
(§9). La tabla de precio de la cola de comparación ya no imprime su línea
fija de pre-v3.1 ni el enlace "See what is included": el párrafo de precio y
el CTA de producto aprobados ya lo dicen.
Política de imagen: sin cambio. El hueco de cabecera 21:9 lo impone el molde;
se llena solo si la página pasa `image` a `PageHeader`.
Regla de DESIGN_RULES.md que aplica: §9, §10, §11.
Se aparta de: el copy de la Tanda C lista el EmailCapture *después* del
límite declarado. Manda §9 (antes de la sección de cierre); reportado como
contradicción.

## SourcedPricingDisclosure — tres palabras de estado nuevas (extensión)
Fecha: 2026-09-10
Decisión: el vocabulario cerrado pasa de tres a seis: se agregan "Vendor
stated", "User reported" y "Different product". Las tres nuevas exigen
`note` con la procedencia; el componente sigue tirando error ante cualquier
otra palabra. La procedencia acepta enlaces inline (una fila puede citar la
página de producto y el perfil de Capterra a la vez).
Razón: el copy aprobado de las cuatro comparativas clasifica sus filas con
esas palabras. Un vendor describiendo su propio modelo no es "precio
publicado" ni "no publicado"; una reseña de Capterra tampoco.
Política de imagen: ninguna (sin prop de imagen, como antes).
Regla de DESIGN_RULES.md que aplica: §2 reglas 2 y 5. Contradicción
reportada: COPY_LIMITS.md dice "prints one of three fixed words"; el copy
usa cinco.

## StatedVsObserved — varias filas declaradas (extensión)
Fecha: 2026-09-10
Decisión: `stated` acepta un array de `{ text, source }`. Siguen siendo dos
filas (Stated / Observed); dentro de Stated, un párrafo por pagador con su
fuente en la misma línea.
Razón: el copy de `/insurance-credentialing-for-therapists` pone dos
ventanas publicadas (Optum, Evernorth) contra dos casos observados.
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 regla 2.

## EditorialTemplate — `DocumentChecklist` (componente nuevo)
Fecha: 2026-09-10
Decisión: la checklist de `/provider-credentialing-checklist` es un bloque
propio: regla gruesa arriba y abajo, filete entre filas y un cuadrado vacío
antes de cada ítem. Sin tarjeta (la columna editorial no lleva tarjetas),
sin número al lado del cuadrado (§6), sin `<input>`: es una lista HTML de
servidor. "Descargable" es la caja de email de la misma página, que manda la
lista como planilla; no hay descarga directa.
Razón: el SERP de la keyword tiene Image pack y el brief pide la checklist
como elemento visual, no como texto corrido. Ningún componente existente es
una lista de documentos con forma de instrumento.
Política de imagen: ninguna. Es una lista, no la foto de una.
Regla de DESIGN_RULES.md que aplica: §1, §6, §9.

## Las 10 páginas editoriales — cabecera sin fotografía; tarjetas de relacionados sin imagen
Fecha: 2026-09-10
Decisión: las 10 cabeceras quedan como el hueco declarado 21:9 del molde
(3:2 bajo 760px), vacías. Las tarjetas de relacionados quedan con su hueco
3:2 vacío. Se armó el registro `components/neo/pageImages.js` (cabecera,
recorte 3:2 para tarjeta y OG 1200×630 por ruta) y
`scripts/editorial-image.mjs` (convierte una foto a los tres archivos WebP/JPEG
bajo 200 KB), de modo que llenar un hueco es una entrada en el registro.
Razón: la key de Pexels entregada para la corrida es rechazada por la API —
toda búsqueda no cacheada devuelve 401 "Invalid API key"; las únicas
respuestas 200 eran aciertos de caché de Cloudflare de búsquedas ajenas. Sin
búsqueda propia por página no hay selección documental posible, y "si dudás
entre una foto y el hueco vacío, dejalo vacío". Las tarjetas que enlazan a
landings (`/pricing`, la plantilla, `/payer-enrollment-software`) quedan
vacías siempre: una landing no tiene cabecera fotográfica que recortar.
Regla de DESIGN_RULES.md que aplica: §5 (hueco con ratio declarado, vacío),
§10 (hueco 3:2 en tarjeta).

## /best-credentialing-software — la tabla sin H2, y dónde van las cifras de costo
Fecha: 2026-09-10
Decisión: `MultiVendorComparison` entra sin H2: el copy le da entrada en el
índice ("What the five products cost") pero no encabezado, así que la
sección es destino del índice sin título propio. La sección de rangos de
costo (que absorbe `credentialing software cost`) tiene H2 pero no entrada
en el índice, tal como la trae el copy. Sus cuatro cifras con fuente van
como lista de `SourcedFigure` antes del párrafo que las explica. El slot
"No verificado" de cada vendor se imprime detrás de la etiqueta estructural
"Not verified", del mismo tipo que "Stated / Observed".
Regla de DESIGN_RULES.md que aplica: §2 regla 2, §6 (una sola enumeración:
viñeta, sin número).

## /medtrainer-pricing · /symplr-pricing · /modio-health-pricing — reescritas sobre el copy v3.1
Fecha: 2026-09-10
Decisión: las tres pasan a la estructura validada del copy
(`SourcedPricingDisclosure` → `PurchaseModelCompare` → sección de para quién
sí es adecuado → cola fija), las tres con los dos componentes de
comparación. Queda superada la entrada del 2026-09-06 según la cual solo
`/symplr-pricing` usaba `SourcedPricingDisclosure`: ahora las tres lo usan,
porque el copy v3.1 de las tres está escrito en filas de afirmación.
La columna del competidor va primero en `PurchaseModelCompare`, como la
nombra el copy; ninguna columna se destaca.
Faltantes del copy y qué se hizo:
- Índice: el copy no da entradas para estas tres. Se usan sus H2 literales
  (para quién sí, precio) más la entrada del FAQ; la divulgación y la tabla
  de modelo de compra no tienen H2 en el copy y no reciben etiqueta
  inventada. Quedan con 3 entradas, bajo el rango 5-10 de COPY_LIMITS
  (que es de criterio, no de medida).
- Relacionados: el copy no trae tarjetas para 12-14. Se armaron con strings
  aprobados: las tarjetas que la página 3 ya escribe para `/pricing`, la
  plantilla y `/medtrainer-pricing`; y para `/best-credentialing-software` y
  `/symplr-pricing`, su `<title>` sin la marca y la primera oración de su
  standfirst o meta description. Destinos según la arquitectura §6
  (12-14 → 3 y 2).
- `/symplr-pricing` y `/modio-health-pricing` no traen heading para el
  `EmailCapture` ni labels para el CTA de producto: la caja usa el heading
  por defecto de `templateCta.js` y el CTA reusa el par aprobado de la
  página 12.
Regla de DESIGN_RULES.md que aplica: §9, §10, §11.

## Las seis guías — el enlace a /pricing con el anchor del copy
Fecha: 2026-09-10
Decisión: el copy de las seis guías pide un enlace a `/pricing` con el
anchor "the three published plans" "sin agregar prosa nueva", pero esa
frase no aparece en ninguno de los párrafos aprobados. Se pone como línea
propia al final de la sección de límite declarado ("The three published
plans", con mayúscula inicial por abrir línea). No se reescribió ningún
párrafo para meterla.
Regla de DESIGN_RULES.md que aplica: §9 (el enlace no es un CTA: no hay caja
ni botón), on-page-seo.md §6.

## /provider-credentialing-checklist — la lista como `DocumentChecklist`
Fecha: 2026-09-10
Decisión: los doce ítems van en `DocumentChecklist` (ver entrada del
componente). La fuente de la lista, Maryland Department of Health, va en una
línea propia debajo con la etiqueta "Source:", porque el copy la declara en
la nota `(f)` y no dentro de la lista.
Regla de DESIGN_RULES.md que aplica: §2 regla 2, §6.

## Las 15 páginas — fuentes con dominio y sin documento
Fecha: 2026-09-10
Decisión: doce fuentes que el copy nombra solo por dominio (BehaveHealth,
Evernorth resource library, UMR, Optum San Diego, Carelon contacto, Maryland
Department of Health, BCBS Nebraska, Contracting Providers, RCMGen,
HireGaynell, DrCredentialing, MedSole "Expired") enlazan a la raíz de ese
dominio y quedan marcadas `pending: true` en `sources.js`. La cita es visible
y atribuible; el documento exacto es un cambio de una línea cuando exista la
URL. No se investigó para completarlas: SIGUIENTE_FASE.md prohíbe mezclar
ensamblado con investigación.
Regla de DESIGN_RULES.md que aplica: §2 regla 2.
