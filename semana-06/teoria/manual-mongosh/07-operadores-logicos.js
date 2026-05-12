// --- Preparación de datos ---
use base1;
db.libros.drop();

db.libros.insertOne({
  _id: 1,
  titulo: 'El aleph',
  autor: 'Borges',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
});
db.libros.insertOne({
  _id: 2,
  titulo: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editorial: ['Siglo XXI'],
  precio: 50,
  cantidad: 12
});
db.libros.insertOne({
  _id: 3,
  titulo: 'Aprenda PHP',
  autor: 'Mario Molina',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 50,
  cantidad: 20
});
db.libros.insertOne({
  _id: 4,
  titulo: 'Java en 10 minutos',
  editorial: ['Siglo XXI'],
  precio: 45,
  cantidad: 1
});

// Mostrar todos los documentos
db.libros.find();

// --- Uso de operadores lógicos ---

// Operador $and (implícito)
db.libros.find({ precio: 50, cantidad: 20 });

// Operador $and (explícito)
db.libros.find({ $and: [{ precio: 50 }, { cantidad: 20 }] });

// Operador $or
db.libros.find({ $or: [{ precio: { $gte: 50 } }, { cantidad: 1 }] });

// Operador $not
db.libros.find({ precio: { $not: { $gte: 50 } } });

// --- Uso de operadores lógicos en borrado ---
db.libros.deleteMany({ precio: { $not: { $eq: 50 } } });

// Verificar los documentos restantes
db.libros.find();


