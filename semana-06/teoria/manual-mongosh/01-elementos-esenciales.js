// --- Creación de base de datos y primera colección ---
use clase_6;

// Insertar el primer documento en la colección 'libros'
db.libros.insertOne({
  codigo: 1,
  nombre: 'El aleph',
  autor: 'Borges',
  editoriales: ['Planeta', 'Siglo XXI']
});

// Insertar el segundo documento
db.libros.insertOne({
  codigo: 2,
  nombre: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editoriales: ['Planeta']
});

// Mostrar los documentos de la colección 'libros'
db.libros.find();

// --- Uso de insertMany ---
db.libros.insertMany([
  {
    codigo: 3,
    nombre: 'Aprenda PHP',
    autor: 'Mario Molina',
    editoriales: ['Planeta']
  },
  {
    codigo: 4,
    nombre: 'Java en 10 minutos',
    autor: 'Barros Sergio',
    editoriales: ['Planeta', 'Siglo XXI']
  }
]);

// Mostrar todos los documentos de la colección 'libros'
db.libros.find();

// --- Uso de un _id manual ---
// Crear la colección 'clientes' e insertar un documento con _id manual
db.clientes.insertOne({
  _id: 1,
  nombre: 'Lopez Marcos',
  domicilio: 'Colon 111',
  provincia: 'Cordoba'
});

// Intentar insertar un documento con el mismo _id (esto generará un error)
db.clientes.insertOne({
  _id: 1,
  nombre: 'Perez Ana',
  domicilio: 'San Martin 222',
  provincia: 'Santa Fe'
});

// Mostrar los documentos de la colección 'clientes'
db.clientes.find();

