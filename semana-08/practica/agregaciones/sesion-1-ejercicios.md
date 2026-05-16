# Sesión 1 — Pipeline básico (segunda vuelta)

> **Tema:** repaso de `$match`, `$project`, `$sort`, `$limit`, `$skip`, `$count` con nuevos casos.
>
> **Material teórico:** `semana-07/teoria/mongosh/agregaciones/01-mongodb_teoria_pipeline_basico.md`.
>
> **Datos a usar:** `data-peliculas.js`.
>
> **Cómo cargar los datos:**
>
> ```js
> use semana8_agregaciones
> load("data-peliculas.js")
> ```

---

## Ejercicio 1 — Dramas de alta calificación (simple)

Mostrar las películas que tienen `"Drama"` entre sus `generos` **y** `calificacion >= 8.5`. Para cada una mostrar solo `titulo`, `director` y `calificacion`, ordenadas por `calificacion` **descendente**. Sin `_id`.

> Pista: para "el array contiene X" alcanza con `{ generos: "Drama" }` — MongoDB resuelve solo que es un array.

---

## Ejercicio 2 — Página 2 del catálogo (simple)

Imaginar que la app del videoclub muestra **5 películas por página**, ordenadas por `año` descendente. Devolver **la página 2** (las películas que irían en posiciones 6 a 10). Mostrar `titulo` y `año`, sin `_id`.

> Pista: `$sort` + `$skip` + `$limit`. La cantidad a saltar es `5` y la cantidad a tomar es `5`.

---

## Ejercicio 3 — Cuántas películas disponibles hay (simple)

Calcular **cuántas películas tienen `disponible: true`**. El resultado debe ser un único documento con un campo llamado `disponibles`.

> Pista: `$match` + `$count: "disponibles"`. La etapa `$count` devuelve un único documento `{ <nombre>: N }`.

---

## Ejercicio 4 — Ranking de rentabilidad (avanzado)

Para cada película calcular un campo `ganancia = recaudacion - presupuesto` y un campo `multiplicador = recaudacion / presupuesto` (redondeado a 2 decimales). Mostrar las **3 películas con mayor `multiplicador`** (las más rentables relativas a lo que costaron). Para cada una mostrar `titulo`, `presupuesto`, `recaudacion`, `ganancia` y `multiplicador`. Sin `_id`.

> Pista: `$project` con `$subtract` y `$divide`, después `$sort` y `$limit`. Para redondear: `{ $round: [<expresión>, 2] }`.
