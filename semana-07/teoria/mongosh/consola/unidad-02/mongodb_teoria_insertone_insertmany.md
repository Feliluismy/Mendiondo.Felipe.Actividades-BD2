# MongoDB en Consola — `insertOne` e `insertMany`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 4 a 5

---

## 2. Insertar documentos en una colección

En la unidad anterior usamos `insertOne` para agregar un único documento. MongoDB ofrece **dos métodos** complementarios para insertar:

| Método | Para qué sirve |
|---|---|
| **`insertOne`** | Inserta **un** documento en una colección |
| **`insertMany`** | Inserta **varios** documentos en una sola operación |

> **Regla práctica:** si tenés un solo documento, `insertOne`. Si tenés más de uno (carga inicial, importación, datos de prueba), `insertMany` — es mucho más eficiente que llamar muchas veces a `insertOne`.

---

## `insertOne` — un documento

```js
db.libros.insertOne({
  codigo: 1,
  nombre: 'El aleph',
  autor: 'Borges',
  editoriales: ['Planeta', 'Siglo XXI']
})
```

Recibe un **objeto JSON** (un solo documento) y lo agrega a la colección. Devuelve un objeto con:

- `acknowledged: true` — el servidor confirmó la operación.
- `insertedId` — el `_id` del documento insertado (autogenerado o el que pasamos).

---

## `insertMany` — varios documentos

```js
db.libros.insertMany([
  {
    codigo: 3,
    nombre: 'Aprenda PHP',
    autor: 'Mario Molina',
    editoriales: ['Planeta']
  },
  {
    codigo: 4,
    nombre: 'Java en 10 minutos',
    autor: 'Barros Sergio',
    editoriales: ['Planeta', 'Siglo XXI']
  }
])
```

### Diferencia de sintaxis con `insertOne`

| `insertOne` | `insertMany` |
|---|---|
| Recibe **un objeto** `{ ... }` | Recibe **un array** `[ {...}, {...}, ... ]` |
| Devuelve `insertedId` (singular) | Devuelve `insertedIds` (plural, array) |

### Resultado típico

```js
{
  "acknowledged" : true,
  "insertedIds" : [
    ObjectId("5c2beb0ac0cc72bd447a93bd"),
    ObjectId("5c2beb0ac0cc72bd447a93be")
  ]
}
```

> Cada documento recibe su propio `_id` autogenerado (si no se especificó manualmente), igual que con `insertOne`.

---

## Recordatorio: activar la base antes de insertar

Cada vez que abrimos el shell, la base activa por defecto es **`test`**. Para trabajar sobre nuestra base hay que activarla explícitamente:

```
use base1
```

Si insertamos en `db.libros.insertOne(...)` sin haber hecho `use base1`, los datos terminan en la base `test`.

---

## Verificar lo insertado: `find()`

```js
db.libros.find()
```

Después de un `insertOne` + un `insertMany` con dos documentos cada uno, la colección debería tener **4 documentos**:

```js
{ "_id": ObjectId("..."), "codigo": 1, "nombre": "El aleph",          "autor": "Borges",         "editoriales": ["Planeta", "Siglo XXI"] }
{ "_id": ObjectId("..."), "codigo": 2, "nombre": "Martin Fierro",     "autor": "Jose Hernandez", "editoriales": ["Planeta"] }
{ "_id": ObjectId("..."), "codigo": 3, "nombre": "Aprenda PHP",       "autor": "Mario Molina",   "editoriales": ["Planeta"] }
{ "_id": ObjectId("..."), "codigo": 4, "nombre": "Java en 10 minutos","autor": "Barros Sergio",  "editoriales": ["Planeta", "Siglo XXI"] }
```

---

## Limpiar la pantalla del shell

Cuando la consola se llena de salidas y queremos empezar fresco, podemos limpiarla con:

| Comando / Tecla | Efecto |
|---|---|
| `cls` | Limpia la pantalla (Windows) |
| **Ctrl + L** | Limpia la pantalla (Linux, Mac y Windows) |

> **Importante:** `cls` solo limpia el output visual — **no borra ni la base de datos ni la sesión**. Las variables, la base activa y las colecciones siguen igual.

---

## La consola es para aprender; la app real usa drivers

El shell de MongoDB es ideal para **aprender**, **explorar datos** y **administrar**, pero en una aplicación real los datos llegan desde **drivers** del lenguaje:

| Lenguaje | Driver oficial |
|---|---|
| Python | `pymongo` |
| Ruby | `mongo` |
| C# / .NET | `MongoDB.Driver` |
| Java | `mongodb-driver-sync` |
| Node.js | `mongodb` |
| PHP | `mongodb` (extensión PECL) |

Los drivers exponen **los mismos métodos** (`insertOne`, `insertMany`, `find`, ...) con la sintaxis del lenguaje correspondiente. Lo que aprendemos en el shell se traduce casi 1 a 1.

---

## Resumen de la unidad

| Operación | Comando |
|---|---|
| Insertar **un** documento | `db.coleccion.insertOne({ ... })` |
| Insertar **varios** documentos | `db.coleccion.insertMany([ { ... }, { ... } ])` |
| Activar base | `use base1` |
| Listar documentos | `db.coleccion.find()` |
| Limpiar pantalla | `cls` o **Ctrl + L** |

### Patrón mínimo para cargar datos

```js
use base1                           // 1. activar la base

db.libros.insertOne({               // 2a. insertar un documento
  codigo: 1, nombre: 'El aleph', autor: 'Borges'
})

db.libros.insertMany([              // 2b. insertar varios de una vez
  { codigo: 3, nombre: 'Aprenda PHP',       autor: 'Mario Molina'  },
  { codigo: 4, nombre: 'Java en 10 minutos', autor: 'Barros Sergio' }
])

db.libros.find()                    // 3. verificar lo insertado
```
