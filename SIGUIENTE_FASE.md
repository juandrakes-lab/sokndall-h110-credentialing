# SIGUIENTE FASE — de moldes aprobados a las 18 páginas

Se agrega a `TRASPASO_DISENO.md`. Leelo primero si no lo hiciste; esta nota
asume que ya lo tenés.

---

## Dónde estamos cuando esta nota se vuelve relevante

Los tres moldes están aprobados: `LandingTemplate` (la home), `EditorialTemplate`
(artículo y comparación) e `InstitutionalTemplate`. El copywriter entregó el
contenido completo de las 18 páginas, medido contra `COPY_LIMITS.md`.

Lo que sigue **no es diseño nuevo.** Es ensamblar.

## Estado real de las páginas de producto, antes de empezar

Esto hay que tenerlo claro antes de tocar nada, porque si no lo sabés vas a
asumir el proceso equivocado.

En una corrida anterior a que la home quedara aprobada, se le pidió a un
agente clonar el layout de una referencia visual (NeoPay). Ese agente, sin que
nadie se lo pidiera explícitamente, **aplicó el estilo nuevo a todas las
páginas del sitio que ya existían** — no solo a la home. Juan lo notó ese
mismo día y se decidió dejarlo así, porque revertir esa corrida costaba más
de lo que valía.

Consecuencia concreta: **`/pricing`, `/payer-enrollment-software`,
`/credentialing-tracking-software`, `/for-billing-companies` y la plantilla
descargable ya tienen contenido y ya tienen aplicado el estilo nuevo — colores,
tipografía, tarjetas.** Pero ninguna de esas páginas pasó por el proceso de
revisión que sí tuvo la home: nadie corrigió sus márgenes, nadie verificó su
composición, nadie chequeó si el layout de la versión vieja (la que "dejaba
mucho que desear") sigue por debajo del estilo nuevo. Tienen la piel nueva
sobre la estructura vieja, sin auditar.

**Por eso, para estas páginas, no partas de lo que ya existe en el repo.**
No es una base a corregir — es una base a reemplazar. La razón no es que se
vea mal a simple vista (puede que a primera vista parezca aceptable, porque
tiene los colores y las tarjetas correctas); la razón es que **nadie verificó
si su composición interna es correcta**, y arrastrarla es heredar una deuda
que no podés medir sin auditar página por página, lo cual es más caro que
reconstruir.

**Reconstruilas de cero, como si esa ruta no tuviera nada**, usando:
- los componentes ya aprobados de `LandingTemplate` (los que salieron de la
  home, no los que ya están escritos en esas páginas)
- el copy nuevo que entregó el copywriter para esa página específica

Esto aplica solo a las páginas de `LandingTemplate` que fueron tocadas en esa
corrida vieja. Las páginas que se construyeron después del proceso de
aprobación de cada molde (la home misma, y cualquier página de muestra de
`EditorialTemplate` o `InstitutionalTemplate` hecha ya contra el molde
aprobado) sí son base válida — esas no llevan la deuda de la corrida vieja
porque nunca pasaron por ella.

Si tenés dudas sobre si una página específica viene de esa corrida vieja o es
posterior al proceso de aprobación, preguntale a Juan antes de decidir si se
reconstruye o se edita. No lo asumas por cómo se ve.

## El principio que gobierna esta fase

**La home es el molde de `LandingTemplate`. Se repiten los componentes, nunca
los gráficos ni los datos.**

Concretamente:

- `/pricing`, `/payer-enrollment-software`, `/credentialing-tracking-software`,
  `/for-billing-companies` y la plantilla descargable comparten con la home:
  los mismos tokens (color, tipografía, espaciado, radio, sombra), las mismas
  piezas (`AlertLadder`, `SourcedFigure`, `MatrixSchematic`, la tarjeta de
  precio), el mismo ritmo de bandas claras y oscuras.
- Lo que **no** comparten es el contenido puesto adentro. Si `MatrixSchematic`
  aparece en dos páginas de producto, no lleva los mismos seis proveedores ni
  los mismos números — lleva el dato que esa página necesita mostrar, dentro
  de la misma pieza visual.
- Lo mismo aplica a `EditorialTemplate` entre las páginas de artículo y de
  comparación: mismo TOC, mismo ancho de columna, mismo tratamiento de imagen
  de cabecera — contenido propio de cada tema.

**Señal de que algo salió mal:** si dos páginas del mismo molde terminan con
exactamente los mismos gráficos y los mismos números, no se ensamblaron —se
copiaron. Eso es lo que hay que detectar en la revisión, no solo si la página
"se ve bien".

## Cómo trabajar esta fase, en la práctica

1. **Por lote, no por página suelta.** Todas las de `LandingTemplate` juntas,
   después todas las de `EditorialTemplate`. El orden ya se decidió antes:
   producto primero, comparación después, editorial al final si su plantilla
   llegó más tarde.

2. **En cada página, primero mapeá qué componentes usa y en qué orden**, antes
   de tocar el contenido. Es la parte donde el agente elige composición — eso
   sigue siendo criterio de diseño, no está automatizado.

3. **Nunca inventes un componente nuevo a mitad de una tanda.** Si el
   contenido de una página no encaja en ningún componente existente, se
   detiene esa página, se evalúa si el componente nuevo se generaliza o es
   one-off, se agrega al catálogo, y recién ahí se sigue. Un componente creado
   apurado en medio del ensamblado es la forma más rápida de volver a tener
   deriva entre páginas.

4. **Corré el checklist de `DESIGN_RULES.md` §0 en cada página**, no al final
   del lote entero. Cuesta menos corregir una página que descubrir al final
   que las seis del lote comparten el mismo error.

5. **Toda corrección que surja en esta fase termina en el componente
   compartido, no en la página individual.** Si corregís algo en
   `/payer-enrollment-software` que en realidad es un defecto de
   `MatrixSchematic`, arreglá el componente. Si lo arreglás solo en esa
   página, la próxima página con la misma pieza va a tener el mismo defecto.

## Qué NO hacer en esta fase

- No rediseñar. Si algo del molde te parece mejorable, es una conversación
  aparte con Juan — no una decisión que tomás página por página mientras
  ensamblás.
- No inventar contenido que el copywriter no entregó. Si un slot llegó vacío
  o marcado `[PEND]`, se queda así hasta que exista el texto real. Nunca se
  rellena con placeholder que después alguien olvida reemplazar.
- No mezclar el ensamblado con investigación de datos (precios de
  competidores, cifras de mercado). Esa investigación se hace aparte, en
  Cowork, y se entrega como documento antes de tocar la página. Fue el error
  caro de la fase anterior: una tarea de ensamblado que también intenta
  investigar tarda mucho y es difícil de recuperar si se corta a la mitad.

## Cuándo esta fase termina

Cuando las 18 páginas pasan el checklist de `DESIGN_RULES.md` §0 y `next build`
muestra todas como `○ (Static)`. Ahí el proyecto pasa de fase de diseño a fase
de revisión de producto con Juan, página por página, antes de publicar.
