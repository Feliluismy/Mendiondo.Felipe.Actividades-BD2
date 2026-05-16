// ============================================================
//  PRÁCTICA MongoDB — Operadores Relacionales
//  Basado en apuntes UTN Avellaneda — Páginas 15 a 18
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_operadores_relacionales.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: 'libros' (para los ejemplos del apunte)
// ============================================================

db = db.getSiblingDB('base1');
db.libros.drop();

db.libros.insertOne({ _id: 1, titulo: 'El aleph',          autor: 'Borges',         editorial: ['Siglo XXI','Planeta'], precio: 20, cantidad: 50 });
db.libros.insertOne({ _id: 2, titulo: 'Martin Fierro',     autor: 'Jose Hernandez', editorial: ['Siglo XXI'],           precio: 50, cantidad: 12 });
db.libros.insertOne({ _id: 3, titulo: 'Aprenda PHP',       autor: 'Mario Molina',   editorial: ['Siglo XXI','Planeta'], precio: 50, cantidad: 20 });
db.libros.insertOne({ _id: 4, titulo: 'Java en 10 minutos',                          editorial: ['Siglo XXI'],           precio: 45, cantidad: 1  });


// ============================================================
//  SECCIÓN 2 — $eq: la igualdad explícita
//  Equivale a la forma corta { precio: 50 }.
// ============================================================

print("\n--- $eq: precio igual a 50 ---");
db.libros.find({ precio: { $eq: 50 } }).forEach(printjson);


// ============================================================
//  SECCIÓN 3 — $lt y $gt: menor y mayor estricto
// ============================================================

print("\n--- $lt: precio menor a 30 ---");
db.libros.find({ precio: { $lt: 30 } }).forEach(printjson);

print("\n--- $gt: precio mayor a 40 ---");
db.libros.find({ precio: { $gt: 40 } }).forEach(printjson);


// ============================================================
//  SECCIÓN 4 — $lte y $gte: menor/mayor o igual
// ============================================================

print("\n--- $gte: cantidad >= 50 ---");
db.libros.find({ cantidad: { $gte: 50 } }).forEach(printjson);

print("\n--- $lte: precio <= 45 ---");
db.libros.find({ precio: { $lte: 45 } }).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — $ne: distinto
// ============================================================

print("\n--- $ne: cantidad distinta de 50 ---");
db.libros.find({ cantidad: { $ne: 50 } }).forEach(printjson);


// ============================================================
//  SECCIÓN 6 — Rango: $gte + $lte sobre el mismo campo
// ============================================================

print("\n--- Rango: precio entre 20 y 45 (inclusive) ---");
db.libros.find({ precio: { $gte: 20, $lte: 45 } }).forEach(printjson);


// ============================================================
//  SECCIÓN 7 — $in y $nin (sobre arrays)
// ============================================================

print("\n--- $in: editorial Planeta ---");
db.libros.find({ editorial: { $in: ['Planeta'] } }).forEach(printjson);

print("\n--- $nin: editorial NO Planeta ---");
db.libros.find({ editorial: { $nin: ['Planeta'] } }).forEach(printjson);

// $in también es una forma cómoda de OR sobre el mismo campo:
print("\n--- $in con varios valores: precio 20 o 45 ---");
db.libros.find({ precio: { $in: [20, 45] } }).forEach(printjson);


// ============================================================
//  PROBLEMAS PROPUESTOS (1.3) — del apunte UTN
//  Colección 'articulos' con 6 documentos de ejemplo.
// ============================================================

// PROBLEMA 1 — Crear la colección 'articulos' y cargar 6 documentos.
db.articulos.drop();

db.articulos.insertOne({ _id: 1, nombre: 'MULTIFUNCION HP DESKJET 2675',         rubro: 'impresora', precio: 3000,  stock: 20 });
db.articulos.insertOne({ _id: 2, nombre: 'MULTIFUNCION EPSON EXPRESSION XP241',  rubro: 'impresora', precio: 3700,  stock: 5  });
db.articulos.insertOne({ _id: 3, nombre: 'LED 19 PHILIPS',                       rubro: 'monitor',   precio: 4500,  stock: 2  });
db.articulos.insertOne({ _id: 4, nombre: 'LED 22 PHILIPS',                       rubro: 'monitor',   precio: 5700,  stock: 4  });
db.articulos.insertOne({ _id: 5, nombre: 'LED 27 PHILIPS',                       rubro: 'monitor',   precio: 12000, stock: 1  });
db.articulos.insertOne({ _id: 6, nombre: 'LOGITECH M90',                         rubro: 'mouse',     precio: 300,   stock: 4  });


// PROBLEMA 2 — Imprimir todos los documentos de 'articulos'.
// TU CÓDIGO:
//


// PROBLEMA 3 — Imprimir todos los documentos de 'articulos' que NO
// son impresoras.
// (Pista: rubro distinto de 'impresora' → $ne, o $nin con un array.)
// TU CÓDIGO:
//


// PROBLEMA 4 — Imprimir los artículos del rubro 'mouse'.
// TU CÓDIGO:
//


// PROBLEMA 5 — Imprimir los artículos con precio mayor o igual a 5000.
// TU CÓDIGO:
//


// PROBLEMA 6 — Imprimir las impresoras con precio mayor o igual a 3500.
// (Pista: AND de rubro = 'impresora' Y precio >= 3500.)
// TU CÓDIGO:
//


// PROBLEMA 7 — Imprimir los artículos cuyo stock esté entre 0 y 4.
// (Pista: rango con $gte y $lte sobre el mismo campo.)
// TU CÓDIGO:
//


// ============================================================
//  EJERCICIOS EXTRA — Para profundizar
// ============================================================

// EJERCICIO 8 — $in con varios valores
// Listá los artículos cuyo rubro sea 'monitor' o 'mouse' usando $in.
// TU CÓDIGO:
//


// EJERCICIO 9 — Rango exclusivo
// Listá los artículos con precio estrictamente mayor a 3000 y
// estrictamente menor a 6000 (ambos extremos excluidos).
// TU CÓDIGO:
//


// EJERCICIO 10 — Reflexión
// (a) ¿Cuál es la diferencia entre { precio: 50 } y { precio: { $eq: 50 } }?
// (b) ¿Por qué la primera forma es válida pero NO podemos escribir
//     { precio: 50, $gt: 40 } para el mismo campo? ¿Cómo se hace?
// TU RESPUESTA:
//


// EJERCICIO 11 — Operadores en deleteMany (anticipo)
// Eliminá de 'articulos' los que tengan stock < 2.
// (No lo ejecutes todavía si querés conservar el dataset; primero
//  hacé un find con la misma condición para ver qué se borraría.)
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
