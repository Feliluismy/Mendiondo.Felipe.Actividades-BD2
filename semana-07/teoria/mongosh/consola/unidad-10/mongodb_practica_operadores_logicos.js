// ============================================================
//  PRÁCTICA MongoDB — Operadores lógicos $and, $or, $not
//  Basado en apuntes UTN Avellaneda — Páginas 35 a 39
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_operadores_logicos.js")
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


// ============================================================
//  SECCIÓN 2 — $and: implícito vs explícito
//  Las dos formas son equivalentes.
// ============================================================

print("\n--- AND implícito: precio: 50 Y cantidad: 20 ---");
db.libros.find({ precio: 50, cantidad: 20 }).forEach(printjson);

print("\n--- AND explícito: lo mismo con $and ---");
db.libros.find({
  $and: [
    { precio:   50 },
    { cantidad: 20 }
  ]
}).forEach(printjson);


// ============================================================
//  SECCIÓN 3 — $or: al menos una condición se cumple
// ============================================================

print("\n--- $or: precio >= 50 O cantidad = 1 (debería traer 3 libros) ---");
db.libros.find({
  $or: [
    { precio:   { $gte: 50 } },
    { cantidad: 1 }
  ]
}).forEach(printjson);


// ============================================================
//  SECCIÓN 4 — $not: negar un operador
// ============================================================

print("\n--- $not: precio NO >= 50 (es decir, < 50) ---");
db.libros.find({
  precio: { $not: { $gte: 50 } }
}).forEach(printjson);
// _id 1 (precio 20) y _id 4 (precio 45)

print("\n--- $not: precio NO igual a 50 ---");
db.libros.find({
  precio: { $not: { $eq: 50 } }
}).forEach(printjson);

// Equivalente con $ne:
print("\n--- $ne: equivalente al $not + $eq de arriba ---");
db.libros.find({ precio: { $ne: 50 } }).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — $and explícito útil (dos condiciones en el MISMO campo)
//  Ejemplo: precio entre 20 y 45 inclusive (rango)
// ============================================================

print("\n--- $and útil: 20 <= precio <= 45 ---");
db.libros.find({
  $and: [
    { precio: { $gte: 20 } },
    { precio: { $lte: 45 } }
  ]
}).forEach(printjson);
// (Recordá: para este caso puntual también sirve la forma compacta:
//   { precio: { $gte: 20, $lte: 45 } }
//  pero $and explícito es válido y a veces más claro.)


// ============================================================
//  SECCIÓN 6 — Operadores lógicos en delete y update
// ============================================================

print("\n--- updateMany con $or: marcar 'destacado' a Borges O precio > 50 ---");
db.libros.updateMany(
  { $or: [ { autor: 'Borges' }, { precio: { $gt: 50 } } ] },
  { $set: { destacado: true } }
);
db.libros.find().forEach(printjson);

// Demostración del delete con $not (lo dejamos comentado para no
// destruir los datos antes de los problemas propuestos):
//
// db.libros.deleteMany({ precio: { $not: { $eq: 50 } } });


// ============================================================
//  SECCIÓN 7 — Anidar operadores lógicos
// ============================================================

print("\n--- (autor Borges Y precio < 30) O cantidad >= 50 ---");
db.libros.find({
  $or: [
    { $and: [ { autor: 'Borges' }, { precio: { $lt: 30 } } ] },
    { cantidad: { $gte: 50 } }
  ]
}).forEach(printjson);


// ============================================================
//  PROBLEMAS PROPUESTOS (1.7) — del apunte UTN
// ============================================================

// PROBLEMA 1 — Crear 'medicamentos' con 6 documentos.

db.medicamentos.drop();

db.medicamentos.insertOne({ _id: 1, nombre: 'Sertal',          laboratorio: 'Roche', precio: 5.20,  cantidad: 100 });
db.medicamentos.insertOne({ _id: 2, nombre: 'Buscapina',       laboratorio: 'Roche', precio: 4.10,  cantidad: 200 });
db.medicamentos.insertOne({ _id: 3, nombre: 'Amoxidal 500',    laboratorio: 'Bayer', precio: 15.60, cantidad: 100 });
db.medicamentos.insertOne({ _id: 4, nombre: 'Paracetamol 500', laboratorio: 'Bago',  precio: 1.90,  cantidad: 200 });
db.medicamentos.insertOne({ _id: 5, nombre: 'Bayaspirina',     laboratorio: 'Bayer', precio: 2.10,  cantidad: 150 });
db.medicamentos.insertOne({ _id: 6, nombre: 'Amoxidal jarabe', laboratorio: 'Bayer', precio: 5.10,  cantidad: 50  });


// PROBLEMA 2 — Imprimir todos los documentos.
// TU CÓDIGO:
//


// PROBLEMA 3 — Recuperar medicamentos cuyo laboratorio sea 'Roche'
// Y precio menor a 5.
// (Pista: AND implícito o explícito.)
// TU CÓDIGO:
//


// PROBLEMA 4 — Recuperar medicamentos cuyo laboratorio sea 'Roche'
// O precio menor a 5.
// (Pista: $or con dos condiciones.)
// TU CÓDIGO:
//


// PROBLEMA 5 — Mostrar todos los medicamentos cuyo laboratorio NO sea
// 'Bayer'. Resolvelo con $ne o con $not, lo que prefieras.
// TU CÓDIGO:
//


// PROBLEMA 6 — Mostrar los medicamentos cuyo laboratorio sea 'Bayer'
// Y cuya cantidad NO sea 100.
// (Pista: AND con dos condiciones; la segunda usa $ne o $not.)
// TU CÓDIGO:
//


// PROBLEMA 7 — Eliminar los documentos de 'medicamentos' cuyo
// laboratorio sea 'Bayer' Y precio mayor a 10.
// (Pista: deleteMany con AND implícito.)
// TU CÓDIGO:
//


// PROBLEMA 8 — Cambiar la cantidad por 200 a todos los medicamentos
// de 'Roche' cuyo precio sea mayor a 5.
// (Pista: updateMany con AND y $set.)
// TU CÓDIGO:
//


// PROBLEMA 9 — Borrar los medicamentos cuyo laboratorio sea 'Bayer'
// O cuyo precio sea menor a 3.
// (Pista: deleteMany con $or.)
// TU CÓDIGO:
//


// ============================================================
//  EJERCICIOS EXTRA — Para profundizar
// ============================================================

// EJERCICIO 10 — Anidación
// Recuperá los medicamentos que cumplan:
//   (laboratorio = 'Bayer' Y cantidad > 100)
//   O
//   (precio < 3)
// TU CÓDIGO:
//


// EJERCICIO 11 — $not vs $ne
// Escribí dos consultas EQUIVALENTES sobre 'medicamentos':
//   (a) usando $ne: laboratorio distinto de 'Bayer'
//   (b) usando $not: NEGACIÓN de $eq con 'Bayer'
// Verificá con count() que devuelven el mismo número.
// TU CÓDIGO:
//


// EJERCICIO 12 — Reflexión
// (a) ¿Por qué $or no tiene forma implícita pero $and sí?
// (b) ¿Cuándo usarías $and explícito en vez de implícito?
// (c) ¿Por qué un filtro vacío {} cumple "todos los documentos"
//     y NO se interpreta como "AND de nada = falso"?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
