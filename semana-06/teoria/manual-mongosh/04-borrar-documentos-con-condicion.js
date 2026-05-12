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

// --- Borrado de documentos ---

// Mostrar todos los documentos antes de borrar
db.libros.find();

// Borrar un solo documento por su _id
db.libros.deleteOne({ _id: 1 });

// Mostrar documentos restantes
db.libros.find();

// Borrar múltiples documentos que cumplen una condición
db.libros.deleteMany({ precio: { $gte: 50 } });

// Mostrar documentos finales
db.libros.find();