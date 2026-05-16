# MongoDB en Consola — Modificar muchos documentos con `updateMany`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 29 a 32

---

## 8. Modificación masiva con `updateMany`

`updateOne` modifica **el primer** documento que coincide con el filtro. `updateMany` hace lo mismo, pero sobre **todos** los documentos que cumplen la condición.

| Método | Cuántos documentos modifica |
|---|---|
| `updateOne(filtro, cambios)`  | El **primero** que cumple el filtro |
| `updateMany(filtro, cambios)` | **Todos** los que cumplen el filtro |

> **Idea clave:** la sintaxis y los operadores son **idénticos**. Lo único que cambia es el alcance.

---

## Forma general

```js
db.coleccion.updateMany(
  <filtro>,        // a qué documentos aplicar el cambio
  <actualizacion>  // qué cambio aplicar (con operadores $)
)
```

### Resultado

```js
{ "acknowledged": true, "matchedCount": N, "modifiedCount": N }
```

A diferencia de `updateOne`, acá `matchedCount` y `modifiedCount` suelen ser mayores a 1.

---

## Tres ejemplos del apunte

Trabajamos sobre la colección `libros` con los 4 documentos habituales.

### Ejemplo 1 — `$set` masivo con condición de rango

> "Para todos los libros con `_id` mayor a 2, fijar `cantidad: 0`."

```js
db.libros.updateMany(
  { _id: { $gt: 2 } },
  { $set: { cantidad: 0 } }
)
```

Resultado:

```js
{ "acknowledged": true, "matchedCount": 2, "modifiedCount": 2 }
```

Los libros `_id: 3` y `_id: 4` ahora tienen `cantidad: 0`.

### Ejemplo 2 — Agregar un campo nuevo a varios documentos

> "Para los libros con `cantidad: 0`, agregar el campo `faltantes: true`."

```js
db.libros.updateMany(
  { cantidad: { $eq: 0 } },
  { $set: { faltantes: true } }
)
```

Resultado:

```js
{ "acknowledged": true, "matchedCount": 2, "modifiedCount": 2 }
```

Los libros `_id: 3` y `_id: 4` ahora tienen un campo extra `faltantes: true`. Los otros dos **no lo tienen** — es perfectamente válido.

### Ejemplo 3 — Combinar `$unset` y `$set` en una sola operación

> "Para los libros con `cantidad: 0`, eliminar `faltantes` Y poner `cantidad: 100`."

```js
db.libros.updateMany(
  { cantidad: { $eq: 0 } },
  {
    $unset: { faltantes: true },
    $set:   { cantidad: 100 }
  }
)
```

Esto demuestra una característica importante: **un mismo update puede combinar varios operadores** mientras no choquen sobre el mismo campo.

---

## Combinar operadores en el mismo update

```js
{
  $set:    { ... },   // cambia / crea campos
  $unset:  { ... },   // elimina campos
  $inc:    { ... },   // suma o resta
  $push:   { ... },   // agrega al array
  $pull:   { ... }    // quita del array
}
```

Reglas a tener en cuenta:

- **Un mismo campo no puede aparecer en dos operadores** del mismo update (MongoDB lo rechaza con error).
- Los operadores se aplican **en una sola transacción por documento** — todo el cambio entra o no entra (a nivel de ese documento).
- Si combinás `$set: { a: 1 }` y `$unset: { a: '' }` MongoDB tira error: estás operando dos veces sobre el mismo campo.

---

## ¿Cuándo usar `updateMany` y cuándo `updateOne`?

| Caso | Método recomendado |
|---|---|
| Modificar **un documento puntual** identificado por `_id` o por un campo único | `updateOne` |
| Aplicar el mismo cambio a **muchos documentos** que cumplen una condición | `updateMany` |
| **No estás seguro de cuántos** documentos cumplen | `find(filtro)` primero — luego elegís el método |

> **Patrón seguro:** antes de un `updateMany` en producción, ejecutá `find(filtro)` con el mismo filtro. Si el resultado son los documentos que querés modificar, recién ahí hacé el update.

---

## Ejemplos típicos en producción

```js
// "Marcar como inactivos todos los usuarios sin login en el último año"
db.usuarios.updateMany(
  { ultimoLogin: { $lt: hace1Año } },
  { $set: { activo: false } }
)

// "Subir el precio 10% a todos los productos del rubro 'electrodomesticos'"
db.productos.updateMany(
  { rubro: 'electrodomesticos' },
  { $mul: { precio: 1.10 } }
)

// "Resetear el stock de los artículos que están en oferta"
db.articulos.updateMany(
  { enOferta: true },
  { $set: { stock: 0 }, $unset: { enOferta: '' } }
)
```

---

## Comparación con SQL

| MongoDB | SQL |
|---|---|
| `updateMany({ rubro: 'monitor' }, { $set: { stock: 0 } })` | `UPDATE articulos SET stock = 0 WHERE rubro = 'monitor'` |
| `updateMany({ stock: 0 }, { $set: { pedir: true } })` | `UPDATE articulos SET pedir = true WHERE stock = 0` |
| `updateMany({}, { $unset: { pedir: '' } })` | `ALTER TABLE articulos DROP COLUMN pedir` (en SQL hay que tocar el esquema) |

> **Diferencia importante:** en SQL eliminar una "columna" cambia la **tabla entera**. En MongoDB `$unset` opera **a nivel de cada documento** y respeta el esquema flexible: cada documento decide qué campos tiene.

---

## Resumen de la unidad

| Operación | Sintaxis |
|---|---|
| Modificar varios | `updateMany(<filtro>, { $set: { ... } })` |
| Agregar campo a varios | `updateMany(<filtro>, { $set: { nuevo: 'X' } })` |
| Eliminar campo en varios | `updateMany(<filtro>, { $unset: { campo: '' } })` |
| Combinar operadores | `updateMany(<filtro>, { $set: {...}, $unset: {...} })` |
| Aplicar a TODOS los documentos | `updateMany({}, { $set: { ... } })` |

```js
// 1. Cambiar varios al mismo valor
db.libros.updateMany(
  { _id: { $gt: 2 } },
  { $set: { cantidad: 0 } }
)

// 2. Agregar un campo a varios
db.libros.updateMany(
  { cantidad: { $eq: 0 } },
  { $set: { faltantes: true } }
)

// 3. Combinar $unset + $set en una sola operación
db.libros.updateMany(
  { cantidad: { $eq: 0 } },
  { $unset: { faltantes: true }, $set: { cantidad: 100 } }
)
```
