# Sesión 4 — Ejercicios propuestos del script de semana-07 (repaso)

> Ejercicios tomados de `semana-07/teoria/mongosh/group/mongodb_practica_group.js` (sección "EJERCICIOS PROPUESTOS").
>
> **Datos a usar:** la colección `estudiantes` del PDF — los 4 documentos originales. Crear así desde `mongosh`:
>
> ```js
> use semana8_group_repaso
> db.estudiantes.drop()
> db.estudiantes.insertMany([
>   { nombre: "Ana",   edad: 17, curso: "A" },
>   { nombre: "Juan",  edad: 18, curso: "A" },
>   { nombre: "Luis",  edad: 17, curso: "B" },
>   { nombre: "Maria", edad: 19, curso: "B" }
> ])
> ```

---

## Ejercicio 1 — Cantidad por curso

Agrupar a los estudiantes por **curso** y contar cuántos hay en cada uno.

> Pista: `$group` con `_id: "$curso"` y `{ $sum: 1 }`.

---

## Ejercicio 2 — Nombres por edad

Agrupar por **edad** y guardar los nombres de los estudiantes de cada edad en un array `alumnos`.

> Pista: `$push: "$nombre"`.

---

## Ejercicio 3 — Suma total de edades

Calcular la **suma total** de las edades de **todos** los estudiantes (un solo número como resultado).

> Pista: `_id: null` + `{ $sum: "$edad" }`.

---

## Ejercicio 4 — Edad promedio por curso

Para cada **curso**, mostrar la edad **promedio** de sus alumnos. El campo calculado debe llamarse `promedioEdad`.

> Pista: `$avg: "$edad"`.

---

## Ejercicio 5 — Edad mínima y máxima por curso

Para cada **curso**, mostrar la edad **mínima** y la edad **máxima**.

> Pista: `$min` y `$max` sobre `"$edad"` en un mismo `$group`.

---

## Ejercicio 6 — Mayor o igual a 18 (true/false)

Agrupar por la condición **"es mayor o igual a 18"**. El `_id` debe ser `true` o `false`. Para cada grupo guardar la cantidad de estudiantes y la lista de nombres.

> Pista: `_id: { $gte: ["$edad", 18] }`.

---

## Ejercicio 7 — Atrapamoscas del "$"

**(a)** Escribir un `$group` que use `_id: "curso"` (**sin** el `$`) y observar cuántos grupos resultan. Explicar **por qué**.

**(b)** Escribir ahora `_id: "$curso"` (**con** el `$`) y comparar el resultado.

---

## Ejercicio 8 — Totales generales

En **un solo pipeline** calcular y mostrar:

- cantidad total de estudiantes
- edad promedio
- edad mínima
- edad máxima

> Pista: `_id: null` + varios campos calculados en el mismo `$group`.

---

## Ejercicio 9 — Agregar más datos y verificar

Insertar estos estudiantes adicionales:

```js
db.estudiantes.insertMany([
  { nombre: "Pablo",  edad: 20, curso: "A" },
  { nombre: "Sofia",  edad: 17, curso: "C" },
  { nombre: "Carlos", edad: 18, curso: "B" }
])
```

Volver a correr el Ejercicio 1 y verificar que ahora el resultado cambió.

---

## Ejercicio 10 — Reflexión

**(a)** ¿Por qué `$group` SIEMPRE necesita `_id`?

**(b)** ¿Qué diferencia hay entre `$sum: 1` y `$sum: "$edad"`?

**(c)** ¿Cuándo usarías `$push` y cuándo `$addToSet`? (Pista: probá agregar un estudiante repetido y compará.)
