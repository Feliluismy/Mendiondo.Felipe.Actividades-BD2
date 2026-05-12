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

db.libros.insertOne({
  _id: 5,
  titulo: 'JavaScript avanzado',
  autor: 'Ana Perez',
  editorial: ['Planeta'],
  precio: 60,
  cantidad: 15
});



// --- Métodos de Cursor ---

// Ordenar resultados (sort)
db.libros.find().sort({ titulo: 1 });

// Formatear salida (pretty)
db.libros.find().pretty();

// Encadenar sort y pretty
db.libros.find().sort({ titulo: 1 }).pretty();

// Limitar número de resultados (limit)
db.libros.find().limit(2);

// Ordenar y luego limitar
db.libros.find().sort({ titulo: 1 }).limit(2);

// Omitir documentos (skip)
db.libros.find().skip(1);

// Combinar skip y limit con pretty
db.libros.find().skip(2).limit(2).pretty();

// --- Método find con query y projection ---

// Filtrar (query) y seleccionar campos (projection)
// Muestra _id (por defecto), titulo y cantidad
db.libros.find({ precio: 50 }, { titulo: 1, cantidad: 1 });