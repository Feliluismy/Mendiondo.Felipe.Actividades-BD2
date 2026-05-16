# Sesión 1 — Pipeline básico con películas

> **Tema:** `$match`, `$project`, `$sort`, `$limit`, `$skip`, `$count`.
>
> **Datos a usar:** `data-peliculas.js` (colección `peliculas`).
>
> **Cómo cargar los datos** (desde `mongosh`):
>
> ```js
> use videoclub_practica
> load("data-peliculas.js")
> ```

---

## Ejercicio 1 — Películas argentinas (simple)

Mostrar todas las películas cuyo `pais` sea `"Argentina"`. Para cada una mostrar **solo** `titulo`, `director` y `año` (sin `_id`), ordenadas por **año descendente** (de la más nueva a la más vieja).

> Pista: `$match` + `$project` + `$sort`.

---

## Ejercicio 2 — Top 5 mejor calificadas (simple)

Mostrar las **5 películas con mayor `calificacion`**. Para cada una mostrar **solo** `titulo` y `calificacion` (sin `_id`).

> Pista: `$sort` + `$limit` + `$project`.

---

## Ejercicio 3 — Recomendaciones largas del nuevo milenio (avanzado)

Buscar las películas que cumplan **todas** estas condiciones:

- estrenadas en el **año 2000 o posterior** (`año >= 2000`)
- con `duracion` mayor a `120` minutos
- que estén `disponible: true`

Para cada una mostrar un campo calculado **`ficha`** con el formato `"<titulo> (<director>)"`, junto a `año`, `duracion` y `calificacion` (sin `_id`). Ordenar por **`calificacion` descendente** y mostrar **solo las 3 mejores**.

> Pista: `$match` con `$gte` y `$gt`, después `$sort`, `$limit` y un `$project` con `$concat`.
