# Sesión 5 — Combinaciones (anclajes + `i` + otros operadores)

> **Tema:** combinar lo aprendido — anclajes con `i`, y mezclar regex con otros operadores de filtro usando `$regex`.
>
> **Datos a usar:** `data-empleados.js` y `data-peliculas.js`.

---

## Ejercicio 1 — Películas que empiezan con "el" sin distinguir mayús/minús

Encontrar todas las películas cuyo `titulo` **empiece con** `"el "` (la palabra "el" seguida de un espacio) **sin distinguir** mayúsculas/minúsculas. Tendrían que matchear tanto los títulos `"El padrino"`, `"El club de la pelea"`, etc., como cualquier otro que empezara con `"EL "` o `"el "`.

> Pista: combinar el anclaje `^` con el modificador `i`: `/^el /i`.

---

## Ejercicio 2 — Empleados con nombre en "M" y sueldo alto

Encontrar todos los empleados que cumplan **simultáneamente** dos condiciones:

- el `nombre` empiece con `"M"` (mayúscula),
- el `sueldo` sea **mayor a 800000**.

> Pista: cuando hay que combinar una regex con otros operadores en el mismo filtro conviene usar la forma con `$regex`:
>
> ```js
> { nombre: { $regex: /^M/ }, sueldo: { $gt: 800000 } }
> ```
>
> La forma corta `{ nombre: /^M/ }` también funciona acá; la forma con `$regex` es la idiomática cuando queremos dejar claro que la regex es **uno** de varios criterios.
