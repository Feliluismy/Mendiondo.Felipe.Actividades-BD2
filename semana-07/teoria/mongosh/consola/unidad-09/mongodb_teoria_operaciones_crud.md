# MongoDB en Consola — Operaciones CRUD (resumen)

> **Fuente:** Apuntes UTN Avellaneda — Páginas 33 a 34

---

## 9. CRUD: las cuatro operaciones básicas

**CRUD** es el acrónimo de las cuatro operaciones fundamentales que toda aplicación realiza sobre sus datos:

| Letra | En inglés | En español | Métodos MongoDB |
|---|---|---|---|
| **C** | **C**reate | **C**rear / Insertar | `insertOne`, `insertMany` |
| **R** | **R**ead   | **L**eer / Recuperar | `find` |
| **U** | **U**pdate | **A**ctualizar / Modificar | `updateOne`, `updateMany`, `replaceOne` |
| **D** | **D**elete | **B**orrar / Eliminar | `deleteOne`, `deleteMany` |

> Esta unidad **resume** lo que ya vimos por separado en las unidades anteriores y agrega un método nuevo: **`replaceOne`**.

---

## C — Crear (insertar documentos)

Las operaciones de inserción agregan documentos nuevos a una colección. Si la colección no existe, se crea **al insertar el primer documento**.

| Método | Para qué sirve |
|---|---|
| `db.<coleccion>.insertOne({ ... })` | Inserta **un** documento |
| `db.<coleccion>.insertMany([{ ... }, { ... }])` | Inserta **varios** documentos |

### Ejemplo

```js
db.usuarios.insertOne({
  nombre:   'Carlos',
  apellido: 'Lopez'
})
```

> Si no se pasa `_id`, MongoDB lo autogenera con un `ObjectId` único.

---

## R — Leer (recuperar documentos)

Las operaciones de lectura **obtienen** documentos según un filtro.

| Método | Para qué sirve |
|---|---|
| `db.<coleccion>.find(<filtro>)` | Devuelve los documentos que cumplen el filtro |
| `db.<coleccion>.find(<filtro>, <proyeccion>)` | Filtra **y** elige qué campos mostrar |

### Ejemplo del apunte (con `$in` y proyección)

```js
db.usuarios.find(
  { rol: { $in: ['admin', 'gerente'] } },   // filtro: usuarios admin o gerente
  { nombre: 1 }                              // proyección: solo el campo nombre
)
```

> El segundo parámetro es la **proyección**: `1` incluye el campo, `0` lo excluye. (Lo veremos en detalle en unidades posteriores.)

---

## U — Actualizar (modificar documentos)

Las operaciones de actualización modifican documentos existentes.

| Método | Para qué sirve |
|---|---|
| `db.<coleccion>.updateOne(filtro, cambios)` | Modifica **el primero** que cumple el filtro |
| `db.<coleccion>.updateMany(filtro, cambios)` | Modifica **todos** los que cumplen el filtro |
| `db.<coleccion>.replaceOne(filtro, documento)` | **Reemplaza** todo el documento por uno nuevo |

### Ejemplo del apunte

```js
db.usuarios.updateOne(
  { id: { $eq: 12 } },
  { $set: { active: false } }
)
```

### El método nuevo: `replaceOne`

`replaceOne` **no modifica** campos puntuales — **reemplaza el documento entero** (excepto el `_id`):

```js
db.usuarios.replaceOne(
  { _id: 12 },
  {
    nombre:   'Ana',
    apellido: 'Garcia',
    rol:      'admin'
    // No hace falta poner _id; el reemplazo conserva el original
  }
)
```

| Característica | `updateOne` (con `$set`) | `replaceOne` |
|---|---|---|
| **Mantiene los campos no mencionados** | ✅ Sí | ❌ No: los campos viejos se pierden |
| **Necesita operadores `$`** | ✅ Sí (obligatorio) | ❌ No: se pasa el documento completo |
| **Conserva `_id`** | ✅ | ✅ |
| **Caso típico** | Cambiar uno o pocos campos | "Pisar" todo el documento por uno nuevo |

> **Cuándo usar `replaceOne`:** cuando el flujo de la app entrega el documento completo (ej. después de editarlo en un formulario) y querés reemplazar el guardado entero. Para actualizaciones parciales conviene `updateOne` con `$set`.

---

## D — Borrar (eliminar documentos)

Las operaciones de borrado **eliminan** documentos.

| Método | Para qué sirve |
|---|---|
| `db.<coleccion>.deleteOne(<filtro>)` | Borra **el primero** que cumple el filtro |
| `db.<coleccion>.deleteMany(<filtro>)` | Borra **todos** los que cumplen el filtro |

### Ejemplo del apunte

```js
db.usuarios.deleteMany({
  active: { $eq: false }
})
```

> Borra todos los usuarios inactivos.

---

## Tabla maestra del CRUD

| Acción | Uno solo | Varios |
|---|---|---|
| **Crear** | `insertOne({...})` | `insertMany([{...}, {...}])` |
| **Leer** | `find({ _id: 1 })` | `find({ ... })` (con o sin filtro) |
| **Actualizar** | `updateOne(filtro, { $set: { ... } })` | `updateMany(filtro, { $set: { ... } })` |
| **Reemplazar** | `replaceOne(filtro, { ...nuevo })` | (no existe `replaceMany`) |
| **Borrar** | `deleteOne(filtro)` | `deleteMany(filtro)` |

### Patrón común

Casi todos los métodos siguen la misma estructura:

```js
db.<coleccion>.<metodo>(
  <filtro>,            // ¿a qué documento(s)?
  <accion-o-cambios>   // ¿qué hago con ellos? (no aplica en find/delete)
)
```

---

## Equivalencias con SQL

| MongoDB | SQL |
|---|---|
| `insertOne({ nombre: 'Ana' })` | `INSERT INTO ... VALUES ('Ana')` |
| `find({ rol: 'admin' })` | `SELECT * FROM ... WHERE rol = 'admin'` |
| `find({ rol: 'admin' }, { nombre: 1 })` | `SELECT nombre FROM ... WHERE rol = 'admin'` |
| `updateOne({ _id: 1 }, { $set: { activo: false } })` | `UPDATE ... SET activo = false WHERE _id = 1` |
| `replaceOne({ _id: 1 }, { ... })` | `UPDATE ... SET (todos los campos) WHERE _id = 1` |
| `deleteMany({ activo: false })` | `DELETE FROM ... WHERE activo = false` |

---

## Resumen visual

```
┌────────────┬────────────────────────┬─────────────────────────┐
│   CRUD     │      Uno solo          │         Varios          │
├────────────┼────────────────────────┼─────────────────────────┤
│  Create    │  insertOne(doc)        │  insertMany([d1, d2])   │
│  Read      │  find({ _id: x })      │  find({ filtro })       │
│  Update    │  updateOne(f, cambios) │  updateMany(f, cambios) │
│  Replace   │  replaceOne(f, doc)    │  —                      │
│  Delete    │  deleteOne(f)          │  deleteMany(f)          │
└────────────┴────────────────────────┴─────────────────────────┘
```

> **Si te quedás con una sola idea:** todos los métodos toman primero un **filtro** (qué documentos) y, cuando corresponde, después un **cambio** (qué hacer). Si dominás esta estructura, dominás el CRUD entero de MongoDB.
