# Sesión 3 — Índices sobre arrays, texto y eliminación (unidades 23–24)

> **Tema:** índices multikey (sobre arrays), índices de texto + `$text`, `dropIndex`.
>
> **Material teórico:** `unidad-23/mongodb_teoria_indices_subdocumentos_texto.md` y `unidad-24/mongodb_teoria_indices_eliminacion.md`.
>
> **Datos a usar:** `data-peliculas.js` y `data-empleados.js` (los mismos que la sesión anterior).
>
> **Cómo cargar los datos:**
>
> ```js
> use semana8_indices_avanzados
> load("data-peliculas.js")
> load("data-empleados.js")
> ```

---

## Ejercicio 1 — Índice multikey sobre `actores` (simple)

Crear un índice ascendente sobre el campo `actores` de `peliculas`. Como `actores` es un **array**, MongoDB automáticamente crea un **índice multikey** (una entrada de índice por cada actor de cada película).

Después hacer:

```js
db.peliculas.find({ actores: "Al Pacino" })
```

Y ejecutar `.explain('executionStats')` sobre la misma consulta. Anotar el `stage` y `totalDocsExamined`.

> Pista: `createIndex({ actores: 1 })`. La consulta `find({ actores: "Al Pacino" })` matchea películas cuyo array `actores` **contenga** ese elemento.

---

## Ejercicio 2 — Índice de texto sobre `titulo` (simple)

Crear un **índice de texto** sobre `titulo` de `peliculas`, en español:

```js
db.peliculas.createIndex({ titulo: "text" }, { default_language: "spanish" })
```

Después usar `$text` para buscar películas cuyo título contenga la palabra `"padrino"` (sin importar mayúsculas):

```js
db.peliculas.find({ $text: { $search: "padrino" } })
```

Y otra consulta que busque películas que contengan **"viaje"** o **"laberinto"**.

> Pista: `$text` aplica un OR implícito entre los términos. No necesitás escribir `OR` — basta con poner los términos separados por espacio.

---

## Ejercicio 3 — Búsqueda ordenada por relevancia (avanzado)

Sobre el índice de texto que ya creaste, hacer una búsqueda de las películas que matchean los términos `"club drama"` y **ordenar el resultado por relevancia** (mayor score primero).

Mostrar `titulo` y el `score` calculado.

> Pista: hay que proyectar `score: { $meta: "textScore" }` y ordenar también por `{ $meta: "textScore" }`. Sin esto, el orden de salida no está garantizado.

---

## Ejercicio 4 — Listar y eliminar índices (simple)

Al final de los ejercicios 1–3, la colección `peliculas` tiene varios índices. Hacer:

1. `db.peliculas.getIndexes()` — anotar todos los nombres de los índices.
2. Eliminar el índice sobre `actores` **por nombre**.
3. Eliminar el índice de texto **por especificación** (el mismo objeto que usaron al crearlo).
4. Volver a llamar a `getIndexes()` y verificar que solo quedó el de `_id`.

> Pista: `dropIndex('actores_1')` y `dropIndex({ titulo: "text" })`. Recordá que el índice sobre `_id` **no se puede eliminar**.

---

## Ejercicio 5 — Reflexión sobre eliminación (avanzado)

Responder en una o dos líneas cada pregunta:

1. ¿Qué pasa si una aplicación está usando un índice y vos lo eliminás en caliente? ¿Qué métrica de `explain` vas a ver "empeorar"?
2. ¿Cuándo es legítimo eliminar un índice? Mencioná al menos dos situaciones.
3. ¿Por qué MongoDB no te deja eliminar el índice sobre `_id`?
