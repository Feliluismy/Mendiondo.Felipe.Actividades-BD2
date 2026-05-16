// ============================================================
//  PRÁCTICA MongoDB — updateOne
//  Basado en apuntes UTN Avellaneda — Páginas 23 a 28
//  (Sección numerada como "7" en el libro — la llamamos 7-bis
//   porque la otra unidad 7 cubrió delete; esta cubre update.)
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_updateone.js")
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
//  SECCIÓN 2 — $set: modificar campos existentes
// ============================================================

print("\n--- $set: cambiar precio y cantidad del libro _id 1 ---");
var r1 = db.libros.updateOne(
  { _id: { $eq: 1 } },
  { $set: { precio: 15, cantidad: 1 } }
);
printjson(r1);
// Esperado: { acknowledged: true, matchedCount: 1, modifiedCount: 1 }

print("\n--- Libro _id 1 después del cambio ---");
db.libros.find({ _id: 1 }).forEach(printjson);


// ============================================================
//  SECCIÓN 3 — $set: agregar un campo NUEVO
//  En MongoDB no es necesario que todos los documentos tengan
//  los mismos campos.
// ============================================================

print("\n--- $set: agregar 'descripcion' al libro _id 4 ---");
db.libros.updateOne(
  { _id: { $eq: 4 } },
  { $set: { descripcion: 'Cada unidad trata un tema fundamental de Java desde 0.' } }
);

print("\n--- Libro _id 4 ahora tiene 'descripcion' ---");
db.libros.find({ _id: 4 }).forEach(printjson);
// Notar que solo el _id 4 tiene ese campo; los otros no.


// ============================================================
//  SECCIÓN 4 — $unset: ELIMINAR un campo
// ============================================================

print("\n--- $unset: eliminar 'descripcion' del libro _id 4 ---");
db.libros.updateOne(
  { _id: { $eq: 4 } },
  { $unset: { descripcion: '' } }
);

print("\n--- Libro _id 4 ya NO tiene 'descripcion' ---");
db.libros.find({ _id: 4 }).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — Diferencia clave: $unset vs $set: ''
//  Una elimina el campo, la otra lo deja como string vacío.
// ============================================================

print("\n--- $set: { descripcion: '' } ← el campo SIGUE existiendo ---");
db.libros.updateOne(
  { _id: 4 },
  { $set: { descripcion: '' } }
);
db.libros.find({ _id: 4 }).forEach(printjson);
// Sí aparece "descripcion": ""

print("\n--- $unset: { descripcion: '' } ← el campo desaparece ---");
db.libros.updateOne(
  { _id: 4 },
  { $unset: { descripcion: '' } }
);
db.libros.find({ _id: 4 }).forEach(printjson);
// Ya NO aparece "descripcion"


// ============================================================
//  SECCIÓN 6 — Operadores para arrays: $push y $pull
// ============================================================

print("\n--- $push: agregar 'Atlántida' al array editorial de _id 1 ---");
db.libros.updateOne(
  { _id: { $eq: 1 } },
  { $push: { editorial: 'Atlántida' } }
);
db.libros.find({ _id: 1 }).forEach(printjson);
// editorial: ['Siglo XXI', 'Planeta', 'Atlántida']

print("\n--- $pull: eliminar 'Atlántida' del array editorial de _id 1 ---");
db.libros.updateOne(
  { _id: { $eq: 1 } },
  { $pull: { editorial: 'Atlántida' } }
);
db.libros.find({ _id: 1 }).forEach(printjson);
// editorial: ['Siglo XXI', 'Planeta']


// ============================================================
//  SECCIÓN 7 — matchedCount vs modifiedCount
//  Si el valor que intentás poner ya está, no se modifica.
// ============================================================

print("\n--- updateOne con un valor que NO cambia nada ---");
var rNoChange = db.libros.updateOne(
  { _id: 1 },
  { $set: { precio: 15 } }   // ya vale 15
);
printjson(rNoChange);
// Esperado: matchedCount: 1, modifiedCount: 0


// ============================================================
//  PROBLEMAS PROPUESTOS (1.5) — del apunte UTN
//  Los hacemos sobre la colección 'articulos' (datos de 1.3).
// ============================================================

// PROBLEMA 1 — Crear 'articulos' con los 6 documentos.
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


// PROBLEMA 3 — Modificar el precio del mouse 'LOGITECH M90'.
// (Pista: filtro por nombre o por _id 6, $set con el nuevo precio.)
// TU CÓDIGO:
//


// PROBLEMA 4 — Fijar el stock en 0 del artículo cuyo _id es 6.
// TU CÓDIGO:
//


// PROBLEMA 5 — Agregar el campo 'proveedores' con el array
// ['Martinez', 'Gutierrez'] al artículo _id 6.
// (Pista: $set con un array literal.)
// TU CÓDIGO:
//


// PROBLEMA 6 — Eliminar el campo 'proveedores' del artículo _id 6.
// (Pista: $unset.)
// TU CÓDIGO:
//


// ============================================================
//  EJERCICIOS EXTRA — Para profundizar
// ============================================================

// EJERCICIO 7 — $inc (anticipo)
// Sumá 5 unidades al stock del artículo _id 3 con el operador $inc.
// (Pista: { $inc: { stock: 5 } } incrementa, valores negativos restan.)
// Verificá con find que el stock pasó de 2 a 7.
// TU CÓDIGO:
//


// EJERCICIO 8 — $push agregando varios al array (anticipo)
// Agregá DOS proveedores al array 'proveedores' del artículo _id 6
// en un solo updateOne (PISTA: { $push: { proveedores: { $each: [...] } } }).
// TU CÓDIGO:
//


// EJERCICIO 9 — Reflexión
// (a) ¿Qué diferencia hay entre matchedCount y modifiedCount?
// (b) ¿Qué pasa si tu filtro NO matchea ningún documento?
//     (Probá un filtro con _id que no exista.)
// (c) ¿Por qué updateOne({...}, { precio: 15 }) sin $set es un error?
// TU RESPUESTA:
//


// EJERCICIO 10 — Combinar varias operaciones en un solo update (desafío)
// En una sola llamada a updateOne sobre el artículo _id 6:
//   - cambiar el precio a 350
//   - bajar el stock en 1 con $inc
//   - agregar un campo 'destacado': true
//   - agregar 'descuento' al array de tags
// (Pista: el segundo parámetro puede combinar $set, $inc y $push juntos.)
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
