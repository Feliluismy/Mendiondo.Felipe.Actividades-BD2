# MongoDB en Consola — Operadores lógicos: `$and`, `$or` y `$not`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 35 a 39

---

## 10. Combinar varias condiciones

Hasta ahora en cada `find` (o `delete` / `update`) podíamos:

- Comparar igualdad: `{ precio: 50 }`
- Usar operadores relacionales: `{ precio: { $gte: 50 } }`
- Combinar **varios campos**, generando un AND implícito.

Para casos más ricos (OR, negación, ANDs explícitos) MongoDB ofrece tres operadores **lógicos**: `$and`, `$or` y `$not`.

| Operador | Significa | Tiene forma implícita |
|---|---|---|
| `$and` | Y lógico (todas las condiciones deben cumplirse) | ✅ Sí (varias claves en el mismo objeto) |
| `$or`  | O lógico (al menos una se cumple) | ❌ No |
| `$not` | Negación de un operador | ❌ No |

---

## `$and` — Y lógico

### Forma implícita (la que ya conocemos)

```js
db.libros.find({ precio: 50, cantidad: 20 })
```

→ Devuelve los libros con `precio = 50` **Y** `cantidad = 20`.

> Cada vez que ponés varias claves en el mismo objeto del filtro, MongoDB las combina con AND.

### Forma explícita

```js
db.libros.find({
  $and: [
    { precio:   50 },
    { cantidad: 20 }
  ]
})
```

El valor de `$and` es **un arreglo** con cada condición.

### ¿Cuándo conviene la forma explícita?

La implícita alcanza para la mayoría de los casos. La explícita sirve cuando:

- **Necesitás dos condiciones sobre el MISMO campo** que la forma implícita no permite (no podés escribir dos claves iguales en un objeto):

  ```js
  // ❌ La forma implícita NO permite esto: hay dos 'precio' en el mismo objeto
  // { precio: { $gt: 20 }, precio: { $lt: 100 } }   // segunda 'precio' pisa la primera

  // ✅ La forma explícita sí
  db.libros.find({
    $and: [
      { precio: { $gt: 20  } },
      { precio: { $lt: 100 } }
    ]
  })
  ```

  > Aclaración: para rangos del mismo campo lo más común es escribir `{ precio: { $gt: 20, $lt: 100 } }`. `$and` queda para condiciones más complejas.

- Querés **dejar explícita la intención** lógica (estilo).

---

## `$or` — O lógico

A diferencia de `$and`, `$or` **no tiene forma implícita** — siempre se escribe.

```js
db.libros.find({
  $or: [
    { precio:   { $gte: 50 } },
    { cantidad: 1 }
  ]
})
```

→ Devuelve los libros con `precio >= 50` **O** `cantidad = 1` (basta con que se cumpla **al menos una**).

| Doc | `precio` | `cantidad` | `precio >= 50` | `cantidad = 1` | ¿Cumple OR? |
|---|---|---|---|---|---|
| _id 1 | 20 | 50 | ❌ | ❌ | ❌ |
| _id 2 | 50 | 12 | ✅ | ❌ | ✅ |
| _id 3 | 50 | 20 | ✅ | ❌ | ✅ |
| _id 4 | 45 | 1  | ❌ | ✅ | ✅ |

### Sintaxis general

```js
{
  $or: [
    <condicion1>,
    <condicion2>,
    <condicion3>,
    ...
  ]
}
```

Cada condición del array es **un objeto de filtro** completo, igual al que pasarías a un `find` normal.

---

## `$not` — Negación

`$not` **invierte** el resultado de un operador. Se usa **dentro** del campo:

```js
{ campo: { $not: { <operador>: <valor> } } }
```

### Ejemplo

> "Libros cuyo precio **NO** sea mayor o igual a 50"

```js
db.libros.find({
  precio: { $not: { $gte: 50 } }
})
```

→ Devuelve los libros con precio < 50 (los que tengan el campo).

### Diferencia entre `$ne` y `$not`

| | `$ne` | `$not` |
|---|---|---|
| **Toma como argumento** | Un valor | **Otro operador** (`$gte`, `$in`, ...) |
| **Sintaxis** | `{ precio: { $ne: 50 } }` | `{ precio: { $not: { $eq: 50 } } }` |
| **Caso típico** | Negar una igualdad | Negar un rango o pertenencia |

### Equivalencia

```js
{ precio: { $ne: 50 } }
// equivale a
{ precio: { $not: { $eq: 50 } } }
```

`$not` es más versátil — sirve para negar cualquier expresión de operador, no solo igualdad.

---

## Funcionan en `find`, `delete` y `update`

Los operadores lógicos **no son exclusivos de `find`**. Funcionan idénticamente en cualquier filtro: borrado y actualización también.

### Borrar con `$not`

```js
// Borra todos los libros cuyo precio NO sea igual a 50
db.libros.deleteMany({
  precio: { $not: { $eq: 50 } }
})
```

### Actualizar con `$or`

```js
// Marca como 'destacado' a los libros que sean de Borges O cuyo precio sea > 50
db.libros.updateMany(
  { $or: [ { autor: 'Borges' }, { precio: { $gt: 50 } } ] },
  { $set: { destacado: true } }
)
```

---

## Combinar operadores lógicos

Se pueden **anidar**: `$and` con `$or` adentro, `$or` con `$and` adentro, etc.

```js
// "(autor 'Borges' Y precio < 30) O cantidad >= 50"
db.libros.find({
  $or: [
    { $and: [ { autor: 'Borges' }, { precio: { $lt: 30 } } ] },
    { cantidad: { $gte: 50 } }
  ]
})
```

> Es buena práctica mantener la lógica **lo más simple posible**. Las anidaciones profundas son difíciles de leer y de mantener.

---

## Equivalencias con SQL

| MongoDB | SQL |
|---|---|
| `{ a: 1, b: 2 }` (AND implícito) | `WHERE a = 1 AND b = 2` |
| `{ $and: [{a:1}, {b:2}] }` | `WHERE a = 1 AND b = 2` |
| `{ $or: [{a:1}, {b:2}] }` | `WHERE a = 1 OR b = 2` |
| `{ a: { $not: { $gte: 5 } } }` | `WHERE NOT (a >= 5)` |
| `{ a: { $ne: 5 } }` | `WHERE a <> 5` |

---

## Resumen de la unidad

| Operador | Sintaxis | Significa |
|---|---|---|
| AND implícito | `{ a: 1, b: 2 }` | a=1 AND b=2 |
| `$and` | `{ $and: [<c1>, <c2>, ...] }` | todas se cumplen |
| `$or` | `{ $or: [<c1>, <c2>, ...] }` | al menos una se cumple |
| `$not` | `{ campo: { $not: { <op>: <val> } } }` | negación de un operador |
| `$ne` | `{ campo: { $ne: valor } }` | distinto de un valor (atajo de `$not` + `$eq`) |

```js
// AND implícito
db.libros.find({ precio: 50, cantidad: 20 })

// AND explícito
db.libros.find({ $and: [ { precio: 50 }, { cantidad: 20 } ] })

// OR
db.libros.find({ $or: [ { precio: { $gte: 50 } }, { cantidad: 1 } ] })

// NOT (negar un operador)
db.libros.find({ precio: { $not: { $gte: 50 } } })
```
