// ============================================================
//  PRÁCTICA MongoDB — Campo _id y clase ObjectId
//  Basado en apuntes UTN Avellaneda — Páginas 61 a 63
// ============================================================
// Para ejecutar: abrí mongosh y corré: load("practica_objectid.js")
// ============================================================


// ------------------------------------------------------------
// SECCIÓN 1: _id definido manualmente (comportamiento conocido)
// ------------------------------------------------------------

use("base1");
db.libros.drop();

db.libros.insertOne({ _id: 1, titulo: 'El aleph',     autor: 'Borges',         precio: 20 });
db.libros.insertOne({ _id: 2, titulo: 'Martin Fierro', autor: 'Jose Hernandez', precio: 50 });

print("\n--- Libros con _id manual ---");
db.libros.find().pretty();
// Resultado esperado: _id: 1 y _id: 2 tal como los definimos.


// ------------------------------------------------------------
// SECCIÓN 2: _id generado automáticamente por MongoDB (ObjectId)
// ------------------------------------------------------------

db.libros.drop();

db.libros.insertOne({
  titulo: 'El aleph',
  autor: 'Borges',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
});
db.libros.insertOne({
  titulo: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editorial: ['Siglo XXI'],
  precio: 50,
  cantidad: 12
});

print("\n--- Libros con _id automático (ObjectId) ---");
db.libros.find().pretty();
// Observá que el _id ahora tiene la forma: ObjectId("...")
// Cada vez que ejecutes el script, los valores de ObjectId serán distintos.


// ------------------------------------------------------------
// EXPERIMENTO 1: Ordenamiento cronológico por _id
// Al ordenar por _id los documentos quedan ordenados
// según el momento de inserción (los primeros 4 bytes del ObjectId
// son un timestamp Unix).
// ------------------------------------------------------------

print("\n--- Documentos ordenados por _id (= orden de inserción) ---");
db.libros.find().sort({ _id: 1 }).pretty();
// 1 = ascendente (más antiguo primero)
// -1 = descendente (más reciente primero)


// ------------------------------------------------------------
// EXPERIMENTO 2: Filtrar por _id generado automáticamente
// Para buscar por ObjectId hay que envolver el valor en ObjectId()
// ------------------------------------------------------------

// Paso 1: obtener el _id del primer documento
const primerDoc = db.libros.findOne();
print("\n--- _id del primer documento ---");
print(primerDoc._id);

// Paso 2: usarlo para buscar ese documento puntualmente
print("\n--- Búsqueda por ObjectId ---");
db.libros.find({ _id: primerDoc._id }).pretty();

// También se puede buscar pasando el string directamente:
// db.libros.find({ _id: ObjectId("PEGAR_AQUI_EL_OBJECTID_STRING") })


// ------------------------------------------------------------
// EXPERIMENTO 3: Intentar insertar un _id duplicado (genera error)
// Descomentá las líneas para verlo en acción.
// ------------------------------------------------------------

// db.libros.insertOne({ _id: primerDoc._id, titulo: 'Duplicado intencional' });
// Error esperado: E11000 duplicate key error


// ============================================================
//  PREGUNTAS DE REFLEXIÓN — Respondé en los comentarios
// ============================================================

// PREGUNTA 1:
// ¿Cuántos bytes ocupa un ObjectId? ¿Qué representa cada segmento?
// TU RESPUESTA:
//


// PREGUNTA 2:
// ¿Por qué MongoDB no usa un número autoincremental como _id por defecto?
// ¿Qué problema generaría en un entorno con múltiples servidores?
// TU RESPUESTA:
//


// PREGUNTA 3:
// Si insertás dos documentos en el mismo segundo desde el mismo proceso,
// ¿qué parte del ObjectId asegura que sus _id sean distintos?
// TU RESPUESTA:
//


// PREGUNTA 4:
// Ejecutá db.libros.find().sort({_id:1}) y db.libros.find().sort({_id:-1}).
// ¿En qué orden aparecen los documentos en cada caso? ¿Por qué?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
