# MongoDB en Consola — Tipo de dato `Date`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 64 a 67

---

## 19. Tipo de dato `Date` en MongoDB

### Repaso: tipos de datos en MongoDB

Antes de incorporar `Date`, recordemos los tipos que ya conocemos:

| Tipo | Descripción |
|---|---|
| `String` | Cadenas de caracteres en formato UTF-8 |
| `Integer32` / `Integer64` | Valores enteros numéricos |
| `Double` | Valores de punto flotante |
| `Object` | Documento embebido (subdocumento) |
| `Array` | Arreglo con elementos de distinto tipo |
| `Boolean` | Valores `true` o `false` |
| **`Date`** | **Fecha y hora — nuevo tipo de este capítulo** |

---

## Cómo usar `Date` en MongoDB

El shell de MongoDB está implementado en **JavaScript**, por lo tanto se usa el constructor `new Date()` de JavaScript para crear valores de fecha.

### Forma 1 — Fecha y hora actual del servidor

```js
db.autos.insertOne({
  patente: 'aaa111',
  fechahora: new Date()   // captura el instante actual
})
```

MongoDB almacena el valor en formato **ISO 8601**:

```
YYYY-MM-DDTHH:MM:SS
```

Ejemplo de lo que se guarda en la colección:
```
"fechahora" : ISODate("2019-01-12T21:49:09.852Z")
```

> La `Z` al final indica que el horario está en **UTC (Tiempo Universal Coordinado)**.

---

### Forma 2 — Fecha específica

Se pasan los argumentos `(año, mes, día)` al constructor:

```js
new Date(2010, 0, 31)   // 31 de enero de 2010
new Date(2001, 11, 1)   // 1 de diciembre de 2001
new Date(2005, 3, 14)   // 14 de abril de 2005
```

> ⚠️ **Advertencia crítica — El mes va de 0 a 11**
> Como el shell es JavaScript, el mes se cuenta desde 0:
>
> | Valor | Mes |
> |---|---|
> | `0` | Enero |
> | `1` | Febrero |
> | ... | ... |
> | `11` | Diciembre |
>
> `new Date(2001, 11, 1)` → 1° de **diciembre** de 2001 (no noviembre ni el mes 11).

Cuando no se pasa la hora, la parte horaria queda en cero:
```
"fechaingreso" : ISODate("2010-01-31T03:00:00Z")
```

---

## Ordenar por campo `Date`

Los campos `Date` se pueden ordenar igual que cualquier campo numérico usando `.sort()`:

```js
// Ordenar por fecha de ingreso de más antiguo a más reciente (ascendente)
db.empleados.find().pretty().sort({ fechaingreso: 1 })

// Ordenar de más reciente a más antiguo (descendente)
db.empleados.find().pretty().sort({ fechaingreso: -1 })
```

---

## Filtrar por rango de fechas

Se usan los operadores de comparación (`$gt`, `$gte`, `$lt`, `$lte`) con valores `Date`:

```js
// Empleados que ingresaron a partir del año 2005
db.empleados.find({ fechaingreso: { $gte: new Date(2005, 0, 1) } })

// Alumnos nacidos a partir de 1970
db.alumnos.find({ fechanacimiento: { $gte: new Date(1970, 0, 1) } })
```

---

## Ejemplo completo — Colección `empleados`

```js
use("base1");
db.empleados.drop();

db.empleados.insertOne({ _id: 20456234, nombre: 'Rodriguez Pablo', fechaingreso: new Date(2010, 0, 31) });
db.empleados.insertOne({ _id: 17488834, nombre: 'Gomez Ana',       fechaingreso: new Date(2001, 11, 1) });
db.empleados.insertOne({ _id: 23463564, nombre: 'Juarez Carla',    fechaingreso: new Date(2005, 3, 14) });

// Ver todos los empleados
db.empleados.find().pretty();

// Ordenados por fecha de ingreso (más antiguo primero)
db.empleados.find().pretty().sort({ fechaingreso: 1 });
```

Resultado de `find()` — las fechas aparecen en formato ISODate:
```
{ "_id": 20456234, "nombre": "Rodriguez Pablo", "fechaingreso": ISODate("2010-01-31T03:00:00Z") }
{ "_id": 17488834, "nombre": "Gomez Ana",        "fechaingreso": ISODate("2001-12-01T03:00:00Z") }
{ "_id": 23463564, "nombre": "Juarez Carla",     "fechaingreso": ISODate("2005-04-14T03:00:00Z") }
```

---

## Tabla resumen — Constructor `new Date()`

| Sintaxis | Resultado |
|---|---|
| `new Date()` | Fecha y hora actual del servidor |
| `new Date(año, mes, día)` | Fecha específica (mes entre 0 y 11) |
| `new Date(año, mes, día, h, m, s)` | Fecha y hora específicas |
| `new Date("YYYY-MM-DD")` | Fecha desde string ISO |

---

## Diagrama mental — Flujo del tipo `Date`

```
Inserción                 Almacenamiento           Consulta
──────────                ──────────────           ────────
new Date()           →   ISODate("...Z")   →   .sort({fecha: 1})
new Date(2010,0,31)  →   ISODate("2010-01-31...")  →   { fecha: { $gte: new Date(...) } }
        ↑
  mes va de 0 a 11
  (comportamiento JavaScript)
```
