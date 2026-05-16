// ============================================================
//  PRÁCTICA MongoDB — Base de Datos, Colección y Documento
//  Basado en apuntes UTN Avellaneda — Páginas 2 a 3
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_base_coleccion_documento.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Activar (o crear) la base de datos
//  En el shell interactivo se haría con: use base1
//  En un script se hace con getSiblingDB:
// ============================================================

db = db.getSiblingDB('base1');

print("\n--- Base de datos activa ---");
print(db);   // imprime "base1"


// ============================================================
//  SECCIÓN 2 — Crear la colección 'libros' insertando documentos
//  La colección NO se declara antes:
//  se crea sola en el momento del primer insertOne.
// ============================================================

// Empezamos limpio para que el script sea reproducible.
db.libros.drop();

print("\n--- Insertando el primer documento ---");
db.libros.insertOne({
  codigo: 1,
  nombre: 'El aleph',
  autor: 'Borges',
  editoriales: ['Planeta', 'Siglo XXI']
});

print("\n--- Insertando el segundo documento ---");
db.libros.insertOne({
  codigo: 2,
  nombre: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editoriales: ['Planeta']
});


// ============================================================
//  SECCIÓN 3 — Listar todos los documentos con find()
// ============================================================

print("\n--- Documentos en 'libros' ---");
db.libros.find().forEach(printjson);
// Cada documento muestra un campo _id agregado automáticamente
// con un valor de tipo ObjectId.


// ============================================================
//  SECCIÓN 4 — El campo _id automático vs manual
// ============================================================

// 4.1 — Insertar SIN _id explícito → MongoDB lo genera (ObjectId)
print("\n--- Insert SIN _id (MongoDB lo crea) ---");
db.libros.insertOne({
  codigo: 3,
  nombre: 'Aprenda PHP',
  autor: 'Mario Molina',
  editoriales: ['Planeta', 'Siglo XXI']
});

// 4.2 — Insertar CON _id explícito → MongoDB respeta el valor dado
print("\n--- Insert CON _id manual ---");
db.libros.insertOne({
  _id: 100,
  codigo: 4,
  nombre: 'Java en 10 minutos',
  autor: 'Anonimo',
  editoriales: ['Siglo XXI']
});

print("\n--- Estado final de la colección ---");
db.libros.find().forEach(printjson);


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — Crear una base distinta
// Activá una base de datos nueva llamada 'biblioteca' (sin usar 'use'
// porque estamos en un script). Imprimí el nombre de la base activa
// para verificar que el cambio funcionó.
// TU CÓDIGO:
//


// EJERCICIO 2 — Crear tu primera colección
// Sobre la base 'biblioteca', creá la colección 'lectores' insertando
// 3 documentos con los campos { dni, nombre, edad, email }. NO uses
// drop() todavía; primero asegurate de que se cree con el primer insert.
// TU CÓDIGO:
//


// EJERCICIO 3 — Mostrar todos los documentos
// Listá los 3 documentos insertados en 'lectores' usando find()
// y forEach(printjson) (porque estamos en un script).
// TU CÓDIGO:
//


// EJERCICIO 4 — _id automático vs manual
// Insertá DOS documentos más en 'lectores':
//   - Uno SIN especificar _id → debería tener un ObjectId.
//   - Uno CON _id: 'lec5' (string) → debería usar ese valor literal.
// Mostrá los 5 documentos al final.
// TU CÓDIGO:
//


// EJERCICIO 5 — Documentos heterogéneos
// Insertá un sexto documento en 'lectores' con campos DISTINTOS a los
// otros (por ejemplo { _id: 'lec6', nombre: 'Ana', telefonos: ['111','222'] }).
// Verificá con find() que MongoDB no rechaza el documento aunque tenga
// otra estructura.
// TU CÓDIGO:
//


// EJERCICIO 6 — Reflexión
// (a) ¿Qué pasaría si en una BASE relacional intentaras insertar
//     filas con columnas distintas en la misma tabla?
// (b) ¿Cuándo es ventaja la flexibilidad de MongoDB y cuándo puede
//     volverse un problema?
// TU RESPUESTA:
//


// EJERCICIO 7 — _id duplicado (debe fallar)
// Intentá insertar dos documentos con el mismo _id (por ejemplo dos
// veces _id: 999). Capturá el error con try/catch e imprimí el mensaje.
// PISTA: el error es de tipo "duplicate key".
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
