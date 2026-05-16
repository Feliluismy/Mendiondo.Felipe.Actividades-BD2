// ============================================================
//  PRÁCTICA MongoDB — Índices
//  Basado en apuntes UTN Avellaneda — Páginas 70 a 71
// ============================================================
// Para ejecutar: abrí mongosh y corré: load("practica_indices.js")
//
// Este capítulo es conceptual. Los experimentos de este script
// permiten OBSERVAR el comportamiento de los índices en la práctica.
// ============================================================

use("base1");
db.libros.find({
  $or: [{ precio: { $gte: 500 } }, { titulo: "Terra Nostra" }],
});
// Sin índices, MongoDB debe revisar cada documento para ver si cumple la condición.
// Esto se llama "COLLSCAN" (Collection Scan) y es ineficiente para grandes colecciones.

// ------------------------------------------------------------
// SECCIÓN 1: Ver el índice automático sobre _id
// MongoDB siempre crea este índice, no puede eliminarse.
// ------------------------------------------------------------

db.libros.drop();
db.libros.insertOne({
  _id: 1,
  titulo: "El aleph",
  autor: "Borges",
  precio: 20,
});
db.libros.insertOne({
  _id: 2,
  titulo: "Martin Fierro",
  autor: "Jose Hernandez",
  precio: 50,
});
db.libros.insertOne({
  _id: 3,
  titulo: "Aprenda PHP",
  autor: "Mario Molina",
  precio: 50,
});

print("\n--- Índices actuales de la colección 'libros' ---");
db.libros.getIndexes();
// Resultado esperado: solo el índice sobre _id
// { "key": { "_id": 1 }, "name": "_id_" }

// ------------------------------------------------------------
// SECCIÓN 2: Crear un índice sobre el campo "autor"
// Útil si la app hace muchas consultas filtrando por autor.
// ------------------------------------------------------------

print("\n--- Creando índice sobre el campo 'autor' ---");
db.libros.createIndex({ autor: 1 });
// 1 = índice ascendente (A → Z)
// -1 = índice descendente (Z → A)

print("\n--- Índices luego de crear el índice sobre 'autor' ---");
db.libros.getIndexes();
// Ahora deberían aparecer dos índices: _id y autor

// ------------------------------------------------------------
// SECCIÓN 3: Usar explain() para ver si MongoDB usa el índice
// explain("executionStats") muestra el plan de ejecución de la consulta.
// ------------------------------------------------------------

print("\n--- Plan de ejecución SIN índice (sobre precio, no indexado) ---");
db.libros.find({ precio: 50 }).explain("queryPlanner");
// Buscá en el resultado:
//   "stage": "COLLSCAN"   → recorrido secuencial (sin índice)
//   "totalDocsExamined"   → cuántos documentos se revisaron

print("\n--- Plan de ejecución CON índice (sobre autor, indexado) ---");
db.libros.find({ autor: "Borges" }).explain("executionStats");
// Buscá en el resultado:
//   "stage": "IXSCAN"     → recorrido por índice (con índice) ✓
//   "totalDocsExamined"   → debería ser menor que COLLSCAN

// ------------------------------------------------------------
// SECCIÓN 4: Crear un índice único
// Impide valores duplicados en ese campo (similar a UNIQUE en SQL).
// ------------------------------------------------------------

db.usuarios.drop();
db.usuarios.insertOne({ _id: 1, email: "ana@mail.com", nombre: "Ana" });
db.usuarios.insertOne({ _id: 2, email: "carlos@mail.com", nombre: "Carlos" });

// Crear índice único sobre email
db.usuarios.createIndex({ email: 1 }, { unique: true });

print("\n--- Intentando insertar email duplicado (debe fallar) ---");
try {
  db.usuarios.insertOne({ _id: 3, email: "ana@mail.com", nombre: "Otra Ana" });
} catch (e) {
  print("Error esperado: " + e.message);
  // Error: E11000 duplicate key error — el índice único lo rechaza
}

// ------------------------------------------------------------
// SECCIÓN 5: Eliminar un índice
// ------------------------------------------------------------

print("\n--- Eliminando el índice sobre 'autor' ---");
db.libros.dropIndex({ autor: 1 });

print("\n--- Índices después de eliminar el de 'autor' ---");
db.libros.getIndexes();
// Solo debería quedar el índice sobre _id

// ============================================================
//  PREGUNTAS DE REFLEXIÓN — Respondé en los comentarios
// ============================================================

// PREGUNTA 1:
// ¿Qué diferencia hay entre un "COLLSCAN" y un "IXSCAN"
// en el resultado de explain()? ¿Cuál es más eficiente y por qué?
// TU RESPUESTA:
//

// PREGUNTA 2:
// Tenés una colección de 2 millones de productos con campos:
// nombre, categoria, precio, stock, fechaCreacion.
// La app hace el 80% de sus búsquedas filtrando por "categoria".
// ¿Crearías un índice? ¿Sobre qué campo? Justificá.
// TU RESPUESTA:
//

// PREGUNTA 3:
// ¿Por qué MongoDB NO usa un índice numérico autoincremental
// en lugar del ObjectId para el _id?
// (Pista: recordá el capítulo 18 sobre entornos distribuidos)
// TU RESPUESTA:
//

// PREGUNTA 4:
// Si una colección recibe 10.000 inserciones por segundo,
// ¿es buena idea tener muchos índices? ¿Qué desventaja aparece?
// TU RESPUESTA:
//

// ============================================================
//  FIN DEL SCRIPT
// ============================================================
