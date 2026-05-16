# MongoDB en Consola — Recuperar documentos con `find` (filtros básicos)

> **Fuente:** Apuntes UTN Avellaneda — Páginas 12 a 14

---

## 5. El método `find` con filtros

`find` es el método que usamos para **leer** documentos de una colección. Ya lo vimos sin parámetros — devuelve todo el contenido. En esta unidad vamos a darle un **filtro** para que devuelva solo los documentos que nos interesan.

### Forma general

```js
db.coleccion.find( <filtro> )
```

| `filtro` | Qué pasa |
|---|---|
| **omitido** o `{}` | Devuelve **todos** los documentos |
| `{ campo: valor }` | Devuelve los que tienen ese campo con ese valor |
| `{ campo1: valor1, campo2: valor2 }` | AND lógico: deben cumplirse **todas** las condiciones |

> **Idea clave:** el filtro es un **objeto JSON** con la "forma" del documento que queremos. MongoDB busca todos los documentos que coincidan con esa forma.

---

## Datos de ejemplo (libros)

A lo largo de esta unidad usamos esta colección:

```js
db.libros.insertOne({ _id: 1, titulo: 'El aleph',           autor: 'Borges',         editorial: ['Siglo XXI','Planeta'], precio: 20, cantidad: 50 });
db.libros.insertOne({ _id: 2, titulo: 'Martin Fierro',      autor: 'Jose Hernandez', editorial: ['Siglo XXI'],           precio: 50, cantidad: 12 });
db.libros.insertOne({ _id: 3, titulo: 'Aprenda PHP',        autor: 'Mario Molina',   editorial: ['Siglo XXI','Planeta'], precio: 50, cantidad: 20 });
db.libros.insertOne({ _id: 4, titulo: 'Java en 10 minutos',                          editorial: ['Siglo XXI'],           precio: 45, cantidad: 1  });
```

---

## `find()` sin parámetros — todos los documentos

```js
db.libros.find()
```

Devuelve los **4** documentos de la colección.

> Equivalente SQL: `SELECT * FROM libros`

---

## Filtro por `_id` — un documento concreto

```js
db.libros.find({ _id: 1 })
```

Devuelve únicamente:

```js
{ "_id": 1, "titulo": "El aleph", "autor": "Borges",
  "editorial": ["Siglo XXI", "Planeta"], "precio": 20, "cantidad": 50 }
```

### Si el `_id` no existe

```js
db.libros.find({ _id: 999 })
```

**No devuelve nada** — el cursor está vacío. No es un error, simplemente no hay coincidencias.

> Equivalente SQL: `SELECT * FROM libros WHERE _id = 1`

---

## Filtro por otro campo — uno o varios resultados

```js
db.libros.find({ precio: 50 })
```

Devuelve **los dos** libros con `precio: 50`:

- `Martin Fierro` (`_id: 2`)
- `Aprenda PHP` (`_id: 3`)

A diferencia del filtro por `_id`, los filtros por otros campos pueden devolver **varios documentos** (porque esos campos no son únicos).

> Equivalente SQL: `SELECT * FROM libros WHERE precio = 50`

---

## Filtro con varios campos — AND implícito

Cuando se ponen **varias claves en el mismo objeto**, MongoDB exige que se cumplan **todas** (AND lógico):

```js
db.libros.find({ precio: 50, cantidad: 20 })
```

Devuelve un solo libro: `Aprenda PHP` (`_id: 3`).

| Doc | `precio` | `cantidad` | ¿Cumple? |
|---|---|---|---|
| `_id: 1` | 20 | 50 | ❌ no precio |
| `_id: 2` | 50 | 12 | ❌ no cantidad |
| `_id: 3` | **50** | **20** | ✅ |
| `_id: 4` | 45 | 1 | ❌ no precio |

> Equivalente SQL: `SELECT * FROM libros WHERE precio = 50 AND cantidad = 20`

---

## Características importantes del filtro

### Es **case-sensitive** y **type-sensitive**

```js
db.libros.find({ autor: 'Borges'  })   // ✅ encuentra
db.libros.find({ autor: 'borges'  })   // ❌ minúscula → no encuentra
db.libros.find({ precio: 50       })   // ✅ encuentra (numérico)
db.libros.find({ precio: '50'     })   // ❌ string vs número → no encuentra
```

### Comparaciones contra arrays

Si el campo es un array, MongoDB busca por **pertenencia**:

```js
db.libros.find({ editorial: 'Planeta' })
```

Devuelve los libros donde el array `editorial` **contiene** `'Planeta'` (`_id: 1` y `_id: 3`).

### Igualdad de objeto vs igualdad de elemento

```js
db.libros.find({ editorial: ['Siglo XXI'] })
```

Esto busca el array **exactamente igual** a `['Siglo XXI']`. Solo coincide `Martin Fierro` y `Java en 10 minutos`.

---

## El cursor: `find` no devuelve un array

`find` devuelve un **cursor** (no un array directo). En el shell interactivo, el cursor se expande automáticamente y muestra los primeros 20 documentos. Si querés iterar manualmente:

```js
var cursor = db.libros.find({ precio: 50 });
while (cursor.hasNext()) {
  printjson(cursor.next());
}
```

O, más cómodo:

```js
db.libros.find({ precio: 50 }).forEach(printjson);
```

---

## Resumen de la unidad

| Caso | Sintaxis | Resultado |
|---|---|---|
| Todos | `find()` o `find({})` | Todos los documentos |
| Por `_id` | `find({ _id: 1 })` | El documento con ese `_id` (o nada) |
| Igualdad simple | `find({ campo: valor })` | Todos los que tengan ese valor |
| AND de campos | `find({ a: 1, b: 2 })` | Los que cumplen ambas condiciones |
| Pertenencia en array | `find({ campoArray: 'X' })` | Los documentos cuyo array contenga `X` |

### Comandos clave

```js
db.libros.find()                                  // todos
db.libros.find({ _id: 1 })                        // por clave
db.libros.find({ precio: 50 })                    // por campo
db.libros.find({ precio: 50, cantidad: 20 })      // AND de dos campos
db.libros.find({ editorial: 'Planeta' })          // pertenencia en array
```
