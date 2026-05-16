# MongoDB en Consola — Expresiones Regulares

> **Fuente:** Apuntes UTN Avellaneda — *Base de Datos II — Expresiones Regulares* (Yanina Scudero)
>
> **Datos de prueba:** los ejemplos usan la colección `estudiantes` (campo `nombre` — incluye nombres como `Jose`, `Joaquina`, `Joana`, `Maria`, `Lila`, `Felipe`, `Camila`, `Carolina`, etc. para que matcheen los patrones `/^Jo/`, `/a$/`, `/li/`, `/li/i`). El dataset está en `semana-07/data_files/data-estudiantes.js`. Cargar con:
>
> ```js
> use base1
> load("data-estudiantes.js")
> ```

---

## ¿Qué son las expresiones regulares en MongoDB?

Una **expresión regular** (o *regex*) es un patrón que describe un conjunto de cadenas de texto. En MongoDB se usan dentro del filtro de un `find` (también de `update` o `delete`) para buscar documentos cuyo **campo de tipo string** coincida con un patrón, en lugar de un valor exacto.

La sintaxis básica es la misma que en JavaScript: el patrón se escribe entre **dos barras** `/.../`, opcionalmente seguidas de **modificadores** como `i` (case-insensitive).

```js
db.collection.find({ "campo": /patron/ })
```

También se puede escribir usando el operador `$regex`, que es equivalente:

```js
db.collection.find({ "campo": { $regex: /patron/ } })
```

> Las dos formas son equivalentes. La forma corta `/patron/` es más cómoda; `$regex` permite combinar la regex con otros operadores en el mismo filtro.

---

## Anclajes principales

Un **anclaje** indica en qué parte de la cadena tiene que aparecer el patrón. Hay dos:

| Anclaje | Significa | Ejemplo |
|---|---|---|
| `^` | Inicio de la cadena | `/^Jo/` → la cadena **empieza** con `Jo` |
| `$` | Fin de la cadena | `/a$/` → la cadena **termina** con `a` |

Si **no se usa anclaje**, el patrón puede aparecer en **cualquier posición** de la cadena.

---

## 1. Búsqueda por inicio de cadena — `/^patron/`

Encuentra documentos donde el campo **comienza** con el patrón.

```js
db.collection.find({ "campo": /^pattern/ })

// Estudiantes cuyo nombre empieza con "Jo" (Jose, Joaquina, Joana, ...)
db.estudiantes.find({ "nombre": /^Jo/ })

// Lo mismo, escrito con $regex
db.estudiantes.find({ "nombre": { $regex: /^Jo/ } })
```

---

## 2. Búsqueda por fin de cadena — `/patron$/`

Encuentra documentos donde el campo **termina** con el patrón.

```js
db.collection.find({ "campo": /pattern$/ })

// Estudiantes cuyo nombre termina con "a" (Joana, Maria, Carla, ...)
db.estudiantes.find({ "nombre": /a$/ })
```

---

## 3. Búsqueda en cualquier posición — `/patron/`

Sin anclajes, el patrón puede aparecer en **cualquier parte** del texto (al inicio, al medio o al final).

```js
db.collection.find({ "campo": /pattern/ })

// Estudiantes cuyo nombre contiene la subcadena "li" en cualquier posición
// (Felipe, Carolina, Lila, Camila, ...)
db.estudiantes.find({ "nombre": /li/ })
```

---

## 4. Búsqueda insensible a mayúsculas/minúsculas — `/patron/i`

El modificador `i` (de *insensitive*) hace que la búsqueda **ignore mayúsculas y minúsculas**.

```js
db.collection.find({ "campo": /pattern/i })

// Coincide con "li", "LI", "Li", "lI"
db.estudiantes.find({ "nombre": /LI/i })
```

> El modificador va **fuera** de las barras, al final: `/patron/i`.

---

## Resumen — combinando anclajes y modificador

| Patrón | Significa | Coincide con |
|---|---|---|
| `/^Jo/` | Empieza con `Jo` | `Jose`, `Joaquina` |
| `/a$/` | Termina con `a` | `Maria`, `Lila` |
| `/li/` | Contiene `li` (en cualquier posición) | `Felipe`, `Lila`, `Camila` |
| `/li/i` | Contiene `li` (sin distinguir mayús/minús) | `Felipe`, `LIma`, `cariLLi` |
| `/^Jo/i` | Empieza con `jo`/`Jo`/`JO`/... | `Jose`, `joana`, `JOAQUIN` |
| `/a$/i` | Termina con `a`/`A` | `Maria`, `lilA` |

---

## Equivalencia con SQL

| MongoDB (regex) | SQL (LIKE) |
|---|---|
| `{ nombre: /^Jo/ }` | `WHERE nombre LIKE 'Jo%'` |
| `{ nombre: /a$/ }` | `WHERE nombre LIKE '%a'` |
| `{ nombre: /li/ }` | `WHERE nombre LIKE '%li%'` |
| `{ nombre: /li/i }` | `WHERE LOWER(nombre) LIKE '%li%'` |

---

## Buenas prácticas

- Las expresiones regulares funcionan también en `updateMany`, `updateOne`, `deleteMany`, etc., no sólo en `find`.
- Si el patrón sólo busca por el **inicio** de la cadena (`/^...`), MongoDB puede aprovechar índices sobre el campo y la consulta será mucho más rápida.
- Las regex sin anclaje (`/li/`) y las case-insensitive (`/li/i`) **no usan índices de manera tan eficiente**: en colecciones grandes son costosas.
- Para validaciones más complejas (clases de caracteres, repeticiones, etc.) se puede usar la sintaxis completa de regex de PCRE: `[a-z]`, `\d`, `+`, `*`, `{n,m}`, etc.
