# MongoDB en Consola — Eliminación de Índices

> **Fuente:** Apuntes UTN Avellaneda — Páginas 85 a 86

---

## 24. Índices — Eliminación

Hasta acá vimos cómo **crear** índices simples, compuestos, sobre subdocumentos, arrays y de texto. En esta unidad vemos las dos operaciones complementarias: **listar** los índices existentes y **eliminar** los que ya no necesitamos.

---

## Listar los índices: `getIndexes()`

Para conocer todos los índices definidos sobre una colección:

```js
db.libros.getIndexes()
```

Devuelve un arreglo con un objeto por cada índice. Por ejemplo, después de haber creado uno sobre `autor`:

```json
[
  {
    "v": 2,
    "key": { "_id": 1 },
    "name": "_id_",
    "ns": "base1.libros"
  },
  {
    "v": 2,
    "key": { "autor": 1 },
    "name": "autor_1",
    "ns": "base1.libros"
  }
]
```

### Campos importantes de cada índice

| Campo | Significado |
|---|---|
| `v` | Versión interna del formato del índice |
| `key` | Campos por los que se indexó y su orden (`1` asc, `-1` desc) |
| `name` | Nombre del índice — autogenerado si no se especificó |
| `ns` | Namespace: `<base>.<colección>` |

### Convención de nombres autogenerados

MongoDB arma el nombre concatenando `<campo>_<orden>`:

| Definición | Nombre autogenerado |
|---|---|
| `{ autor: 1 }` | `"autor_1"` |
| `{ titulo: -1 }` | `"titulo_-1"` |
| `{ titulo: 1, autor: 1 }` | `"titulo_1_autor_1"` |
| `{ 'direccion.calle': 1 }` | `"direccion.calle_1"` |

---

## Eliminar un índice: `dropIndex()`

Hay **dos formas** de invocar `dropIndex`:

### Forma 1 — Pasando el nombre del índice (string)

```js
db.libros.dropIndex('autor_1')
```

Salida típica:

```json
{ "nIndexesWas": 2, "ok": 1 }
```

- `nIndexesWas` indica cuántos índices había **antes** de la eliminación.

### Forma 2 — Pasando la misma especificación con la que se creó

Si no querés llamar antes a `getIndexes()` para averiguar el nombre, podés pasar **el mismo objeto** que usaste en `createIndex`:

```js
db.libros.createIndex({ titulo: 1 })   // crear
db.libros.dropIndex({ titulo: 1 })     // eliminar
```

Las dos formas son equivalentes: por nombre conocido, o por especificación de campos.

---

## El índice sobre `_id` no se puede eliminar

```js
db.libros.dropIndex('_id_')   // ❌ error
```

MongoDB **no permite** borrar el índice que crea automáticamente sobre `_id`. Es un índice **obligatorio** en toda colección y forma parte del funcionamiento interno del motor.

---

## Flujo típico de mantenimiento

```js
// 1. Ver qué índices hay
db.libros.getIndexes()

// 2. Identificar el índice a eliminar (por nombre o por spec)
db.libros.dropIndex('autor_1')
// o equivalente:
db.libros.dropIndex({ autor: 1 })

// 3. Verificar
db.libros.getIndexes()
```

---

## ¿Cuándo eliminar un índice?

- El índice **ya no se usa** (la consulta que lo motivaba cambió o desapareció).
- El **costo de mantenimiento** del índice (cada insert/update lo actualiza) supera el beneficio.
- Quedó un índice **redundante** — por ejemplo, si tenés `{ a: 1, b: 1 }`, el índice `{ a: 1 }` es redundante para consultas que filtran solo por `a`.
- Querés **reemplazarlo** por uno con distinto orden o más campos.

> **Cuidado:** eliminar un índice que la app sí está usando puede degradar drásticamente el rendimiento de las consultas afectadas. Antes de eliminarlo en producción, conviene confirmarlo con `explain('executionStats')` y/o métricas reales.

---

## Resumen de comandos

```js
// Listar todos los índices de una colección
db.libros.getIndexes()

// Eliminar un índice por nombre
db.libros.dropIndex('autor_1')

// Eliminar un índice por especificación
db.libros.dropIndex({ autor: 1 })
```

| Operación | Método | Argumento |
|---|---|---|
| Listar índices | `getIndexes()` | — |
| Crear | `createIndex(...)` | spec del índice |
| Eliminar (por nombre) | `dropIndex(...)` | string con el nombre |
| Eliminar (por spec) | `dropIndex(...)` | mismo objeto que se usó al crear |
