// ============================================================
//  PRÁCTICA MongoDB — deleteOne y deleteMany
//  Basado en apuntes UTN Avellaneda — Páginas 19 a 22
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_deleteone_deletemany.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: 'libros' (los 4 documentos del PDF)
// ============================================================

db = db.getSiblingDB('base1');
db.libros.drop();

db.libros.insertOne({ _id: 1, titulo: 'El aleph',          autor: 'Borges',         editorial: ['Siglo XXI','Planeta'], precio: 20, cantidad: 50 });
db.libros.insertOne({ _id: 2, titulo: 'Martin Fierro',     autor: 'Jose Hernandez', editorial: ['Siglo XXI'],           precio: 50, cantidad: 12 });
db.libros.insertOne({ _id: 3, titulo: 'Aprenda PHP',       autor: 'Mario Molina',   editorial: ['Siglo XXI','Planeta'], precio: 50, cantidad: 20 });
db.libros.insertOne({ _id: 4, titulo: 'Java en 10 minutos',                          editorial: ['Siglo XXI'],           precio: 45, cantidad: 1  });

print("\n--- Estado inicial ---");
db.libros.find().forEach(printjson);


// ============================================================
//  SECCIÓN 2 — deleteOne por _id (sintaxis abreviada)
// ============================================================

print("\n--- deleteOne({ _id: 1 }) ---");
var r1 = db.libros.deleteOne({ _id: 1 });
printjson(r1);   // { acknowledged: true, deletedCount: 1 }

print("\n--- Estado tras borrar _id: 1 ---");
db.libros.find().forEach(printjson);


// ============================================================
//  SECCIÓN 3 — deleteMany con un operador relacional
//  Borra TODOS los documentos que cumplen la condición.
// ============================================================

print("\n--- deleteMany({ precio: { $gte: 50 } }) ---");
var r2 = db.libros.deleteMany({ precio: { $gte: 50 } });
printjson(r2);   // { acknowledged: true, deletedCount: 2 }

print("\n--- Estado final ---");
db.libros.find().forEach(printjson);
// Solo debería quedar _id: 4 (precio 45)


// ============================================================
//  SECCIÓN 4 — Las dos sintaxis de igualdad
//  Recargamos la colección y mostramos que son equivalentes.
// ============================================================

db.libros.drop();
db.libros.insertMany([
  { _id: 1, titulo: 'A', precio: 100 },
  { _id: 2, titulo: 'B', precio: 200 },
  { _id: 3, titulo: 'C', precio: 300 }
]);

print("\n--- Equivalencia: { _id: 2 } y { _id: { $eq: 2 } } ---");
print("Antes:");
db.libros.find().forEach(printjson);

print("\ndeleteOne({ _id: { $eq: 2 } }) ← sintaxis explícita");
db.libros.deleteOne({ _id: { $eq: 2 } });

print("\nDespués:");
db.libros.find().forEach(printjson);
// _id: 2 ya no está


// ============================================================
//  SECCIÓN 5 — Patrón seguro: find antes de delete
//  El mismo filtro debe usarse en los dos pasos.
// ============================================================

db.libros.drop();
db.libros.insertMany([
  { _id: 1, titulo: 'A', precio: 100 },
  { _id: 2, titulo: 'B', precio: 200 },
  { _id: 3, titulo: 'C', precio: 300 },
  { _id: 4, titulo: 'D', precio: 400 }
]);

var filtro = { precio: { $gte: 200 } };

print("\n--- PASO 1: find con el filtro (qué se va a borrar) ---");
db.libros.find(filtro).forEach(printjson);

print("\n--- PASO 2: deleteMany con el MISMO filtro ---");
printjson(db.libros.deleteMany(filtro));

print("\n--- Estado final ---");
db.libros.find().forEach(printjson);


// ============================================================
//  PROBLEMAS PROPUESTOS (1.4) — del apunte UTN
// ============================================================

// PROBLEMA 1 — Crear la colección 'articulos' con 6 documentos
// (los mismos que en 1.3, vistos en la unidad anterior).

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


// PROBLEMA 3 — Borrar los documentos cuyo rubro sea 'impresora'.
// El apunte pide hacerlo con LAS DOS SINTAXIS que permite MongoDB
// (igualdad implícita y $eq explícito). Acordate de recargar la
// colección entre una y otra para poder probar las dos.
//
// Sintaxis 1 — implícita:
// TU CÓDIGO:
//

// Sintaxis 2 — con $eq:
// TU CÓDIGO:
//


// PROBLEMA 4 — Borrar todos los artículos con _id mayor o igual a 5.
// (Pista: $gte sobre el campo _id.)
// TU CÓDIGO:
//


// ============================================================
//  EJERCICIOS EXTRA — Para profundizar
// ============================================================

// EJERCICIO 5 — deleteOne vs deleteMany
// Recargá 'articulos' con los 6 documentos. Hacé:
//   db.articulos.deleteOne({ rubro: 'monitor' })
// y luego mostrá la colección. ¿Cuántos monitores quedaron?
// ¿Por qué quedaron 2 y no 0?
// TU CÓDIGO:
//


// EJERCICIO 6 — Borrar por $in
// Recargá 'articulos'. Borrá en una sola operación todos los artículos
// cuyo rubro sea 'mouse' O 'monitor' usando $in.
// TU CÓDIGO:
//


// EJERCICIO 7 — Reflexión (patrón seguro)
// (a) ¿Por qué conviene hacer find con el filtro antes de un deleteMany
//     en datos importantes?
// (b) ¿Qué pasaría si por error escribís deleteMany({}) en vez de
//     deleteMany({ rubro: 'impresora' })?
// TU RESPUESTA:
//


// EJERCICIO 8 — Borrado en cascada simulado (desafío)
// Imaginá una colección 'pedidos' con campos { _id, articulo_id, cantidad }.
// Insertá 5 pedidos donde articulo_id apunte a artículos existentes.
// Después borrá del catálogo los artículos del rubro 'impresora' Y, en
// una segunda operación, borrá de 'pedidos' los pedidos cuyo
// articulo_id ya no existe.
// (Pista: hacé un find sobre articulos para juntar los _id activos
//  y usá $nin con ese array al borrar pedidos.)
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
