# Sesión 5 — Pipelines combinados (repaso de semana-07)

> Ejercicios tomados de `semana-07/practica/agregaciones/sesion-5-ejercicios.md`. Combinan lo aprendido en las sesiones anteriores.
>
> **Tema:** `$lookup` con casos borde, `$unwind` sobre arrays embebidos, `$group` final.
>
> **Datos a usar:** `data-empleados.js` y `data-departamentos.js`.
>
> **Cómo cargar los datos:**
>
> ```js
> use empresa_practica_s8
> load("data-departamentos.js")
> load("data-empleados.js")
> ```

---

## Ejercicio 1 — Departamentos sin empleados (simple)

Encontrar los departamentos que **no tienen ningún empleado asociado**. Mostrar `nombre` y `sede` (sin `_id`).

> Pista: `aggregate` desde `departamentos`, `$lookup` hacia `empleados`, `$match` con `{ empleados: { $size: 0 } }` y `$project`.

---

## Ejercicio 2 — Top 5 skills más comunes (simple)

Hacer un **ranking de los 5 skills más frecuentes** entre los empleados (cada empleado tiene un array `skills`). Mostrar el skill y la cantidad de empleados que lo poseen, ordenado por cantidad **descendente**.

> Pista: `$unwind: "$skills"` + `$sortByCount` + `$limit`.

---

## Ejercicio 3 — Tablero por departamento (avanzado)

Para **cada departamento** mostrar:

- `departamento`: nombre del departamento
- `sede`: sede del departamento
- `cantidadEmpleadosActivos`: cantidad de empleados con `activo: true`
- `sueldoPromedio`: promedio del `sueldo` de los empleados activos (redondeado a 2 decimales)
- `empleadosActivos`: array de strings `"<nombre> <apellido>"` (sin repetidos)

Considerar **solo a los empleados activos**. Si un departamento no tiene empleados activos no debe aparecer en el resultado. Ordenar por `sueldoPromedio` **descendente**.

> Pista: `aggregate` desde `departamentos`, `$lookup` hacia `empleados`, `$unwind` sobre el array de empleados, `$match` por `activo: true`, `$group` por departamento con `$sum`, `$avg`, `$addToSet` + `$concat`, después `$sort` y `$project` final con `$round`.
