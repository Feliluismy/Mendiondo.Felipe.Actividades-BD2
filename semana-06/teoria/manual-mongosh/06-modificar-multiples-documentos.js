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

// Mostrar estado inicial
db.libros.find();

// --- Modificaciones masivas con updateMany ---

// Modificar la cantidad a 0 para los libros con _id > 2
db.libros.updateMany({ _id: { $gt: 2 } }, { $set: { cantidad: 0 } });
db.libros.find();

// Agregar el campo 'faltantes' a los libros con cantidad 0
db.libros.updateMany({ cantidad: { $eq: 0 } }, { $set: { faltantes: true } });
db.libros.find();

// Eliminar el campo 'faltantes' y actualizar la cantidad a 100
db.libros.updateMany({ cantidad: { $eq: 0 } }, { $unset: { faltantes: true }, $set: { cantidad: 100 } });
db.libros.find();