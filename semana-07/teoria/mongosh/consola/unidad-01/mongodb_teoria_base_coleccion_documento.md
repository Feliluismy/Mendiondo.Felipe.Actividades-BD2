# MongoDB en Consola — Base de Datos, Colección y Documento

> **Fuente:** Apuntes UTN Avellaneda — Páginas 2 a 3

---

## 1. Elementos esenciales de MongoDB

MongoDB organiza los datos en tres niveles jerárquicos:

```
Servidor MongoDB
└── Base de datos      (ej. base1)
    └── Colección      (ej. libros)
        └── Documento  (ej. { codigo: 1, nombre: 'El aleph', ... })
```

| Concepto | Equivalente en SQL | Descripción |
|---|---|---|
| **Base de datos** | Database | Contenedor de colecciones |
| **Colección** | Tabla | Conjunto de documentos relacionados |
| **Documento** | Fila / Registro | Objeto JSON con los datos |
| **Campo** | Columna | Par clave-valor dentro de un documento |

> **Diferencia clave con SQL:** los documentos de una misma colección **no necesitan tener la misma estructura**. Cada documento puede tener distintos campos.

---

## Crear / activar una base de datos: `use`

```
use base1
```

El comando `use`:

- **Activa** la base si ya existe.
- **La crea** (lógicamente) si no existe — aunque la base no se materializa en disco hasta que se inserte el primer documento.

Salida:

```
switched to db base1
```

A partir de ese momento, la variable global **`db`** representa a esa base.

---

## Saber qué base está activa: la variable `db`

Al iniciar el shell, MongoDB activa por defecto la base **`test`**. Para confirmar cuál está activa en cualquier momento, basta con escribir:

```
db
```

Ejemplo:

```
> db
test
> use base1
switched to db base1
> db
base1
```

---

## Crear una colección e insertar el primer documento

Las colecciones **se crean al insertar el primer documento** — no hace falta declararlas antes.

```js
db.libros.insertOne({
  codigo: 1,
  nombre: 'El aleph',
  autor: 'Borges',
  editoriales: ['Planeta', 'Siglo XXI']
})
```

### Anatomía del comando

| Parte | Significado |
|---|---|
| `db` | Base activa (la que se eligió con `use`) |
| `libros` | Nombre de la colección — se crea sola si no existe |
| `insertOne` | Método que inserta **un** documento |
| `{...}` | Objeto en formato JSON con los campos del documento |

### Tipos de valores válidos

En el ejemplo se ven tres tipos:

- **Número:** `codigo: 1`
- **String:** `nombre: 'El aleph'`
- **Array:** `editoriales: ['Planeta', 'Siglo XXI']`

MongoDB también acepta booleanos, fechas, `null`, documentos embebidos (objetos dentro de objetos), entre otros.

---

## Insertar más documentos

```js
db.libros.insertOne({
  codigo: 2,
  nombre: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editoriales: ['Planeta']
})
```

Cada llamada a `insertOne` agrega **un** documento más a la colección.

---

## Listar los documentos: `find()`

```js
db.libros.find()
```

Resultado:

```js
{ "_id": ObjectId("5c27f1edcd0f463fbb3699ce"),
  "codigo": 1, "nombre": "El aleph",      "autor": "Borges",
  "editoriales": [ "Planeta", "Siglo XXI" ] }

{ "_id": ObjectId("5c27f4ffcd0f463fbb3699cf"),
  "codigo": 2, "nombre": "Martin Fierro", "autor": "Jose Hernandez",
  "editoriales": [ "Planeta" ] }
```

`find()` sin parámetros devuelve **todos** los documentos de la colección.

---

## El campo automático `_id`

Cada documento **necesita** una clave primaria almacenada en el campo `_id`. Si no lo proveemos, MongoDB **lo crea solo** con un valor de tipo **`ObjectId`** — un identificador único de 12 bytes.

```js
"_id": ObjectId("5c27f1edcd0f463fbb3699ce")
```

### Reglas del `_id`

- Es **obligatorio**: todo documento tiene uno.
- Es **único** dentro de la colección.
- Si **lo proveemos nosotros**, MongoDB lo respeta:

  ```js
  db.libros.insertOne({ _id: 1, nombre: 'Libro' })   // _id manual
  ```
- Si **no lo proveemos**, MongoDB genera un `ObjectId` automáticamente.

> Nota: el campo `codigo: 1` del ejemplo es un campo común — no es el `_id`. La clave primaria es siempre `_id`.

---

## Resumen de la unidad

| Operación | Comando |
|---|---|
| Activar / crear base | `use base1` |
| Ver base activa | `db` |
| Insertar un documento (y crear la colección si no existe) | `db.libros.insertOne({...})` |
| Listar todos los documentos | `db.libros.find()` |
| Clave primaria automática | Campo `_id` (`ObjectId` si no se especifica) |

### Flujo mínimo de trabajo

```js
use base1                                    // 1. activar base
db.libros.insertOne({                        // 2. insertar (crea la colección)
  codigo: 1,
  nombre: 'El aleph',
  autor: 'Borges',
  editoriales: ['Planeta', 'Siglo XXI']
})
db.libros.find()                              // 3. ver lo insertado
```
