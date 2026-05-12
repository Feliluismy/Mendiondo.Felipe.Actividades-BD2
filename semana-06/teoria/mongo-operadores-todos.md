# Operadores Relacionales de MongoDB

## Índice
1. [Introducción](#introducción)
2. [Operadores de Comparación](#operadores-de-comparación)
3. [Operadores Lógicos](#operadores-lógicos)
4. [Operadores de Evaluación](#operadores-de-evaluación)
5. [Operadores de Array](#operadores-de-array)
6. [Ejemplos Prácticos](#ejemplos-prácticos)
7. [Mejores Prácticas](#mejores-prácticas)

---

## Introducción

Los operadores relacionales en MongoDB permiten realizar consultas complejas y filtrar documentos basándose en diferentes criterios. Estos operadores son fundamentales para construir queries eficientes y precisas.

### Sintaxis General
```javascript
{ campo: { $operador: valor } }
```

---

## Operadores de Comparación

### $eq (Equal - Igual)
Busca documentos donde el campo es igual al valor especificado.

```javascript
// Sintaxis
{ campo: { $eq: valor } }

// Ejemplo
db.usuarios.find({ edad: { $eq: 25 } })
// Equivale a: db.usuarios.find({ edad: 25 })
```

### $ne (Not Equal - No igual)
Busca documentos donde el campo NO es igual al valor especificado.

```javascript
// Sintaxis
{ campo: { $ne: valor } }

// Ejemplo
db.productos.find({ categoria: { $ne: "electronica" } })
```

### $gt (Greater Than - Mayor que)
Busca documentos donde el campo es mayor que el valor especificado.

```javascript
// Sintaxis
{ campo: { $gt: valor } }

// Ejemplo
db.ventas.find({ monto: { $gt: 1000 } })
```

### $gte (Greater Than or Equal - Mayor o igual que)
Busca documentos donde el campo es mayor o igual que el valor especificado.

```javascript
// Sintaxis
{ campo: { $gte: valor } }

// Ejemplo
db.empleados.find({ salario: { $gte: 50000 } })
```

### $lt (Less Than - Menor que)
Busca documentos donde el campo es menor que el valor especificado.

```javascript
// Sintaxis
{ campo: { $lt: valor } }

// Ejemplo
db.estudiantes.find({ calificacion: { $lt: 60 } })
```

### $lte (Less Than or Equal - Menor o igual que)
Busca documentos donde el campo es menor o igual que el valor especificado.

```javascript
// Sintaxis
{ campo: { $lte: valor } }

// Ejemplo
db.inventario.find({ stock: { $lte: 10 } })
```

### $in (In - En)
Busca documentos donde el campo coincide con cualquier valor del array especificado.

```javascript
// Sintaxis
{ campo: { $in: [valor1, valor2, ...] } }

// Ejemplo
db.usuarios.find({ 
  rol: { $in: ["admin", "moderador", "editor"] } 
})
```

### $nin (Not In - No en)
Busca documentos donde el campo NO coincide con ningún valor del array especificado.

```javascript
// Sintaxis
{ campo: { $nin: [valor1, valor2, ...] } }

// Ejemplo
db.productos.find({ 
  estado: { $nin: ["descontinuado", "agotado"] } 
})
```

---

## Operadores Lógicos

### $and (Y lógico)
Realiza una operación AND lógica en un array de expresiones.

```javascript
// Sintaxis
{ $and: [ { expresión1 }, { expresión2 }, ... ] }

// Ejemplo
db.productos.find({
  $and: [
    { precio: { $gte: 100 } },
    { categoria: "electronica" },
    { stock: { $gt: 0 } }
  ]
})
```

### $or (O lógico)
Realiza una operación OR lógica en un array de expresiones.

```javascript
// Sintaxis
{ $or: [ { expresión1 }, { expresión2 }, ... ] }

// Ejemplo
db.usuarios.find({
  $or: [
    { edad: { $lt: 18 } },
    { edad: { $gt: 65 } }
  ]
})
```

### $not (Negación)
Realiza una operación NOT lógica en la expresión especificada.

```javascript
// Sintaxis
{ campo: { $not: { expresión } } }

// Ejemplo
db.productos.find({
  precio: { $not: { $gt: 1000 } }
})
```

### $nor (NOR lógico)
Realiza una operación NOR lógica en un array de expresiones.

```javascript
// Sintaxis
{ $nor: [ { expresión1 }, { expresión2 }, ... ] }

// Ejemplo
db.usuarios.find({
  $nor: [
    { activo: false },
    { verificado: false }
  ]
})
```

---

## Operadores de Evaluación

### $exists (Existe)
Verifica si el campo existe en el documento.

```javascript
// Sintaxis
{ campo: { $exists: boolean } }

// Ejemplos
db.usuarios.find({ telefono: { $exists: true } })
db.productos.find({ descuento: { $exists: false } })
```

### $type (Tipo)
Verifica si el campo es del tipo de datos especificado.

```javascript
// Sintaxis
{ campo: { $type: tipo } }

// Ejemplo
db.datos.find({ valor: { $type: "string" } })
db.numeros.find({ cantidad: { $type: "number" } })
```

### $regex (Expresión Regular)
Selecciona documentos donde los valores coinciden con una expresión regular.

```javascript
// Sintaxis
{ campo: { $regex: patrón, $options: opciones } }

// Ejemplos
db.usuarios.find({ 
  nombre: { $regex: "^Juan", $options: "i" } 
})

db.productos.find({ 
  descripcion: { $regex: /móvil|celular/i } 
})
```

### $mod (Módulo)
Realiza una operación módulo en el valor del campo.

```javascript
// Sintaxis
{ campo: { $mod: [divisor, resto] } }

// Ejemplo
db.numeros.find({ 
  valor: { $mod: [2, 0] } // Números pares
})
```

---

## Operadores de Array

### $all (Todos)
Selecciona documentos donde el campo array contiene todos los elementos especificados.

```javascript
// Sintaxis
{ campo: { $all: [valor1, valor2, ...] } }

// Ejemplo
db.estudiantes.find({
  materias: { $all: ["matematicas", "fisica"] }
})
```

### $elemMatch (Coincidencia de Elemento)
Selecciona documentos si el elemento en el array coincide con todas las condiciones especificadas.

```javascript
// Sintaxis
{ campo: { $elemMatch: { condición1, condición2, ... } } }

// Ejemplo
db.pedidos.find({
  productos: {
    $elemMatch: {
      precio: { $gte: 100 },
      cantidad: { $gt: 1 }
    }
  }
})
```

### $size (Tamaño)
Selecciona documentos si el array tiene el tamaño especificado.

```javascript
// Sintaxis
{ campo: { $size: número } }

// Ejemplo
db.listas.find({ 
  elementos: { $size: 3 } 
})
```

---

## Ejemplos Prácticos

### Base de Datos de Ejemplo: E-commerce

```javascript
// Colección: productos
{
  _id: ObjectId("..."),
  nombre: "iPhone 14",
  precio: 999,
  categoria: "electronica",
  stock: 25,
  tags: ["smartphone", "apple", "5g"],
  especificaciones: {
    color: "negro",
    almacenamiento: "128GB"
  },
  fechaCreacion: ISODate("2023-09-15")
}
```

### Consultas Complejas

```javascript
// 1. Productos caros en stock
db.productos.find({
  $and: [
    { precio: { $gt: 500 } },
    { stock: { $gt: 0 } }
  ]
})

// 2. Productos de electrónica o ropa con descuento
db.productos.find({
  $or: [
    { categoria: "electronica" },
    { categoria: "ropa" }
  ],
  descuento: { $exists: true, $gt: 0 }
})

// 3. Productos con tags específicos
db.productos.find({
  tags: { $all: ["smartphone", "5g"] }
})

// 4. Productos creados en el último mes
db.productos.find({
  fechaCreacion: {
    $gte: new Date("2023-09-01"),
    $lt: new Date("2023-10-01")
  }
})

// 5. Productos con nombres que contengan "phone"
db.productos.find({
  nombre: { $regex: /phone/i }
})
```

---

## Mejores Prácticas

### 1. Uso de Índices
```javascript
// Crear índices para campos consultados frecuentemente
db.productos.createIndex({ categoria: 1, precio: 1 })
```

### 2. Optimización de Consultas
- Usa `$and` implícito cuando sea posible
- Coloca las condiciones más selectivas primero
- Evita `$regex` sin anclas cuando sea posible

### 3. Combinación Eficiente
```javascript
// ✅ Bueno - AND implícito
db.productos.find({
  categoria: "electronica",
  precio: { $gte: 100, $lte: 1000 }
})

// ❌ Innecesario - AND explícito
db.productos.find({
  $and: [
    { categoria: "electronica" },
    { precio: { $gte: 100, $lte: 1000 } }
  ]
})
```

### 4. Manejo de Tipos de Datos
```javascript
// Asegúrate de usar el tipo correcto
db.productos.find({ precio: 100 })      // Número
db.productos.find({ precio: "100" })    // String (diferente)
```

### 5. Consultas con Arrays
```javascript
// Para arrays, MongoDB busca cualquier elemento que coincida
db.productos.find({ tags: "smartphone" })

// Para coincidencia exacta del array completo
db.productos.find({ tags: ["smartphone", "apple"] })
```

---










## Tabla de Referencia Rápida

| Operador | Tipo | Descripción | Sintaxis |
|----------|------|-------------|----------|
| `$eq` | Comparación | Igual | `{ campo: { $eq: valor } }` |
| `$ne` | Comparación | No igual | `{ campo: { $ne: valor } }` |
| `$gt` | Comparación | Mayor que | `{ campo: { $gt: valor } }` |
| `$gte` | Comparación | Mayor o igual | `{ campo: { $gte: valor } }` |
| `$lt` | Comparación | Menor que | `{ campo: { $lt: valor } }` |
| `$lte` | Comparación | Menor o igual | `{ campo: { $lte: valor } }` |
| `$in` | Comparación | En lista | `{ campo: { $in: [valores] } }` |
| `$nin` | Comparación | No en lista | `{ campo: { $nin: [valores] } }` |
| `$and` | Lógico | Y lógico | `{ $and: [condiciones] }` |
| `$or` | Lógico | O lógico | `{ $or: [condiciones] }` |
| `$not` | Lógico | Negación | `{ campo: { $not: condición } }` |
| `$nor` | Lógico | NOR lógico | `{ $nor: [condiciones] }` |
| `$exists` | Evaluación | Existe campo | `{ campo: { $exists: bool } }` |
| `$type` | Evaluación | Tipo de dato | `{ campo: { $type: "tipo" } }` |
| `$regex` | Evaluación | Expresión regular | `{ campo: { $regex: patrón } }` |
| `$all` | Array | Contiene todos | `{ campo: { $all: [valores] } }` |
| `$elemMatch` | Array | Elemento coincidente | `{ campo: { $elemMatch: condición } }` |
| `$size` | Array | Tamaño del array | `{ campo: { $size: número } }` |
---

*Esta guía cubre los operadores relacionales más importantes de MongoDB. Para casos de uso específicos, consulta la documentación oficial de MongoDB.*












