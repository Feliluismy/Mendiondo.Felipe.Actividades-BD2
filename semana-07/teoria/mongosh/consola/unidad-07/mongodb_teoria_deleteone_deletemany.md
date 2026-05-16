# MongoDB en Consola — `deleteOne` y `deleteMany`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 19 a 22

---

## 7. Borrar documentos con filtros

En la unidad 4 vimos `deleteMany({})` para vaciar una colección entera. En la unidad 6 aprendimos los **operadores relacionales** (`$eq`, `$lt`, `$gte`, `$ne`, ...) que se usan dentro del filtro de `find`.

En esta unidad **combinamos las dos cosas**: vamos a borrar **solo** los documentos que cumplan una condición, usando los mismos operadores.

> **Idea clave:** los filtros que armaste para `find` se reutilizan tal cual en `delete*`. Si una consulta `find` devuelve los documentos que querés borrar, ese mismo filtro pasado a `deleteMany` los elimina.

---

## Los dos métodos

| Método | Qué borra |
|---|---|
| **`deleteOne(<filtro>)`** | El **primer** documento que coincide con el filtro |
| **`deleteMany(<filtro>)`** | **Todos** los documentos que coinciden con el filtro |

Ambos reciben un objeto `<filtro>` con la misma sintaxis que `find`.

### Resultado de la operación

```js
{ "acknowledged" : true, "deletedCount" : N }
```

Donde `N` es la cantidad real de documentos borrados.

---

## Borrar por `_id`: el caso típico de `deleteOne`

```js
db.libros.deleteOne({ _id: 1 })
```

- Como `_id` es **único**, sabemos que **solo un documento** puede cumplir esa condición.
- Por eso es **buena práctica** usar `deleteOne` cuando la condición es por `_id`: comunica la intención y evita que un bug accidental borre más de lo previsto.

### Resultado

```js
{ "acknowledged" : true, "deletedCount" : 1 }
```

### Sintaxis alternativa con `$eq`

```js
db.libros.deleteOne({ _id: { $eq: 1 } })   // equivalente al de arriba
```

Las dos formas funcionan exactamente igual. La primera es la **abreviada**; la segunda es la **explícita**.

> **Importante:** la abreviatura sin `$` solo existe para la **igualdad**. Para los demás operadores (`$lt`, `$gte`, `$ne`, ...) **es obligatorio** escribirlos con su nombre.

---

## Borrar varios con `deleteMany` y operadores

Para borrar **todos los libros con precio mayor o igual a 50**:

```js
db.libros.deleteMany({ precio: { $gte: 50 } })
```

Si la colección tiene 4 libros y dos cumplen la condición:

```js
{ "acknowledged" : true, "deletedCount" : 2 }
```

> Cualquier filtro válido para `find` también es válido para `deleteMany`. Si te quedó una duda sobre qué se va a borrar, **probá primero con `find`** y después aplicá `deleteMany` con el mismo filtro.

---

## Patrón seguro: `find` antes de `delete`

Antes de un `deleteMany` en datos importantes, conviene hacer **el mismo filtro con `find`** para confirmar lo que se va a borrar:

```js
// 1. Ver qué se borraría
db.libros.find({ precio: { $gte: 50 } })

// 2. Borrar (mismo filtro)
db.libros.deleteMany({ precio: { $gte: 50 } })
```

Esto vale el doble en producción: una condición mal pensada puede borrar mucho más de lo que parece.

---

## Diferencia visual entre los métodos

```
Colección: 4 libros
  _id: 1 (precio 20)
  _id: 2 (precio 50)
  _id: 3 (precio 50)
  _id: 4 (precio 45)


db.libros.deleteOne({ precio: { $gte: 50 } })
  → borra el PRIMERO que cumpla (típicamente _id: 2)
  → deletedCount: 1
  Quedan: _id 1, 3, 4

db.libros.deleteMany({ precio: { $gte: 50 } })
  → borra TODOS los que cumplan (_id: 2 y _id: 3)
  → deletedCount: 2
  Quedan: _id 1, 4
```

> Atención: el "primero" en `deleteOne` no es necesariamente el de menor `_id`. Es el primero que MongoDB encuentre según el orden de almacenamiento. Por eso `deleteOne` se usa típicamente con filtros que ya identifican un único documento (por `_id` o por un campo único).

---

## Tabla de equivalencias con SQL

| MongoDB | SQL |
|---|---|
| `db.libros.deleteOne({ _id: 1 })` | `DELETE FROM libros WHERE _id = 1 LIMIT 1` |
| `db.libros.deleteMany({ precio: { $gte: 50 } })` | `DELETE FROM libros WHERE precio >= 50` |
| `db.libros.deleteMany({})` | `DELETE FROM libros` (o `TRUNCATE TABLE libros`) |
| `db.libros.deleteMany({ rubro: { $in: ['mouse','monitor'] } })` | `DELETE FROM libros WHERE rubro IN ('mouse','monitor')` |

---

## Resumen de la unidad

| Operación | Comando |
|---|---|
| Borrar el primero que cumple el filtro | `db.coleccion.deleteOne({ filtro })` |
| Borrar todos los que cumplen el filtro | `db.coleccion.deleteMany({ filtro })` |
| Borrar todos los documentos | `db.coleccion.deleteMany({})` |
| Igualdad implícita | `{ _id: 1 }` |
| Igualdad explícita | `{ _id: { $eq: 1 } }` |
| Resultado | `{ acknowledged: true, deletedCount: N }` |

```js
// Por _id (único): conviene deleteOne
db.libros.deleteOne({ _id: 1 })

// Por condición de rango: deleteMany
db.libros.deleteMany({ precio: { $gte: 50 } })

// Por pertenencia a un conjunto:
db.articulos.deleteMany({ rubro: { $in: ['mouse', 'monitor'] } })

// Patrón seguro: previsualizar con find ANTES de borrar
db.libros.find({ precio: { $gte: 50 } })   // mirar
db.libros.deleteMany({ precio: { $gte: 50 } })   // borrar
```
