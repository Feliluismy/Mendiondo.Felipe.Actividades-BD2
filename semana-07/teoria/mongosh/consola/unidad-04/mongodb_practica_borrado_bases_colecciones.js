// ============================================================
//  PRÁCTICA MongoDB — Borrar bases, colecciones y documentos
//  Basado en apuntes UTN Avellaneda — Páginas 9 a 11
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_borrado_bases_colecciones.js")
//
// CUIDADO: este script ejecuta drop y dropDatabase sobre 'base1'.
// Está pensado para una base de prácticas, NO ejecutar en producción.
// ============================================================


// ============================================================
//  SECCIÓN 1 — Activar 'base1' y armar datos de prueba
// ============================================================

db = db.getSiblingDB('base1');

// Reset de las colecciones que vamos a usar como ejemplo
db.libros.drop();
db.clientes.drop();
db.usuarios.drop();

print("\n--- Cargando datos de prueba ---");
db.libros.insertMany([
  { _id: 1, titulo: 'El aleph',          autor: 'Borges' },
  { _id: 2, titulo: 'Martin Fierro',     autor: 'Hernandez' }
]);

db.clientes.insertMany([
  { _id: 1, nombre: 'Lopez Marcos' },
  { _id: 2, nombre: 'Perez Ana' },
  { _id: 3, nombre: 'Garcia Juan' }
]);

db.usuarios.insertMany([
  { _id: 1, user: 'admin' },
  { _id: 2, user: 'invitado' }
]);

print("\n--- Colecciones iniciales en 'base1' ---");
print(db.getCollectionNames());


// ============================================================
//  SECCIÓN 2 — deleteMany({}): borra los documentos,
//  pero la colección sigue existiendo.
// ============================================================

print("\n--- deleteMany({}) sobre 'libros' ---");
var rDel = db.libros.deleteMany({});
printjson(rDel);
// Esperado: { acknowledged: true, deletedCount: 2 }

print("\n--- 'libros' después de deleteMany ---");
print("Documentos:", db.libros.countDocuments());     // 0
print("¿Sigue existiendo la colección?:");
print(db.getCollectionNames());                        // libros sigue ahí


// ============================================================
//  SECCIÓN 3 — drop(): borra la colección entera (con todo).
// ============================================================

print("\n--- drop() sobre 'libros' ---");
var rDrop = db.libros.drop();
print("Resultado:", rDrop);                            // true

print("\n--- Colecciones después del drop ---");
print(db.getCollectionNames());                        // ya NO aparece libros


// ============================================================
//  SECCIÓN 4 — Diferencia visual entre deleteMany y drop
// ============================================================

print("\n--- Recargando 'libros' para volver a comparar ---");
db.libros.insertMany([
  { _id: 10, titulo: 'A' },
  { _id: 11, titulo: 'B' }
]);

print("ANTES   colecciones:", db.getCollectionNames());
print("ANTES   docs en libros:", db.libros.countDocuments());

db.libros.deleteMany({});
print("\nTras deleteMany({}):");
print("  colecciones:", db.getCollectionNames());     // libros SIGUE
print("  docs en libros:", db.libros.countDocuments()); // 0

db.libros.drop();
print("\nTras drop():");
print("  colecciones:", db.getCollectionNames());     // libros NO está


// ============================================================
//  SECCIÓN 5 — dropDatabase(): borra TODA la base activa.
//  La dejamos comentada para que cargar este script no destruya
//  la base sin pedirlo explícitamente. Descomentá para probarla.
// ============================================================

// print("\n--- dropDatabase() sobre la base activa ---");
// var rDb = db.dropDatabase();
// printjson(rDb);   // { dropped: 'base1', ok: 1 }

// print("\n--- Bases del servidor después del dropDatabase ---");
// printjson(db.adminCommand('listDatabases'));


// ============================================================
//  PROBLEMAS PROPUESTOS (1.2) — del apunte UTN
// ============================================================

// PROBLEMA 1 — Crear una base de datos llamada "blog".
// (En script: cambiar el handle de db con getSiblingDB.)
// TU CÓDIGO:
//


// PROBLEMA 2 — Agregar una colección llamada "posts" e insertar 1
// documento con la estructura que elijas (por ejemplo titulo, autor,
// contenido, fecha, tags).
// TU CÓDIGO:
//


// PROBLEMA 3 — Mostrar todas las bases de datos actuales.
// (Equivalente programático de 'show dbs'.)
// TU CÓDIGO:
//


// PROBLEMA 4 — Eliminar la colección "posts".
// TU CÓDIGO:
//


// PROBLEMA 5 — Eliminar la base de datos "blog" y mostrar las bases
// de datos existentes.
// TU CÓDIGO:
//


// ============================================================
//  EJERCICIOS EXTRA — Para profundizar
// ============================================================

// EJERCICIO 6 — deleteMany con filtro
// Cargá 5 libros en una colección 'biblioteca' (algunos de Borges,
// otros de Hernandez). Borrá SOLO los de Borges con
// deleteMany({ autor: 'Borges' }).
// Verificá con find() que quedaron únicamente los otros.
// TU CÓDIGO:
//


// EJERCICIO 7 — Reflexión
// (a) ¿Qué diferencia operativa hay entre deleteMany({}) y drop() si
//     ya no me interesan ni los datos ni la estructura?
// (b) Si la colección tiene 5 índices definidos, ¿cuál de los dos
//     conviene si después voy a recargar datos? ¿Por qué?
// TU RESPUESTA:
//


// EJERCICIO 8 — Verificación previa al borrado (desafío)
// Escribí un bloque que ANTES de hacer dropDatabase() imprima:
//   - el nombre de la base activa
//   - la cantidad de colecciones que tiene
//   - el total de documentos sumando todas las colecciones
// y SOLO si la base se llama 'base1' ejecute dropDatabase().
// (Pista: armá un if con db.toString() === 'base1'.)
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
