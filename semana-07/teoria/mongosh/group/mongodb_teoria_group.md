# MongoDB en Consola — `$group` paso a paso

> **Fuente:** Apuntes UTN Avellaneda — *Base de Datos II — Agregación / `$group`* (Yanina Scudero)
>
> **Datos de prueba:** los ejemplos usan la colección `estudiantes` (campos `nombre`, `edad`, `curso`). Los 4 documentos del PDF están en `semana-07/data_files/data-estudiantes.js` (más algunos extra para los ejercicios). Cargar con:
>
> ```js
> use base1
> load("data-estudiantes.js")
> ```

---

## ¿Qué es `$group` en MongoDB?

`$group` sirve para **AGRUPAR documentos** y sacar **información resumida** (similar a `GROUP BY` en SQL).

Las acciones que toma sobre los documentos son **dos**:

1. **Juntarlos** por algo (edad, curso, ciudad, etc.).
2. Y **luego contar, sumar o listar** cosas para ese grupo.

---

## La idea CLAVE de `$group`

Un `$group` tiene **dos partes importantes**:

```js
{
  $group: {
    _id: <criterio de agrupación>,
    <campoCalculado>: { <operador>: <campo> }
  }
}
```

### `_id` — el criterio de agrupación

- Define **por qué campo se agrupan** los documentos.
- **Todo lo que tenga el mismo `_id` va al mismo grupo.**
- Es **obligatorio** — siempre hay que ponerlo (puede ser `null` para "todo en un solo grupo").

### Campos calculados — `<campo>: { <operador>: ... }`

Son cosas que se **calculan por grupo**. Usan operadores como:

- `$sum`
- `$avg`
- `$push`
- `$count`

---

## Colección de ejemplo (la usaremos en todos los casos)

```js
{ nombre: "Ana",   edad: 17, curso: "A" }
{ nombre: "Juan",  edad: 18, curso: "A" }
{ nombre: "Luis",  edad: 17, curso: "B" }
{ nombre: "Maria", edad: 19, curso: "B" }
```

---

## Ejemplo 1 — Agrupar por edad

```js
db.estudiantes.aggregate([
  {
    $group: {
      _id: "$edad",
      cantidad: { $sum: 1 }
    }
  }
])
```

**¿Qué hace esto?**
Agrupa a los estudiantes por edad y cuenta cuántos hay en cada edad.

```js
{ _id: 17, cantidad: 2 }
{ _id: 18, cantidad: 1 }
{ _id: 19, cantidad: 1 }
```

- `_id = edad` → cada valor distinto de edad es un grupo.
- `cantidad = cuántos documentos hay en ese grupo` (sumamos 1 por cada documento).

---

## Ejemplo 2 — Agrupar por curso y guardar los nombres

```js
db.estudiantes.aggregate([
  {
    $group: {
      _id: "$curso",
      alumnos: { $push: "$nombre" }
    }
  }
])
```

**¿Qué pasa acá?**
Agrupa por curso y guarda **todos los nombres en un array**.

```js
{ _id: "A", alumnos: ["Ana", "Juan"] }
{ _id: "B", alumnos: ["Luis", "Maria"] }
```

> `$push` mete valores en un array. **Cada grupo tiene su propio array.**

---

## Ejemplo 3 — Agrupar menores y mayores de 18

```js
db.estudiantes.aggregate([
  {
    $group: {
      _id: { $lt: ["$edad", 18] },
      estudiantes: {
        $push: { nombre: "$nombre", edad: "$edad" }
      }
    }
  }
])
```

**¿Cómo pensar esto?**
MongoDB evalúa para cada documento: *¿edad < 18?* → `true` o `false`. Después agrupa por esos valores.

```js
{ _id: true,  estudiantes: [ { nombre: "Ana",   edad: 17 }, { nombre: "Luis",  edad: 17 } ] }
{ _id: false, estudiantes: [ { nombre: "Juan",  edad: 18 }, { nombre: "Maria", edad: 19 } ] }
```

- `true` → menores.
- `false` → mayores o iguales a 18.

---

## ¿Por qué los campos llevan el signo `$`?

El signo `$` en los nombres de los campos es lo que más confunde en MongoDB.

**El `$` le dice a MongoDB:** *"esto no es texto literal, es el VALOR de un campo o una operación"*.

### Ejemplo

Supongamos este documento:

```js
{ nombre: "Ana", edad: 17 }
```

`"$edad"` significa **"usá el valor del campo `edad`"** → MongoDB toma `17`.

### Aplicado en `$group`

```js
{
  $group: {
    _id: "$edad",
    cantidad: { $sum: 1 }
  }
}
```

- `"$edad"` → "agrupá usando el VALOR del campo `edad`".
- `$sum` → operador que suma.

> **Sin el `$` MongoDB no sabe que es un campo** — lo trataría como el string literal `"edad"` y todos los documentos terminarían en el mismo grupo.

---

## Errores comunes

- ❌ **Pensar que `$group` solo muestra campos.**
  → No: `$group` **reorganiza y resume** documentos. Si querés "elegir campos para mostrar", eso es `$project`.

- ❌ **Olvidar `_id`.**
  → `$group` **siempre** necesita `_id`. Si no querés agrupar por nada (totalizar todo), poné `_id: null`.

- ❌ **Usar campos normales sin operador.**
  → Todo campo distinto de `_id` debe usar un acumulador: `$sum`, `$push`, `$avg`, etc. No podés escribir `nombre: "$nombre"` directamente dentro de `$group`.

---

## Operadores más usados con `$group`

| Operador | ¿Para qué sirve? |
|---|---|
| `$sum` | contar o sumar |
| `$avg` | promedio |
| `$min` | mínimo |
| `$max` | máximo |
| `$push` | guardar valores en un array |

> **Truco mental:** `$sum: 1` cuenta documentos del grupo (suma 1 por cada uno). `$sum: "$campo"` suma los valores numéricos de ese campo.

---

## Resumen de la unidad

```js
// ESTRUCTURA GENERAL
{
  $group: {
    _id: <criterio>,                       // OBLIGATORIO
    <nombreCampo>: { <operador>: ... }     // 0, 1 o más campos calculados
  }
}
```

| Si querés... | Usá |
|---|---|
| Contar cuántos hay por grupo | `{ $sum: 1 }` |
| Sumar valores por grupo | `{ $sum: "$campo" }` |
| Promedio por grupo | `{ $avg: "$campo" }` |
| Min / Max por grupo | `{ $min: "$campo" }` / `{ $max: "$campo" }` |
| Listar valores por grupo | `{ $push: "$campo" }` |
| Agrupar por una condición | `_id: { $lt: ["$campo", N] }` (true/false) |
| Totalizar TODO en un solo grupo | `_id: null` |
