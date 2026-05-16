# Sesión 2 — Acumuladores numéricos `$avg`, `$min`, `$max` (segunda vuelta)

> **Tema:** `$avg`, `$min`, `$max` combinados, varios campos calculados en un mismo `$group`.
>
> **Datos a usar:** la misma colección `estudiantes` de la Sesión 1 (con 7 documentos):
>
> ```js
> use semana8_group
> db.estudiantes.drop()
> db.estudiantes.insertMany([
>   { nombre: "Ana",   edad: 17, curso: "A" },
>   { nombre: "Juan",  edad: 18, curso: "A" },
>   { nombre: "Luis",  edad: 17, curso: "B" },
>   { nombre: "Maria", edad: 19, curso: "B" },
>   { nombre: "Pablo", edad: 20, curso: "A" },
>   { nombre: "Sofia", edad: 17, curso: "C" },
>   { nombre: "Carlos", edad: 18, curso: "B" }
> ])
> ```

---

## Ejercicio 1 — Estadísticas de edad por curso

Para cada `curso`, en un mismo `$group`, calcular:

- `cantidad`: cuántos estudiantes hay
- `edadProm`: promedio de edad
- `edadMin`: edad mínima
- `edadMax`: edad máxima

> Pista: en un mismo `$group` se pueden definir tantos campos calculados como hagan falta, usando distintos acumuladores sobre el mismo campo (`$avg`, `$min`, `$max`).

---

## Ejercicio 2 — Edad mínima y máxima global

Mostrar **un único documento** con la edad mínima y la edad máxima de **todos** los estudiantes (sin agrupar por curso).

Resultado esperado:

```js
{ _id: null, edadMin: 17, edadMax: 20 }
```

> Pista: `_id: null` agrupa todo en un único grupo. Sirve para calcular un total general.

---

## Ejercicio 3 — Curso con la edad promedio más alta

Calcular la edad promedio por curso y mostrar **solo el curso con la edad promedio más alta** (un único documento).

> Pista: hay dos formas:
>
> - `$group` por curso → `$sort` por `edadProm` descendente → `$limit: 1`.
> - `$group` con `$max` sobre `$avg` no es válido porque dentro de un mismo `$group` no podés usar acumulador sobre acumulador. La forma estándar es **dos etapas**: agrupar primero, después ordenar y limitar.

---

## Ejercicio 4 — Sumar las edades por curso, solo cursos con 2 o más

Para cada curso calcular `cantidad` y `sumaEdades`. Después, **filtrar solo los cursos con `cantidad >= 2`** y ordenar por `sumaEdades` descendente.

Resultado esperado (curso "C" se queda afuera porque tiene 1):

```js
{ _id: "A", cantidad: 3, sumaEdades: 55 }
{ _id: "B", cantidad: 3, sumaEdades: 54 }
```

> Pista: `$group` + `$match` (después del group, no antes) + `$sort`. El `$match` después del `$group` filtra **sobre los grupos**, no sobre los documentos originales.
