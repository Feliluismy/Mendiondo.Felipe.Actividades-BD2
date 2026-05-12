// --- Preparación de datos con documentos embebidos ---
use base1;
db.clientes.drop();

db.clientes.insertOne({
  _id: 1,
  nombre: 'Martinez Victor',
  mail: 'mvictor@gmail.com',
  direccion: {
    calle: 'Colon',
    numero: 620,
    codigopostal: 5000
  }
});
db.clientes.insertOne({
  _id: 2,
  nombre: 'Alonso Carlos',
  mail: 'acarlos@gmail.com',
  direccion: {
    calle: 'Colon',
    numero: 150,
    codigopostal: 5000
  }
});
db.clientes.insertOne({
  _id: 3,
  nombre: 'Gonzalez Marta',
  mail: 'gmarta@outlook.com',
  direccion: {
    calle: 'Colon',
    numero: 1200,
    codigopostal: 5000
  }
});
db.clientes.insertOne({
  _id: 4,
  nombre: 'Ferrero Ariel',
  mail: 'fariel@yahoo.com',
  direccion: {
    calle: 'Dean Funes',
    numero: 23,
    codigopostal: 5002
  }
});
db.clientes.insertOne({
  _id: 5,
  nombre: 'Fernandez Diego',
  mail: 'fdiego@gmail.com',
  direccion: {
    calle: 'Dean Funes',
    numero: 561,
    codigopostal: 5002
  }
});

// --- Consultas en documentos embebidos ---

// Mostrar todos los documentos
db.clientes.find();

// Recuperar por un subcampo
db.clientes.find({ 'direccion.calle': 'Colon' }).pretty();

// Recuperar usando múltiples condiciones en subcampos
db.clientes.find({ 'direccion.calle': 'Colon', 'direccion.numero': { $gte: 0, $lte: 1000 } }).pretty();