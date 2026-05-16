# Sesión 3 — `$unwind` y arrays con películas

> **Tema:** `$unwind`, `$sortByCount`, combinar `$unwind` con `$group`.
>
> **Datos a usar:** `data-peliculas.js` (colección `peliculas`).
>
> Recordá: cuando un campo es un **array** (acá `generos`, `actores`, `premios`), si querés operar sobre cada elemento por separado primero hay que abrir el array con `$unwind`.

---

## Ejercicio 1 — Géneros distintos (simple)

Listar **todos los géneros distintos** que aparecen en la colección. El resultado debe tener un documento por género (sin repeticiones), con el género como `_id`.

> Pista: `$unwind: "$generos"` + `$group` con `_id: "$generos"`.

---

## Ejercicio 2 — Ranking de actores (simple)

Hacer un **ranking de los 5 actores que aparecen en más películas**. Mostrar el actor y la cantidad de películas en las que aparece, ordenado por cantidad **descendente**.

> Pista: `$unwind: "$actores"` + `$sortByCount: "$actores"` + `$limit`.

---

## Ejercicio 3 — Calidad promedio por género (avanzado)

Para cada `genero`, calcular:

- `cantidadPeliculas`: cuántas películas pertenecen a ese género
- `calificacionPromedio`: promedio de `calificacion` de esas películas
- `recaudacionTotal`: suma de `recaudacion`

Mostrar **solo los géneros con 3 o más películas** y ordenar por `calificacionPromedio` **descendente**. Mostrar `genero` (en lugar de `_id`), `cantidadPeliculas`, `calificacionPromedio` (redondeada a 2 decimales) y `recaudacionTotal`.

> Pista: `$unwind` sobre `generos`, después `$group` por género, después `$match` para filtrar por cantidad, `$sort` y un `$project` final con `$round`.
