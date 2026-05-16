// ============================================================
//  PRÁCTICA MongoDB — insertOne e insertMany
//  Basado en apuntes UTN Avellaneda — Páginas 4 a 5
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_insertone_insertmany.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Activar la base 'base1'
//  En el shell interactivo: use base1
//  En un script:
// ============================================================

db = db.getSiblingDB('base1');

print("\n--- Base activa ---");
print(db);


// ============================================================
//  SECCIÓN 2 — Reset de la colección 'libros'
//  Para que el script sea reproducible.
// ============================================================

db.libros.drop();


// ============================================================
//  SECCIÓN 3 — insertOne: un documento por vez
// ============================================================

print("\n--- insertOne: 'El aleph' ---");
db.libros.insertOne({
  codigo: 1,
  nombre: 'El aleph',
  autor: 'Borges',
  editoriales: ['Planeta', 'Siglo XXI']
});

print("\n--- insertOne: 'Martin Fierro' ---");
db.libros.insertOne({
  codigo: 2,
  nombre: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editoriales: ['Planeta']
});


// ============================================================
//  SECCIÓN 4 — insertMany: varios documentos en un solo llamado
//  Recibe un ARRAY de objetos.
// ============================================================

print("\n--- insertMany: 2 libros más en un solo llamado ---");
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


// ============================================================
//  SECCIÓN 5 — Verificar el contenido de la colección
//  Esperado: 4 documentos.
// ============================================================

print("\n--- Documentos en 'libros' ---");
db.libros.find().forEach(printjson);

print("\n--- Total de documentos ---");
print(db.libros.countDocuments());


// ============================================================
//  SECCIÓN 6 — Diferencia de retorno entre insertOne e insertMany
// ============================================================

print("\n--- Resultado de insertOne (insertedId, singular) ---");
var r1 = db.libros.insertOne({
  codigo: 5,
  nombre: 'El Quijote',
  autor: 'Cervantes',
  editoriales: ['Siglo XXI']
});
printjson(r1);

print("\n--- Resultado de insertMany (insertedIds, plural) ---");
var r2 = db.libros.insertMany([
  { codigo: 6, nombre: 'Rayuela', autor: 'Cortazar' },
  { codigo: 7, nombre: '1984',    autor: 'Orwell'   }
]);
printjson(r2);


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — insertOne
// Sobre la colección 'usuarios' (creala si no existe) insertá UN solo
// documento con los campos { _id, nombre, email, edad }.
// Mostrá el resultado completo de la operación con printjson.
// TU CÓDIGO:
//


// EJERCICIO 2 — insertMany básico
// Sobre 'usuarios' insertá CUATRO documentos en una sola llamada
// usando insertMany. No especifiques _id en ninguno: dejá que MongoDB
// los genere. Después listá todos los documentos.
// TU CÓDIGO:
//


// EJERCICIO 3 — _id explícito mezclado
// Sobre 'usuarios', usando insertMany, insertá tres documentos donde
// SOLO UNO tenga _id explícito (por ejemplo _id: 'usr-especial') y los
// otros dos no. Verificá que MongoDB respeta el _id manual y autogenera
// los otros dos.
// TU CÓDIGO:
//


// EJERCICIO 4 — Carga masiva
// Insertá 50 documentos en una colección 'productos' con la forma
// { codigo, nombre, precio, stock } usando UN solo insertMany
// y un loop que arme el array antes de insertar.
// PISTA:
//   var lote = [];
//   for (var i = 1; i <= 50; i++) { lote.push({ ... }); }
//   db.productos.insertMany(lote);
// TU CÓDIGO:
//


// EJERCICIO 5 — Comparación de eficiencia (reflexión)
// ¿Por qué es más eficiente UN insertMany de 50 documentos que 50
// llamadas a insertOne? ¿Qué tiene que ver el "round trip" cliente/servidor
// con esto?
// TU RESPUESTA:
//


// EJERCICIO 6 — Documentos heterogéneos
// Sobre 'productos' agregá con insertMany dos documentos extra que NO
// sigan exactamente la misma estructura: por ejemplo uno con un campo
// 'categoria' y otro con un array 'tags'. Verificá con find() que
// conviven sin problemas.
// TU CÓDIGO:
//


// EJERCICIO 7 — _id duplicado en insertMany (desafío)
// Intentá hacer un insertMany de 3 documentos donde el SEGUNDO tenga
// un _id que ya exista en la colección. Capturá el error con try/catch.
// ¿Qué pasa con los documentos anteriores y posteriores al que falla?
// (PISTA: por defecto los inserts son "ordered" y se cortan en el primer
// error.)
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
