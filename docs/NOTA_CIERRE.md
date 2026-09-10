# Nota de cierre — estado de los entregables

**9 de septiembre de 2026 · actualizada tras la pasada final**

## Las 15 páginas del mapa de `H110_ARQUITECTURA_v3_1.md` §4 están completas.

**Estos son los únicos cuatro archivos vigentes.** Cualquier otro archivo de
copy que hayas descargado en turnos anteriores de esta conversación es
anterior a la arquitectura v3.1 y no debe usarse para maquetar.

| Archivo | Contenido |
|---|---|
| `H110_COPY_TANDA_A_LANDING.md` | Páginas 1 (home), 2, 4, 9, 11 |
| `H110_COPY_TANDA_B_COMPARACION.md` | Páginas 3, 12, 13, 14 |
| `H110_COPY_TANDA_C_EDITORIAL.md` | Páginas 5, 6, 7, 8, 10, 15 |
| `NOTA_CIERRE.md` | Este archivo |

## Dos archivos obsoletos, retirados en esta pasada

Al revisar la carpeta completa de salida encontré dos archivos de copy que
seguían disponibles para descarga pese a estar superados. Los **retiré** de
`/mnt/user-data/outputs/` — ya no están entre los archivos presentados:

**`H110_COPY_HOME_v4.md`** — la home tenía dos versiones. Su contenido, ya
auditado y corregido, vive únicamente dentro de `H110_COPY_TANDA_A_LANDING.md`,
sección "PÁGINA 1 · `/` — Home".

Para que quede trazado qué cambió y por qué, sin que haga falta ir a buscarlo:
al escribir la Tanda A audité las citas `(v#)` de la home contra
`research-proceso.md` §4 y reescribí dos bloques:

- **Sección 2, las tres row-cards del problema en dinero.** Pasaron de
  anécdota con cita interna a mecanismo con fuente pública: Medicare no
  reembolsa el período de desactivación (CFR, vía CredyApp), y el fallo de
  CAQH no genera aviso alguno del pagador (HireGaynell).
- **Sección 3, la lista de la tall-card.** Se agregó "CAQH attestation, 120
  days" — es el vocabulario de expiración que traía `/credentialing-tracking-
  software` antes de eliminarse, y el brief 1 de la v3.1 manda absorberlo acá.

Verifiqué el resto de las ocho secciones (Hero, Matriz, Ancla de precio,
Precio visible, Qué no hace, FAQ, cierre) línea por línea contra las dos
versiones: son idénticas salvo el formato de tabla. No hay una tercera
divergencia escondida.

**`H110_COPY_TANDA1_PRODUCTO.md`** — la primera tanda que escribí, previa a la
arquitectura v3.1. Contenía cinco páginas (2, 4, 9, 10, 12 en la numeración
vieja), y las cinco están superadas: las cuatro que siguen vigentes se
reescribieron dentro de `H110_COPY_TANDA_A_LANDING.md` con precios corregidos,
terminología auditada y estructura de slots actualizada contra el
`COPY_LIMITS.md` vigente. La quinta era `/credentialing-tracking-software`,
que la v3.1 eliminó por canibalización de SERP — esa página ya no debe
construirse en absoluto. No tenía sentido dejar ese archivo disponible ni
como referencia: todo lo que decía bien ya está en otro lado, y lo que decía
sobre esa página ya no aplica.

## El "20 páginas" del encabezado de la arquitectura

`H110_ARQUITECTURA_v3_1.md` §4 titula "MAPA DE PÁGINAS v3.1 — 20 páginas",
pero lista 15 numeradas + 4 permanentes (`/about`, `/security`, `/terms`,
`/privacy`) = 19. Leí las secciones 1 a 3 del mismo documento buscando una
página que se me hubiera escapado: describen exactamente cinco cambios de
estado respecto de la v3 (una eliminada, una relocalizada, una agregada), y
ninguno deja una decimosexta página numerada sin listar en el mapa. Es un
número que quedó del encabezado de una versión anterior sin actualizar —no
hay página faltante de mi lado ni del documento.

## Estado de todos los `[PEND]`

Cero. Todas las cifras de las 15 páginas tienen fuente linkeada — ninguna
quedó pendiente de `research-proceso.md`, `COMPETIDORES_DATOS.md` ni de la
auditoría de verbatims.

## Lo único que sigue abierto, y no es mío para cerrar

Tres páginas quedan por debajo del rango de palabras de su propio brief
(página 6, 7 y 15 — ver el resumen dentro de `H110_COPY_TANDA_C_EDITORIAL.md`).
No las rellené porque lo que falta es dato que los pagadores no publican, y
`voice-and-evidence.md` §4 prohíbe rellenar. Si en algún momento aparece ese
dato, son las tres a revisar primero.

---

## Segunda pasada — auditoría completa contra `on-page-seo.md`

**9 de septiembre de 2026**

El usuario pidió confirmar que todas las reglas de `on-page-seo.md` estuvieran
aplicadas. Auditoría sección por sección contra las 15 páginas. Se encontraron
y corrigieron problemas reales, no solo de anotación:

1. **§4 — patrón de keyword invertido en `/pricing`.** El H1 llevaba la
   keyword exacta y el H2 no. Corregido: H1 de premisa, keyword al primer H2.
2. **§6 — las seis páginas editoriales no enlazaban a `/pricing`.** Agregado
   un enlace con anchor descriptivo en la sección de límite declarado de cada
   una.
3. **§7 — `rel="nofollow"` no declarado** en los enlaces a competidores de
   varias páginas. Agregado explícitamente en la home, `/pricing`, y las
   cuatro páginas de comparación.
4. **§7 — URLs incompletas.** Múltiples páginas nombraban una fuente
   ("Capterra", "CMS", "Medicotech") sin la URL real. Se completaron las 15
   páginas con URLs verificadas — la mayoría ya estaban en `research-
   proceso.md` o `COMPETIDORES_DATOS.md`; un grupo (Medicotech, Medwave, HOM
   RCM, Assured, Maryland Department of Health, Zedtreeo) se había verificado
   por búsqueda web en un turno anterior sin quedar registrado en ningún
   archivo, y se re-verificó con búsqueda web en esta pasada.
5. **§7 — dos páginas con un solo dominio externo, por debajo del mínimo de
   2:** `/for-billing-companies` (se agregó Zedtreeo, con el cálculo real del
   costo de un especialista de credentialing dedicado) y
   `/credentialing-spreadsheet-template` (se agregó CMS, ya citado en el
   dashboard de la plantilla sin fuente declarada).
6. **`voice-and-evidence.md` §5.3 — la página 15 tenía 1 fuente primaria
   real, no 2** como decía la tabla de verificación (un dominio citado dos
   veces no son dos fuentes independientes). Se agregó una segunda fuente
   genuina (Optum).
7. **Corrección de honestidad:** la nota de la página 10 afirmaba dos fuentes
   independientes para la lista de documentos del checklist. Al verificar la
   URL, solo pude confirmar una (Maryland Department of Health). Se corrigió
   la afirmación en vez de sostenerla sin poder verificarla.

**Estado final: las 15 páginas cumplen el mínimo de 2-4 enlaces externos con
`rel="nofollow"` en competidores, y las seis editoriales enlazan a `/pricing`.**
Verificado con conteo automatizado de dominios por página tras cada corrección.
