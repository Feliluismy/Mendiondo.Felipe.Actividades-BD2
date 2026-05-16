# MongoDB en Consola — Resumen Teórico

> **Fuente:** Apuntes UTN Avellaneda — Páginas 45 a 49

---

## 15. Métodos `find` con Query y Projection

### ¿Qué es el método `find`?

`find` es el método principal para **consultar documentos** en una colección de MongoDB. Acepta hasta dos parámetros opcionales:

| Parámetro | Nombre | Descripción |
|---|---|---|
| 1° | **Query** | Filtra los documentos que cumplen una condición |
| 2° | **Projection** | Especifica qué campos se quieren recuperar |

---

### Formas de usar `find`

#### Sin parámetros — trae todos los documentos
```js
db.libros.find()
```

#### Con Query — filtra por condición
```js
db.libros.find({ precio: 50 })
// Recupera todos los documentos donde precio === 50
```

#### Con Query + Projection — filtra y selecciona campos
```js
db.libros.find({ precio: 50 }, { titulo: 1, cantidad: 1 })
// Retorna solo los campos "titulo", "cantidad" y "_id" de los docs con precio 50
```

---

### Reglas de Projection

- Se asigna **`1`** al campo para **incluirlo** en el resultado.
- Se asigna **`0`** al campo para **excluirlo** del resultado.
- El campo **`_id` se incluye siempre por defecto**, salvo que se excluya explícitamente:

```js
// Excluir el _id del resultado
db.libros.find({ precio: 50 }, { titulo: 1, cantidad: 1, _id: 0 })
```

> ⚠️ No se pueden mezclar inclusiones y exclusiones en la misma projection (salvo para `_id`).

---

### Encadenando `.sort()` con `find`

Para ordenar los resultados se encadena el método `.sort()`:

```js
// Ordenar de menor a mayor por precio (1 = ascendente, -1 = descendente)
db.articulos.find({ rubro: 'monitor' }, { nombre: 1, precio: 1 }).sort({ precio: 1 })
```

---

## 16. Documentos Embebidos

### ¿Qué son?

Hasta ahora los documentos almacenaban datos simples (enteros, strings, arreglos). MongoDB también permite que **el valor de un campo sea otro documento completo**. Esto se llama **documento embebido** (o subdocumento).

### ¿Cuándo usarlos?

Cuando se necesita **agrupar datos relacionados** y luego hacer consultas que discriminen por sus subcampos. Por ejemplo, una dirección con calle, número y código postal.

---

### Sintaxis de un documento embebido

```js
db.clientes.insertOne({
  _id: 1,
  nombre: 'Martinez Victor',
  mail: 'mvictor@gmail.com',
  direccion: {          // <-- campo de tipo documento (embebido)
    calle: 'Colon',
    numero: 620,
    codigopostal: 5000
  }
})
```

### Consultar por campos de un subdocumento

Se utiliza la **notación de punto** (`"campo.subcampo"`) para acceder a los campos internos:

```js
// Buscar clientes que viven en la calle 'Colon'
db.clientes.find({ "direccion.calle": "Colon" })

// Buscar clientes con número de puerta mayor a 500
db.clientes.find({ "direccion.numero": { $gt: 500 } })
```

---

## Operadores de Comparación útiles

| Operador | Significado | Ejemplo |
|---|---|---|
| `$gt` | Mayor que | `{ precio: { $gt: 3500 } }` |
| `$gte` | Mayor o igual que | `{ precio: { $gte: 3500 } }` |
| `$lt` | Menor que | `{ precio: { $lt: 1000 } }` |
| `$lte` | Menor o igual que | `{ precio: { $lte: 1000 } }` |
| `$ne` | Distinto de | `{ rubro: { $ne: 'mouse' } }` |

---

## Resumen Visual

```
db.<colección>.find( <query> , <projection> ).sort( <orden> )
                      ↑              ↑                ↑
                 Filtro de       Campos a         Ordenamiento
                documentos       mostrar          del resultado
```
