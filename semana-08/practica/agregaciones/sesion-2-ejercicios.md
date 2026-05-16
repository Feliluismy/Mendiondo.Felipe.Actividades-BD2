# Sesión 2 — `$group` + `$unwind` aplicados (segunda vuelta)

> **Tema:** repaso de `$group` con acumuladores y combinación con `$unwind` para abrir arrays.
>
> **Material teórico:** `semana-07/teoria/mongosh/agregaciones/02-mongodb_teoria_group_unwind.md`.
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

## Ejercicio 1 — Duración promedio por país (simple)

Para cada `pais`, calcular la **duración promedio** de las películas. Mostrar el país y un campo `duracionPromedio` (redondeado a 1 decimal). Ordenar por `duracionPromedio` **descendente**.

> Pista: `$group` con `_id: "$pais"` + `$avg: "$duracion"`, después `$project` con `$round` y `$sort`.

---

## Ejercicio 2 — Géneros más frecuentes (simple)

Hacer un **ranking de los 5 géneros más frecuentes** entre todas las películas (recordar que `generos` es un array). Mostrar el género y la cantidad de películas que lo tienen, ordenado de mayor a menor.

> Pista: `$unwind: "$generos"` para abrir el array, después `$sortByCount: "$generos"` (que es el atajo de `$group` + `$sort`) y `$limit: 5`.

---

## Ejercicio 3 — Reporte por director (avanzado)

Para cada `director`, calcular:

- `cantidad`: cuántas películas dirigió (en la colección)
- `recaudacionTotal`: suma de la `recaudacion` de sus películas
- `calificacionPromedio`: promedio de `calificacion` (redondeado a 2 decimales)
- `peliculas`: array con los `titulo` de sus películas

Mostrar **solo los directores con 2 o más películas** y ordenar por `recaudacionTotal` **descendente**.

> Pista: `$group` con `$sum`, `$avg`, `$push`, después `$match` para filtrar `cantidad >= 2`, `$sort` y un `$project` final con `$round`.

---

## Ejercicio 4 — Premios obtenidos por película (avanzado)

Para cada película que tenga **al menos un premio** en su array `premios`, mostrar `titulo` y un campo `cantidadPremios`. Ordenar por `cantidadPremios` **descendente** y mostrar solo el **top 5**.

> Pista: hay dos formas:
>
> - Con `$project` y `$size`: `cantidadPremios: { $size: "$premios" }`, después `$match` por `cantidadPremios > 0`, `$sort` y `$limit`.
> - Con `$unwind` + `$group`: abrir el array, agrupar por `_id: "$titulo"` y contar.
>
> La primera es más directa porque no necesita reagrupar.
