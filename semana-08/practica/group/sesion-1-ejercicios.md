# Sesión 1 — `$group` — agrupar y contar (segunda vuelta)

> **Tema:** estructura del `$group`, el rol del `_id`, acumuladores básicos `$sum`, `$push`.
>
> **Material teórico:** `semana-07/teoria/mongosh/group/mongodb_teoria_group.md`.
>
> **Datos a usar:** colección `estudiantes` (la del PDF). Crear así desde `mongosh`:
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

## Ejercicio 1 — Cantidad de estudiantes por curso

Agrupar los estudiantes por `curso` y mostrar cuántos hay en cada uno.

Resultado esperado (orden no importa):

```js
{ _id: "A", cantidad: 3 }
{ _id: "B", cantidad: 3 }
{ _id: "C", cantidad: 1 }
```

> Pista: `$group` con `_id: "$curso"` y `cantidad: { $sum: 1 }`.

---

## Ejercicio 2 — Nombres de estudiantes por edad

Agrupar por `edad` y para cada edad guardar **un array `nombres`** con los nombres de los estudiantes que tienen esa edad.

Resultado esperado (orden interno del array no importa):

```js
{ _id: 17, nombres: ["Ana", "Luis", "Sofia"] }
{ _id: 18, nombres: ["Juan", "Carlos"] }
{ _id: 19, nombres: ["Maria"] }
{ _id: 20, nombres: ["Pablo"] }
```

> Pista: `$group` con `_id: "$edad"` y `nombres: { $push: "$nombre" }`.

---

## Ejercicio 3 — Totalizar todos los estudiantes en un solo grupo

Calcular **en un único documento** la cantidad total de estudiantes y la suma total de edades.

Resultado esperado:

```js
{ _id: null, totalEstudiantes: 7, sumaEdades: 126 }
```

> Pista: `_id: null` agrupa **todo** en un único grupo. Después `$sum: 1` para contar y `$sum: "$edad"` para sumar edades.
