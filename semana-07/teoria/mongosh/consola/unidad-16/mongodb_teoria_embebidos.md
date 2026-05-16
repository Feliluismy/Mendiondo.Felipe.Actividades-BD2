# MongoDB en Consola — Documentos Embebidos

> **Fuente:** Apuntes UTN Avellaneda — Páginas 49 a 53

---

## 16. Documentos Embebidos: campos de tipo documento

### Concepto

Hasta ahora los documentos almacenaban **tipos de datos simples** (enteros, strings, arreglos). MongoDB permite que el valor de un campo sea **otro documento completo**, lo que se conoce como **documento embebido** o **subdocumento**.

### ¿Cuándo conviene usarlos?

Cuando se necesita agrupar datos relacionados y luego **consultar filtrando por sus subcampos**. Por ejemplo, si se necesita buscar clientes por calle y número de forma independiente, conviene modelar la dirección como subdocumento en lugar de un único string.

---

### Estructura de un documento embebido

```js
db.clientes.insertOne({
  _id: 1,
  nombre: 'Martinez Victor',
  mail: 'mvictor@gmail.com',
  direccion: {           // ← campo cuyo valor es otro documento
    calle: 'Colon',
    numero: 620,
    codigopostal: 5000
  }
})
```

El campo `direccion` contiene un subdocumento con sus propios campos: `calle`, `numero` y `codigopostal`.

---

## Consultar sobre subcampos: notación de punto

Para filtrar por un campo interno de un subdocumento se usa la **notación de punto** (`"campo.subcampo"`).

> ⚠️ **Es obligatorio usar comillas** cuando se referencia un subcampo con notación de punto.

### Ejemplo 1 — filtrar por un subcampo exacto

```js
// Recuperar todos los clientes que viven en la calle 'Colon'
db.clientes.find({ 'direccion.calle': 'Colon' }).pretty()
```

### Ejemplo 2 — combinar múltiples condiciones sobre subcampos

```js
// Clientes en calle 'Colon' con número entre 1 y 1000
db.clientes.find({
  'direccion.calle': 'Colon',
  'direccion.numero': { $gte: 1 },
  'direccion.numero': { $lte: 1000 }
}).pretty()
```

> 💡 **Nota:** Al repetir la misma clave (`'direccion.numero'`) en el objeto de query, MongoDB solo considera la última condición. Para aplicar ambas correctamente se usa el operador **`$and`** o se combinan en un solo campo con `$gte` y `$lte` juntos (ver tabla de operadores abajo).

### Forma correcta de rango con `$and` implícito

```js
db.clientes.find({
  'direccion.calle': 'Colon',
  'direccion.numero': { $gte: 1, $lte: 1000 }
}).pretty()
```

---

## Documentos embebidos como campo "autor"

El mismo patrón aplica a cualquier entidad. En la colección `libros`, el campo `autor` puede ser un subdocumento:

```js
db.libros.insertOne({
  _id: 1,
  titulo: 'El aleph',
  autor: {
    nombre: 'Borges',
    nacionalidad: 'Argentina'
  },
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
})
```

### Consultar por subcampos del autor

```js
// Libros de autores argentinos
db.libros.find({ 'autor.nacionalidad': 'Argentina' })

// Libros de Borges
db.libros.find({ 'autor.nombre': 'Borges' })

// Libros de autores españoles con precio >= 50
db.libros.find({
  'autor.nacionalidad': 'Española',
  precio: { $gte: 50 }
})
```

---

## Resumen de operadores de comparación

| Operador | Significado        | Ejemplo                          |
|----------|--------------------|----------------------------------|
| `$gt`    | Mayor que          | `{ precio: { $gt: 45 } }`       |
| `$gte`   | Mayor o igual que  | `{ precio: { $gte: 50 } }`      |
| `$lt`    | Menor que          | `{ numero: { $lt: 1000 } }`     |
| `$lte`   | Menor o igual que  | `{ numero: { $lte: 1000 } }`    |
| `$ne`    | Distinto de        | `{ nacionalidad: { $ne: 'Española' } }` |

---

## Método `.pretty()`

Encadenar `.pretty()` al `find()` formatea la salida en la consola de forma legible (indentada). Muy útil cuando los documentos tienen subdocumentos anidados.

```js
db.clientes.find().pretty()
```

---

## Esquema mental — Documento con subdocumento

```
Documento principal
│
├── _id
├── nombre
├── mail
└── direccion  ←── subdocumento
    ├── calle
    ├── numero
    └── codigopostal

Consulta:  { "direccion.calle": "Colon" }
                  ↑
           notación de punto entre comillas
```
