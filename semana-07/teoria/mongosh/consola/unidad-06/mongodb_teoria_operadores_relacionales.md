# MongoDB en Consola — Operadores Relacionales

> **Fuente:** Apuntes UTN Avellaneda — Páginas 15 a 18

---

## 6. Operadores relacionales

En la unidad anterior usamos `find` con **igualdad implícita**:

```js
db.libros.find({ precio: 50 })
```

Eso sirve cuando queremos un valor exacto. Pero para condiciones más ricas (mayor que, menor que, distinto, dentro de un conjunto, ...) hay que usar **operadores relacionales**: palabras especiales que empiezan con `$` y van **dentro de un objeto** asociado al campo.

---

## La forma general

```js
db.coleccion.find({ <campo>: { <operador>: <valor> } })
```

El primer objeto sigue siendo el filtro. Ahora, en lugar de un valor literal, le pasamos **otro objeto** que indica el operador.

### Equivalencia de la igualdad

Estas dos consultas son **idénticas**:

```js
db.libros.find({ precio: 50 })              // forma corta (igualdad implícita)
db.libros.find({ precio: { $eq: 50 } })     // forma con operador explícito
```

> El apunte muestra `$eq` para que veamos que la igualdad es solo **un caso particular**: el resto de operadores siempre se escriben con esa forma `{ $op: valor }`.

---

## Listado de operadores relacionales

| Operador | Lectura | Significa | Equivalente SQL |
|---|---|---|---|
| `$eq`  | **eq**ual              | igual            | `=`  |
| `$ne`  | **n**ot **e**qual      | distinto         | `<>` |
| `$lt`  | **l**ess **t**han      | menor que        | `<`  |
| `$lte` | **l**ess **t**han **e**qual | menor o igual | `<=` |
| `$gt`  | **g**reater **t**han   | mayor que        | `>`  |
| `$gte` | **g**reater **t**han **e**qual | mayor o igual | `>=` |
| `$in`  | **in**                 | dentro del conjunto | `IN (..., ...)` |
| `$nin` | **n**ot **in**         | fuera del conjunto | `NOT IN (..., ...)` |

> **Truco para recordarlos:** los nombres son las iniciales en inglés. `gt` es "greater than", agregar una `e` final lo hace "or equal".

---

## Ejemplos sobre la colección `libros`

Para los ejemplos asumimos los 4 libros de la unidad 5:

| `_id` | `titulo` | `autor` | `editorial` | `precio` | `cantidad` |
|---|---|---|---|---|---|
| 1 | El aleph           | Borges         | [Siglo XXI, Planeta] | 20 | 50 |
| 2 | Martin Fierro      | Jose Hernandez | [Siglo XXI]          | 50 | 12 |
| 3 | Aprenda PHP        | Mario Molina   | [Siglo XXI, Planeta] | 50 | 20 |
| 4 | Java en 10 minutos | —              | [Siglo XXI]          | 45 | 1  |

### Menor que (`$lt`)

```js
db.libros.find({ precio: { $lt: 30 } })
```

→ `_id: 1` (precio 20). El único con precio menor a 30.

### Mayor que (`$gt`)

```js
db.libros.find({ precio: { $gt: 40 } })
```

→ `_id: 2, 3, 4` (precios 50, 50 y 45).

### Mayor o igual (`$gte`)

```js
db.libros.find({ cantidad: { $gte: 50 } })
```

→ `_id: 1` (cantidad 50).

### Distinto (`$ne`)

```js
db.libros.find({ cantidad: { $ne: 50 } })
```

→ `_id: 2, 3, 4` (todos los que NO tengan cantidad 50).

### Rango: combinar dos operadores en el mismo campo

Para expresar **entre** se ponen **dos operadores** en el mismo objeto:

```js
db.libros.find({ precio: { $gte: 20, $lte: 45 } })
```

→ Libros con precio entre 20 y 45 inclusive.

> **Importante:** los dos operadores se aplican al **mismo campo** y forman un AND.

### Dentro de un conjunto (`$in`)

```js
db.libros.find({ editorial: { $in: ['Planeta'] } })
```

→ Libros publicados por **'Planeta'** (al menos en uno de los valores del array editorial).

> Sobre **arrays**, `$in` busca documentos en los que **al menos un elemento** del array del documento esté en el array que pasamos al operador.

### Fuera de un conjunto (`$nin`)

```js
db.libros.find({ editorial: { $nin: ['Planeta'] } })
```

→ Libros que **no** son de 'Planeta'.

### `$in` con varios valores

```js
db.libros.find({ precio: { $in: [20, 45] } })
```

→ Libros con precio 20 **o** 45 (forma corta de OR sobre el mismo campo).

---

## Combinaciones útiles

### AND de dos campos (uno con operador y otro con igualdad)

```js
db.libros.find({ autor: 'Borges', precio: { $lt: 30 } })
```

→ Libros de Borges con precio menor a 30.

> Como ya sabemos, **varias claves en el mismo objeto** = AND.

### Rango cerrado

```js
db.libros.find({ cantidad: { $gte: 12, $lte: 20 } })
```

→ Libros con cantidad entre 12 y 20.

---

## Aclaración importante

Estos operadores **no son exclusivos de `find`**. También se usan en:

- `deleteMany({ filtro })` — borrar los que cumplen una condición
- `updateOne(...)` y `updateMany(...)` — modificar los que cumplen una condición
- `countDocuments({ filtro })` — contar
- Etapa `$match` del pipeline de agregación

Aprender bien estos operadores es **inversión que rinde** todo el resto del curso.

---

## Resumen de la unidad

```js
$eq   →  igual           db.libros.find({ precio: { $eq: 50 } })
$ne   →  distinto        db.libros.find({ precio: { $ne: 50 } })
$lt   →  menor           db.libros.find({ precio: { $lt: 30 } })
$lte  →  menor o igual   db.libros.find({ precio: { $lte: 45 } })
$gt   →  mayor           db.libros.find({ precio: { $gt: 40 } })
$gte  →  mayor o igual   db.libros.find({ cantidad: { $gte: 50 } })
$in   →  está en         db.libros.find({ editorial: { $in: ['Planeta'] } })
$nin  →  no está en      db.libros.find({ editorial: { $nin: ['Planeta'] } })

// Rango sobre el MISMO campo:
db.libros.find({ precio: { $gte: 20, $lte: 45 } })
```

| Forma | Significado |
|---|---|
| `{ campo: valor }` | igualdad implícita |
| `{ campo: { $op: valor } }` | operador relacional |
| `{ campo: { $op1: v1, $op2: v2 } }` | dos condiciones sobre el mismo campo (AND) |
| `{ a: 1, b: { $gt: 10 } }` | dos condiciones sobre **distintos** campos (AND) |
