// ============================================================
//  PRÁCTICA MongoDB — find() con Query, Projection y
//  Documentos Embebidos
//  Basado en apuntes UTN Avellaneda — Páginas 45 a 49
// ============================================================
// Para ejecutar: abre la consola de MongoDB (mongosh) y
// pega o carga este archivo con: load("practica_mongo.js")
// ============================================================

// ------------------------------------------------------------
// SECCIÓN 1: COLECCIÓN "libros" — ejemplos de find + projection
// ------------------------------------------------------------

use("base1");
db.libros.drop();

db.libros.insertOne({
  _id: 1,
  titulo: "El aleph",
  autor: "Borges",
  editorial: ["Siglo XXI", "Planeta"],
  precio: 20,
  cantidad: 50,
});
db.libros.insertOne({
  _id: 2,
  titulo: "Martin Fierro",
  autor: "Jose Hernandez",
  editorial: ["Siglo XXI"],
  precio: 50,
  cantidad: 12,
});
db.libros.insertOne({
  _id: 3,
  titulo: "Aprenda PHP",
  autor: "Mario Molina",
  editorial: ["Siglo XXI", "Planeta"],
  precio: 50,
  cantidad: 20,
});
db.libros.insertOne({
  _id: 4,
  titulo: "Java en 10 minutos",
  editorial: ["Siglo XXI"],
  precio: 45,
  cantidad: 1,
});

// -- Ejemplo 1: Recuperar todos los documentos
print("\n--- Todos los libros ---");
db.libros.find();

// -- Ejemplo 2: Query simple — libros con precio 50
print("\n--- Libros con precio 50 ---");
db.libros.find({ precio: 50 });

// -- Ejemplo 3: Query + Projection — precio 50, mostrar solo titulo y cantidad
//    El campo _id se incluye por defecto
print("\n--- Libros con precio 50 (solo titulo, cantidad y _id) ---");
db.libros.find({ precio: 50 }, { titulo: 1, cantidad: 1 });

// -- Ejemplo 4: Excluir el _id de la projection
print("\n--- Libros con precio 50 (sin _id) ---");
db.libros.find({ precio: 50 }, { titulo: 1, cantidad: 1, _id: 0 });

// ------------------------------------------------------------
// SECCIÓN 2: COLECCIÓN "articulos" — datos de prueba completos
// ------------------------------------------------------------

db.articulos.drop();

db.articulos.insertOne({
  _id: 1,
  nombre: "MULTIFUNCION HP DESKJET 2675",
  rubro: "impresora",
  precio: 3000,
  stock: 20,
});
db.articulos.insertOne({
  _id: 2,
  nombre: "MULTIFUNCION EPSON EXPRESSION XP241",
  rubro: "impresora",
  precio: 3700,
  stock: 5,
});
db.articulos.insertOne({
  _id: 3,
  nombre: "LED 19 PHILIPS",
  rubro: "monitor",
  precio: 4500,
  stock: 2,
});
db.articulos.insertOne({
  _id: 4,
  nombre: "LED 22 PHILIPS",
  rubro: "monitor",
  precio: 5700,
  stock: 4,
});
db.articulos.insertOne({
  _id: 5,
  nombre: "LED 27 PHILIPS",
  rubro: "monitor",
  precio: 12000,
  stock: 1,
});
db.articulos.insertOne({
  _id: 6,
  nombre: "LOGITECH M90",
  rubro: "mouse",
  precio: 300,
  stock: 4,
});

// ------------------------------------------------------------
// SECCIÓN 3: COLECCIÓN "clientes" — documentos embebidos
// ------------------------------------------------------------

db.clientes.drop();

db.clientes.insertOne({
  _id: 1,
  nombre: "Martinez Victor",
  mail: "mvictor@gmail.com",
  direccion: { calle: "Colon", numero: 620, codigopostal: 5000 },
});
db.clientes.insertOne({
  _id: 2,
  nombre: "Alonso Carlos",
  mail: "acarlos@gmail.com",
  direccion: { calle: "Colon", numero: 150, codigopostal: 5000 },
});
db.clientes.insertOne({
  _id: 3,
  nombre: "Gonzalez Marta",
  mail: "gmarta@outlook.com",
  direccion: { calle: "Colon", numero: 1200, codigopostal: 5000 },
});

// -- Ejemplo de consulta con notación de punto sobre subdocumento
print("\n--- Clientes en calle Colon ---");
db.clientes.find({ "direccion.calle": "Colon" });

print("\n--- Clientes con número de puerta mayor a 500 ---");
db.clientes.find({ "direccion.numero": { $gt: 500 } });

// ============================================================
//  EJERCICIOS PROPUESTOS (1.8) — Resolvé vos cada uno
//  Trabajar sobre la colección "articulos" de la Sección 2
// ============================================================

// EJERCICIO 2:
// Imprimir todos los documentos de la colección 'articulos',
// mostrando solo los campos _id y nombre.
// TU RESPUESTA:
// db.articulos.find( ___ , ___ );

// EJERCICIO 3:
// Imprimir todos los artículos cuyo rubro sea 'impresora',
// mostrando solo los campos nombre y precio (sin _id).
// TU RESPUESTA:
// db.articulos.find( ___ , ___ );

// EJERCICIO 4:
// Imprimir todas las impresoras con precio mayor o igual a 3500.
// Mostrar solo los campos _id, nombre, precio y stock.
// Pista: usá el operador $gte
// TU RESPUESTA:
// db.articulos.find( ___ , ___ );

// EJERCICIO 5:
// Imprimir todos los monitores, mostrando solo nombre y precio,
// ordenados de menor a mayor precio.
// Pista: encadenás .sort() al final del find()
// TU RESPUESTA:
// db.articulos.find( ___ , ___ ).sort( ___ );

// ============================================================
//  FIN DEL SCRIPT
// ============================================================
