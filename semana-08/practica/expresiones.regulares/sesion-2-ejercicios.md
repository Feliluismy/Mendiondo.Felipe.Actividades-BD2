# Sesión 2 — Búsqueda en cualquier posición y modificador `i` (segunda vuelta)

> **Tema:** regex sin anclar (subcadena en cualquier posición) y modificador `i` (case-insensitive).
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

## Ejercicio 1 — Empleados con "ar" en el nombre

Encontrar los empleados cuyo `nombre` **contenga** la subcadena `"ar"` en **cualquier** posición (al inicio, al medio o al final). Sin importar mayúsculas/minúsculas. Mostrar `nombre` y `apellido`.

> Pista: `/ar/i`. Sin anclajes, matchea en cualquier posición; con `i`, también matchearía `"AR"`, `"Ar"`, etc.

---

## Ejercicio 2 — Películas con "amor" en el título

Encontrar las películas cuyo `titulo` **contenga** la subcadena `"amor"` sin distinguir mayús/minús. Mostrar `titulo` y `año`.

> Pista: `/amor/i`.

---

## Ejercicio 3 — Skills que contengan "script"

Cada empleado tiene un array `skills`. Encontrar los empleados que tengan **algún skill** que contenga la subcadena `"script"` (ejemplos: `"JavaScript"`, `"TypeScript"`). Sin distinguir mayús/minús. Mostrar `nombre`, `apellido` y `skills`.

> Pista: las regex sobre un campo array buscan que **algún elemento** del array matchee: `{ skills: /script/i }`.

---

## Ejercicio 4 — Directores con "del" o "DEL" en cualquier parte

Encontrar las películas cuyo `director` contenga la subcadena `"del"` sin distinguir mayús/minús (por ejemplo `"Guillermo del Toro"`). Mostrar `titulo` y `director`.

> Pista: `{ director: /del/i }`.
