# MongoDB en Consola — Campo obligatorio `_id`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 6 a 8

---

## 3. Campo obligatorio `_id`

En MongoDB **todo documento** tiene una clave primaria almacenada en un campo llamado **`_id`**. La regla es estricta:

- Si **no** lo definimos al insertar, MongoDB lo crea automáticamente con un valor único de tipo `ObjectId`.
- Si **lo definimos**, MongoDB respeta el valor que le pasamos.
- En ambos casos, **el valor debe ser único** dentro de la colección.

> Equivalente conceptual: la **PRIMARY KEY** de una tabla SQL — pero siempre se llama `_id` y siempre existe.

---

## Definir el `_id` manualmente

```js
db.clientes.insertOne({
  _id: 1,
  nombre: 'Lopez Marcos',
  domicilio: 'Colon 111',
  provincia: 'Cordoba'
})
```

### Resultado de un insert exitoso

```js
{ "acknowledged" : true, "insertedId" : 1 }
```

| Campo | Significado |
|---|---|
| `acknowledged` | El servidor confirmó la operación (`true` / `false`) |
| `insertedId` | El `_id` final del documento (manual o autogenerado) |

---

## Tipos válidos para `_id`

`_id` no tiene que ser un número entero. Puede ser:

- **Número:** `_id: 1`, `_id: 100`
- **String:** `_id: 'cli-001'`, `_id: 'lopez-marcos'`
- **ObjectId:** `_id: ObjectId("...")` — el tipo por defecto si no se especifica
- **Documento:** `_id: { tipo: 'A', codigo: 7 }` (composición)
- **Date, UUID, etc.**

> Lo importante es que el valor sea **único** y **consistente en tipo** dentro de la colección (todos números, todos strings, etc.).

---

## El error E11000 — clave duplicada

Si intentamos insertar un documento con un `_id` que ya existe:

```js
db.clientes.insertOne({
  _id: 1,                     // ← ya existe en la colección
  nombre: 'Perez Ana',
  domicilio: 'San Martin 222',
  provincia: 'Santa Fe'
})
```

MongoDB **rechaza la operación** y devuelve un objeto de error con esta forma:

```js
WriteError({
  "index"  : 0,
  "code"   : 11000,
  "errmsg" : "E11000 duplicate key error collection: base1.clientes index: _id_ dup key: { : 1.0 }",
  "op"     : { _id: 1, nombre: "Perez Ana", ... }
})
```

### Campos clave del error

| Campo | Significado |
|---|---|
| `code: 11000` | Código universal de "duplicate key" |
| `errmsg` | Mensaje legible que indica colección, índice y valor duplicado |
| `index: _id_` | El índice que detectó la colisión (siempre existe sobre `_id`) |
| `op` | El documento que se intentó insertar (no se grabó) |

> El número **11000** es importante: es el código que verás en cualquier driver (Python, Node, Java, etc.) cuando ocurra un duplicado de clave única.

---

## Consecuencia: el documento no se inserta

Después del intento fallido, la colección **sigue como estaba**:

```js
db.clientes.find()
```

```js
{ "_id" : 1, "nombre" : "Lopez Marcos", "domicilio" : "Colon 111", "provincia" : "Cordoba" }
```

Hay **un solo documento** — el segundo intento (con `_id: 1` repetido) fue descartado.

---

## Resumen visual

```
insertOne({ _id: 1, ... })   → OK   { acknowledged: true, insertedId: 1 }
insertOne({ _id: 2, ... })   → OK   { acknowledged: true, insertedId: 2 }
insertOne({ _id: 1, ... })   → ❌    WriteError E11000 (duplicate key)
                                    El documento NO entra a la colección.
```

---

## Buenas prácticas

| Recomendación | Por qué |
|---|---|
| Si la app va a manejar `_id`, validá unicidad en el lado de la app **antes** de insertar | Para evitar errores 11000 en runtime |
| Si no tenés un identificador natural, **dejá que MongoDB genere el `ObjectId`** | Es único globalmente sin coordinación entre procesos |
| Para integraciones con otros sistemas, podés usar el **identificador externo** como `_id` | Por ejemplo, el ISBN de un libro o el DNI de un cliente |
| **No cambies el `_id`** una vez creado el documento | MongoDB no permite update directo sobre `_id` |

---

## Resumen de la unidad

| Tema | Detalle |
|---|---|
| Campo obligatorio | `_id` (siempre se llama así) |
| Si no lo paso | MongoDB autogenera un `ObjectId` |
| Si lo paso | Se usa el valor explícito (debe ser único) |
| Tipos válidos | Number, String, ObjectId, Date, Document, etc. |
| Resultado OK | `{ acknowledged: true, insertedId: <valor> }` |
| Resultado error | `WriteError` con `code: 11000` y `errmsg: "duplicate key..."` |
| Tras un error 11000 | El documento NO se inserta; la colección queda intacta |

```js
// Ejemplo — _id manual
db.clientes.insertOne({ _id: 1,    nombre: 'Lopez Marcos' })   // OK
db.clientes.insertOne({ _id: 1,    nombre: 'Otra persona'  })  // ❌ E11000

// Ejemplo — _id autogenerado
db.clientes.insertOne({            nombre: 'Sin id manual' })  // OK, _id es ObjectId
```
