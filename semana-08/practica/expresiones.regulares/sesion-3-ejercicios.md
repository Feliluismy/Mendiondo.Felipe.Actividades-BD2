# Sesión 3 — Combinaciones: regex + otros operadores (segunda vuelta)

> **Tema:** combinar regex con `$gt`, `$lt`, `$in`, `$and`, `$or`, usar `$regex` cuando hay varios criterios.
>
> **Datos a usar:** `data-empleados.js` y `data-peliculas.js`.
>
> **Cómo cargar los datos:**
>
> ```js
> use semana8_regex
> load("data-empleados.js")
> load("data-peliculas.js")
> ```

---

## Ejercicio 1 — Apellido en "z" + sueldo bajo

Encontrar los empleados que cumplan **las dos** condiciones:

- el `apellido` **termine en `"z"`** (sin distinguir mayús/minús)
- el `sueldo` sea **menor a 900000**

Mostrar `nombre`, `apellido` y `sueldo`. Ordenar por `sueldo` ascendente.

> Pista: idiomáticamente, cuando combinás regex con otros operadores, usá la forma con `$regex`:
>
> ```js
> { apellido: { $regex: /z$/i }, sueldo: { $lt: 900000 } }
> ```

---

## Ejercicio 2 — Películas de un país que empieza con "E" y calificación alta

Encontrar las películas cuyo `pais` **empiece con `"E"`** (mayúscula) **y** tengan `calificacion >= 8`. Mostrar `titulo`, `pais` y `calificacion`. Ordenar por `calificacion` descendente.

> Pista:
>
> ```js
> { pais: { $regex: /^E/ }, calificacion: { $gte: 8 } }
> ```

---

## Ejercicio 3 — Empleados con skill "java" o "python", activos y sueldo > 800000

Encontrar los empleados que cumplan **las tres** condiciones:

- tengan **algún skill** que contenga `"java"` o `"python"` (sin distinguir mayús/minús).
- estén `activo: true`
- tengan `sueldo > 800000`

Mostrar todos los campos. Ordenar por `sueldo` descendente.

> Pista: para "skill que contenga java **o** python" lo más simple es usar `$or` con dos regex sobre `skills`:
>
> ```js
> {
>   $or: [{ skills: /java/i }, { skills: /python/i }],
>   activo: true,
>   sueldo: { $gt: 800000 }
> }
> ```

---

## Ejercicio 4 — Películas con "el" al inicio del título y posteriores a 2000

Encontrar las películas cuyo `titulo` **empiece con `"el "`** (la palabra "el" seguida de un espacio) **sin distinguir** mayús/minús, **y** que sean del año `2000` o posterior. Mostrar `titulo` y `año`.

> Pista: `^el ` con modificador `i`:
>
> ```js
> { titulo: { $regex: /^el /i }, año: { $gte: 2000 } }
> ```
