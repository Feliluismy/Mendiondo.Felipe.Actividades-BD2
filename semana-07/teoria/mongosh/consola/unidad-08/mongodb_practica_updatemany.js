// ============================================================
//  PRÁCTICA MongoDB — updateMany
//  Basado en apuntes UTN Avellaneda — Páginas 29 a 32
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_updatemany.js")
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
//  SECCIÓN 2 — updateMany con $set masivo (filtro de rango)
//  Cambia 'cantidad' a 0 para todos los libros con _id > 2.
// ============================================================

print("\n--- updateMany: { _id: { $gt: 2 } } → { $set: { cantidad: 0 } } ---");
var r1 = db.libros.updateMany(
  { _id: { $gt: 2 } },
  { $set: { cantidad: 0 } }
);
printjson(r1);
// Esperado: matchedCount: 2, modifiedCount: 2

print("\n--- Estado tras el primer updateMany ---");
db.libros.find().forEach(printjson);


// ============================================================
//  SECCIÓN 3 — updateMany agregando un campo NUEVO a varios
//  Agrega 'faltantes: true' a los libros con cantidad == 0.
// ============================================================

print("\n--- updateMany: { cantidad: 0 } → { $set: { faltantes: true } } ---");
var r2 = db.libros.updateMany(
  { cantidad: { $eq: 0 } },
  { $set: { faltantes: true } }
);
printjson(r2);

print("\n--- Estado tras el segundo updateMany ---");
db.libros.find().forEach(printjson);
// Solo _id: 3 y _id: 4 tienen 'faltantes'. Los otros dos no.


// ============================================================
//  SECCIÓN 4 — Combinar $unset + $set en UN solo updateMany
//  Quita 'faltantes' Y pone cantidad: 100, en una sola operación.
// ============================================================

print("\n--- updateMany combinado: $unset + $set ---");
var r3 = db.libros.updateMany(
  { cantidad: { $eq: 0 } },
  {
    $unset: { faltantes: true },
    $set:   { cantidad: 100 }
  }
);
printjson(r3);

print("\n--- Estado final ---");
db.libros.find().forEach(printjson);
// _id: 3 y _id: 4 ahora tienen cantidad: 100 y NO tienen 'faltantes'


// ============================================================
//  SECCIÓN 5 — updateMany sobre TODOS los documentos
//  Filtro vacío {} = todos.
// ============================================================

print("\n--- Demo: agregar 'moneda: \"ARS\"' a TODOS los libros ---");
db.libros.updateMany(
  {},
  { $set: { moneda: 'ARS' } }
);
db.libros.find().forEach(printjson);

print("\n--- Demo: eliminar 'moneda' de TODOS los libros ---");
db.libros.updateMany(
  {},
  { $unset: { moneda: '' } }
);
db.libros.find().forEach(printjson);


// ============================================================
//  SECCIÓN 6 — Conflicto entre operadores en el mismo update
//  Operar 2 veces sobre el MISMO campo es error.
// ============================================================

print("\n--- Update con conflicto: $set y $unset sobre el mismo campo ---");
try {
  db.libros.updateMany(
    {},
    {
      $set:   { precio: 999 },
      $unset: { precio: '' }
    }
  );
} catch (e) {
  print("Error esperado: " + e.message);
}


// ============================================================
//  PROBLEMAS PROPUESTOS (1.6) — del apunte UTN
// ============================================================

// PROBLEMA 1 — Crear 'articulos' con los 6 documentos (datos de 1.3).
db.articulos.drop();

db.articulos.insertOne({ _id: 1, nombre: 'MULTIFUNCION HP DESKJET 2675',         rubro: 'impresora', precio: 3000,  stock: 20 });
db.articulos.insertOne({ _id: 2, nombre: 'MULTIFUNCION EPSON EXPRESSION XP241',  rubro: 'impresora', precio: 3700,  stock: 5  });
db.articulos.insertOne({ _id: 3, nombre: 'LED 19 PHILIPS',                       rubro: 'monitor',   precio: 4500,  stock: 2  });
db.articulos.insertOne({ _id: 4, nombre: 'LED 22 PHILIPS',                       rubro: 'monitor',   precio: 5700,  stock: 4  });
db.articulos.insertOne({ _id: 5, nombre: 'LED 27 PHILIPS',                       rubro: 'monitor',   precio: 12000, stock: 1  });
db.articulos.insertOne({ _id: 6, nombre: 'LOGITECH M90',                         rubro: 'mouse',     precio: 300,   stock: 4  });


// PROBLEMA 2 — Imprimir todos los documentos.
// TU CÓDIGO:
//


// PROBLEMA 3 — Fijar el stock en 0 para TODOS los artículos del rubro
// 'monitor' (deberían modificarse 3 documentos).
// TU CÓDIGO:
//


// PROBLEMA 4 — Agregar el campo 'pedir: true' a TODOS los artículos
// con stock == 0.
// (Pista: el filtro depende del resultado del problema 3.)
// TU CÓDIGO:
//


// PROBLEMA 5 — Eliminar el campo 'pedir' de TODOS los documentos.
// (Pista: filtro vacío {} alcanza a todos los documentos.)
// TU CÓDIGO:
//


// ============================================================
//  EJERCICIOS EXTRA — Para profundizar
// ============================================================

// EJERCICIO 6 — $inc masivo (subir precios)
// Sobre 'articulos', aumentá un 10% el precio de TODAS las impresoras
// usando el operador $mul.
// (Pista: { $mul: { precio: 1.10 } })
// TU CÓDIGO:
//


// EJERCICIO 7 — Patrón seguro
// Antes de hacer un updateMany para fijar stock = 0 en monitores,
// ejecutá un find con el MISMO filtro y mostrá los documentos.
// Solo si los resultados son los esperados, aplicá el updateMany.
// TU CÓDIGO:
//


// EJERCICIO 8 — Combinar operadores
// En una sola operación, sobre TODOS los artículos del rubro 'mouse':
//   - bajá el precio en 50 con $inc
//   - agregá el campo destacado: true con $set
//   - eliminá el campo (inventado) 'oferta_temporal' con $unset
// TU CÓDIGO:
//


// EJERCICIO 9 — Reflexión
// (a) ¿Qué pasaría si por error escribís updateMany({}, { $set: { stock: 0 } })?
// (b) ¿Cómo te das cuenta a posteriori cuántos documentos modificó?
// (c) ¿Qué diferencia hay entre eliminar un campo con $unset en MongoDB
//     y eliminar una columna en SQL?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
