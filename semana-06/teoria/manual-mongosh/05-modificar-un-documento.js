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

// --- Modificar campos existentes ($set) ---
db.libros.updateOne({ _id: { $eq: 1 } }, { $set: { precio: 15, cantidad: 1 } });
db.libros.find();

// --- Agregar un nuevo campo a un documento ($set) ---
db.libros.updateOne({ _id: { $eq: 4 } }, { $set: { descripcion: 'Cada unidad trata un tema fundamental de Java desde 0.' } });
db.libros.find();

// --- Eliminar un campo de un documento ($unset) ---
db.libros.updateOne({ _id: { $eq: 4 } }, { $unset: { descripcion: '' } });
db.libros.find();

// --- Agregar un elemento a un arreglo ($push) ---
db.libros.updateOne({ _id: { $eq: 1 } }, { $push: { editorial: 'Atlántida' } });
db.libros.find();

// --- Eliminar un elemento de un arreglo ($pull) ---
db.libros.updateOne({ _id: { $eq: 1 } }, { $pull: { editorial: 'Atlántida' } });
db.libros.find();

