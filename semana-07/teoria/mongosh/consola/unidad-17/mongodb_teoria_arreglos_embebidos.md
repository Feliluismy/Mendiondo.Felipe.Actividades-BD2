# MongoDB en Consola — Arreglos de Documentos Embebidos

> **Fuente:** Apuntes UTN Avellaneda — Páginas 54 a 60

---

## 17. Campos de tipo arreglo con elementos de tipo documento

### Repaso: arreglo de valores simples

Ya conocíamos los campos de tipo arreglo que almacenan valores primitivos:

```js
db.libros.insertOne({
  codigo: 1,
  nombre: 'El aleph',
  autor: 'Borges',
  editoriales: ['Planeta', 'Siglo XXI']   // arreglo de strings
})
```

### Nuevo: arreglo de documentos embebidos

MongoDB permite que los elementos de un arreglo sean **documentos completos** (con sus propios subcampos). Esto permite agrupar datos relacionados dentro de un único documento principal.

```js
db.posts.insertOne({
  _id: 1,
  titulo: 'Lenguaje Java',
  contenido: 'Uno de los lenguajes más utilizados es ...',
  comentarios: [                        // arreglo de documentos
    { autor: 'Marcos Paz',   mail: 'pazm@gmail.com',      contenido: 'Me parece un buen...' },
    { autor: 'Ana Martinez', mail: 'martineza@gmail.com', contenido: 'Todo ha cambiado en...' },
    { autor: 'Luiz Blanco',  mail: 'blancol@outlook.com', contenido: 'Afirmo que es...' }
  ]
})
```

El campo `comentarios` es un arreglo donde **cada elemento es un documento** con sus propios campos (`autor`, `mail`, `contenido`).

---

## Consultas sobre arreglos de documentos embebidos

La misma **notación de punto** usada para subdocumentos simples se aplica aquí.  
MongoDB recorre **todos los elementos del arreglo** en busca de coincidencias.

### Ejemplo 1 — Projection sobre un subcampo del arreglo

Recuperar el título de cada post y los autores de sus comentarios:

```js
db.posts.find(
  {},                                           // query: todos los docs
  { _id: 0, titulo: 1, 'comentarios.autor': 1 } // projection: solo titulo y autor de cada comentario
).pretty()
```

> 💡 Con `'comentarios.autor': 1` MongoDB proyecta únicamente el campo `autor` de cada elemento del arreglo `comentarios`, omitiendo `mail` y `contenido`.

---

### Ejemplo 2 — Filtrar por un subcampo dentro del arreglo

Recuperar todos los posts donde **alguno** de los comentarios fue hecho por 'Pablo Rodriguez':

```js
db.posts.find({ 'comentarios.autor': 'Pablo Rodriguez' }).pretty()
```

MongoDB busca en **todos los elementos** del arreglo. Si al menos uno cumple la condición, devuelve el documento completo.

---

### Ejemplo 3 — Filtrar por posición específica en el arreglo

Recuperar los posts donde el **primer comentario** (índice `0`) fue hecho por 'Pablo Rodriguez':

```js
db.posts.find({ 'comentarios.0.autor': 'Pablo Rodriguez' }).pretty()
```

La notación `'arreglo.N.subcampo'` permite apuntar a un elemento en una **posición específica** del arreglo (índice base 0).

---

## Comparación de las tres formas de consulta

| Consulta | Qué hace |
|---|---|
| `{ 'comentarios.autor': 'X' }` | Busca si **algún** elemento del arreglo tiene `autor == 'X'` |
| `{ 'comentarios.0.autor': 'X' }` | Busca si el **primer** elemento (`[0]`) tiene `autor == 'X'` |
| `{ 'comentarios.N.autor': 'X' }` | Busca si el elemento en posición **N** tiene `autor == 'X'` |

---

## Anidamiento de más niveles

Es posible crear estructuras con más profundidad: arreglos cuyos elementos son documentos que a su vez contienen otros documentos. Ejemplo con la colección `series`:

```js
db.series.insertOne({
  _id: 1,
  titulo: 'The big bang theory',
  productor: 'Chuck Lorre',
  actores: ['Johnny Galecki', 'Jim Parsons', ...],
  temporada1: [
    { capitulo1: { titulo: 'Piloto',                       audiencia: 8300000 } },
    { capitulo2: { titulo: 'La hipótesis del Gran Cerebro', audiencia: 8700000 } },
    { capitulo3: { titulo: 'El Corolario de el Gato con Botas', audiencia: 9200000 } }
  ],
  temporada2: [
    { capitulo1: { titulo: 'El paradigma del pescado malo', audiencia: 10000000 } },
    { capitulo2: { titulo: 'La topología de la bragueta',   audiencia: 11000000 } }
  ]
})
```

Aquí `temporada1` es un arreglo, cada elemento es un documento cuyo valor es **otro documento** (`capitulo1`, `capitulo2`, etc.) con `titulo` y `audiencia`.

---

## ⚠️ Acotaciones importantes — Límite de tamaño

- Un documento en MongoDB **no puede superar los 16 MB**.
- Si un arreglo embebido puede crecer de forma ilimitada (ej: todos los ciudadanos de una ciudad), **no conviene embeber**: es mejor usar colecciones separadas.
- Si la cantidad de elementos es **acotada y razonable** (ej: comentarios de un post), el embebido es la solución correcta y más eficiente.

> **Regla de diseño:** antes de embeber, preguntarse ¿cuánto puede crecer este arreglo? Si la respuesta es "potencialmente millones", hay que separar en colecciones.

---

## Esquema mental — Niveles de anidamiento

```
Documento posts
│
├── _id, titulo, contenido
└── comentarios  [ ]  ← arreglo
    ├── { autor, mail, contenido }   ← elemento 0 (doc embebido)
    ├── { autor, mail, contenido }   ← elemento 1
    └── { autor, mail, contenido }   ← elemento 2

Consulta por cualquier elemento:  { 'comentarios.autor': 'X' }
Consulta por posición específica: { 'comentarios.0.autor': 'X' }
```
