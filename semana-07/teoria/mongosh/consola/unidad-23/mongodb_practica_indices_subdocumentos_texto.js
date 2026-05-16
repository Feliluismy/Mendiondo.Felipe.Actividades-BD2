// ============================================================
//  PRÁCTICA MongoDB — Índices sobre subdocumentos, arrays y texto
//  Basado en apuntes UTN Avellaneda — Páginas 81 a 84
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_indices_subdocumentos_texto.js")
// ============================================================


use("base1");


// ============================================================
//  SECCIÓN 1 — Índice sobre UN SUBCAMPO (notación de punto)
//  Indexamos 'direccion.calle' para acelerar búsquedas por calle.
// ============================================================

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

print("\n--- Creando índice sobre subcampo 'direccion.calle' ---");
db.clientes.createIndex({ 'direccion.calle': 1 });
// Las comillas son obligatorias por el punto en la clave.

print("\n--- Búsqueda por subcampo (usa el índice) ---");
db.clientes.find({ 'direccion.calle': 'Dean Funes' });


// ============================================================
//  SECCIÓN 2 — Índice sobre el SUBDOCUMENTO COMPLETO
//  Solo se aprovecha cuando la consulta filtra por TODOS los subcampos.
// ============================================================

db.libros.drop();

db.libros.insertOne({
  _id: 1,
  titulo: 'El aleph',
  autor: { nombre: 'Borges',         nacionalidad: 'Argentina' },
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
});

db.libros.insertOne({
  _id: 2,
  titulo: 'Martin Fierro',
  autor: { nombre: 'Jose Hernandez', nacionalidad: 'Argentina' },
  editorial: ['Siglo XXI'],
  precio: 50,
  cantidad: 12
});

db.libros.insertOne({
  _id: 3,
  titulo: 'Aprenda PHP',
  autor: { nombre: 'Mario Molina',   nacionalidad: 'Española' },
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 50,
  cantidad: 20
});

db.libros.insertOne({
  _id: 4,
  autor: { nombre: 'Java en 10 minutos', nacionalidad: 'Española' },
  editorial: ['Siglo XXI'],
  precio: 45,
  cantidad: 1
});

print("\n--- Creando índice sobre el subdocumento completo 'autor' ---");
db.libros.createIndex({ autor: 1 });

print("\n--- Consulta que filtra por AMBOS subcampos (usa el índice) ---");
db.libros.find({
  'autor.nombre': 'Java en 10 minutos',
  'autor.nacionalidad': 'Española'
});

// Si solo filtramos por 'autor.nombre', este índice NO se aprovecha igual.
// Para ese caso convendría un índice puntual sobre 'autor.nombre'.


// ============================================================
//  SECCIÓN 3 — Índice MULTIKEY (sobre un array)
//  Genera una entrada por cada elemento del arreglo.
// ============================================================

print("\n--- Creando índice multikey sobre el array 'editorial' ---");
db.libros.createIndex({ editorial: 1 });

print("\n--- Búsqueda por un elemento dentro del array ---");
db.libros.find({ editorial: 'Planeta' });


// ============================================================
//  SECCIÓN 4 — Operador $text e índice de TEXTO
//  Búsqueda full-text (palabras, frases, exclusión, score).
// ============================================================

// Una colección puede tener UN SOLO índice de texto, pero puede cubrir
// varios campos. Antes de crear uno nuevo, eliminamos cualquier
// índice de texto previo.

db.stores.drop();

db.stores.insertOne({ _id: 1, nombre: 'Java Coffee Shop',     descripcion: 'Cafetería especializada en granos de Java' });
db.stores.insertOne({ _id: 2, nombre: 'Coffee House',          descripcion: 'Coffee shop with espresso and pastries'   });
db.stores.insertOne({ _id: 3, nombre: 'Tea & More',            descripcion: 'Té importado, sin café'                   });
db.stores.insertOne({ _id: 4, nombre: 'Java Programming Shop', descripcion: 'Libros y cursos de programación en Java'  });
db.stores.insertOne({ _id: 5, nombre: 'Espresso Bar',          descripcion: 'Pequeña barra de espresso italiana'       });

print("\n--- Creando índice de texto sobre 'nombre' y 'descripcion' ---");
db.stores.createIndex(
  { nombre: "text", descripcion: "text" },
  { default_language: "spanish" }
);

