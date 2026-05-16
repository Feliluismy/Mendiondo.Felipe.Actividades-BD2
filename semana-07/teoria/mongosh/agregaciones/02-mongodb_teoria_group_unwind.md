# MongoDB en Consola — Agregación (Parte 2): `$group`, `$unwind`, `$sortByCount`

> **Fuente:** Apuntes UTN Avellaneda — *Base de Datos II — Agregación* (Yanina Scudero)
>
> **Etapas cubiertas en esta parte:** `$group`, `$unwind`, `$sortByCount`. (`$sort` ya se vio en la Parte 1; aquí lo combinamos con las nuevas etapas.)
>
> **Datos de prueba:** los ejemplos usan **dos** colecciones:
>
> - `estudiantes` (campos `nombre`, `apellido`, `edad`, `curso`, `programa`) — para `$group`, `$sortByCount` por `programa`, y los ejemplos con expresiones booleanas como `{ $lt: ["$edad", 18] }`.
> - `universities` (campos `country`, `city`, `name`, `students` como **array de subdocumentos**) — para el ejemplo de `$unwind` con la USAL de Salamanca.
>
> Cargar los dos datasets:
>
> ```js
> use base1
> load("data-estudiantes.js")
> load("data-universities.js")
> ```
>
> Los dos archivos están en `semana-07/data_files/`.

---

## `$group` — agrupar documentos

```js
{ $group: { _id: <expresión>, <campo>: { <acumulador>: <expresión> }, ... } }
```

- Agrupa los documentos según una **expresión** (por ejemplo, el valor de un campo).
- **Genera un documento por cada grupo** que será la salida de la etapa.
- El `_id` es **obligatorio**: su valor es **el resultado de la expresión** que define la clave del grupo.
- Junto con `_id` se pueden definir **campos adicionales calculados** mediante **acumuladores** (`$sum`, `$avg`, `$min`, `$max`, `$push`, `$addToSet`, etc.).

### Ejemplo: contar estudiantes por programa

```js
db.estudiantes.aggregate([
  { $group: { _id: "$programa", count: { $sum: 1 } } }
])
```

- `_id: "$programa"` → un grupo por cada valor distinto de `programa`.
- `count: { $sum: 1 }` → suma 1 por cada documento del grupo (es el clásico contador).

> **Nota sobre el `$`:** `"$programa"` significa "el valor del campo `programa` en el documento de entrada". Sin el `$` sería el literal string `"programa"`.

### Acumuladores frecuentes

| Acumulador | Para qué |
|---|---|
| `$sum: 1` | Cuenta documentos del grupo |
| `$sum: "$campo"` | Suma los valores del campo |
| `$avg: "$campo"` | Promedia |
| `$min: "$campo"` / `$max: "$campo"` | Mínimo / máximo |
| `$push: "$campo"` | Junta TODOS los valores en un array (acepta repetidos) |
| `$addToSet: "$campo"` | Igual que `$push` pero **sin repetidos** |
| `$first` / `$last` | Primer / último valor del grupo (depende del orden de entrada) |

### Ejemplo con `$push` (juntar valores)

```js
// Agrupa por "es menor de edad o no" (true/false) y junta las edades
db.estudiantes.aggregate([
  { $group: {
      _id: { $lt: [ "$edad", 18 ] },
      edades: { $push: { edad: "$edad" } }
  }}
])
```

- La expresión `{ $lt: [ "$edad", 18 ] }` devuelve **`true`** o **`false`** → solo dos grupos.
- `$push` arma un array con la edad de cada documento que cayó en ese grupo.

---

## `$unwind` — descomponer un array

```js
{ $unwind: <expresión que apunta a un array> }
```

Si un documento tiene un **campo array**, `$unwind` **emite un documento por cada elemento del array**, copiando los demás campos. Es indispensable para trabajar (filtrar, ordenar, agrupar) por valores que viven dentro de un array.

### Documento original (colección `universities`)

```js
{
  country: 'Spain',
  city: 'Salamanca',
  name: 'USAL',
  students: [
    { year: 2014, number: 24774 },
    { year: 2015, number: 23166 },
    { year: 2016, number: 21913 },
    { year: 2017, number: 21715 }
  ]
}
```

### Pipeline con `$unwind`

```js
db.universities.aggregate([
  { $match:   { name: 'USAL' } },
  { $unwind:  '$students' },
  { $project: { _id: 0, 'students.year': 1, 'students.number': 1 } },
  { $sort:    { 'students.number': -1 } }
])
```

→ El array de 4 elementos se "abre" en 4 documentos independientes, uno por año, que después se proyectan y ordenan.

> Sin `$unwind` no podríamos ordenar la universidad por la cantidad de alumnos de cada año, porque ese dato está adentro del array.

---

## `$sortByCount` — agrupar y ordenar por cantidad

```js
{ $sortByCount: <expresión> }
```

Es un **atajo** muy útil. Equivale a:

```js
{ $group: { _id: <expresión>, count: { $sum: 1 } } },
{ $sort:  { count: -1 } }
```

Es decir: **agrupa por la expresión, cuenta cuántos documentos hay en cada grupo y ordena de mayor a menor**.

### Ejemplo: rankear los programas por cantidad de estudiantes

```js
db.estudiantes.aggregate([
  { $sortByCount: "$programa" }
])
// →
// { _id: 'Tecnicatura', count: 5 }
// { _id: 'Ingenieria',  count: 3 }
// { _id: 'Posgrado',    count: 2 }
```

---

## `$sort` (recordatorio)

```js
{ $sort: { campo: 1 | -1 } }
```

- `1` → ascendente.
- `-1` → descendente.

Se puede usar **antes** de `$group` (para que `$first`/`$last` tengan sentido) o **después** de `$group` (para ordenar los grupos resultantes).

```js
db.empleados.aggregate([
  { $sort:    { nombre: -1 } },
  { $project: { _id: 0, nombre: 1 } }
])
// → [ { nombre: 'Pedro' }, { nombre: 'Juan' }, { nombre: 'Ana' } ]
```

---

## Equivalencia con SQL

| MongoDB (pipeline) | SQL |
|---|---|
| `{ $group: { _id: "$x", n: { $sum: 1 } } }` | `SELECT x, COUNT(*) AS n GROUP BY x` |
| `{ $group: { _id: "$x", t: { $sum: "$importe" } } }` | `SELECT x, SUM(importe) AS t GROUP BY x` |
| `{ $group: { _id: "$x", a: { $avg: "$nota" } } }` | `SELECT x, AVG(nota) AS a GROUP BY x` |
| `{ $sortByCount: "$x" }` | `SELECT x, COUNT(*) c GROUP BY x ORDER BY c DESC` |
| `{ $unwind: "$arr" }` | (no tiene equivalente directo: SQL no anida arrays) |

---

## Consejos finales

- En `$group`, **siempre** tenés que definir `_id` (puede ser `null` para "agrupar todos en uno solo").
- Para contar, lo más idiomático es `count: { $sum: 1 }`.
- Si vas a **filtrar por un campo dentro de un array**, primero `$unwind` y después `$match` (o usar operadores como `$elemMatch` en el filtro original, según el caso).
- `$sortByCount` ahorra escritura cuando el resultado deseado es un *ranking*.
