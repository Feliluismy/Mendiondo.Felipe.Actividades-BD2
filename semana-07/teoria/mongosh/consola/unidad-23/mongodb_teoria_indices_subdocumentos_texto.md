# MongoDB en Consola — Índices sobre subdocumentos, arrays y texto

> **Fuente:** Apuntes UTN Avellaneda — Páginas 81 a 84

---

## 23. Índices con campos de tipo documento, array y texto (`$text`)

Hasta ahora vimos índices sobre campos "planos" (string, número). MongoDB también permite indexar:

- **Subcampos** de un documento embebido (con notación de punto)
- **Documentos embebidos completos**
- **Campos de tipo array**
- **Texto libre** (búsqueda full-text con el operador `$text`)

---

## Índice sobre un subcampo (notación de punto)

Cuando un documento contiene un objeto embebido, podemos indexar uno de sus subcampos usando **notación de punto** entre comillas:

```js
db.clientes.createIndex({ 'direccion.calle': 1 })
```

Y consultarlo del mismo modo:

```js
db.clientes.find({ 'direccion.calle': 'Dean Funes' })
```

> **Las comillas son obligatorias** en la clave porque el punto no es válido en un identificador JavaScript suelto.

### Documento de ejemplo

```js
{
  _id: 1,
  nombre: 'Martinez Victor',
  mail: 'mvictor@gmail.com',
  direccion: {
    calle: 'Colon',
    numero: 620,
    codigopostal: 5000
  }
}
```

El índice `{ 'direccion.calle': 1 }` solo afecta al subcampo `calle`. Los demás subcampos (`numero`, `codigopostal`) **no** quedan indexados.

---

## Índice sobre el subdocumento completo

También se puede crear un índice **sobre el documento embebido entero**:

```js
db.libros.createIndex({ autor: 1 })
```

Donde `autor` es:

```js
autor: {
  nombre: 'Borges',
  nacionalidad: 'Argentina'
}
```

### Particularidad importante

Este tipo de índice **solo se utiliza cuando la consulta filtra por TODOS los subcampos**, en el **mismo orden** en que están guardados:

```js
// SÍ usa el índice — coincide nombre y nacionalidad
db.libros.find({
  'autor.nombre': 'Java en 10 minutos',
  'autor.nacionalidad': 'Española'
})

// NO aprovecha del mismo modo — solo consulta un subcampo
db.libros.find({ 'autor.nombre': 'Borges' })
```

> **Comparación:** un índice sobre `direccion.calle` sirve para consultas por calle. Un índice sobre `direccion` solo sirve si la consulta abarca calle + número + código postal completos.

---

## Índices sobre arrays (índices multikey)

MongoDB también permite indexar campos de tipo arreglo. Cuando se indexa un array, MongoDB genera **una entrada de índice por cada elemento del arreglo** — esto se conoce como **índice multikey**.

```js
// Si editorial es un array: ['Siglo XXI', 'Planeta']
db.libros.createIndex({ editorial: 1 })
db.libros.find({ editorial: 'Planeta' })
```

> El apunte introduce el tema y avisa que se puede incluir un array en la definición del índice; la búsqueda de texto que viene a continuación es la forma más rica de indexar contenido textual cuando aparece en arrays o strings largos.

---

## Operador `$text` — búsqueda de texto

El operador `$text` permite hacer **búsquedas de texto** sobre una colección que tenga un **índice de texto** definido.

### ¿Qué hace `$text`?

1. **Tokeniza** la cadena de búsqueda usando espacios y signos de puntuación como delimitadores.
2. Aplica un **OR lógico** entre todos los tokens.
3. Devuelve los documentos que contienen al menos uno de los términos.

### Ejemplos

#### OR de varios términos

```js
db.stores.find({ $text: { $search: "java coffee shop" } })
// Encuentra tiendas que contengan "java", "coffee" o "shop".
```

#### Frase exacta — comillas dobles escapadas

```js
db.stores.find({ $text: { $search: "java \"coffee shop\"" } })
// Encuentra documentos que contengan "java" o la frase exacta "coffee shop".
```

#### Excluir un término — prefijo `-`

```js
db.stores.find({ $text: { $search: "java shop -coffee" } })
// "java" o "shop", pero NO "coffee".
```

---

## Puntuación de relevancia (`textScore`)

Por defecto los resultados de `$text` **no vienen ordenados**. Pero internamente MongoDB calcula una **puntuación de relevancia** (qué tan bien coincide cada documento con la búsqueda).

Para ordenar por relevancia hay que:

1. **Proyectar** el campo de score con `$meta: "textScore"`.
2. **Ordenar** por el mismo `$meta`.

```js
db.stores.find(
  { $text: { $search: "java coffee shop" } },
  { score: { $meta: "textScore" } }
).sort(
  { score: { $meta: "textScore" } }
)
```

### ¿Qué es `$meta`?

- `$meta` retorna **metadatos asociados al documento** generados por MongoDB.
- `"textScore"` es el nombre del metadato que asigna una puntuación de relevancia a cada documento que coincide con la búsqueda.

---

## Crear un índice de texto

### Reglas importantes

- Una colección puede tener **un solo índice de texto** (regla estricta).
- Pero ese **único** índice puede cubrir **varios campos**.
- Indexar los campos consultados con frecuencia aumenta la chance de tener **covered queries** (consultas resueltas solo con el índice).

### Sintaxis general

```js
db.<coleccion>.createIndex({
  <campo1>: "text",
  <campo2>: "text",
  ...
})
```

### Ejemplo en español

```js
db.libros.createIndex(
  { titulo: "text" },
  { default_language: "spanish" }
)
```

- `default_language: "spanish"` indica el **idioma del análisis**: cómo separar palabras, qué stopwords ignorar (de, la, el, ...) y cómo aplicar la raíz de las palabras (stemming).
- Si no se especifica, MongoDB usa `english` por defecto.

---

## Resumen de la unidad

| Caso | Sintaxis | Cuándo se usa |
|---|---|---|
| Subcampo embebido | `createIndex({ 'doc.subcampo': 1 })` | Consulta por un subcampo puntual |
| Subdocumento completo | `createIndex({ doc: 1 })` | Consulta por TODOS los subcampos a la vez |
| Array (multikey) | `createIndex({ campoArray: 1 })` | Consulta por elementos de un arreglo |
| Texto libre | `createIndex({ campo: "text" })` | Búsquedas con `$text` |
| OR de palabras | `find({ $text: { $search: "a b c" } })` | OR implícito entre términos |
| Frase exacta | `find({ $text: { $search: "\"frase exacta\"" } })` | Mantener las palabras juntas |
| Excluir término | `find({ $text: { $search: "a -b" } })` | Excluir resultados con `b` |
| Score de relevancia | `{ score: { $meta: "textScore" } }` | Ordenar resultados por pertinencia |
