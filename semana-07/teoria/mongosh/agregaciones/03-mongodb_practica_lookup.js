// ============================================================
//  PRÁCTICA MongoDB — Agregación (Parte 3): $lookup (joins)
//  Basado en apuntes UTN Avellaneda — Yanina Scudero
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("03-mongodb_practica_lookup.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: 'empleados' y 'departamentos' (PDF)
// ============================================================

db = db.getSiblingDB('base1');
db.empleados.drop();
db.departamentos.drop();

db.empleados.insertOne({ _id: 1, nombre: 'Juan',  telefono: '1234', mail: 'juan@gmail.com',  idDepto: '1' });
db.empleados.insertOne({ _id: 2, nombre: 'Ana',   telefono: '456',  mail: 'ana@gmail.com',   idDepto: '1' });
db.empleados.insertOne({ _id: 3, nombre: 'Pedro', telefono: '789',  mail: 'pedro@gmail.com', idDepto: '2' });

db.departamentos.insertOne({ _id: 1, nombre: 'RRHH'     });
db.departamentos.insertOne({ _id: 2, nombre: 'FINANZAS' });
db.departamentos.insertOne({ _id: 3, nombre: 'SISTEMAS' });

// OJO: en el modelo del PDF idDepto está como STRING ('1','2') y _id de
// departamentos como NUMBER (1,2). Para que el join matchee de verdad,
// agregamos un campo numérico paralelo:
db.empleados.updateMany({}, [ { $set: { idDeptoNum: { $toInt: "$idDepto" } } } ]);


// ============================================================
//  SECCIÓN 2 — $lookup: empleados del Departamento 1
//  (Ejemplo del PDF, ordenado por nombre)
// ============================================================

print("\n--- $lookup: nombre de los empleados del Depto 1 ordenado por nombre ---");
db.departamentos.aggregate([
  { $match:  { _id: 1 } },
  { $lookup: {
      from:         'empleados',
      localField:   '_id',
      foreignField: 'idDeptoNum',
      as:           'EmpleadosDepto1'
  }},
  { $unwind:  '$EmpleadosDepto1' },
  { $sort:    { 'EmpleadosDepto1.nombre': 1 } },
  { $project: { _id: 0, 'EmpleadosDepto1.nombre': 1 } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 3 — $lookup desde el lado de los empleados
//  (cada empleado con el documento de SU departamento)
// ============================================================

print("\n--- $lookup: cada empleado con su departamento ---");
db.empleados.aggregate([
  { $lookup: {
      from:         'departamentos',
      localField:   'idDeptoNum',
      foreignField: '_id',
      as:           'depto'
  }},
  { $unwind:  '$depto' },
  { $project: { _id: 0, nombre: 1, mail: 1, departamento: '$depto.nombre' } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 4 — $lookup sin $unwind: ver el array tal cual
// ============================================================

print("\n--- $lookup sin $unwind: el campo agregado es un ARRAY ---");
db.departamentos.aggregate([
  { $lookup: {
      from:         'empleados',
      localField:   '_id',
      foreignField: 'idDeptoNum',
      as:           'empleados'
  }}
]).forEach(printjson);
// Notar que SISTEMAS (id 3) tiene 'empleados: []' porque no tiene matches.


// ============================================================
//  EJERCICIOS PROPUESTOS
// ============================================================

// EJERCICIO 1
// Mostrar el nombre de los empleados del Departamento 'FINANZAS'
// (id 2) ordenado por nombre ascendente.
// (Pista: $match por _id: 2, después $lookup, $unwind, $sort, $project.)
// TU CÓDIGO:
//


// EJERCICIO 2
// Mostrar TODOS los departamentos con la cantidad de empleados que tiene cada uno.
// El resultado debe tener: nombre del departamento y cantidadEmpleados.
// (Pista: $lookup + $project usando { $size: '$empleados' }.)
// TU CÓDIGO:
//


// EJERCICIO 3
// Mostrar todos los departamentos que NO tienen empleados.
// (Pista: $lookup + $match { 'empleados': { $size: 0 } }.)
// TU CÓDIGO:
//


// EJERCICIO 4
// Para cada empleado, mostrar el nombre del empleado y el nombre del
// departamento al que pertenece, en un único documento "plano":
//   { empleado: 'Juan', departamento: 'RRHH' }
// (Pista: aggregate desde 'empleados', $lookup hacia 'departamentos',
//  $unwind y $project con alias.)
// TU CÓDIGO:
//


// EJERCICIO 5
// Listar los empleados ordenados por nombre del departamento ASC y, dentro
// del mismo departamento, por nombre del empleado ASC.
// TU CÓDIGO:
//


// EJERCICIO 6 — Modelo extra (productos / categorias)
// Cargá los siguientes datos y resolvé el ejercicio que sigue.

db.categorias.drop();
db.categorias.insertMany([
  { _id: 1, nombre: 'Lácteos'  },
  { _id: 2, nombre: 'Bebidas'  },
  { _id: 3, nombre: 'Limpieza' }
]);

db.productos.drop();
db.productos.insertMany([
  { _id: 1, nombre: 'Leche',     precio: 800,  idCategoria: 1 },
  { _id: 2, nombre: 'Yogur',     precio: 600,  idCategoria: 1 },
  { _id: 3, nombre: 'Queso',     precio: 1500, idCategoria: 1 },
  { _id: 4, nombre: 'Coca',      precio: 1200, idCategoria: 2 },
  { _id: 5, nombre: 'Agua',      precio: 400,  idCategoria: 2 },
  { _id: 6, nombre: 'Detergente',precio: 950,  idCategoria: 3 }
]);

// EJERCICIO 6.a
// Mostrar todos los productos con el nombre de su categoría:
//   { nombre: 'Leche', precio: 800, categoria: 'Lácteos' }
// TU CÓDIGO:
//


// EJERCICIO 6.b
// Mostrar la cantidad de productos por categoría, ordenado por
// cantidad DESC. Resultado: { categoria, cantidad }.
// (Pista: $lookup desde categorias, después $project con $size, después $sort.)
// TU CÓDIGO:
//


// EJERCICIO 6.c
// Mostrar para cada categoría su PRECIO PROMEDIO de productos.
// (Pista: $lookup + $unwind + $group por categoría + $avg sobre el precio.)
// TU CÓDIGO:
//


// EJERCICIO 7 — Reflexión
// (a) ¿Por qué $lookup siempre devuelve un array, incluso cuando matchea
//     un único documento?
// (b) ¿Cuándo conviene NO hacer $unwind después del $lookup?
// (c) ¿Qué tipo de JOIN de SQL es equivalente al $lookup básico y por qué?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
