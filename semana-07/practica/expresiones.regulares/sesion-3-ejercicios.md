# Sesión 3 — Regex sin anclaje (cualquier posición)

> **Tema:** búsqueda en **cualquier posición** de la cadena (sin `^` ni `$`).
>
> **Datos a usar:** `data-empleados.js` y `data-peliculas.js`.

---

## Ejercicio 1 — Películas dirigidas por alguien que tiene "Pedro" en el nombre

Encontrar todas las películas cuyo `director` **contenga** la cadena `"Pedro"` en cualquier posición de su nombre.

> Pista: regex sin anclajes: `/Pedro/`.

---

## Ejercicio 2 — Empleados cuyo apellido contiene "ez"

Encontrar todos los empleados cuyo `apellido` **contenga** `"ez"` en cualquier posición (no sólo al final como en la sesión 2).

> Pista: `/ez/` — sin `$` la coincidencia puede estar al principio, al medio o al final.
>
> Comparar el resultado con el de la **Sesión 2 — Ejercicio 1** (`/ez$/`): ¿da la misma cantidad de documentos?, ¿hay alguno que aparezca acá y no allá (o viceversa)?
