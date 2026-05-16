# Sesión 1 — Regex con anclaje de inicio `^`

> **Tema:** búsqueda por **comienzo de cadena** con `/^patron/`.
>
> **Datos a usar:** `data-empleados.js` y `data-peliculas.js`.
>
> **Cómo cargar los datos** (desde `mongosh`):
>
> ```js
> use semana7_regex
> load("data-empleados.js")
> load("data-peliculas.js")
> ```

---

## Ejercicio 1 — Empleados cuyo nombre empieza con "M"

Encontrar todos los empleados cuyo `nombre` **comience** con la letra **M** (mayúscula). Mostrar todos los campos del documento.

> Pista: `find` con regex anclada al inicio: `/^M/`.

---

## Ejercicio 2 — Películas cuyo título empieza con "El "

Encontrar todas las películas cuyo `titulo` **comience** con la cadena `"El "` (la palabra "El" seguida de un espacio).

> Pista: el espacio cuenta como un carácter más dentro de la regex: `/^El /`.
