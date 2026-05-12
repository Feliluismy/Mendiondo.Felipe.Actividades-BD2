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

// --- Consultas con el método find ---

// Recuperar todos los documentos
db.libros.find();

// Recuperar por _id
db.libros.find({ _id: 1 });

// Recuperar por un campo con valor exacto
db.libros.find({ precio: 50 });

// Recuperar por más de un campo (AND implícito)
db.libros.find({ precio: 50, cantidad: 20 });

// --- Consultas con operadores relacionales ---

// Igual a ($eq)
db.libros.find({ precio: { $eq: 50 } });

// Menor que ($lt)
db.libros.find({ precio: { $lt: 30 } });

// Mayor que ($gt)
db.libros.find({ precio: { $gt: 40 } });

// Mayor o igual que ($gte)
db.libros.find({ cantidad: { $gte: 50 } });

// Distinto de ($ne)
db.libros.find({ cantidad: { $ne: 50 } });

// Comprendido entre dos valores ($gte y $lte)
db.libros.find({ precio: { $gte: 20, $lte: 45 } });

// Dentro de un arreglo de valores ($in)
db.libros.find({ editorial: { $in: ['Planeta'] } });

// No dentro de un arreglo de valores ($nin)
db.libros.find({ editorial: { $nin: ['Planeta'] } });

