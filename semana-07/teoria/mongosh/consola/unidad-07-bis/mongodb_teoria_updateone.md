# MongoDB en Consola — Modificar documentos con `updateOne`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 23 a 28
> *(Esta es la **segunda** sección numerada como "7" en el libro: la primera fue sobre `deleteOne`/`deleteMany`. La identificamos como "unidad 7-bis" porque cubre la operación faltante del CRUD: modificar.)*

---

## 7. Completar el CRUD: modificación

Hasta ahora vimos tres de las cuatro operaciones fundamentales:

| CRUD | Acción | Método |
|---|---|---|
| **C**reate | Insertar | `insertOne`, `insertMany` |
| **R**ead | Recuperar | `find` |
| **U**pdate | **Modificar** | **`updateOne`, `updateMany`** ← esta unidad |
| **D**elete | Eliminar | `deleteOne`, `deleteMany` |

`updateOne` modifica **el primer documento** que cumple un filtro. Más adelante veremos `updateMany` para varios.

---

## Forma general de `updateOne`

```js
db.coleccion.updateOne(
  <filtro>,        // a qué documento aplicarle el cambio
  <actualizacion>  // qué cambio aplicar (con operadores $)
)
```

| Parámetro | Significado |
|---|---|
| `<filtro>` | Igual que en `find`/`delete`: el objeto que identifica al documento (típicamente `{ _id: ... }`) |
| `<actualizacion>` | Objeto que **debe empezar con un operador** de actualización (`$set`, `$unset`, `$push`, `$pull`, ...) |

### Resultado

```js
{
  "acknowledged":  true,
  "matchedCount":  1,    // cuántos cumplían el filtro
  "modifiedCount": 1     // cuántos efectivamente cambiaron
}
```

> `matchedCount` y `modifiedCount` pueden diferir: si el documento ya tenía exactamente esos valores, MongoDB lo encuentra (matched) pero no lo modifica (modified = 0).

---

## `$set` — modificar (o crear) campos

Cambia uno o varios campos de un documento. Si el campo no existía, lo **crea**.

### Modificar campos existentes

```js
db.libros.updateOne(
  { _id: { $eq: 1 } },
  { $set: { precio: 15, cantidad: 1 } }
)
```

Antes:

```js
{ _id: 1, titulo: 'El aleph', precio: 20, cantidad: 50, ... }
```

Después:

```js
{ _id: 1, titulo: 'El aleph', precio: 15, cantidad: 1, ... }
```

### Agregar un campo nuevo (esquema flexible)

En MongoDB **los documentos no obligan a tener todos los mismos campos**. Si querés agregar un campo nuevo a un solo documento, lo hacés con `$set`:

```js
db.libros.updateOne(
  { _id: { $eq: 4 } },
  { $set: { descripcion: 'Cada unidad trata un tema fundamental de Java desde 0.' } }
)
```

A partir de ese momento, el libro `_id: 4` tiene un campo `descripcion` que **los demás documentos no tienen** — y eso es totalmente válido.

---

## `$unset` — eliminar un campo

Elimina **el campo entero** del documento.

```js
db.libros.updateOne(
  { _id: { $eq: 4 } },
  { $unset: { descripcion: '' } }
)
```

> El valor pasado a `$unset` (en este caso `''`) **se ignora**. Solo importa el nombre del campo. Por convención se pasa `''`, pero podría ser `1`, `null` o cualquier cosa.

### Diferencia importante: `$unset` vs `$set` con `''`

| Operación | Resultado |
|---|---|
| `$set: { descripcion: '' }` | El campo `descripcion` **sigue existiendo** y vale `''` |
| `$unset: { descripcion: '' }` | El campo `descripcion` **deja de existir** |

Esto importa para consultas que verifican existencia, índices y tamaño del documento.

---

## Operadores para arrays: `$push` y `$pull`

Cuando el campo es un **array**, hay operadores específicos para agregar/quitar elementos sin reescribirlo entero.

### `$push` — agregar un elemento al final

```js
db.libros.updateOne(
  { _id: { $eq: 1 } },
  { $push: { editorial: 'Atlántida' } }
)
```

Antes: `editorial: ['Siglo XXI', 'Planeta']`
Después: `editorial: ['Siglo XXI', 'Planeta', 'Atlántida']`

### `$pull` — eliminar un elemento por valor

```js
db.libros.updateOne(
  { _id: { $eq: 1 } },
  { $pull: { editorial: 'Atlántida' } }
)
```

Antes: `editorial: ['Siglo XXI', 'Planeta', 'Atlántida']`
Después: `editorial: ['Siglo XXI', 'Planeta']`

> `$pull` quita **todas** las apariciones de ese valor en el array. Si el elemento no estaba, no pasa nada (matchedCount sí, modifiedCount = 0).

---

## Otros operadores de actualización (anticipo)

El apunte sugiere consultar la página oficial. Algunos que se usan mucho:

| Operador | Qué hace |
|---|---|
| `$inc` | Suma un valor numérico al campo (ej. `{ $inc: { stock: -1 } }`) |
| `$mul` | Multiplica un campo numérico |
| `$rename` | Renombra un campo |
| `$min` / `$max` | Solo actualiza si el nuevo valor es menor/mayor |
| `$addToSet` | Como `$push` pero **sin duplicar** elementos en el array |
| `$pop` | Quita el primer (`-1`) o último (`1`) elemento del array |
| `$pullAll` | Quita varios valores del array a la vez |

---

## El error típico: olvidar el operador `$`

```js
// ❌ MAL — esto sobrescribiría TODO el documento (excepto _id)
db.libros.updateOne(
  { _id: 1 },
  { precio: 15 }            // sin $set
)
```

Este patrón está **deprecado** en `updateOne` y devuelve un error en versiones modernas. La forma correcta es siempre con un operador:

```js
// ✅ BIEN
db.libros.updateOne(
  { _id: 1 },
  { $set: { precio: 15 } }
)
```

> **Idea para llevarte:** el segundo parámetro **siempre** empieza con un operador (`$set`, `$unset`, `$push`, `$pull`, `$inc`, ...).

---

## Resumen de la unidad

| Operación | Sintaxis |
|---|---|
| Modificar un campo | `updateOne(<filtro>, { $set: { campo: valor } })` |
| Modificar varios campos a la vez | `updateOne(<filtro>, { $set: { a: 1, b: 2 } })` |
| Agregar un campo nuevo | `updateOne(<filtro>, { $set: { nuevo: 'X' } })` |
| Eliminar un campo | `updateOne(<filtro>, { $unset: { campo: '' } })` |
| Agregar al array | `updateOne(<filtro>, { $push: { arr: 'X' } })` |
| Quitar del array | `updateOne(<filtro>, { $pull: { arr: 'X' } })` |

```js
// Patrón completo
db.libros.updateOne(
  { _id: { $eq: 1 } },                       // qué documento
  { $set: { precio: 15, cantidad: 1 } }      // qué cambiar
)

// Resultado
// { acknowledged: true, matchedCount: 1, modifiedCount: 1 }
```
