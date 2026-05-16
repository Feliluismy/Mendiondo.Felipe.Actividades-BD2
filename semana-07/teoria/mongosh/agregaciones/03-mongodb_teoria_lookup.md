# MongoDB en Consola — Agregación (Parte 3): `$lookup` (joins)

> **Fuente:** Apuntes UTN Avellaneda — *Base de Datos II — Agregación* (Yanina Scudero)
>
> **Datos de prueba:** el ejemplo del PDF arma a mano una colección `empleados` (3 docs) y otra `departamentos` (3 docs) usando `insertOne` — esos `insertOne` están más abajo en este mismo documento, no requieren un `load()`.
>
> Para los ejercicios de la práctica (con un dataset más rico) los archivos están en `semana-07/data_files/`:
>
> ```js
> use base1
> load("data-departamentos.js")
> load("data-empleados.js")
> ```
>
> Diferencias entre el ejemplo del PDF y los archivos `data-*.js`:
>
> | Aspecto | PDF (este .md) | `data-empleados.js` / `data-departamentos.js` |
> |---|---|---|
> | Cantidad | 3 empleados, 3 deptos | 25 empleados, 7 deptos |
> | Tipo de `idDepto` | **string** (`'1'`, `'2'`) | **número** (`1`, `2`) |
> | Campos extra | mínimos | sueldo, skills, activo, sede, presupuesto, etc. |
>
> Si vas a correr el pipeline del PDF tal cual, usá los `insertOne` de este .md. Si vas a hacer los ejercicios de la práctica, cargá los archivos `.js`.

---

## ¿Para qué sirve `$lookup`?

`$lookup` permite **unir los datos de dos colecciones** dentro del pipeline. Hace algo equivalente a un **`LEFT OUTER JOIN`** de SQL: por cada documento de la colección de entrada, busca documentos coincidentes en otra colección y los **agrega como un array** dentro del documento original.

```js
{
  $lookup: {
    from:         "<otraColeccion>",
    localField:   "<campo en la colección actual>",
    foreignField: "<campo en la otra colección>",
    as:           "<nombre del array de resultados>"
  }
}
```

### Parámetros

| Parámetro | Significa |
|---|---|
| `from` | Colección con la que se quiere hacer el join (debe estar en la **misma base**). |
| `localField` | Campo de la colección **origen** (la que viene atravesando el pipeline) que actúa como *clave ajena*. |
| `foreignField` | Campo de la colección indicada en `from` con el que se hace la coincidencia (suele ser su clave primaria). |
| `as` | Nombre del nuevo campo (un **array**) que se agrega a cada documento con los resultados del join. |

> **Importante:** el resultado de `$lookup` siempre es un **array** (puede tener 0, 1 o muchos elementos), aun cuando matchee un solo documento. Por eso se suele combinar con `$unwind` para "aplanarlo".

---

## Ejemplo del PDF — Empleados y Departamentos

### Modelo

```
empleados                                    departamentos
| _id | nombre | telefono | mail | idDepto | | _id | nombre   |
| 1   | Juan   | 123      | ...  | '1'     | | 1   | RRHH     |
| 2   | Ana    | 456      | ...  | '1'     | | 2   | FINANZAS |
| 3   | Pedro  | 789      | ...  | '2'     | | 3   | SISTEMAS |
```

### Inserts

```js
db.empleados.insertOne({ _id: 1, nombre: 'Juan',  telefono: '1234', mail: 'juan@gmail.com',  idDepto: '1' })
db.empleados.insertOne({ _id: 2, nombre: 'Ana',   telefono: '456',  mail: 'ana@gmail.com',   idDepto: '1' })
db.empleados.insertOne({ _id: 3, nombre: 'Pedro', telefono: '789',  mail: 'pedro@gmail.com', idDepto: '2' })

db.departamentos.insertOne({ _id: 1, nombre: 'RRHH'     })
db.departamentos.insertOne({ _id: 2, nombre: 'FINANZAS' })
db.departamentos.insertOne({ _id: 3, nombre: 'SISTEMAS' })
```

### Consigna

> Buscar el **nombre** de los empleados del **Departamento 1** ordenado por nombre.

### Pipeline

```js
db.departamentos.aggregate([
  { $match:  { _id: 1 } },                       // dejo sólo el depto 1
  { $lookup: {
      from:         'empleados',                 // join con 'empleados'
      localField:   '_id',                       // _id del depto
      foreignField: 'idDepto',                   // idDepto en empleados
      as:           'EmpleadosDepto1'            // array con los matches
  }},
  { $unwind:  '$EmpleadosDepto1' },              // aplano el array
  { $sort:    { 'EmpleadosDepto1.nombre': 1 } }, // ordeno por nombre
  { $project: { _id: 0, 'EmpleadosDepto1.nombre': 1 } }
])
```

### Resultado

```js
[
  { EmpleadosDepto1: { nombre: 'Ana'  } },
  { EmpleadosDepto1: { nombre: 'Juan' } }
]
```

---

## ¿Por qué se necesita `$unwind` después?

El campo `as: 'EmpleadosDepto1'` es **siempre un array**. Si en el departamento 1 hay 2 empleados, el documento queda así:

```js
{
  _id: 1,
  nombre: 'RRHH',
  EmpleadosDepto1: [
    { _id: 1, nombre: 'Juan', ... },
    { _id: 2, nombre: 'Ana',  ... }
  ]
}
```

Si querés **un documento por empleado** (para ordenarlos, proyectarlos por separado, etc.), usás `$unwind: '$EmpleadosDepto1'` y se "abre" en dos documentos.

---

## Equivalencia con SQL

```sql
SELECT e.nombre
  FROM departamentos d
  JOIN empleados      e ON e.idDepto = d._id
 WHERE d._id = 1
 ORDER BY e.nombre ASC;
```

```js
db.departamentos.aggregate([
  { $match:  { _id: 1 } },
  { $lookup: { from: 'empleados', localField: '_id',
               foreignField: 'idDepto', as: 'emps' } },
  { $unwind: '$emps' },
  { $sort:   { 'emps.nombre': 1 } },
  { $project:{ _id: 0, 'emps.nombre': 1 } }
])
```

---

## Buenas prácticas

- `$lookup` siempre se hace contra una colección de la **misma base de datos**.
- Tener un **índice** sobre el `foreignField` (o el `localField`) acelera mucho el join.
- Si esperás **un solo match** por documento, usá `$unwind` para aplanar y trabajar con campos directos. Si los matches pueden ser muchos, manténelo como array y usá operadores de array.
- Para casos más complejos (múltiples condiciones de join, sub-pipelines), `$lookup` admite la forma extendida con `let` y `pipeline`. (No la cubrimos en este apunte.)
