# Sesión 1 — Documentos embebidos (unidad 16)

> **Tema:** campos cuyo valor es otro documento, consulta con **notación de punto** (`'campo.subcampo'`), `.pretty()`.
>
> **Material teórico:** `semana-07/teoria/mongosh/consola/unidad-16/mongodb_teoria_embebidos.md`.
>
> **Cómo arrancar** (desde `mongosh`):
>
> ```js
> use semana8_embebidos
> ```

---

## Ejercicio 1 — Insertar clientes con dirección embebida (simple)

Insertar en la colección `clientes` estos tres documentos. La `direccion` de cada uno es un **subdocumento** con `calle`, `numero` y `codigopostal`:

```js
db.clientes.insertOne({
  _id: 1,
  nombre: 'Martinez Victor',
  mail: 'mvictor@gmail.com',
  direccion: { calle: 'Colon',     numero: 620,  codigopostal: 5000 }
})

db.clientes.insertOne({
  _id: 2,
  nombre: 'Pereyra Laura',
  mail: 'lpereyra@gmail.com',
  direccion: { calle: 'Colon',     numero: 1850, codigopostal: 5000 }
})

db.clientes.insertOne({
  _id: 3,
  nombre: 'Rios Pablo',
  mail: 'pablorios@outlook.com',
  direccion: { calle: 'San Martin', numero: 320,  codigopostal: 1426 }
})
```

Verificar con `db.clientes.find().pretty()` que los documentos se insertaron correctamente y que `direccion` aparece como subdocumento (no como string).

---

## Ejercicio 2 — Filtrar por un subcampo (simple)

Recuperar **todos los clientes que viven en la calle `"Colon"`**. Mostrar todos los campos. Usar `.pretty()` para que la salida quede legible.

> Pista: notación de punto entre comillas → `{ 'direccion.calle': 'Colon' }`.

---

## Ejercicio 3 — Filtrar por subcampo con rango (avanzado)

Recuperar los clientes que viven en la calle `"Colon"` **y** cuyo `numero` de dirección esté **entre 1 y 1000** (inclusive).

> Pista: rango con `$gte` y `$lte` **en el mismo objeto** sobre el mismo subcampo:
>
> ```js
> { 'direccion.calle': 'Colon', 'direccion.numero': { $gte: 1, $lte: 1000 } }
> ```
>
> Repetir la misma clave dos veces (una con `$gte` y otra con `$lte`) **no funciona** — JavaScript se queda con el último valor.

---

## Ejercicio 4 — Libros con autor embebido (simple)

Insertar en la colección `libros` estos cuatro documentos. El campo `autor` es un **subdocumento** con `nombre` y `nacionalidad`:

```js
db.libros.insertOne({
  _id: 1, titulo: 'El aleph',      autor: { nombre: 'Borges',         nacionalidad: 'Argentina' }, precio: 20
})
db.libros.insertOne({
  _id: 2, titulo: 'Martin Fierro', autor: { nombre: 'Jose Hernandez', nacionalidad: 'Argentina' }, precio: 50
})
db.libros.insertOne({
  _id: 3, titulo: 'Don Quijote',   autor: { nombre: 'Cervantes',      nacionalidad: 'Española'  }, precio: 80
})
db.libros.insertOne({
  _id: 4, titulo: 'La colmena',    autor: { nombre: 'Camilo Jose Cela',nacionalidad: 'Española' }, precio: 35
})
```

Después, recuperar **todos los libros de autores argentinos** (solo `titulo` y `autor.nombre`, sin `_id`).

> Pista: filtro con `'autor.nacionalidad': 'Argentina'` + proyección con `{ _id: 0, titulo: 1, 'autor.nombre': 1 }`.

---

## Ejercicio 5 — Combinar subcampo con otro filtro (avanzado)

Recuperar los libros cuyo autor sea **español** **y** que tengan `precio >= 50`. Mostrar `titulo`, `autor` y `precio` (sin `_id`).

> Pista: `'autor.nacionalidad': 'Española'` combinado con `precio: { $gte: 50 }` en el mismo filtro.