// 4.1 — OR implícito entre términos
print("\n--- $text: OR entre 'java', 'coffee' y 'shop' ---");
db.stores.find({ $text: { $search: "java coffee shop" } });

// 4.2 — Frase exacta entre comillas dobles escapadas
print("\n--- $text: 'java' o frase exacta 'coffee shop' ---");
db.stores.find({ $text: { $search: "java \"coffee shop\"" } });

// 4.3 — Excluir un término con prefijo "-"
print("\n--- $text: 'java' o 'shop' pero NO 'coffee' ---");
db.stores.find({ $text: { $search: "java shop -coffee" } });

// 4.4 — Score de relevancia ($meta: "textScore")
print("\n--- $text con score de relevancia, ordenado por pertinencia ---");
db.stores.find(
  { $text: { $search: "java coffee shop" } },
  { score: { $meta: "textScore" } }
).sort(
  { score: { $meta: "textScore" } }
);


// ============================================================
//  SECCIÓN 5 — Índice de texto en español sobre 'libros'
//  Demuestra createIndex con default_language: "spanish".
// ============================================================

// Cuidado: si ya hubiera un índice de texto sobre la colección,
// hay que eliminarlo antes (solo se permite UNO por colección).
print("\n--- Creando índice de texto en español sobre libros.titulo ---");
db.libros.createIndex(
  { titulo: "text" },
  { default_language: "spanish" }
);

print("\n--- Búsqueda full-text sobre títulos ---");
db.libros.find({ $text: { $search: "aleph fierro" } });


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — Índice sobre subcampo
// Sobre la colección 'clientes', creá un índice ascendente sobre el
// subcampo 'direccion.codigopostal' y mostrá los clientes con
// codigopostal igual a 5002.
// TU CÓDIGO:
//


// EJERCICIO 2 — Índice compuesto con subcampos
// Creá un índice compuesto sobre ('direccion.calle' asc, 'direccion.numero' asc)
// y ejecutá una consulta que liste los clientes ordenados por calle y,
// dentro de cada calle, por número de altura.
// TU CÓDIGO:
//


// EJERCICIO 3 — Subdocumento completo
// Tomando como base la colección 'libros', escribí dos consultas:
// (a) Una que aproveche el índice { autor: 1 } (filtrando por nombre Y
//     nacionalidad).
// (b) Otra equivalente pero que filtre solo por 'autor.nombre' y por
//     lo tanto NO aproveche del mismo modo el índice del subdocumento.
// Usá explain('executionStats') para comparar ambas.
// TU CÓDIGO:
//


// EJERCICIO 4 — Multikey sobre array
// Sobre 'libros', usando el índice multikey ya creado sobre 'editorial',
// listá todos los libros publicados por 'Siglo XXI'. Verificá con
// explain('executionStats') que el stage del plan ganador es IXSCAN.
// TU CÓDIGO:
//


// EJERCICIO 5 — $text con OR
// En la colección 'stores', encontrá todos los documentos que contengan
// alguno de los términos 'programacion', 'cafeteria' o 'espresso'.
// TU CÓDIGO:
//


// EJERCICIO 6 — $text con frase exacta
// En 'stores', encontrá los documentos que contengan la frase exacta
// "coffee shop" (debe aparecer así, junta).
// TU CÓDIGO:
//


// EJERCICIO 7 — $text excluyendo
// En 'stores', encontrá los documentos que contengan 'java' pero NO 'shop'.
// TU CÓDIGO:
//


// EJERCICIO 8 — Score de relevancia
// Repetí la búsqueda 'java coffee shop' sobre 'stores' pero esta vez
// proyectá también { _id: 1, nombre: 1, score: { $meta: "textScore" } }
// y ordená descendentemente por score. ¿Cuál es el documento más relevante?
// TU CÓDIGO:
//


// EJERCICIO 9 — Índice de texto en otro idioma (desafío)
// Eliminá el índice de texto de 'libros' y creá uno nuevo que cubra
// ('titulo', 'autor.nombre') con default_language "spanish". Probá:
//   db.libros.find({ $text: { $search: "borges" } })
// ¿Qué libro/s aparece/n?
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
