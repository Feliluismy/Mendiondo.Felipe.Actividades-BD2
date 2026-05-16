# MongoDB en Consola — Agregación (Parte 1): Pipeline básico

> **Fuente:** Apuntes UTN Avellaneda — *Base de Datos II — Agregación* (Yanina Scudero)
>
> **Etapas cubiertas en esta parte:** introducción al pipeline, `$match`, `$count`, `$project` (incluye alias y `$concat`), `$sort`, `$limit`, `$skip`.
>
> **Datos de prueba:** los ejemplos usan la colección `estudiantes` (campos `nombre`, `apellido`, `edad`, `curso`, `programa`). El dataset está en `semana-07/data_files/data-estudiantes.js`. Cargar con:
>
> ```js
> use base1
> load("data-estudiantes.js")
> ```
>
> El primer ejemplo del PDF (`db.orders.aggregate(...)` con `$match` + `$group`) es conceptual y no requiere cargar `orders` — se ilustra el concepto, no la ejecución. Los demás ejemplos sí corren sobre `estudiantes`.

---

## ¿Qué es la agregación?

Las **operaciones de agregación** procesan los datos almacenados en una colección y devuelven resultados calculados (totales, conteos, agrupamientos, ordenamientos, etc.).

Se suelen comparar con `GROUP BY` y `COUNT` de SQL, pero **incluyen más**: ordenar (`sort`), limitar (`limit`), proyectar (`project`), unir colecciones (`lookup`), etc.

MongoDB ofrece **3 alternativas** para hacer agregación:

1. **Tubería de agregación** (*aggregation pipeline*) ← la más usada y la que vemos aquí.
2. **MapReduce**.
3. **Operaciones de agregación con propósito simple** (atajos como `countDocuments`, `distinct`).

---

## Tubería de agregación (*aggregation pipeline*)

Se invoca con el método `aggregate` sobre la colección:

```js
db.collection.aggregate( [ { <etapa> }, { <etapa> }, ... ] );
```

- Recibe un **arreglo de etapas** (*stages*).
- Cada etapa es **un objeto** con un único **operador de etapa** (`$match`, `$group`, `$sort`, etc.) y una expresión.
- La **salida de una etapa es la entrada de la siguiente** — como una tubería de Unix.
- La última etapa devuelve el resultado final.

### Diagrama conceptual

```
Colección  →  $match  →  $group  →  $sort  →  Resultado
            (filtra)  (agrupa)  (ordena)
```

### Ejemplo del PDF

```js
db.orders.aggregate([
  { $match: { status: "A" } },
  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
])
```

1. `$match` deja sólo las órdenes con `status: "A"`.
2. `$group` agrupa por `cust_id` y suma el `amount` de cada cliente.

> Cuando un campo aparece como **valor** en una expresión, se lo referencia con el prefijo **`$`**: `"$cust_id"`, `"$amount"`. Es lo que distingue al *nombre del campo* de un *literal*.

---

## `$match` — filtrar documentos

Funciona igual que el filtro de `find()`: pasa a la siguiente etapa **sólo** los documentos que cumplen la condición.

```js
db.estudiantes.aggregate([
  { $match: { nombre: 'Juan' } }
])
```

Acepta cualquier operador de filtro (`$gt`, `$lt`, `$in`, `$or`, etc.).

> **Buena práctica:** poner `$match` **lo más temprano posible** en la tubería, para reducir la cantidad de documentos que recorren las etapas siguientes (y aprovechar índices).

---

## `$count` — contar documentos en la etapa actual

Devuelve un único documento con el **número de documentos que entraron a esta etapa**. El parámetro es un **string** que actúa como nombre/alias del campo en el resultado.

```js
db.estudiantes.aggregate([
  { $match: { edad: { $lt: 20 } } },
  { $count: "Estudiantes menores a 20 años" }
])
// → [ { "Estudiantes menores a 20 años": 7 } ]
```

> Cuenta los documentos **después** de las etapas anteriores. Si va al principio (sin `$match` previo), cuenta toda la colección.

---

## `$project` — seleccionar / transformar campos

Permite **elegir** qué campos se muestran y **renombrar** o **calcular** nuevos.

### a) Inclusión / exclusión

```js
//  Mostrar (1)   No mostrar (0)
db.estudiantes.aggregate([
  { $project: { nombre: 1, _id: 0 } }
])
```

> El `_id` se muestra **por defecto**. Si no lo querés, hay que excluirlo explícitamente con `_id: 0`.

### b) Crear alias para los campos

Los nombres nuevos van a la izquierda; el valor es el campo original con prefijo `$` entre comillas:

```js
db.estudiantes.aggregate([
  { $project: { _id: 0, Nom: "$nombre", Ape: "$apellido" } }
])
```

### c) Operadores de string (ej. `$concat`)

`$project` admite **expresiones** que transforman datos. `$concat` une strings.

```js
db.estudiantes.aggregate([
  { $project: {
      _id: 0,
      nombre_Completo: { $concat: [ "$nombre", " ", "$apellido" ] }
  }}
])
```

Existen muchos otros operadores de string (`$toUpper`, `$toLower`, `$substr`, etc.).

---

## `$sort` — ordenar

Ordena los documentos según uno o más campos.

- `1` → ascendente.
- `-1` → descendente.

```js
db.estudiantes.aggregate([
  { $project: { nombre: 1, edad: 1, _id: 0 } },
  { $sort:    { edad: 1 } }
])
```

Se pueden combinar varios campos: `{ apellido: 1, nombre: 1 }`.

---

## `$limit` — limitar la cantidad de documentos

Recibe un entero N: deja pasar **sólo los primeros N** documentos.

```js
db.estudiantes.aggregate([
  { $project: { nombre: 1, edad: 1, _id: 0 } },
  { $sort:    { edad: 1 } },
  { $limit:   3 }
])
// → los 3 estudiantes más jóvenes
```

---

## `$skip` — saltar los primeros N documentos

Descarta los primeros N documentos de la entrada y deja pasar el resto. Combinado con `$limit` permite **paginación**.

```js
db.estudiantes.aggregate([
  { $project: { nombre: 1, edad: 1, _id: 0 } },
  { $sort:    { edad: 1 } },
  { $skip:    2 },
  { $limit:   3 }
])
// → estudiantes en las posiciones 3, 4 y 5 ordenados por edad
```

---

## Resumen — orden típico de las etapas

| # | Etapa | Para qué |
|---|---|---|
| 1 | `$match` | Filtrar lo más temprano posible |
| 2 | `$project` | Quedarse con los campos relevantes / crear alias |
| 3 | `$sort` | Ordenar |
| 4 | `$skip` | Paginar (saltar) |
| 5 | `$limit` | Paginar / limitar |
| — | `$count` | Reemplaza el resultado por el conteo |

> El orden importa: por ejemplo `$skip` antes de `$sort` salta documentos en el orden natural y rara vez es lo que querés.

---

## Equivalencia con SQL

| MongoDB (pipeline) | SQL |
|---|---|
| `{ $match: { x: 1 } }` | `WHERE x = 1` |
| `{ $project: { a: 1, b: 1 } }` | `SELECT a, b` |
| `{ $project: { Nom: "$nombre" } }` | `SELECT nombre AS Nom` |
| `{ $sort: { edad: 1 } }` | `ORDER BY edad ASC` |
| `{ $limit: 3 }` | `LIMIT 3` |
| `{ $skip: 2 }, { $limit: 3 }` | `LIMIT 3 OFFSET 2` |
| `{ $count: "n" }` | `SELECT COUNT(*) AS n` |
