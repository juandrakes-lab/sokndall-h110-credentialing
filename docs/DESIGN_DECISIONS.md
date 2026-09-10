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
