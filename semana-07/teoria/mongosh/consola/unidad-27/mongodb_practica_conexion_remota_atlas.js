// ============================================================
//  PRÁCTICA MongoDB — Conexión a un servidor remoto (Atlas)
//  Basado en apuntes UTN Avellaneda — Páginas 96 a 100
// ============================================================
// IMPORTANTE: este archivo combina pasos administrativos (que se
// hacen UNA VEZ desde la terminal y desde el panel web) con un
// script JS que se ejecuta DESPUÉS de haberse conectado.
//
// Para ejecutar la parte JS:
//   1. Conectate a Atlas (ver SECCIÓN 1 más abajo).
//   2. Una vez en el prompt PRIMARY> corré:
//        load("mongodb_practica_conexion_remota_atlas.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Pasos PREVIOS (no se ejecutan dentro de mongosh)
//  Se hacen una sola vez desde el navegador y la terminal.
// ============================================================

/*
PASO 1.1 — Registrarse en Atlas
   https://www.mongodb.com/cloud/atlas
   "Start Free" → crear cuenta.

PASO 1.2 — Crear un Cluster M0 (gratuito)
   - Cloud Provider: AWS / GCP / Azure
   - Region: alguna que diga "FREE TIER AVAILABLE"
   - Tier: M0 Sandbox
   - Cluster Name: por ejemplo Cluster0

PASO 1.3 — Crear un usuario de base de datos
   Database Access → Add New Database User
   - Username: <ej. alumnoutn>
   - Password: <clave fuerte>
   - Privileges: "Read and write to any database"

PASO 1.4 — Habilitar tu IP
   Network Access → Add IP Address
   - "Add Current IP Address" (o 0.0.0.0/0 SOLO para pruebas)

PASO 1.5 — Obtener la cadena de conexión
   Cluster → Connect → "Connect with the Mongo Shell"
   Copiar la cadena SRV, ejemplo:
     mongodb+srv://cluster0-azrix.mongodb.net/test

PASO 1.6 — Conectarse desde la terminal del SO
   $ mongosh "mongodb+srv://cluster0-azrix.mongodb.net/test" --username alumnoutn
   Enter password: ********
   ...
   MongoDB Enterprise Cluster0-shard-0:PRIMARY>
*/


// ============================================================
//  SECCIÓN 2 — A partir de acá ya estamos conectados a Atlas.
//  Las operaciones son IDÉNTICAS a las del servidor local.
// ============================================================

// Cambiar a la base 'base1' (en script equivale a 'use base1')
db = db.getSiblingDB('base1');

// Re-crear la colección 'libros' con datos de prueba
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


// ============================================================
//  SECCIÓN 3 — Verificaciones (todo lo que ya sabemos hacer)
// ============================================================

print("\n--- Bases de datos del servidor remoto ---");
printjson(db.adminCommand('listDatabases'));

print("\n--- Colecciones de la base 'base1' ---");
print(db.getCollectionNames());

print("\n--- Documentos en libros ---");
db.libros.find().forEach(printjson);


// ============================================================
//  SECCIÓN 4 — Confirmar contra qué servidor estamos hablando
//  Útil para asegurarte de NO estar trabajando contra el local.
// ============================================================

print("\n--- Servidor al que estoy conectado ---");
printjson(db.serverStatus().host);     // hostname del nodo
printjson(db.serverStatus().repl);     // info del replica set (si existe)
printjson(db.serverStatus().version);  // versión del servidor


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos en tu cluster Atlas
// ============================================================

// EJERCICIO 1 — Setup
// Seguí los pasos 1.1 a 1.6 de la SECCIÓN 1 para crear tu propio
// cluster gratuito en Atlas y conectarte desde mongosh.
// CHECK: ¿qué prompt mostró el shell? Anotalo.
// TU RESPUESTA:
//


// EJERCICIO 2 — Replicar el ejemplo del apunte
// Una vez conectado, ejecutá manualmente (sin script) los comandos:
//   show dbs
//   use base1
//   db.libros.drop()
//   db.libros.insertOne({...})  x2
//   show collections
//   db.libros.find()
// CHECK: que aparezca la colección 'libros' al hacer show collections.
// TU CÓDIGO / SALIDA:
//


// EJERCICIO 3 — Identificar el servidor
// Ejecutá db.serverStatus().host y db.runCommand({ buildInfo: 1 }).
// ¿Qué hostname te devuelve? ¿Qué versión de MongoDB corre Atlas?
// TU RESPUESTA:
//


// EJERCICIO 4 — Crear un índice en el remoto
// Sobre la colección 'libros' del cluster Atlas:
//   - Creá un índice ascendente sobre 'autor'.
//   - Listá los índices con db.libros.getIndexes().
// CHECK: aparece "autor_1" en el listado.
// TU CÓDIGO:
//


// EJERCICIO 5 — Cuotas del tier gratuito
// Atlas M0 te da 512 MB de almacenamiento.
// ¿Cuántos documentos como los del ejemplo (libro: titulo + autor + editorial...)
// estimás que entrarían? Hacé un cálculo aproximado considerando el tamaño
// de un documento BSON (podés usar Object.bsonsize(doc) si está disponible
// o estimar a ojo). No es necesario llenarlo, es un ejercicio de estimación.
// TU RESPUESTA:
//


// EJERCICIO 6 — Local vs Remoto
// Listá 3 cosas que cambian al pasar de un servidor local a Atlas
// y 3 cosas que NO cambian (siguen funcionando igual).
// TU RESPUESTA:
//


// EJERCICIO 7 — Seguridad (reflexión)
// ¿Qué riesgo tiene dejar Network Access en 0.0.0.0/0?
// ¿Qué riesgo tiene commitear en git una cadena de conexión que
// incluya usuario y clave? ¿Cómo lo evitarías?
// TU RESPUESTA:
//


// EJERCICIO 8 — Cargar un script remoto (desafío)
// Tomá uno de los scripts que escribiste en unidades anteriores
// (p. ej. el de carga masiva de articulos) y ejecutalo CONECTADO
// AL CLUSTER ATLAS con load("ruta/del/script.js").
// CHECK: los datos quedaron en el remoto, no en tu localhost.
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
