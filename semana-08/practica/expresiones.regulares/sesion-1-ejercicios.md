# Sesión 1 — Anclajes `^` y `$` (segunda vuelta)

> **Tema:** búsquedas por **inicio** (`^`) y **fin** (`$`) de cadena.
>
> **Material teórico:** `semana-07/teoria/mongosh/expresiones.regulares/mongodb_teoria_expresiones_regulares.md`.
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

## Ejercicio 1 — Apellidos que terminan en "ez"

Encontrar los empleados cuyo `apellido` **termine** con `"ez"` (típica terminación patronímica en castellano: Pérez, López, Suárez, Gómez, ...). Mostrar `nombre`, `apellido` y `sueldo`.

> Pista: anclaje al final → `/ez$/`.

---

## Ejercicio 2 — Películas cuyo título empieza con un dígito

Encontrar las películas cuyo `titulo` **empiece** con un **número** (un dígito del 0 al 9), por ejemplo `"12 Monos"`, `"007: Casino Royale"`, etc. Mostrar `titulo` y `año`.

> Pista: una clase de caracteres dentro de la regex: `/^[0-9]/`. El `^` ancla al inicio y `[0-9]` matchea cualquier dígito.

---

## Ejercicio 3 — Directores cuyo nombre empieza con "Q"

Encontrar las películas cuyo `director` **empiece** con la letra `"Q"` (mayúscula). Mostrar `titulo` y `director`.

> Pista: `{ director: /^Q/ }`. Sin el modificador `i`, la regex distingue mayúscula de minúscula.
