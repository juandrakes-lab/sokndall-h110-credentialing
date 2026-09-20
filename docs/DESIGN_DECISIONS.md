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

---

# Ronda de pulido: las 5 landings (2026-09-11)

Rama `design/landing-polish`. El estado anterior quedó marcado como tag
`pre-landing-polish` sobre `main`; volver es `git switch main`. Referencia
visual: la maqueta de NeoPay de la que se clonó la piel neo. El fundador
confirmó que la paleta tinta/ámbar es suya y se mantiene, y que las páginas no
se publican hasta que todo esté listo.

## Kit — tamaño del H2 de sección
Fecha: 2026-09-11
Decisión: `.sk-h2` baja de 40→65px a 36→54px. Mantiene el peso regular.
Razón: el H1 del hero es 72px en semibold; el H2 a 65px no se distinguía de él
salvo por el peso. La referencia hace hero fuerte y secciones livianas pero con
un salto de tamaño claro; 54px deja 1,33 de diferencia y una línea autoral de
21 caracteres ya no se parte en una cuarta.
Regla de DESIGN_RULES.md que aplica: §1 (valores en TOKENS). TOKENS.md §2
actualizado.

## Kit — cortes autorales del titular solo en escritorio
Fecha: 2026-09-11
Decisión: los `<br>` que escribe el copy llevan `.sk-br` y se apagan bajo 900px
(`Lines` en landingPrimitives).
Razón: a 390px dejaban palabras huérfanas ("one of them is / your / problem
right now"). En escritorio el corte sigue siendo del copy.
Regla de DESIGN_RULES.md que aplica: §7.

## Kit — acento de marca (`--accent`)
Fecha: 2026-09-11
Decisión: nuevo rol, no nuevo color: `--accent` = `--rule-dark` (#3d6a6b), el
tono medio de la familia tinta. Lo llevan en superficie clara los íconos, los
puntos de lista, la cifra grande (`.sk-stat`) y la regla junto a la línea de
cierre de una sección.
Razón: la referencia vive de su azul en dosis chicas en cada sección; la
paleta aprobada no tenía un tono medio en uso sobre blanco y todo lo que no es
ámbar se leía negro. 6,0:1 sobre blanco; nunca texto de cuerpo.
Regla de DESIGN_RULES.md que aplica: §2 regla 4 (el ámbar no cambia de rol).

## Kit — `ScreenSlot` (componente nuevo)
Fecha: 2026-09-11
Decisión: marco cerrado para una pantalla de producto: barra con "Screen" + qué
pantalla + ratio; adentro el esquema (con nota obligatoria) o nada (rayado,
con ratio fijo). Sin cromo de ventana. Los tres huecos originales de la home
toman el mismo rayado y una etiqueta de qué pantalla va:
"one credential record and its expiry alerts" (sección 2), "one enrollment
application and its follow-up log" (quad, ancho) y "the Monday digest email"
(quad, esquina). Etiquetas propuestas; las ajusta el fundador.
Razón: pedido del fundador: los huecos son para visuales del producto, y los
esquemas son huecos cerrados que se llenan después. Discrepancia planteada y
aceptada: el esquema no se vacía, queda adentro del marco hasta que exista la
captura, porque hoy es lo único que explica el producto.
Política de imagen: solo pantallas de producto. Nunca stock, nunca personas.
Regla de DESIGN_RULES.md que aplica: §5 (reescrita), §16 (nueva).

## Kit — `Indicator` (componente nuevo)
Fecha: 2026-09-11
Decisión: tarjetita con ícono en acento + valor + qué cuenta. Los "chips" de la
referencia, con una diferencia innegociable: cada valor es un hecho del
producto o una cifra con fuente del copy aprobado, nunca una métrica inventada.
Política de imagen: ninguna (ícono sólido, sin caja, §5).
Regla de DESIGN_RULES.md que aplica: §2 reglas 1-2.

## Kit — `ProseBandSection` reconstruida, `IconRowSection split`, `CardGridSection`, FAQ `split`
Fecha: 2026-09-11
Decisión: la sección de prosa usa todo el ancho: *split* (titular a la
izquierda, texto a la derecha) por defecto, *media* con un `ScreenSlot` al lado.
La nota (respuesta directa, on-page-seo §5) abre la columna a tamaño `lead`; nota,
párrafos y cierre comparten una sola medida, y el cierre lleva la regla de
acento. `IconRowSection layout="split"` pone la lista al lado del titular.
`CardGridSection` (nueva) pone 2-4 ítems de largo parecido en fila.
`PanelSection split` pone el FAQ al lado de su titular.
Razón: mitad derecha vacía en 9 secciones de las 5 landings; la nota era el
texto más chico de la sección y había tres anchos de línea apilados.
Regla de DESIGN_RULES.md que aplica: §14 (nueva), §4, §6.

## Kit — tarjeta al lado de la matriz con altura natural
Fecha: 2026-09-11
Decisión: `DiagramSection` deja de usar `.sk-bento--eq`; las dos tarjetas bajo
la matriz tienen su altura natural.
Razón: el emparejado de alturas se derogó el 6 sep y el CSS lo seguía
aplicando: la tarjeta "Where the sheet gives out" dejaba su cuerpo flotando en
el medio.
Regla de DESIGN_RULES.md que aplica: §4.

## Kit — matriz a 3 pagadores en el teléfono; tabla de estados apilada
Fecha: 2026-09-11
Decisión: bajo 640px la matriz muestra las tres primeras columnas enteras en
vez de cinco cortadas por un scroll sin señal; la tabla de estados pasa a una
tarjeta por estado con los dos campos rotulados.
Razón: a 390px se veían 2 de 5 pagadores y la columna "What to do" quedaba
fuera de pantalla.
Regla de DESIGN_RULES.md que aplica: §2 regla 3 (glifo + etiqueta intactos).

## Kit — la cifra propia en la banda de anclas
Fecha: 2026-09-11
Decisión: la figura de Sokndall (`ours`) es la única tarjeta blanca en la banda
oscura. `layout="side"` pone el titular a la izquierda y las figuras apiladas a
la derecha cuando el copy no trae párrafo lateral.
Razón: las tres cifras se veían iguales; la jerarquía blanco/gris de §3 marca
cuál es la nuestra sin insignia ni adjetivo.
Regla de DESIGN_RULES.md que aplica: §3, §2 regla 2.

## / — íconos del quad
Fecha: 2026-09-11
Decisión: la tarjeta ancha lleva ícono en la esquina, como las chicas; la alta
lo conserva arriba del título.
Razón: tal cual la referencia. En la esquina, el ícono partía el título de la
columna angosta en dos líneas (probado y revertido).
Regla de DESIGN_RULES.md que aplica: §6.

## Pastillas escritas por el diseño — pendientes de revisión del copy
Fecha: 2026-09-11
Decisión: el copy aprobado solo trae la pastilla de la sección 2 de la home.
Las demás se escribieron como etiquetas estructurales de 1-3 palabras:
home — "What it tracks", "The matrix", "Cost anchors", "Pricing", "Scope", "FAQ".
(Las de las otras cuatro páginas se listan en sus propias entradas.)
Regla de DESIGN_RULES.md que aplica: §13.

## / — hero restaurado al panel de la referencia (`HeroPanel variant="panel"`)
Fecha: 2026-09-11
Decisión: el hero de la home vuelve a ser el bloque firma de la referencia:
panel de tinta con márgenes y esquinas redondeadas, muesca blanca en la esquina
superior izquierda con la marca, nav sobre la tinta al lado, textura de líneas
al 7,5% de blanco, y lengüeta centrada bajo el borde inferior. La matriz entra
en un `ScreenSlot` 4:3 y dos `Indicator` flotan sobre sus bordes:
"90 · 60 · 30 · 14 · 7 — days before an expiry, an alert goes out" y
"30 days — with no contact flags an application". Los valores son hechos del
copy aprobado (pie de la sección 3 y FAQ Q4 de la home; FAQ Q4 de
/payer-enrollment-software); las etiquetas son microcopy de maquetado,
pendiente de revisión.
Razón: el hero de la home se había aplanado a un rectángulo a sangre; el
fundador pidió volver a la referencia. Los empalmes de la muesca y la lengüeta
son radiales de corte duro usados como forma (un cuarto de disco del color de
la página), no degradados.
Regla de DESIGN_RULES.md que aplica: §2 regla 1 (el esquema lleva su nota), §3
(el hero es la excepción a sangre; ahora es un bloque con margen, como las
bandas oscuras).

## Titulares — `text-wrap: balance`
Fecha: 2026-09-11
Decisión: `.sk-display` y `.sk-h2` equilibran sus líneas. El copy sigue
decidiendo dónde corta (en escritorio); el navegador reparte lo que envuelve
entre corte y corte.
Razón: a 1280 con barra de scroll, "tells you what went / quiet" dejaba la
última palabra sola. Se midió: la línea 1 ("Credentialing that") necesita
567px; la columna de copy del hero pasa a 1,15fr (593px).
Regla de DESIGN_RULES.md que aplica: §7.

## /pricing — recompuesta
Fecha: 2026-09-11
Decisión: encabezado claro (`HeroPanel variant="light"`) con la lista de
precios como su objeto: el primer H2 (la keyword exacta) va dentro del
encabezado, a tamaño de título de tarjeta (`.sk-h3`) como rótulo de la lista, y
la primera fila de precio queda arriba del pliegue en 1280×720. La sección
proveedor/usuario pasa a *media* con `CountDiagram` (componente nuevo en
`Schematics.jsx`): 3 personas contra 40 registros, el ejemplo del propio copy
("a three-person front office managing forty clinicians"). Anclas en la banda
oscura, 2×2, con la cifra propia en blanco. Términos del trial como
`CardGridSection` (tres ítems de largo parecido, §4) con íconos calendario,
tarjeta y círculo tachado. FAQ a dos columnas.
Pastillas escritas por el diseño, pendientes de revisión del copy: "Pricing"
(encabezado), "Provider vs. user", "Cost anchors", "The trial", "FAQ".
Razón: el primer precio aparecía a y≈880 en una página de precios; la sección
proveedor/usuario tenía cuatro líneas de titular y la mitad derecha vacía.
Política de imagen de `CountDiagram`: ninguna; marcas dibujadas, íconos
sólidos sin caja.
Regla de DESIGN_RULES.md que aplica: §14, §15, on-page-seo.md §4.

## /payer-enrollment-software — recompuesta
Fecha: 2026-09-11
Decisión: encabezado claro con el recorrido de estados de una solicitud como
objeto (`StatusTrack` en un `ScreenSlot`): los cinco estados en orden con los
mismos glifos de la tabla, "Info requested" en ámbar con la pista de la tabla
("The payer is waiting on you"), remate "Effective date, confirmed in writing"
y la salida "Denied or withdrawn" debajo. No es la matriz de la home: esa queda
para su propia sección. Secuencia: dos pasos (*split*) → la espera (banda
oscura, con "90–120" grande y sus dos fuentes en el pie) → estados (tabla) →
fecha efectiva (*media* invertida, `ScreenSlot` vacío "One application's
confirmed effective date") → desajustes (*stack*) → matriz (banda oscura) → qué
no hace (tres tarjetas, §4) → FAQ → cierre. Nunca más de tres blancas seguidas.
La matriz pasa a 6 celdas de acción (3 info + 3 sin contacto): el copy dice
"the six" dos veces y la grilla mostraba tres. Queda superada la entrada del
2026-09-10 que la dejaba en tres para diferenciarla de la home; la densidad
(6 × 5 contra 5 × 5) ya la diferencia.
Pastillas escritas por el diseño, pendientes de revisión del copy: "Payer
enrollment software" (encabezado), "Two steps", "The wait", "Statuses",
"Effective date", "Data mismatches", "The matrix", "Scope", "FAQ". También la
nota del esquema de estados, calcada de la nota aprobada de la matriz.
Razón: ocho secciones blancas seguidas, cuatro con la mitad derecha vacía, y la
matriz contradiciendo al copy que la describe.
Regla de DESIGN_RULES.md que aplica: §14, §15, §16, §2 reglas 1-4.

## Kit — títulos de tarjeta clara sobre banda oscura
Fecha: 2026-09-11
Decisión: contra-regla para `.sk-h3`/`.sk-h4` dentro de una tarjeta clara en
`.sk-band--ink`.
Razón: la trampa que CLAUDE.md ya documenta, reaparecida al pasar la matriz a
banda oscura: el título de la tarjeta lateral salía blanco sobre blanco.
Regla de DESIGN_RULES.md que aplica: §8.

## /for-billing-companies — recompuesta
Fecha: 2026-09-11
Decisión: encabezado claro con la estructura de clientes como objeto
(`ClientStructure` en un `ScreenSlot`): un login, seis organizaciones con datos
aislados, el coordinador asignado a dos clientes y no a los otros cuatro, y la
vista agregada al pie. Seis porque el H1 dice seis; sin conteos, porque el copy
no los da. Secuencia: problema (*split*) → estructura (filas con íconos:
candado, cambio, personas, grilla, correo) → reporte (*media*, `ScreenSlot`
vacío "Per-client report: dates, statuses, last follow-up") → anclas (banda
oscura, `layout="side"`: el copy no trae párrafo lateral, así que el titular
queda a la izquierda y las tres cifras apiladas a la derecha, la propia en
blanco) → arquitectura (*split*) → FAQ → cierre.
Pastillas y microcopy del esquema escritos por el diseño, pendientes de revisión
del copy: "For billing companies" (encabezado), "The problem", "Structure",
"Client reporting", "Cost anchors", "Billing Co plan", "FAQ"; en el esquema,
"One login", "Isolated data", "Coordinator 1 · two clients", "Coordinator 2 ·
the other four" y la línea de la vista agregada.
Razón: una página que vende una estructura no mostraba ninguna; tres secciones
con la mitad derecha vacía y un H2 de tres líneas sobre 38 palabras.
Regla de DESIGN_RULES.md que aplica: §14, §15, §16, §2 regla 1.

## /credentialing-spreadsheet-template — recompuesta
Fecha: 2026-09-11
Decisión: encabezado claro partido: copy a la izquierda, la caja de email a la
derecha (el brief pide la plantilla arriba del pliegue; centrada, la caja caía
a y≈740 en 1280×720), y debajo, a todo el ancho, un `ScreenSlot` 21:9 vacío
para una captura real del archivo ("The template, Dashboard tab", con la línea
"Reserved for a capture of the file"). Es el único visual del sitio que puede
ser una captura hoy: no simula el producto, es la cosa que se regala. Pestañas
en *stack* con íconos; límites en filas con íconos; "cuándo alcanza" en banda
oscura (*split*) por el ritmo; FAQ a dos columnas. La caja recupera su heading
por defecto ("Get the free credentialing template") porque ya no tiene al lado
un bloque que diga qué es.
Pastillas escritas por el diseño, pendientes de revisión del copy: "Free
template" (encabezado), "Inside the file", "Limits", "When to switch", "FAQ".
Pendiente del fundador: si el archivo de seis pestañas existe, su captura va en
ese hueco.
Regla de DESIGN_RULES.md que aplica: §9 (un solo CTA de plantilla, por email),
§14, §15, §16.

## Kit — la línea de cierre lleva la regla de acento en todas las secciones
Fecha: 2026-09-11
Decisión: `.sk-closing` y `.sk-scope__closing` toman la misma regla de acento
a la izquierda que el cierre de la prosa.
Razón: la línea que resume una sección era texto suelto en unas y tenía regla
en otras; ahora es un solo elemento en todo el kit, y es una de las dosis de
color de marca por sección.
Regla de DESIGN_RULES.md que aplica: §13 (espíritu: marca en cada sección).

## Verificación de la ronda — móvil y build
Fecha: 2026-09-11
Decisión: dos correcciones salidas de revisar a 390/768: (1) el reparto de
columnas del hero de la home (1,15fr / 0,85fr) le ganaba en especificidad a la
regla de una columna del móvil y dejaba el hero partido a 390 — se reafirma la
columna única bajo 900px; (2) en el encabezado partido de la plantilla, en el
teléfono la caja de email pasa antes que los chips, para que quede en la
primera pantalla. `next build` (en un worktree aparte, para no pisar el `.next`
del dev server) da las cinco landings como ○ (Static); los greps de §0 dan 0 en
las cinco `page.jsx`.
Regla de DESIGN_RULES.md que aplica: §0, §9.

---

# Ronda 2 de pulido (2026-09-11, tarde)

El fundador aprobó las cinco propuestas: dos variantes del hero de la home para
elegir, degradados de un tono (§17), mostaza como elemento uno por sección
(§18), barra en azul petróleo (la tinta) y bloques gris claro redondeados como
tercera superficie. Fotos de stock habilitadas vía Pexels (§19).

## Paso A — sistema
Fecha: 2026-09-11
Decisión:
- Margen de los bloques oscuros al borde de pantalla a la mitad
  (`--page-x` 8→22px). `--light-x` queda fijo y `--pad-x` absorbe la
  diferencia, así los textos no se mueven: los bloques se ensanchan.
- Una sola sombra para toda tarjeta clara, blanca o gris, con borde visible
  (1px al 7,5%). Antes la blanca se iluminaba desde arriba y casi no tenía
  sombra arriba, y la gris era pareja: la misma tarjeta cambiaba de relieve
  según el color.
- Pastilla en `--ink-2`: el mismo verde que los paneles, un paso más claro,
  porque a tamaño chico #0e2a2e se leía más oscuro que los paneles grandes.
  Sobre fondo oscuro, pastilla de vidrio (blanco al 10% con filete).
- Botones en pastilla con degradado de ámbar de un solo tono y la flecha en un
  disco de tinta, dibujado por CSS para que lo tomen todos los botones del sitio
  (incluidos los de las páginas editoriales). El secundario pasa a link
  subrayado con flecha.
- Barra flotante (`FloatingNav`, componente cliente nuevo): píldora de tinta
  con brillo en una esquina, fija al hacer scroll. En la home aparece recién al
  pasar el hero; en las páginas de encabezado claro, desde el principio.
Razón: pedidos del fundador en la ronda 2; la referencia.
Regla de DESIGN_RULES.md que aplica: §7 (cuarto componente cliente), §17.

## Paso B — superficies oscuras
Fecha: 2026-09-11
Decisión:
- Una familia de texturas para lo oscuro, blanco al 7-10%: el hero conserva sus
  ondas; las tarjetas de cifras llevan anillos punteados (eco de la escalera de
  alertas), la de la matriz una grilla de puntos, las demás curvas de nivel. Más
  un brillo suave de verde medio en una esquina (§17).
- Las secciones oscuras dejan de ser una caja de canto a canto con contenido
  adentro: pasan a un bento con una tarjeta oscura (`InkTile`) al lado de
  tarjetas claras, como el hero y "Your money, locked down" de VELD.
  `FigureBandSection`: la oscura con pastilla, titular, aparte y el cierre al
  pie; al lado las cifras en tarjetas blancas, la propia en mostaza (§18, única
  por sección). `ProseBandSection surface="ink"`: la oscura con titular y cifra,
  el texto en una tarjeta blanca. `DiagramSection layout="bento"`: la oscura con
  titular, puntos y el aparte en vidrio, al lado de la matriz (compacta) y su
  leyenda. El cierre (`CtaSection`) sigue siendo un bloque entero, ahora con
  textura.
- Hero de la home en tres variantes para elegir, en `/styleguide/hero`
  (noindex): A las líneas de hoy; B la foto detrás del panel bajo un velo de
  petróleo al 86-94% y desaturada (en lugar de las líneas: foto y líneas en la
  misma superficie compiten); C el panel al lado de una tarjeta con foto y los
  dos indicadores encima (la matriz sobre la foto tapaba a la persona y no
  entraba; tiene su propia sección más abajo). La home sigue en A hasta que el
  fundador elija.
Razón: pedidos 2-4 de la ronda 2. "The matrix" en /payer-enrollment-software
era el caso más vacío del sitio.
Regla de DESIGN_RULES.md que aplica: §3 y §15 (enmendadas), §17, §18.

## Paso C — secciones planas y fotos
Fecha: 2026-09-11
Decisión:
- `CardGridSection layout="bento"` con patrones fijos por cantidad (3: oscura
  alta a la izquierda o, si es la última, tres pasos en fila; 4: oscura alta y
  una ancha; 5: oscura ancha arriba) y un `fact` grande por tarjeta cuando el
  copy lo da. Se usa en: "What Sokndall does not do" (home, bloque gris), los
  pasos del trial (/pricing, "Step 01-03" con "14 days", "Day 15",
  "Self-serve", bloque gris; sin íconos por §6), "What it does not do"
  (/payer-enrollment-software), la estructura (/for-billing-companies, bloque
  gris) y los límites (plantilla, bloque gris).
- `StageCompare` (nuevo, Schematics.jsx): las dos etapas de "two steps" con qué
  son y en qué se traban, textos del propio copy.
- `PlanCard` (nuevo): la tarjeta del plan Billing Co al lado de "A different
  architecture", el mostaza de esa sección; su botón pasa a tinta sobre el
  mostaza.
- `FactStrip` (nuevo): fila de cuatro cifras bajo el hero de la home, todas
  hechos del copy ("$79", "14 days", "1–50", "0" registros de pacientes).
- La última línea autoral de cada H2 va en el tono medio de la marca (`.sk-em`);
  sobre oscuro, un verde claro de la misma familia. Los H1 no.
- Líneas tenues de tinta al 6% arriba de los encabezados claros.
- Fotos de Pexels (vía `lib/pexels.js`, del lado del servidor) en los dos huecos
  de imagen de la home: la sección 2 ("px-binders-desk", Anna Tarazevich) y la
  tarjeta ancha del quad ("px-phone-desk", Karolina Grabowska); más las del
  hero B ("px-forms-hands", Mahyub Hamida) y C ("px-followup-call", Andrea
  Piacquadio). Todas WebP < 200 KB en public/landing/, crédito visible sobre la
  foto. El hueco "Monday digest email" sigue siendo pantalla de producto.
- Pastillas y microcopy nuevos pendientes de revisión del copy: los facts del
  trial y de la fila de la home, y "Stage 01/02" / "Stalls on".
Razón: pedido 5 de la ronda 2 (secciones planas) y la instrucción de llenar
los huecos de imagen con Pexels.
Regla de DESIGN_RULES.md que aplica: §4, §6, §18, §19.

---

# Ronda 3 (2026-09-12)

## Hero de la home — se queda con las líneas, provisional
Fecha: 2026-09-12
Decisión: descartada la variante C (panel al lado de una tarjeta con foto; se
borraron su código y su foto). Entre A (líneas) y B (foto detrás del panel) el
fundador se queda con A de forma provisional: la foto de B no convence y el
esquema del producto todavía no es definitivo. B sigue en `/styleguide/hero`.
Las demás fotos de Pexels quedan provisionales hasta tener las definitivas
(mejores fotos o generadas con IA).
Regla de DESIGN_RULES.md que aplica: §19.

## Amarillo más claro; bordes de estado en ocre; foco en petróleo
Fecha: 2026-09-12
Decisión: `--amber` pasa de #C88A2E a #F2C14E. `--amber-line` (#B38314)
dibuja los bordes de los estados de acción, que un amarillo claro no podría
marcar sobre blanco; el anillo de foco sobre claro pasa a petróleo.
Razón: el fundador encontraba el mostaza apagado; el texto sobre él quedaba en
5,1:1, ahora 12,5:1.
Regla de DESIGN_RULES.md que aplica: §2 regla 4 (reescrita), §18.

## Botones planos; barra flotante blanca
Fecha: 2026-09-12
Decisión: el botón deja la luz simulada (degradado, filos, brillo propio) y el
disco de tinta: superficie plana amarilla, flecha directa sobre ella, sombra
neutra. La barra flotante pasa a blanca, como en VELD, con una sombra que la
separa de la página y nada más.
Razón: pedido del fundador ("superficie lisa y moderna").
Regla de DESIGN_RULES.md que aplica: §17 (enmendada).

## Planes: destacado en petróleo, viñetas con tilde, tarjeta de Billing Co
Fecha: 2026-09-12
Decisión: el plan destacado lleva borde y etiqueta en petróleo; el botón sigue
amarillo en todos. Las listas de un plan usan un disco petróleo con tilde
blanca. La tarjeta de Billing Co en /for-billing-companies deja el relleno
amarillo de la ronda 2 (error de criterio: un plan tiene que verse igual donde
aparezca) y toma el estilo de /pricing, con borde petróleo y la etiqueta
"The plan built for billing companies" (microcopy nuevo, pendiente de revisión
del copy; no es la etiqueta fija del plan del medio, §2 regla 8).
Regla de DESIGN_RULES.md que aplica: §2 reglas 4 y 8, §18, §20 (nueva).

## Íconos y viñetas en el color principal
Fecha: 2026-09-12
Decisión: íconos y puntos de lista pasan de `--accent` a `--ink`. El tono medio
queda en la línea de marca de los H2 y en las cifras grandes.
Razón: el fundador preguntó por qué eran más claros que el color principal; no
había una buena razón.
Regla de DESIGN_RULES.md que aplica: §20.

## Banda de cifras: el rango grande, el cierre bajo las cifras
Fecha: 2026-09-12
Decisión: cada etiqueta de cifra se compone en dos niveles tipográficos: el
rango en dólares grande y la unidad debajo. Mismas palabras, mismo orden (la
entrada del 2026-09-10 prohibía partir la frase en dos piezas de copy; esto es
solo tamaño). La línea de cierre sale de la tarjeta oscura y va como leyenda
bajo las cifras; el aparte de la oscura baja un paso y se ancla abajo. Nuestra
cifra, cuando ocupa la fila entera, va en horizontal.
Razón: en pantallas grandes las tarjetas de cifras tenían el centro vacío,
estiradas por una tarjeta oscura demasiado alta (medido: 603 px de oscura
contra 166 px de contenido por tarjeta).
Regla de DESIGN_RULES.md que aplica: §4.

## / — "What it tracks" en tres tarjetas (`LayersSection`, nuevo)
Fecha: 2026-09-12
Decisión: el H2 aprobado dice "Three things" y el copy trae cuatro tarjetas.
Las tres cosas rastreadas son las solicitudes, las credenciales y el
seguimiento del lunes; "One row per state" es una propiedad de las
credenciales. Tres tarjetas, cada una con su visual al pie (foto en
solicitudes, el hueco del correo del lunes en seguimiento) y "One row per
state" dentro de credenciales como detalle. Ningún texto cambió.
Para el copywriter: confirmar esta lectura, o decidir si el H2 debería decir
otra cosa.
Regla de DESIGN_RULES.md que aplica: §4, §5.

## Foto de "Built for the small practice" y cabezas fijas
Fecha: 2026-09-12
Decisión: una foto que llena una celda va en posición absoluta y nunca fija la
altura de la fila (la cuadrada hacía la fila tan alta como ancha y estiraba las
tres tarjetas vecinas). La cabeza de la lista de pestañas de la plantilla queda
fija al hacer scroll, como la del FAQ, y ambas despejan la barra flotante.
Regla de DESIGN_RULES.md que aplica: §4, §14.

## Bloques de oferta con sombra propia; botón del pie en negro
Fecha: 2026-09-12
Decisión: todo bloque que vende un plan (filas de precio en / y /pricing, la
tarjeta de /for-billing-companies) toma `--sh-offer`, un escalón de relieve
sobre el de una tarjeta de contenido. El botón de prueba del pie recupera el
texto negro: la regla de links blancos del footer le ganaba en especificidad.
Razón: bajo el borde petróleo, la sombra común de tarjeta casi no se veía.
Regla de DESIGN_RULES.md que aplica: §3 (profundidad como jerarquía), §2 regla 4.

## /pricing — `PlanFeatureMatrix` (componente nuevo) y la línea de seguridad
Fecha: 2026-09-12
Decisión: el encargo de copy del 2026-09-09 entra en /pricing como una sección
nueva entre la lista de precios (dentro del encabezado) y la sección
proveedor/usuario: la tabla muestra, esa sección explica. Va sobre bloque gris
para que la tabla se lea como un objeto propio después de la lista blanca. La
línea de seguridad va debajo, como línea de cierre con la regla de acento.
- Filas 5 y 6 consolidadas en "Aggregate and scoped client views", como
  recomendó el copywriter: el caption ("the only two rows…") queda cierto tal
  como está escrito.
- La fila "Document storage" no entra: sus cifras están [PEND] y no hay ningún
  límite de almacenamiento en la configuración del producto; el encargo dice
  que sin cifras la fila no sale.
- Proveedores y usuarios no se escriben en el copy de la página: salen de
  `PLAN_PRICES` (schema.jsx), que ganó el campo `users`, así la tabla, la lista
  y el schema `Offer` leen el mismo dato.
- Las celdas de estado imprimen glifo y texto ("✓ Included", "– Not
  included"); el componente tira error ante un booleano suelto. Glifos en
  petróleo, nunca amarillo; sin números de fila. La columna Practice lleva la
  regla petróleo del plan destacado.
- En la línea de seguridad no va sello, escudo ni badge: implicaría una
  acreditación inexistente (§2 regla 6). Sigue pendiente de la misma revisión
  legal que el ítem 3 de la sección 7 de la home.
- Pastilla "Plan comparison": etiqueta estructural escrita por diseño,
  pendiente de revisión del copy.
- Sin cambios: precios, costo por proveedor, etiqueta del plan del medio, H1 de
  premisa, keyword en el primer H2 (verificado en el HTML: la matriz es el
  segundo H2), un solo H1.
Política de imagen: ninguna. Sin hueco reservado, sin ícono decorativo.
Regla de DESIGN_RULES.md que aplica: §1, §2 reglas 3, 4, 6 y 7, §6, §13.

## /pricing — la matriz de planes, bajo los planes y solo con símbolo
Fecha: 2026-09-12
Decisión: a pedido del fundador, sobre su referencia, `PlanFeatureMatrix` deja
de ser una sección propia y va dentro del encabezado de /pricing, debajo de la
lista de precios y su nota (modo `embedded`: sin banda, sin pastilla, H2 a
tamaño de título de card como el de la lista). La tabla lleva la fila de
encabezados en petróleo con los nombres de plan en blanco y centrados; las
celdas de los planes centradas.
- Celdas de estado solo con símbolo: ✓ blanco en disco petróleo (Included) y
  × en círculo gris (Not included). La palabra queda como texto para lectores
  de pantalla (`.sk-sr`, clase nueva). Requirió enmendar §2 regla 3 para
  celdas binarias; los estados de seguimiento no cambian.
- El tick en petróleo, no amarillo (decisión del fundador): significa lo mismo
  que los ticks de la lista de planes, y el amarillo sigue siendo la acción.
- Las etiquetas de fila quedan alineadas a la izquierda aunque el pedido decía
  "filas centradas": se leen de arriba abajo como lista y centradas pierden el
  borde de lectura. Centrarlas es una línea de CSS si el fundador lo prefiere.
- El plan destacado (Practice): encabezado en un petróleo más claro
  (`--ink-2`) y su columna con tinte suave, en vez de la regla superior.
- La pastilla "Plan comparison" ya no se muestra (el modo embebido no lleva
  pastilla); queda en `data.js` por si la tabla vuelve a ser sección.
- Al salir el bloque gris de la matriz, /pricing queda: encabezado claro →
  proveedor/usuario (blanco) → anclas (oscuro) → trial (gris) → FAQ → CTA.
  §15 se cumple.
- Nota para el copywriter: las celdas "Included" / "Not included" siguen
  escritas así en `data.js` y se leen en voz alta, pero no se ven. El H2 se
  imprime en una línea (el corte autoral de dos líneas se une). COPY_LIMITS
  re-medido.
- Sin cambios: precios, schema, un solo H1, keyword en el primer H2 (la
  matriz sigue siendo el segundo H2).
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 reglas 3 (enmendada) y 4, §6, §13, §15, §18.

## /pricing — selector por tax ID, anclas en dos grupos (encargo de copy 2026-09-09)
Fecha: 2026-09-14
Decisión: entra el encargo "selector por entidad + anclas de costo
reestructuradas" completo, con dos componentes nuevos o ampliados.
- `EntityChooser` (nuevo): la pregunta del tax ID va dentro del encabezado,
  debajo del H2 de la keyword y antes de la lista de precios, como H3 (las
  opciones como H4). Verificado en el HTML: la keyword sigue siendo el primer
  H2, un solo H1, sin saltos de jerarquía. Panel gris suave: pregunta y lead a
  la izquierda, las dos respuestas como cards blancas a la derecha, el
  closing al pie con la regla de acento. Estático, no es un toggle: no hay
  nada que filtrar. Sin amarillo, sin numeración, sin ícono.
- Descripción de Billing Co reemplazada. El enlace a /for-billing-companies
  queda solo sobre "billing companies": esa página está escrita para ellas y
  no para un grupo multi-TIN (el pendiente que el mismo encargo declara).
- Nota de precio reemplazada (sale el enlace a las anclas, entra el usuario
  adicional a $39).
- Matriz: "Separate tax IDs" (One / One / Several) como primera fila, y
  "Additional users" (Not available / … / $39 a month each) después de "Users
  included". Las celdas de palabra se imprimen enteras a tamaño de cuerpo; las
  cantidades siguen grandes. Siete filas: el techo de COPY_LIMITS.
- Caption de la matriz retirado (decisión del fundador): con las filas nuevas
  deja de ser cierto ("the only two rows…", ahora son cuatro). Vuelve cuando
  copy lo reescriba; el texto aprobado queda comentado en `data.js`.
- Anclas (`FigureBandSection groups`, modo nuevo; el modo de una fila no
  cambia en la home ni en /for-billing-companies): el tile oscuro va arriba a
  todo el ancho, H2 a la izquierda y aside a la derecha; debajo, los dos grupos
  como paneles grises separados, cada uno con su H3, sus dos cifras apiladas y
  su closing. Así las cuatro cifras no se leen como una sola escala. La cifra
  propia sigue siendo el único amarillo de la sección.
- Para el copywriter / producto:
  - El usuario adicional a $39 no existe en `lib/plans.js` ni en Polar. La
    página lo promete antes de que el checkout lo cobre, igual que la
    discrepancia de precios ya conocida.
  - La FAQ "Do you charge per provider or per user?" dice "Users are included
    rather than billed". Con el usuario adicional pago eso queda a medias.
  - El pendiente del encargo sigue abierto: ninguna página le explica al
    grupo multi-TIN qué compra.
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 reglas 2, 3 y 4, §6, §13, §14, §18.

## /pricing — la zona antes de los planes, sin cajas dentro de cajas
Fecha: 2026-09-14
Decisión: a pedido del fundador ("cuadros dentro de un cuadro gris", ruido
antes de los planes), rediseño de la zona entre el subtítulo del hero y la
lista de precios, y de las anclas de costo.
- El H2 "Credentialing software pricing: three plans, published" NO sale: es
  el primer H2 con la keyword exacta (on-page-seo.md §4, y el encargo del
  2026-09-09 lo exige). El fundador pidió sacarlo por redundante con el H1 y
  el subtítulo; se discutió y se acordó mantenerlo como H2 pero con aspecto de
  etiqueta: 15px, seminegrita, centrado entre dos filetes. Sigue siendo el
  primer H2 (verificado en el DOM).
- `EntityChooser` plano: sin panel gris ni cards. Tres columnas: la pregunta
  (H3 + lead) y las dos respuestas, cada una detrás de una regla petróleo; el
  closing en letra chica debajo de las respuestas. De 304px a 161px de alto a
  1280.
- Anclas en grupos: sin paneles grises ni una card por cifra. Cada grupo es
  una columna abierta con regla petróleo arriba, título, cifras como filas
  separadas por filetes y el closing al pie; la cifra propia sigue siendo el
  único bloque lleno, en amarillo (§18). El canal ancho entre columnas marca
  que no se comparan.
- Copy: celda 0.3 de la matriz "Several" → "No limit" (corrección del
  copywriter, 2026-09-14).
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 regla 4, §6, §14, §18; on-page-seo.md §4.

## /pricing — anclas en tres bloques, selector como el FAQ, intervalos con guión
Fecha: 2026-09-14
Decisión: el rediseño plano anterior se descarta (el fundador: sin jerarquía
clara, texto desordenado, fuera del estilo de la página). Se vuelve al
lenguaje de cards del kit.
- Anclas: tile oscuro arriba a todo el ancho, y debajo tres bloques. A la
  izquierda, a doble alto, "Paying someone to do the work" con sus dos cifras
  (separadas por un filete) y su closing. A la derecha, "Paying for
  software" con la cifra de MedTrainer, y debajo el bloque amarillo con la
  cifra propia. El closing del grupo 2 va dentro del amarillo, porque habla de
  esa cifra ("this sits at the bottom of the same range"). Es el layout que
  propuso el fundador. El tile no va a la izquierda como en la home: dos
  columnas de bloques en ~620px romperían las cifras grandes.
- Jerarquía dentro de cada bloque, en este orden:
  1. La cifra (la misma de la home y billing).
  2. El título del grupo, en el color de acento de la segunda línea de los
     H2, a tamaño de título de card y seminegrita.
  3. La unidad, en negrita chica.
  4. La nota con su fuente.
- Selector: el layout del FAQ. A la izquierda la pastilla, la pregunta como
  encabezado y el lead; a la derecha las dos respuestas como row cards
  (respuesta a la izquierda, qué significa a la derecha) y el closing debajo.
  Cambio de copy por decisión del fundador, sin palabras nuevas:
  - La pregunta del lead pasa a ser el H3.
  - La pastilla es "Start with one question".
  - Se cae ", not with provider count".
  - El resto del lead queda debajo de la pregunta.
  Pendiente de revisión del copywriter.
- Intervalos: en cifras de display se dibujan con guión en lugar de "to"
  (§21 nueva). `RangeText` lo resuelve en las cifras de FigureBandSection y en
  los chips del hero, así que la home, billing, pricing y el chip de
  payer-enrollment cambian juntos. El copy no se toca, y "to" queda para
  lectores de pantalla. La prosa sigue con "to".
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §13, §14, §18, §21 (nueva).

## /pricing — el selector como sección; títulos de grupo más chicos; encargo de copy
Fecha: 2026-09-14
Decisión:
- `EntityChooser` se arma con las reglas de sección (pedido del fundador): la
  distribución split de `ProseBandSection`.
  - La pastilla va en su propia fila.
  - El encabezado va a tamaño de H2 de sección, con las líneas autorales
    "How many separate / tax IDs do you need / to keep apart?", la última en
    acento. Sigue siendo `<h3>` en el HTML, porque va debajo del H2 de la
    keyword.
  - El lead va debajo del encabezado.
  - A la derecha, a la altura del encabezado y no de la pastilla, las dos
    respuestas como cards chicas lado a lado, y el closing debajo de ambas.
  - Columnas 1fr/1fr como el split estándar. A 0.9fr la primera línea
    (456px) no entraba.
  - Margen de sección arriba y abajo dentro del encabezado. En móvil se apila
    igual que antes.
- Anclas: el título de cada grupo baja de 22px a 18px (acento, seminegrita).
  A 22px competía con la cifra.
- Encargo pendiente para el copywriter (el fundador prefirió pedirlo antes que
  usar un texto provisional): fusionar los dos closings de las anclas en una
  sola nota de cierre debajo de la sección, ≤216 caracteres. Pegados tal cual
  no sirven: "a fraction of these" pierde a qué cifras se refiere, y juntos
  suman ~350. Hasta que llegue, cada closing sigue en su bloque (el del grupo
  2 dentro del amarillo).
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §13, §14, §18.

## /pricing — respuesta de copy del 2026-09-14 (closing único, lead, FAQ Q4)
Fecha: 2026-09-14
Decisión: entra la respuesta de copywriting a la solicitud del mismo día.
- Anclas: los dos closings de grupo se borran y entra un solo closing de
  sección debajo de los tres bloques, con la línea de cierre estándar (regla de
  acento, sin ámbar). El bloque amarillo queda solo con su cifra. Los bloques
  quedan parejos: 387px a la izquierda, 387px a la derecha.
  - El copy pedía dos líneas de ~105 cortadas en el punto. La línea de cierre
    estándar mide 72ch (775px) y lo pone en tres líneas de ~80. A todo el
    ancho serían ~125 caracteres por línea, más de lo legible. Se mantiene el
    estándar y el corte queda natural.
- Selector: el lead vuelve a su rango con la extensión del copywriter (164).
  Reestructura confirmada.
- FAQ Q4 reemplazada (usuario adicional de Billing Co). El schema FAQPage lee
  la misma data (verificado en el JSON-LD).
- Caption de la matriz: la versión propuesta NO entra y el caption sigue
  retirado. Nombra una fila de almacenamiento ("providers, users, storage")
  que la tabla no tiene: salió el 2026-09-12 con cifras [PEND]. La respuesta
  de copy también cuenta "tres filas de multi-cliente", y hoy son dos (se
  consolidaron). Vuelve a copy.
- Para producto/fundador (bloqueante, según copy): el usuario adicional a $39
  se promete en la nota de precio, en la matriz y en la FAQ Q4, y no existe en
  `lib/plans.js` ni en Polar. Opciones de copy: implementarlo antes de
  publicar, o sacar las tres menciones (tope duro de 10 usuarios).
- Para copy (fuera de mi alcance, página editorial): `/medtrainer-pricing`
  dice "Users are included up to the plan limit, not billed separately", que
  queda a medias por el mismo motivo.
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 regla 4, §18.

## /pricing y /medtrainer-pricing — segunda respuesta de copy (caption, cobro de usuarios)
Fecha: 2026-09-14
Decisión: entra la segunda respuesta de copywriting del día.
- El caption de la matriz vuelve, reescrito contra las siete filas: capacidad,
  escala o paridad, sin nombrar filas salvo el tax ID. Entra en una línea a
  1280.
- /pricing, sección proveedor/usuario, párrafo 2: la primera frase suma la
  excepción del usuario adicional de Billing Co. Copy la encontró buscando por
  significado; no dice "billed", así que ningún grep la encontraba.
- /medtrainer-pricing, celda "ours" de la comparación: reemplazada (89, dentro
  de 62–95). Es un cambio de copy en una página editorial. El diseño de la
  página no se toca.
- Se reemplazaron `docs/H110_COPY_TANDA_A_LANDING.md` y
  `docs/H110_COPY_TANDA_B_COMPARACION.md` por las versiones sincronizadas del
  copywriter. El diff contra las anteriores son solo esos cambios y la FAQ
  Q4, así que archivo y código dicen lo mismo.
- El cobro del usuario adicional a $39 sigue pendiente en desarrollo
  (`lib/plans.js`, Polar) y bloquea la publicación de /pricing.
Regla de DESIGN_RULES.md que aplica: §2 regla 3.

## Home — el hero: shot sangrado, viñeta por encima, parallax
Fecha: 2026-09-19
Decisión: el mockup de baja fidelidad ya no existe y el shot del dashboard
quedó chico dentro de la columna (0,5, el piso del Stage). Rediseño del hero:
- El shot se dibuja 1:1 y sale por el borde derecho del panel, que lo recorta
  (`bleed`). Sidebar desplegada: el recorte deja a la vista el lado izquierdo,
  y ahí la nav nombra las seis cosas que el producto sigue.
- Las dos cifras del hero pasan de tarjetas del kit de marketing a chips de la
  app, con sombras propias para fondo oscuro (`liftOnInk`, `chipLiftOnInk`):
  una sombra color tinta sobre tinta no se ve.
- Salen los cuatro chips del strip: duplicaban la fila de datos que va 200px
  más abajo. "No demo call" y "No quote request" no están en ningún otro lado
  — pendiente de copy.
- El H1 del hero de la home baja de 4,5rem a 4rem. La columna de texto pasa de
  620 a 576px y el shot se queda con la diferencia (de 0,74 a 0,92).
- La viñeta del panel va por encima del shot (pedido del fundador), asimétrica
  y fuerte en el borde derecho, para que el shot se hunda en el panel en lugar
  de quedar rebanado. Se bajó de intensidad una vez: apagaba los datos.
- La pestaña de abajo lleva ahora un chevron: era una forma suelta y pasa a ser
  la señal de scroll, lo único del hero que apunta hacia abajo.
- Parallax con animaciones ligadas al scroll: solo el fondo, ±8% sobre el
  scroll de la página (0–900px). El shot se movía ∓44px y se sacó: al animarlo
  pasa a ser una capa compuesta y el fundador lo vio menos nítido en su
  pantalla. Entre movimiento y nitidez, manda la nitidez. Sin listener y sin componente cliente; donde el
  navegador no lo soporta (Safari, Firefox) no se mueve nada, igual que para
  quien pide menos movimiento.
- Inclinación descartada: se midió a 7° y 13° con recortes a 2×. A 7° la
  pérdida de nitidez es casi nula (el shot se dibuja por debajo de 1:1, así que
  no hay agrandado), a 13° se nota en el texto chico gris. El fundador eligió
  la recta igual. Queda escrito en PRODUCT_SHOTS.md con el porqué, y
  /styleguide/hero se borró.
Regla de DESIGN_RULES.md que aplica: §5, §16, §17.

## Home — "Three things, tracked in one place", recompuesta
Fecha: 2026-09-20
Decisión: la sección se rehace entera (pedido del fundador; copy respondió el
2026-09-19). Antes eran tres tarjetas de tres formas distintas: una con foto de
archivo, otra con una lista de cinco ítems y una cuarta idea en caja gris
adentro, y la tercera con el correo colgando por fuera.
- Ahora: a la izquierda las tres cosas como tres filas iguales (ícono, título,
  línea); a la derecha el correo del lunes, entero y a tamaño propio. El título
  dice "in one place" y el correo es ese lugar, así que la sección se prueba a
  sí misma.
- Sale la foto del hombre con el teléfono. A la home le queda una sola foto, la
  de la sección 2. Es la sección que promete que el producto sigue tres cosas:
  una foto de archivo juega en contra.
- El correo suma el tercer bloque ("Expiring in the next 90 days"), para que
  muestre las tres cosas y no solo los follow-ups. Escena `NarrowDigest` nueva
  para teléfono: a 600 de lienzo en una columna de 322 caía a 0,54 y no se
  leía; recortado se dibuja a 0,85.
- Las tres filas se reparten a lo alto del correo (`space-between`), así la
  primera y la última quedan a la altura de su cabecera y su pie.
- Copy, según la respuesta del copywriter:
  - Las cinco credenciales bajan a la línea de cierre de la sección, con "one
    row per state" absorbido adentro (170 caracteres).
  - "A multi-state panel is where a spreadsheet breaks first" se retira de la
    home; ya vive en /credentialing-spreadsheet-template §4.
  - Los tres títulos y los tres cuerpos no cambian.
- Bloqueante que copy levantó y que ya no aplica: las tres líneas que dicen que
  el producto no existe ("not a screenshot", "no product interface exists yet")
  siguen en los data.js pero ninguna se renderiza desde que entraron los
  product shots. Verificado en las tres páginas. Queda para copy retirarlas del
  archivo.
- DESIGN_RULES §2 regla 1 enmendada: el producto existe y las figuras son
  pantallas reales; lo prohibido ahora es la pantalla inventada.
Política de imagen: ninguna foto; una figura de producto.
Regla de DESIGN_RULES.md que aplica: §2 regla 1 (enmendada), §13, §14, §19.

## Home — "Three things": las filas dejan de ser tarjetas; el correo queda como único objeto
Fecha: 2026-09-20
Decisión: segunda ronda sobre la sección recompuesta el mismo día, a pedido del
fundador (tres problemas: tarjetas demasiado separadas, correo chico en
pantallas medianas, y los cuatro cuadros leyéndose como pares).
- **Jerarquía.** Las tres filas salen de `sk-card`: pasan a ser ícono + título +
  línea sobre el blanco de la sección, separadas por un filete (`--line`). El
  correo queda como la única tarjeta de la sección, así que se lee como lo que
  se está mostrando y no como un cuarto par. Los cuatro cuadros tenían el mismo
  borde, el mismo radio y la misma sombra: la página decía que eran lo mismo.
  No se le agrega cromo de cliente de correo al shot (§16 lo prohíbe).
- **Separación.** `align-content: space-between` estiraba dos gaps de 16px a
  **168px cada uno** — 335px de aire dentro de una columna de 734. Pasa a
  `center` con `gap: var(--s-6)`. La lista queda centrada contra el correo.
- **Pantallas medianas (el bug real).** `@media (max-width: 900px)` apilaba la
  sección, pero un bloque posterior `@media (max-width: 980px)`, resto del
  layout de tarjetas anterior, volvía a poner dos columnas y ganaba por orden
  de aparición: entre 640 y 980 la sección nunca apilaba. Con dos columnas de
  313px el lienzo de 600 del correo se dibujaba a **0,52** a 768 y a 0,67 a
  980 — su tipografía de 13px a 7. Se borran las reglas muertas y el quiebre
  queda en **1080px**, donde la escala caería por debajo de ~0,8. Apilada, la
  columna alcanza para dibujarlo a 1,0 en 768 y en 980. El gutter apilado sube
  a `--s-7`: a 16px la última fila quedaba pegada al correo.
- **Lienzo de la escena.** `MondayDigest` declaraba 600×780 y su contenido mide
  600×588: 192px de lienzo vacío al pie, que en la página eran 183px de hueco
  entre el correo y la línea de cierre. Pasa a 588, y `NarrowDigest` de 470 a
  408 (contenido 408). La sección baja de 1261px a 1079 a 1440.
- Se borran de `neo.css` las reglas muertas `.sk-layers__card/__top/__visual/
  __detail/__stack`: ningún JSX las usa desde la recomposición.
Política de imagen: ninguna foto; una figura de producto.
Regla de DESIGN_RULES.md que aplica: §3 (blanco vs. gris es jerarquía), §4,
§16.

## Home — "Three things": vuelven las tarjetas y el correo se para sobre el fondo de la app
Fecha: 2026-09-20
Decisión: se revierte el paso anterior del mismo día (quitarle la tarjeta a las
tres filas) y entra la solución del fundador. Tenía razón: sacarle el marco al
contenido resolvía la jerarquía **contra el resto del sitio**, donde todo lo que
no es texto corrido va en un cuadro. Un molde que solo funciona en una sección
no es el molde.
- Las tres filas vuelven a `sk-card sk-card--pad`. Se va el filete entre filas.
  Los arreglos de la ronda anterior quedan: centrado en lugar de
  `space-between`, quiebre a una columna en 1080 y lienzo de la escena a 588.
- El correo se dibuja sobre **el fondo de la app** (`app-ground-flat`, que ya
  existía en `globals.css` y que el `ProductShot` original llevaba como
  `backdrop="ground"`, commit `fade29b`), en caja redondeada de 28px con
  filete. Es el material que distingue una figura de una tarjeta de la página,
  y no inventa nada: es literalmente el fondo de la herramienta.
- **Se le saca el radial ámbar** (variante `app-ground-flat--calm`). El fondo
  original lleva petróleo arriba a la izquierda y ámbar abajo a la derecha, y
  eso rompe dos reglas a la vez: §17 (nunca dos colores en un degradado, nunca
  sobre superficie clara) y §18 (el ámbar es señal — y las figuras que se paran
  encima llevan sus propias pastillas ámbar de estado, con las que competía).
  El lavado petróleo es la mitad que hace reconocible el fondo como el de la app.
- La regla que queda, para las demás figuras: **una figura que es una pantalla
  entera trae su propia sidebar y su barra superior y no necesita fondo; una
  tarjeta suelta, un panel o un correo, sí** — una tarjeta blanca de la app
  suelta sobre una sección blanca, al lado de tarjetas blancas de contenido, se
  lee como una cuarta tarjeta de contenido. El hero sigue sin fondo
  (`backdrop="none"`): se para sobre el panel tinta.
- Costo medido: el padding del fondo le come ancho al lienzo. A 1440 el correo
  pasa de 0,95 a **0,871**; a 768 sigue en 1,0. En teléfono el padding baja a
  12px y aun así pasa de 0,847 a **0,784** — es la pérdida a discutir, porque
  el teléfono ya es el caso más justo.
Política de imagen: ninguna foto; una figura de producto sobre el fondo de la app.
Regla de DESIGN_RULES.md que aplica: §3, §17, §18.

## Figuras de producto — rotación en Z y transparencia del fondo: las dos se descartan
Fecha: 2026-09-20
Decisión: propuestas del fundador sobre el correo de la home; ninguna entra, y
las dos por un motivo distinto.
- **Rotación en Z.** Medida como se midió la inclinación 3D: recortes a 2× de
  las mismas filas a 0°, 1,2° y 2,5°. El **texto aguanta** — el shot se dibuja
  a 0,871, así que rotar es remuestrear y no agrandar, igual que a 7° de
  inclinación. Lo que no aguanta es **el filete de 1px**: los separadores de
  fila pasan de limpios a 0° a blandos y de grosor desparejo a lo largo del
  trazo a 1,2°, y parejamente blandos a 2,5°. Este correo está construido
  entero con filetes — uno por fila, siete — así que el daño cae justo donde la
  figura lleva su estructura. Y los recortes son a 2×: en una pantalla a 1×,
  como la del fundador, no hay subpíxel donde repartir el error y se ve peor.
  La prueba queda escrita en PRODUCT_SHOTS.md: no es "nada se inclina", es
  **una escena dibujada con filetes se queda derecha**. Una escena de tarjetas
  y pastillas podría llevar rotación, y nunca por debajo de 2°: 1° es chico
  para leerse como intencional y grande para que las líneas parezcan mal
  dibujadas.
- **Transparencia del fondo.** El fondo de la app mide **1,13:1 contra el
  blanco de la página** (#eef1ef contra #fff). Es todo el margen que tiene para
  decir "esto es otro material", y es lo único que separa la figura de las tres
  tarjetas desde que volvieron. Bajarlo con transparencia lo lleva a ~1,11:1 y
  deshace lo que acabamos de comprar. La transparencia sirve sobre un fondo de
  color — el panel tinta del hero, donde dejar pasar el panel hunde la figura
  en él. Sobre blanco no tiene nada que dejar pasar.
Política de imagen: sin cambios.
Regla de DESIGN_RULES.md que aplica: §17.

## Figuras de producto — el shot se para sobre el fondo y se sale de él (inclinado en Y)
Fecha: 2026-09-20
Decisión: entra el boceto del fundador, que es una tercera cosa distinta de las
dos que veníamos discutiendo: **el fondo queda derecho y quieto, y es el shot el
que se inclina y se sale**. No es el fondo como marco alrededor del shot (lo que
había hecho yo), ni la figura entera inclinada.
- El fondo (`app-shotframe__ground`) es más grande que el shot: sale 32px a la
  izquierda de la caja de la figura y 28px arriba y abajo. Así se lee como una
  superficie y no como un marco. El tope de la izquierda lo pone el gutter de
  columna: 58px a 1440, así que 32 deja 26 libres contra las tarjetas.
- El shot va corrido 64px a la derecha y girado `rotateY(7deg)` con el origen
  en el borde izquierdo, de modo que ese borde se queda quieto y el derecho
  viaja. Resultado a 1440: el fondo se ve 96px a la izquierda del correo, y el
  correo sale 43px por el borde derecho del fondo.
- **La inclinación es solo en Y, y solo por encima de 1080.** Medido el mismo
  día: a 7° el borde cercano se dibuja a ×1,020, o sea 0,888 efectivo — sigue
  por debajo de 1:1, que es la prueba que fija el contrato (recién cruzaría
  pasados los ~36°). Y a diferencia de la rotación en Z, que saca a los siete
  filetes del grid a lo largo de todo su trazo, una rotación en Y los deja
  mucho más cerca de la horizontal. Apilada la sección, la inclinación se va:
  322px de columna no tienen ancho que gastar en perspectiva.
- **El fondo dejó de costar nitidez.** Como marco con padding le comía 48px al
  lienzo y el correo caía de 0,951 a 0,871. Ahora el shot conserva el ancho
  entero de la figura: vuelve a **0,951** a 1440, a 1,0 a 768 y a 0,847 en
  teléfono. La profundidad salió gratis.
- El correo lleva una sombra más profunda que el `lift` estándar (`liftOff`,
  nueva en AppScreen): el voladizo es la afirmación y la sombra es lo que la
  hace legible. Las escenas reciben su profundidad por prop (`depth`), que el
  `ProductShot` pasa solo cuando hay fondo.
- El voladizo derecho nunca supera el viewport (a 1440 el correo termina en
  1363; a 1280 en 1234; a 1100 en 1046), así que la figura no agrega scroll
  horizontal.
Política de imagen: ninguna foto; una figura de producto sobre el fondo de la app.
Regla de DESIGN_RULES.md que aplica: §3, §17.

## Home — hallazgo aparte: la home tiene scroll horizontal desde el hero
Fecha: 2026-09-20
Decisión: no es mío y no lo toqué, pero queda anotado. A 1440 la home mide
**1721px de ancho de documento**; `/pricing` y `/security` miden 1440 clavados.
El que se sale es el lienzo del Stage del hero (`div.absolute.top-1/2.left-0`),
que llega a x=1721: el shot que sangra fuera del panel no está siendo recortado
por nadie. Viene de `fd21bc9`, cuando el hero pasó a sangrar. Medido con y sin
la figura del correo: 1721 en los dos casos, así que la figura nueva no aporta
nada a esto. Hay que recortarlo donde corresponda —el panel del hero— sin usar
`overflow: hidden`, que rompería el parallax.

## Figuras de producto — se revierte la inclinación: todo derecho
Fecha: 2026-09-20
Decisión: el fundador revierte la entrada anterior del mismo día. La figura
vuelve al fondo como marco con padding, derecha, sin inclinación y sin voladizo
(estado de `eb68138`). Se retiran `app-shotframe*`, la prop `tilt`, la sombra
`liftOff` y la prop `depth` de la escena: si no se usan, se van.
Queda en pie, porque es lo que se aprendió midiendo y no depende de la decisión:
- La rotación en Z rompe los filetes de 1px; la rotación en Y no (anotado en
  PRODUCT_SHOTS.md). Si alguna vez se retoma, esa es la que sirve.
- El fondo como marco con padding le cuesta ancho al lienzo: el correo se
  dibuja a 0,871 a 1440 y a 0,784 en teléfono, contra 0,951 y 0,847 con el
  fondo detrás. Es el único número que quedó abierto de esta ronda.
Política de imagen: sin cambios.

## /payer-enrollment-software — el recorrido de estados gana una forma intermedia
Fecha: 2026-09-20
Decisión: pedido del fundador (la figura del hero "no se adapta y queda muy
chica en pantallas medianas"). Medido antes de tocar: el lienzo de `StatusPath`
mide 1000px y es una fila de seis chips que no puede plegarse, así que de 1024
para abajo solo se achica — 0,88 a 1024, 0,77 a 900, 0,66 a 768 y **0,55 a
641**, que pone sus chips de 15px en 8.
- Entra `MidStatusPath`, 640×306: la misma tarjeta con la fila de chips
  plegada (`flex-wrap`). Y `ProductShot` acepta ahora un escalón intermedio
  además del de teléfono: elige de más angosto a más ancho, el primero que
  matchea gana.
- Reparto: teléfono ≤640 (`NarrowStatusPath`), medio 641–1023 (`MidStatusPath`),
  ancho ≥1024 (`StatusPath`). Peor caso de toda la banda: **0,86** contra 0,55.
- Los tres lienzos declaraban más alto del que usan (340/430/560 contra
  301/300/472). Quedan en 306/306/478.
- Lo mismo en las otras dos figuras de la página: `Stages` declaraba 440 y usa
  305 (queda en 310), la matriz declaraba 580 y usa 525 (queda en 530).
Política de imagen: ninguna foto; figuras de producto.
Regla de DESIGN_RULES.md que aplica: §5 (el hueco declara su relación y no la
cambia), contrato de PRODUCT_SHOTS §6.

## /payer-enrollment-software — fondo en dos figuras, y el chip que pisa la tarjeta
Fecha: 2026-09-20
Decisión: pedido del fundador.
- `Stages` y `EffectiveDate` pasan a `backdrop="ground"`. La tabla de estados
  **no** lo lleva: su sección ya es un bloque gris, y ahí la tarjeta blanca con
  su sombra alcanza para separar las capas (criterio del fundador, y coincide
  con §3: blanco contra gris ya es jerarquía).
- `EffectiveDate` queda centrada en su lienzo: la tarjeta pasa de `left: 0` a
  `left: 30` y el chip de x=260 a x=230, así el contenido ocupa 30..590 de un
  lienzo de 620 en lugar de 0..620 con el peso a la izquierda.
- El chip flotante gana profundidad propia (`chipOver`, nueva en AppScreen). El
  `chipLift` es más suave que el `lift` de una tarjeta, lo cual está bien para
  un chip que flota al lado de una pantalla y está al revés para uno que la
  **pisa**: el que está encima tiene que ser el más cercano de los dos.
- Costo medido del fondo en esta figura: el padding le come 48px, así que la
  escena cae de 0,853 a 0,776 a 1440.
Política de imagen: ninguna foto; figuras de producto.
Regla de DESIGN_RULES.md que aplica: §3.

## /payer-enrollment-software — la tabla de estados pasa al sistema de la app
Fecha: 2026-09-20
Decisión: pedido del fundador. La sección dibujaba los seis estados con las
marcas propias de la tabla de marketing (`.sk-mark`), o sea que la página tenía
un segundo vocabulario, inventado, para la cosa que el producto ya nombra.
Ahora usa los chips reales de la herramienta (`CHIP` de `showcase/parts`),
dentro de una tarjeta blanca del sistema de la app.
- **No es un product shot.** Un shot es un lienzo fijo que escala; esto es copy
  —seis significados y seis acciones—, así que sigue siendo una `<table>` real
  y fluida, que reflowea y que un crawler lee. De la app viene la tarjeta y los
  chips de la columna de estado, nada más.
- **El glifo queda adentro del chip.** §2 regla 3: un estado es glifo +
  etiqueta, nunca color solo, y los chips de la app son color + etiqueta. Sin
  el glifo adentro, pasar al sistema de la app habría roto la regla.
- **Sin fondo**, por decisión del fundador: la sección ya es un bloque gris y
  una tarjeta blanca con su sombra alcanza para separar las capas (§3).
- La fila de acción conserva su tinte ámbar y suma el anillo del estado, que es
  como la app marca lo que pide acción.
- Debajo de 640 la tabla se apila fila por fila con la etiqueta de la tercera
  columna visible, en el mismo marcado: no hay copia duplicada en el DOM.
Política de imagen: ninguna.
Regla de DESIGN_RULES.md que aplica: §2 regla 3, §3.

## /payer-enrollment-software — la matriz: columnas a medida y el total pisando la tarjeta
Fecha: 2026-09-20
Decisión: punto 5 del fundador, hecho a medias a propósito (ver el pendiente al
final). Medido antes de tocar, a 1440:
- El bloque tinta de la izquierda mide **660px** de alto y la figura **470**:
  190px de columna vacía. Es lo que el fundador marcó en rojo.
- Cada celda medía **190px** y su texto **50**: 124px muertos por celda.
Cambios:
- El lienzo baja de 780 a **690**, que es exactamente el ancho de su columna a
  1440, así que la escena se dibuja a **1,000** en vez de 0,886 — el texto de la
  matriz queda 13% más grande y a 1:1. La columna de proveedor queda en 215
  (a 190 truncaba los apellidos) y las de pagador en 158.
- La tarjeta de totales pasa a **pisar** la matriz por 20px, en vez de flotar
  debajo con aire en el medio, y con la sombra de un chip que va encima
  (`chipOver`). Las dos tienen que leerse como un objeto contra el tile.
- Su leyenda pasa de seis columnas a tres: a seis cada entrada tenía 108px y
  **todas** las etiquetas truncaban ("Appr…", "Submi…").
- El lienzo queda en 690×486, que es lo que el contenido usa.
Pendiente, y es el corazón del pedido: **la figura sigue 190px más baja que el
bloque tinta**, y eso solo se cierra con más filas de proveedores (unas tres).
La consulta al libro demo en Supabase quedó bloqueada por tratarse de datos
personales, y PRODUCT_SHOTS §7 prohíbe inventar los datos de las figuras. El
fundador ofreció las dos vías; queda a su decisión.
Política de imagen: ninguna foto; figura de producto sin fondo (el tile tinta ya
separa las capas, criterio del fundador).
Regla de DESIGN_RULES.md que aplica: §3, §14; PRODUCT_SHOTS §1 y §7.

## neo.css — tres media queries que nunca se aplicaban, y la auditoría que las encontró
Fecha: 2026-09-20
Decisión: el fundador señaló que la sección de la matriz quedaba ilegible en
teléfono. No era diseño: **la sección nunca apilaba**. Medido a 400px, seguía
en dos columnas de 132px y 184px, con el tile tinta de **1966px** de alto y la
matriz dibujada al 0,50 —el piso del Stage— y recortada.
La causa es un patrón, no un caso: `neo.css` se escribe apendeando rondas al
final, así que una regla sin media query escrita en una ronda posterior le gana
por orden de aparición a la media query que la ronda anterior había puesto más
arriba. Tres casos, los tres reales:
| Selector | Media query que no se aplicaba | La pisaba |
|---|---|---|
| `.sk-diagbento` | `max-width: 1080` → una columna | la proporción 5fr/7fr de la ronda 3 |
| `.sk-figbento` | `max-width: 980` → una columna | la proporción 5.4fr/6.6fr de la ronda 3 |
| `.sk-lhero__inner` | `max-width: 880` → `padding-top: --s-7` | `--s-8` de la ronda del header claro |
Las tres reglas posteriores pasan a llevar su propia `min-width`. Verificado a
400px: la matriz apila y sube de 0,50 recortada a **0,72 entera**, el tile pasa
de 1966 a 662px de alto, el figbento de la home apila por primera vez, y el
padding del header claro baja a 48px. A 1440 no cambia nada (5.4fr/6.6fr,
5fr/7fr y 64px intactos).
La auditoría que las encontró recorre el archivo con un parser de llaves y lista
cada par (selector, propiedad) declarado dentro de una `max-width` y otra vez
después sin condición. Quedó en cero. **Vale la pena volver a correrla al cerrar
cada ronda**, porque la forma de trabajar del archivo reintroduce el patrón.
Regla de DESIGN_RULES.md que aplica: §0 (capturas a 390/768/1440 — este bug solo
aparece midiendo el ancho chico).

## /payer-enrollment-software — la matriz centrada contra el tile
Fecha: 2026-09-20
Decisión: pedido del fundador. La figura se centra verticalmente contra el
bloque tinta en vez de alinearse arriba: el tile mide 660 y la figura 486, y
alineada arriba los 174px de diferencia colgaban todos abajo. Ahora quedan 87
arriba y 87 abajo. Apilada no hay contra qué centrar y vuelve a arriba.
Regla de DESIGN_RULES.md que aplica: §14.
