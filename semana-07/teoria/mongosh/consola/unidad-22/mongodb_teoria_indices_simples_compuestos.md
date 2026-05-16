# MongoDB en Consola — Índices Simples y Compuestos

> **Fuente:** Apuntes UTN Avellaneda — Páginas 72 a 80

---

## 22. Índices en MongoDB — Simples y Compuestos

En la unidad anterior vimos **qué es un índice** y por qué importa. En esta unidad pasamos a la práctica: cómo se **crean**, qué **tipos** existen y cómo se puede **medir** su efecto sobre las consultas.

---

## Índices simples

Un índice es **simple** cuando se construye sobre **un único campo** del documento.

Se utiliza el método `createIndex` indicando el campo y el sentido de orden:

- `1` → orden **ascendente** (A → Z, 0 → 9)
- `-1` → orden **descendente** (Z → A, 9 → 0)

```js
db.libros.createIndex({ titulo: 1 })   // índice ascendente sobre titulo
db.libros.createIndex({ titulo: -1 })  // índice descendente sobre titulo
```

Al crear el índice, MongoDB devuelve un objeto informativo:

```json
{
  "createdCollectionAutomatically": false,
  "numIndexesBefore": 1,
  "numIndexesAfter": 2,
  "ok": 1
}
```

- `numIndexesBefore` → cuántos índices había antes (1 = solo el de `_id`)
- `numIndexesAfter` → cuántos hay luego de la operación

### Ejemplo de consulta ordenada usando el índice

```js
db.libros.find({}, { titulo: 1 }).sort({ titulo: 1 }).pretty()
```

Cuando el campo del `sort()` está indexado, MongoDB **no necesita ordenar en memoria**: recorre el índice en el sentido pedido.

---

## Índices compuestos

Un índice es **compuesto** cuando se hace sobre **dos o más campos** del documento. También se usa `createIndex`, pasando un objeto con varios campos:

```js
db.libros.createIndex({ titulo: 1, autor: 1 })
```

A partir de ese momento, una consulta que filtre por **`titulo` y `autor`** sobre millones de documentos será **casi instantánea**:

```js
db.libros.find({ titulo: 'Aprenda PHP', autor: 'Mario Molina' }).pretty()
```

### El orden de los campos importa

El índice compuesto `{ titulo: 1, autor: 1 }` sirve para:

- Consultas por `titulo` solo
- Consultas por `titulo` **y** `autor`

Pero **no** se aprovecha de manera óptima si la consulta filtra solo por `autor` (sin `titulo`), porque el índice se recorre en el orden en que fue declarado.

> **Regla práctica:** poné primero el campo más selectivo o el que aparece en más consultas.

---

## Acceso solo a los datos de los índices (Covered Queries)

Para **maximizar la eficiencia**, podemos:

1. **Filtrar** por campos que están indexados.
2. **Proyectar** (en el segundo parámetro de `find`) **solamente** campos que también estén en el índice.

En ese caso MongoDB **no abre los documentos** de la colección — responde leyendo únicamente el archivo índice. Esto es lo que se llama una **covered query**.

```js
db.articulos.createIndex({ rubro: 1, _id: 1 })

db.articulos.find(
  { rubro: 'monitor' },         // filtro: campo indexado
  { rubro: 1, _id: 1 }          // proyección: solo campos indexados
)
```

Sobre colecciones con millones de documentos, esta técnica es **dramáticamente más rápida** que recuperar el documento completo.

---

## Conocer estadísticas de la consulta — `explain('executionStats')`

Para saber **qué hizo MongoDB realmente** al ejecutar una consulta, se encadena `explain('executionStats')`:

```js
db.articulos.find({ rubro: 'monitor' }, { rubro: 1, _id: 1 })
  .explain('executionStats')
```

### Campos importantes del resultado

| Campo | Significado |
|---|---|
| `winningPlan.stage` | Etapa elegida por el planificador (`IXSCAN` = uso de índice, `COLLSCAN` = recorrido completo, `PROJECTION` = recorte de campos) |
| `indexName` | Nombre del índice usado (ej. `"rubro_1__id_1"`) |
| `nReturned` | Cuántos documentos devolvió la consulta |
| `totalKeysExamined` | Cuántas entradas del índice se leyeron |
| `totalDocsExamined` | Cuántos **documentos** se leyeron de la colección |
| `executionTimeMillis` | Tiempo total de ejecución |

### El indicador clave: `totalDocsExamined`

```json
"executionStats": {
  "nReturned": 3,
  "totalKeysExamined": 3,
  "totalDocsExamined": 0   // ← ¡no se abrió ni un documento!
}
```

Cuando `totalDocsExamined: 0` → fue una **covered query**: MongoDB respondió usando solo el índice.

Si la misma consulta pide un campo **no indexado**, el resultado cambia:

```js
db.articulos.find({ rubro: 'monitor' }, { rubro: 1, _id: 1, precio: 1 })
  .explain('executionStats')
```

```json
"executionStats": {
  "nReturned": 3,
  "totalKeysExamined": 3,
  "totalDocsExamined": 3   // ← MongoDB tuvo que abrir los 3 documentos
}
```

> **Lección:** la proyección sí afecta el rendimiento. Si pedís un campo que no está en el índice, MongoDB se ve obligado a abrir el documento.

---

## Índices únicos

Permiten **garantizar que ningún documento repita el valor** de uno o varios campos. Equivale al `UNIQUE` de SQL.

### Sintaxis

Se pasa un **segundo parámetro** a `createIndex` con la opción `unique: true`:

```js
db.clientes.createIndex({ dni: 1 }, { unique: true })
```

### Comportamiento

Si luego se intenta insertar un documento con un valor de `dni` que ya existe, MongoDB **rechaza la operación** con un error:

```
WriteError: E11000 duplicate key error collection: base1.clientes
index: dni_1 dup key: { : "20888722" }
```

- Código de error: **`11000`**
- Nombre conocido: *duplicate key error*

### Cuándo usarlos

- DNI, CUIT, número de legajo, email de usuario, nombre de usuario, ISBN, etc.
- Cualquier campo de negocio que **conceptualmente** no puede repetirse entre documentos.

---

## Resumen de la unidad

| Tipo | Sintaxis | Uso típico |
|---|---|---|
| Simple ascendente | `createIndex({ campo: 1 })` | Buscar / ordenar por un solo campo |
| Simple descendente | `createIndex({ campo: -1 })` | Idem, en orden inverso |
| Compuesto | `createIndex({ a: 1, b: 1 })` | Consultas que filtran por varios campos |
| Único | `createIndex({ campo: 1 }, { unique: true })` | Evitar duplicados (DNI, email, ...) |
| Covered query | `find({ a: ... }, { a: 1, b: 1 })` con índice `{a:1, b:1}` | Máxima eficiencia: solo se lee el índice |
| Diagnóstico | `find(...).explain('executionStats')` | Ver si la consulta usa o no el índice |

---

## Comandos clave de la unidad

```js
// Crear índice simple ascendente
db.libros.createIndex({ titulo: 1 })

// Crear índice simple descendente
db.libros.createIndex({ titulo: -1 })

// Crear índice compuesto
db.libros.createIndex({ titulo: 1, autor: 1 })

// Crear índice único
db.clientes.createIndex({ dni: 1 }, { unique: true })

// Obtener estadísticas de una consulta
db.articulos.find({ rubro: 'monitor' }).explain('executionStats')
```
