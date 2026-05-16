# Sesión 2 — Índices simples, compuestos y únicos (unidades 21–22)

> **Tema:** `createIndex`, índice simple, compuesto, único, `getIndexes`, `explain('executionStats')`.
>
> **Material teórico:** `semana-07/teoria/mongosh/consola/unidad-21/mongodb_teoria_indices.md` y `unidad-22/mongodb_teoria_indices_simples_compuestos.md`.
>
> **Datos a usar:** `data-peliculas.js` y `data-empleados.js`.
>
> **Cómo cargar los datos** (desde `mongosh`):
>
> ```js
> use semana8_indices
> load("data-peliculas.js")
> load("data-empleados.js")
> ```

---

## Ejercicio 1 — Listar índices iniciales (simple)

Antes de crear nada, listar **todos los índices** que tienen las colecciones `peliculas` y `empleados`. Responder en una línea: ¿cuántos índices tiene cada una y cuál es?

> Pista: `db.peliculas.getIndexes()` y `db.empleados.getIndexes()`. Toda colección recién creada arranca con un único índice.

---

## Ejercicio 2 — Índice simple ascendente sobre `pais` (simple)

Crear un **índice simple ascendente** sobre el campo `pais` de la colección `peliculas`. Después, volver a listar los índices y verificar que aparezca el nuevo. Anotar el `name` autogenerado.

> Pista: `createIndex({ pais: 1 })`. El nombre que MongoDB le pone es la concatenación `<campo>_<orden>`.

---

## Ejercicio 3 — Verificar el uso del índice con `explain` (simple)

Sobre `peliculas`, ejecutar esta consulta con `explain('executionStats')`:

```js
db.peliculas.find({ pais: "Argentina" }).explain('executionStats')
```

Buscar en la salida estos tres datos y anotarlos:

- `winningPlan.stage` (o `winningPlan.inputStage.stage`) — ¿dice `IXSCAN` o `COLLSCAN`?
- `totalKeysExamined` — cuántas entradas del índice se leyeron.
- `totalDocsExamined` — cuántos documentos se abrieron.

> Pista: si el `stage` es `IXSCAN` quiere decir que el índice se está usando. Si es `COLLSCAN`, MongoDB está recorriendo toda la colección.

---

## Ejercicio 4 — Índice compuesto (avanzado)

Crear un **índice compuesto** sobre `(estudio, año)` (ascendente en los dos) en `peliculas`. Después ejecutar las siguientes tres consultas con `explain('executionStats')` y anotar para cada una si usa el índice o no:

1. `db.peliculas.find({ estudio: "Paramount" })`
2. `db.peliculas.find({ estudio: "Paramount", año: 1972 })`
3. `db.peliculas.find({ año: 1972 })`

> Pista: el orden de los campos del índice compuesto importa. La regla general es: el índice `{ A: 1, B: 1 }` ayuda a consultas que filtran por `A` solo, o por `A` y `B`, pero **no** a una consulta que filtre solo por `B`.

---

## Ejercicio 5 — Índice único sobre empleados (avanzado)

En `empleados` no hay un campo "número de legajo" pero **`_id`** ya es único por defecto. Para practicar, crear un índice **único** sobre el campo `nombre` de la colección `empleados`.

Después intentar insertar este documento:

```js
db.empleados.insertOne({
  _id: 99,
  nombre: "Juan",
  apellido: "Test",
  edad: 25,
  sueldo: 500000,
  idDepto: 1,
  activo: true
})
```

¿Qué error devuelve MongoDB? Anotar el código de error y el mensaje. Después **eliminar el índice** que crearon para no romper futuros ejercicios.

> Pista: `createIndex({ nombre: 1 }, { unique: true })` y al final `dropIndex({ nombre: 1 })`. Los nombres únicos en empleados no se mantienen en la práctica — este ejercicio es solo para ver el comportamiento del índice único.
