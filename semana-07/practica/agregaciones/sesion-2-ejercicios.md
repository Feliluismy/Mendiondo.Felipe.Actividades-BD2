# Sesión 2 — `$group` y acumuladores con películas

> **Tema:** `$group`, acumuladores (`$sum`, `$avg`, `$min`, `$max`), `$sort` sobre el resultado del grupo.
>
> **Datos a usar:** `data-peliculas.js` (colección `peliculas`).

---

## Ejercicio 1 — Películas por país (simple)

Calcular **cuántas películas hay por cada `pais`**. El resultado debe ordenarse por cantidad **descendente**.

> Pista: `$group` con `_id: "$pais"` y `count: { $sum: 1 }`, después `$sort`.

---

## Ejercicio 2 — Duración promedio por director (simple)

Para cada `director`, calcular la **duración promedio** de sus películas. Mostrar solo el director y un campo `duracionPromedio`. Ordenar por `duracionPromedio` **descendente**.

> Pista: `$group` con `_id: "$director"` y `$avg: "$duracion"`.

---

## Ejercicio 3 — Reporte por estudio (avanzado)

Para cada `estudio` calcular:

- `cantidad`: cantidad de películas
- `calificacionPromedio`: promedio de `calificacion`
- `recaudacionTotal`: suma de `recaudacion`
- `presupuestoMaximo`: presupuesto más alto entre las películas del estudio

Mostrar **solo los estudios con 2 o más películas** y ordenar el resultado por `recaudacionTotal` **descendente**.

> Pista: `$group` + `$sum`, `$avg`, `$max`. Después `$match` sobre el resultado del grupo (filtrar por `cantidad >= 2`) y `$sort`.
