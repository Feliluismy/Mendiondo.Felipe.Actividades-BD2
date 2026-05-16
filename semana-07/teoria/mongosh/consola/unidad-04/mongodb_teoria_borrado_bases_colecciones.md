# MongoDB en Consola — Borrar bases, colecciones y documentos

> **Fuente:** Apuntes UTN Avellaneda — Páginas 9 a 11

---

## 4. Tres niveles de borrado en MongoDB

MongoDB ofrece **tres formas distintas** de "borrar", cada una con un alcance diferente. Es importante entenderlas porque la diferencia entre ellas suele ser fuente de confusión.

```
┌────────────────────────────────────────────────────────────────┐
│  deleteMany({})    → Borra los DOCUMENTOS, conserva colección  │
│  drop()            → Borra la COLECCIÓN entera (con todo)      │
│  dropDatabase()    → Borra la BASE entera (con todo)           │
└────────────────────────────────────────────────────────────────┘
```

| Método | Alcance | Sigue existiendo después |
|---|---|---|
| `deleteMany({})` | Todos los documentos | La **colección** vacía |
| `drop()` | La colección completa | La **base** (sin esa colección) |
| `dropDatabase()` | La base entera | El **servidor** sin esa base |

> **Regla práctica:** elegí siempre el alcance **más chico** que resuelva tu caso. Pasar de un nivel al siguiente borra más cosas y es más difícil de revertir.

---

## Borrar todos los documentos: `deleteMany({})`

Elimina **todos los documentos** de una colección, pero deja la colección creada (vacía).

```js
use base1
db.libros.deleteMany({})
show collections
```

### El objeto vacío `{}`

El `{}` es el **filtro** de la operación: significa "todos los documentos". Más adelante veremos que ese mismo método con un filtro distinto borra **solo** los que cumplen una condición:

```js
db.libros.deleteMany({ autor: 'Borges' })   // borra solo los de Borges
```

### Resultado

```js
{ "acknowledged" : true, "deletedCount" : 2 }
```

| Campo | Significado |
|---|---|
| `acknowledged` | El servidor confirmó la operación |
| `deletedCount` | Cuántos documentos se eliminaron |

### La colección sigue ahí

Después de `deleteMany({})`, `show collections` **sigue mostrando** la colección:

```
clientes
libros          ← sigue existiendo, pero vacía
```

> **Cuándo usarlo:** cuando querés limpiar los datos pero conservar índices, validaciones o configuración de la colección.

---

## Borrar la colección entera: `drop()`

Elimina **la colección completa** — documentos, índices y la propia entidad.

```js
use base1
db.libros.drop()
show collections
```

### Resultado

```
true        ← la colección se eliminó correctamente
```

### Después del `drop()`

`show collections` **ya no muestra** la colección:

```
clientes
usuarios
                ← libros desapareció
```

> **Cuándo usarlo:** cuando ya no necesitás esa colección o querés recrearla desde cero (incluyendo índices).

---

## Borrar la base entera: `dropDatabase()`

Elimina **toda la base de datos**, con todas sus colecciones, documentos e índices.

```js
show dbs
use base1
db.dropDatabase()
show dbs
```

### Resultado

```js
{ "dropped" : "base1", "ok" : 1 }
```

### Después del `dropDatabase()`

```
admin    0.000GB
config   0.000GB
local    0.000GB
test     0.000GB
                  ← base1 desapareció
```

### Particularidad importante

`dropDatabase()` actúa sobre **la base activa** (la del último `use`). Por eso siempre se hace `use base1` justo antes — para asegurarse de que la base activa es la que queremos eliminar.

> **Cuidado:** este método elimina **todo** lo que tenga la base. No hay un "Estás seguro?". Una vez ejecutado, los datos se pierden (a menos que tengas backup).

---

## Comparación visual de los tres métodos

```
ANTES                              DESPUÉS

Base: base1                        deleteMany({}):
├── libros (4 docs)                  Base: base1
├── clientes (3 docs)                ├── libros (0 docs)   ← vacía pero existe
└── usuarios (2 docs)                ├── clientes (3 docs)
                                     └── usuarios (2 docs)


Base: base1                        drop() sobre libros:
├── libros (4 docs)                  Base: base1
├── clientes (3 docs)                ├── clientes (3 docs)
└── usuarios (2 docs)                └── usuarios (2 docs) ← libros eliminada


Base: base1                        dropDatabase():
├── libros (4 docs)                  (La base base1 ya no existe)
├── clientes (3 docs)                Solo quedan: admin, config, local, test
└── usuarios (2 docs)
```

---

## Buenas prácticas

| Recomendación | Por qué |
|---|---|
| Antes de un `drop` o `dropDatabase`, hacer un **backup** | La operación es irreversible |
| **Confirmar la base activa con `db`** antes de `dropDatabase` | Para no borrar otra distinta por error |
| Usar `deleteMany({})` para "vaciar" — preserva índices y permisos | Reconstruir índices puede ser costoso |
| En scripts: agregar `if` o validaciones antes de borrar producción | Evitar accidentes |
| Para datos sensibles, controlá los **roles** del usuario que ejecuta | Solo cuentas administrativas deberían poder dropear |

---

## Resumen de la unidad

| Operación | Sintaxis | Qué borra | Qué deja |
|---|---|---|---|
| Vaciar colección | `db.coleccion.deleteMany({})` | Todos los documentos | La colección vacía |
| Eliminar colección | `db.coleccion.drop()` | Documentos + colección + índices | La base |
| Eliminar base | `db.dropDatabase()` | Base entera (todas las colecciones) | El servidor |
| Listar bases | `show dbs` | — | — |
| Listar colecciones | `show collections` | — | — |

### Comandos clave

```js
// Vaciar
db.libros.deleteMany({})

// Eliminar la colección
db.libros.drop()

// Eliminar la base activa (cuidado: se va todo)
use base1
db.dropDatabase()
```
