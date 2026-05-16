// ============================================================
//  PRÁCTICA MongoDB — Documentos Embebidos
//  Consultas con notación de punto sobre subdocumentos
//  Basado en apuntes UTN Avellaneda — Páginas 49 a 53
// ============================================================
// Para ejecutar: abrí mongosh y corré: load("practica_embebidos.js")
// ============================================================


// ------------------------------------------------------------
// SECCIÓN 1: COLECCIÓN "clientes" — subdocumento "direccion"
// ------------------------------------------------------------

use("base1");
db.clientes.drop();

db.clientes.insertOne({
  _id: 1,
  nombre: 'Martinez Victor',
  mail: 'mvictor@gmail.com',
  direccion: { calle: 'Colon',      numero: 620,  codigopostal: 5000 }
});
db.clientes.insertOne({
  _id: 2,
  nombre: 'Alonso Carlos',
  mail: 'acarlos@gmail.com',
  direccion: { calle: 'Colon',      numero: 150,  codigopostal: 5000 }
});
db.clientes.insertOne({
  _id: 3,
  nombre: 'Gonzalez Marta',
  mail: 'gmarta@outlook.com',
  direccion: { calle: 'Colon',      numero: 1200, codigopostal: 5000 }
});
db.clientes.insertOne({
  _id: 4,
  nombre: 'Ferrero Ariel',
  mail: 'fariel@yahoo.com',
  direccion: { calle: 'Dean Funes', numero: 23,   codigopostal: 5002 }
});
db.clientes.insertOne({
  _id: 5,
  nombre: 'Fernandez Diego',
  mail: 'fdiego@gmail.com',
  direccion: { calle: 'Dean Funes', numero: 561,  codigopostal: 5002 }
});


// -- Ejemplo 1: Todos los clientes
print("\n--- Todos los clientes ---");
db.clientes.find().pretty();

// -- Ejemplo 2: Filtrar por subcampo con notación de punto
//    ⚠️  Las comillas en 'direccion.calle' son OBLIGATORIAS
print("\n--- Clientes en calle Colon ---");
db.clientes.find({ 'direccion.calle': 'Colon' }).pretty();

// -- Ejemplo 3: Rango sobre subcampo numérico
//    Clientes de calle Colon con número entre 1 y 1000
//    FORMA CORRECTA: combinar $gte y $lte en el mismo objeto
print("\n--- Clientes en Colon con número entre 1 y 1000 ---");
db.clientes.find({
  'direccion.calle': 'Colon',
  'direccion.numero': { $gte: 1, $lte: 1000 }
}).pretty();


// ------------------------------------------------------------
// SECCIÓN 2: COLECCIÓN "libros" — subdocumento "autor"
//            (Problemas propuestos 1.9)
// ------------------------------------------------------------

db.libros.drop();

db.libros.insertOne({
  _id: 1,
  titulo: 'El aleph',
  autor: { nombre: 'Borges',           nacionalidad: 'Argentina' },
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
});
db.libros.insertOne({
  _id: 2,
  titulo: 'Martin Fierro',
  autor: { nombre: 'Jose Hernandez',   nacionalidad: 'Argentina' },
  editorial: ['Siglo XXI'],
  precio: 50,
  cantidad: 12
});
db.libros.insertOne({
  _id: 3,
  titulo: 'Aprenda PHP',
  autor: { nombre: 'Mario Molina',     nacionalidad: 'Española'  },
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 50,
  cantidad: 20
});
db.libros.insertOne({
  _id: 4,
  // Nota: en el apunte original el _id:4 no tiene campo "titulo"
  // el nombre del libro quedó dentro de autor.nombre por error tipográfico
  autor: { nombre: 'Java en 10 minutos', nacionalidad: 'Española' },
  editorial: ['Siglo XXI'],
  precio: 45,
  cantidad: 1
});


// ============================================================
//  EJERCICIOS PROPUESTOS (1.9) — Resolvé vos cada uno
//  Trabajar sobre la colección "libros" de la Sección 2
// ============================================================

// EJERCICIO 2:
// Imprimir todos los documentos de la colección 'libros'.
// TU RESPUESTA:
// db.libros.find( ___ );


// EJERCICIO 3:
// Imprimir todos los libros de autores de nacionalidad 'Argentina'.
// Pista: usá notación de punto sobre el subdocumento "autor"
// TU RESPUESTA:
// db.libros.find({ ___ });


// EJERCICIO 4:
// Imprimir los libros de 'Borges'.
// TU RESPUESTA:
// db.libros.find({ ___ });


// EJERCICIO 5:
// Imprimir todos los libros de nacionalidad 'Española' que cuestan 50 o más.
// Pista: combiná dos condiciones: una sobre subcampo y una sobre campo raíz
// TU RESPUESTA:
// db.libros.find({ ___ , ___ });


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
