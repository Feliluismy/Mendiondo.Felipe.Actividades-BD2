# Sesión 4 — `$lookup` básico (empleados / departamentos)

> **Tema:** `$lookup`, `$unwind` sobre el resultado del lookup, `$project` con campos del documento "joineado".
>
> **Datos a usar:** `data-empleados.js` y `data-departamentos.js`.
>
> **Cómo cargar los datos** (desde `mongosh`):
>
> ```js
> use empresa_practica
> load("data-departamentos.js")
> load("data-empleados.js")
> ```
>
> El campo `idDepto` de `empleados` referencia al `_id` de `departamentos`.

---

## Ejercicio 1 — Empleado con su departamento (simple)

Para cada empleado mostrar **un único documento plano** con:

- `empleado`: nombre + apellido (con un espacio en el medio)
- `departamento`: el `nombre` del departamento al que pertenece

Sin `_id`. Ordenar por `empleado` **ascendente**.

> Pista: `$lookup` desde `empleados` hacia `departamentos`, `$unwind` del array resultante, `$project` con `$concat`, `$sort`.
>
> Ojo: el empleado de `idDepto: 99` no tiene departamento — con `$unwind` "normal" desaparece, está bien que no aparezca en este ejercicio.

---

## Ejercicio 2 — Cantidad de empleados por departamento (simple)

Para **cada departamento** mostrar:

- `departamento`: el nombre del departamento
- `cantidadEmpleados`: cantidad de empleados que pertenecen a él

Ordenar por `cantidadEmpleados` **descendente**.

> Pista: hacer el `aggregate` desde `departamentos`, `$lookup` hacia `empleados`, y usar `$size` sobre el array resultante en el `$project`.

---

## Ejercicio 3 — Resumen por sede (avanzado)

Para cada `sede` calcular:

- `cantidadEmpleados`: total de empleados de los departamentos de esa sede
- `sueldoTotal`: suma de los sueldos
- `sueldoPromedio`: promedio de sueldo
- `departamentos`: array con los nombres de los departamentos de esa sede (sin repetidos)

Ordenar por `sueldoTotal` **descendente**.

> Pista: `aggregate` desde `departamentos`, `$lookup` hacia `empleados`, `$unwind` sobre los empleados, `$group` por `sede` con `$sum`, `$avg`, `$addToSet`.
