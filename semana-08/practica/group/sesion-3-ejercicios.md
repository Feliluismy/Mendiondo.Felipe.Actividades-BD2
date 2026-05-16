# Sesión 3 — `_id` como expresión y `$push` vs `$addToSet` (segunda vuelta)

> **Tema:** `_id` calculado con una expresión (no un campo directo), diferencia entre `$push` (con repetidos) y `$addToSet` (sin repetidos).
>
> **Datos a usar:** colección `estudiantes` (con los 7 estudiantes de la Sesión 1) + uno repetido para ver la diferencia entre `$push` y `$addToSet`:
>
> ```js
> use semana8_group
> db.estudiantes.drop()
> db.estudiantes.insertMany([
>   { nombre: "Ana",   edad: 17, curso: "A" },
>   { nombre: "Juan",  edad: 18, curso: "A" },
>   { nombre: "Luis",  edad: 17, curso: "B" },
>   { nombre: "Maria", edad: 19, curso: "B" },
>   { nombre: "Pablo", edad: 20, curso: "A" },
>   { nombre: "Sofia", edad: 17, curso: "C" },
>   { nombre: "Carlos", edad: 18, curso: "B" },
>   { nombre: "Ana",   edad: 22, curso: "C" }   // Otra estudiante llamada "Ana"
> ])
> ```

---

## Ejercicio 1 — Mayores y menores de edad (true / false)

Agrupar a los estudiantes según si **son mayores de edad** (`edad >= 18`). El `_id` del grupo tiene que ser `true` o `false`. Para cada grupo mostrar la cantidad y un array con los nombres.

Resultado esperado:

```js
{ _id: true,  cantidad: 5, nombres: ["Juan", "Maria", "Pablo", "Carlos", "Ana"] }
{ _id: false, cantidad: 3, nombres: ["Ana", "Luis", "Sofia"] }
```

> Pista: `_id: { $gte: ["$edad", 18] }`. MongoDB evalúa la expresión para cada documento (devuelve `true` o `false`) y usa ese valor como criterio de agrupación.

---

## Ejercicio 2 — Rangos de edad

Agrupar a los estudiantes por **rangos de edad**:

- `"menor"` → menores de 18
- `"adulto"` → 18 a 19
- `"mayor"` → 20 o más

Para cada rango, mostrar la cantidad y los nombres.

> Pista: usar `$switch` dentro del `_id`:
>
> ```js
> _id: {
>   $switch: {
>     branches: [
>       { case: { $lt: ["$edad", 18] }, then: "menor" },
>       { case: { $lt: ["$edad", 20] }, then: "adulto" }
>     ],
>     default: "mayor"
>   }
> }
> ```

---

## Ejercicio 3 — `$push` vs `$addToSet`: nombres por curso

Sobre la colección hay **dos estudiantes llamadas "Ana"** (una en curso `A`, una en curso `C`). Hacer dos consultas:

**(a)** Agrupar por curso con `$push: "$nombre"` (deja repetidos).

**(b)** Hacer lo mismo con `$addToSet: "$nombre"` (no deja repetidos).

¿En qué consulta cambia el resultado y por qué? Explicar en una línea.

> Pista: si dentro de un mismo curso hubiera dos estudiantes con el **mismo nombre**, `$push` los listaría dos veces y `$addToSet` los listaría una sola vez. Acá las dos "Ana" están en cursos distintos — pensá si igualmente hay diferencia.

---

## Ejercicio 4 — Reflexión

Responder en una línea cada una:

1. ¿Por qué `$group` siempre necesita `_id`? ¿Qué pasa si se lo omite?
2. ¿En qué se diferencia `{ $sum: 1 }` de `{ $sum: "$edad" }`?
3. Si quisieras saber **cuántas edades distintas** hay en la colección, ¿qué pipeline usarías?
