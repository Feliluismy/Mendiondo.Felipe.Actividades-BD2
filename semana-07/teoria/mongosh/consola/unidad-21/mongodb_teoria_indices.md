# MongoDB en Consola — Índices

> **Fuente:** Apuntes UTN Avellaneda — Páginas 70 a 71

---

## 21. Índices en MongoDB

### ¿Qué es un índice?

Un **índice** es una estructura de datos auxiliar asociada a una colección que permite **localizar documentos rápidamente**, sin tener que recorrer la colección entera.

> Analogía: el índice de un libro. En lugar de leer todas las páginas para encontrar un tema, se busca en el índice y se va directamente a la página indicada.

---

## Las dos formas en que MongoDB accede a los documentos

| Método | Descripción | Analogía |
|---|---|---|
| **Sin índice** — Recorrido secuencial (*Collection Scan*) | MongoDB lee todos los documentos uno por uno desde el principio hasta encontrar los que cumplen la condición | Hojear un libro página por página |
| **Con índice** — Recorrido del árbol (*Index Scan*) | MongoDB recorre la estructura de árbol del índice, localiza los documentos que coinciden y los extrae directamente | Buscar en el índice del libro y saltar a la página exacta |

---

## ¿Por qué son importantes?

Sin índice, cada consulta obliga a MongoDB a recorrer **todos** los documentos de la colección. Para colecciones pequeñas esto no es problema, pero con **cientos de miles o millones de documentos** el impacto en el rendimiento es enorme.

Los índices aceleran:
- Consultas (`find`)
- Modificaciones (`updateOne`, `updateMany`) — porque primero se localiza el documento
- Eliminaciones (`deleteOne`, `deleteMany`) — por la misma razón

---

## Ventajas y desventajas

| | Detalle |
|---|---|
| ✅ **Ventaja** | Acceso directo y rápido a los documentos |
| ✅ **Ventaja** | Mejora el rendimiento de `find`, `update` y `delete` |
| ✅ **Ventaja** | Los cambios en la colección se reflejan automáticamente en el índice |
| ❌ **Desventaja** | Consume espacio adicional en disco |
| ❌ **Desventaja** | Genera costo de mantenimiento en inserciones y modificaciones (el índice debe actualizarse) |

---

## El índice automático sobre `_id`

MongoDB crea automáticamente un índice sobre el campo **`_id`** en cada colección. Es el único índice que existe por defecto y no puede eliminarse.

Los índices sobre los demás campos deben **definirlos el desarrollador** según las necesidades de consulta de la aplicación.

---

## ¿Cuándo crear un índice? — Reglas de diseño

**Sí crear un índice cuando:**
- El campo se usa frecuentemente en condiciones de `find` (en el primer parámetro — query)
- La colección tiene cientos de miles o millones de documentos
- El campo se usa para ordenar resultados con `sort()`

**No crear un índice cuando:**
- El campo raramente aparece en consultas
- La colección es muy pequeña (el costo de mantener el índice supera el beneficio)
- El campo cambia con muchísima frecuencia (cada actualización reconstruye parte del índice)

> **Regla práctica:** identificar los campos que la aplicación usa más frecuentemente en sus consultas y crear índices sobre ellos.

---

## Comparación con bases de datos relacionales

Los índices en MongoDB funcionan de manera **similar a los de MySQL, SQL Server y PostgreSQL**: son estructuras de árbol B que permiten búsquedas en tiempo logarítmico en lugar de lineal.

La diferencia está en que MongoDB indexa **campos de documentos JSON** (incluidos subcampos de subdocumentos con notación de punto) en lugar de columnas de tablas.

---

## Diagrama conceptual — Con y sin índice

```
SIN ÍNDICE (Collection Scan)
Consulta: { autor: 'Borges' }

Doc 1 → ¿autor == Borges? NO  → siguiente
Doc 2 → ¿autor == Borges? NO  → siguiente
Doc 3 → ¿autor == Borges? SÍ  → retornar
Doc 4 → ¿autor == Borges? NO  → siguiente
...
Doc N → ¿autor == Borges? NO  → fin
Costo: O(N) — proporcional a la cantidad de documentos

CON ÍNDICE (Index Scan)
Índice sobre "autor":
  'Borges'    → [Doc 3, Doc 7]
  'Hernandez' → [Doc 1, Doc 5]
  'Molina'    → [Doc 2]

Consulta: { autor: 'Borges' }
  → Ir directo a 'Borges' en el árbol → [Doc 3, Doc 7]
Costo: O(log N) — mucho más rápido
```

---

## Comandos clave (anticipo — se verán en detalle más adelante)

```js
// Ver los índices de una colección
db.coleccion.getIndexes()

// Crear un índice sobre un campo (1 = ascendente, -1 = descendente)
db.coleccion.createIndex({ campo: 1 })

// Crear un índice único (no permite valores duplicados en ese campo)
db.coleccion.createIndex({ campo: 1 }, { unique: true })

// Eliminar un índice
db.coleccion.dropIndex({ campo: 1 })
```
