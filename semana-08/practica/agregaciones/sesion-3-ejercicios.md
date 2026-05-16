# Sesión 3 — `$lookup` combinado (segunda vuelta)

> **Tema:** `$lookup` para combinar empleados con departamentos, mezclado con `$group`, `$match` y `$project`.
>
> **Material teórico:** `semana-07/teoria/mongosh/agregaciones/03-mongodb_teoria_lookup.md`.
>
> **Datos a usar:** `data-empleados.js` y `data-departamentos.js`.
>
> **Cómo cargar los datos:**
>
> ```js
> use semana8_lookup
> load("data-departamentos.js")
> load("data-empleados.js")
> ```

---

## Ejercicio 1 — Empleados con sueldo alto y su departamento (simple)

Listar los empleados con `sueldo > 1000000`. Para cada uno mostrar:

- `empleado`: `"<nombre> <apellido>"`
- `sueldo`
- `departamento`: nombre del departamento al que pertenece

Sin `_id`. Ordenar por `sueldo` **descendente**.

> Pista: `$match` por `sueldo`, después `$lookup` hacia `departamentos`, `$unwind` del array resultante, `$project` con `$concat` y `$sort`.

---

## Ejercicio 2 — Sueldo total por sede (simple)

Para cada `sede` (en `departamentos`), calcular el `sueldoTotal` sumando los sueldos de **todos los empleados** que trabajan en departamentos de esa sede. Ordenar por `sueldoTotal` descendente.

> Pista: `aggregate` desde `departamentos`, `$lookup` hacia `empleados`, `$unwind` sobre los empleados, `$group` por `sede` con `$sum: "$empleados.sueldo"`.

---

## Ejercicio 3 — Empleados sin departamento (simple)

Encontrar los empleados cuyo `idDepto` **no se corresponde con ningún departamento existente**. Mostrar `nombre`, `apellido` y `idDepto`. Sin `_id`.

> Pista: `$lookup` desde `empleados` hacia `departamentos`, después `$match` con `{ depto: { $size: 0 } }` (el array de resultados del `$lookup` está vacío cuando no hay match).

---

## Ejercicio 4 — Departamento con mejor sueldo promedio (avanzado)

Para cada departamento que **tenga al menos un empleado activo**, calcular:

- `departamento`: nombre del departamento
- `sede`: sede del departamento
- `sueldoPromedio`: promedio del `sueldo` de los empleados **activos** (redondeado a 2 decimales)
- `cantidad`: cantidad de empleados activos

Devolver **solo el departamento con el `sueldoPromedio` más alto** (un único documento).

> Pista: `aggregate` desde `departamentos`, `$lookup`, `$unwind`, `$match` por `empleados.activo: true`, `$group` por departamento con `$avg` y `$sum: 1`, `$sort` por `sueldoPromedio` descendente y `$limit: 1`.
