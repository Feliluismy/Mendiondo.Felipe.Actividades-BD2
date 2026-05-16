# Sesión 5 — Regex insensible a mayúsculas/minúsculas `i` (repaso de semana-07)

> Ejercicios tomados de `semana-07/practica/expresiones.regulares/sesion-4-ejercicios.md`.
>
> **Tema:** modificador `i` para ignorar la diferencia entre mayúsculas y minúsculas.
>
> **Datos a usar:** `data-empleados.js`, `data-departamentos.js` y `data-peliculas.js`.
>
> **Cómo cargar los datos:**
>
> ```js
> use semana8_regex_repaso
> load("data-empleados.js")
> load("data-departamentos.js")
> load("data-peliculas.js")
> ```

---

## Ejercicio 1 — Empleados con algún skill que contenga "java"

Encontrar todos los empleados que tengan en su array `skills` algún skill que **contenga la subcadena `"java"`** sin distinguir mayúsculas/minúsculas (debería matchear `"Java"`, `"JavaScript"`, `"java"`, etc.).

> Pista: `/java/i`. La regex sobre un campo array busca un elemento del array que matchee.

---

## Ejercicio 2 — Películas cuyo estudio contenga "studio" sin distinguir mayús/minús

Encontrar todas las películas cuyo campo `estudio` **contenga** la subcadena `"studio"` en cualquier posición y **sin** distinguir mayúsculas/minúsculas (así matchea tanto `"Studio Ghibli"` como, por ejemplo, `"studio canal"`, etc.).

> Pista: `/studio/i`.
