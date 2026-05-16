// ============================================================
//  PRÁCTICA MongoDB — Eliminación de Índices
//  Basado en apuntes UTN Avellaneda — Páginas 85 a 86
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_indices_eliminacion.js")
// ============================================================


use("base1");


// ============================================================
//  SECCIÓN 1 — Datos de prueba
//  Reusamos la colección 'libros' del apunte.
// ============================================================

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

db.libros.insertOne({
  _id: 3,
  titulo: 'Aprenda PHP',
  autor: 'Mario Molina',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 50,
  cantidad: 20
});

db.libros.insertOne({
  _id: 4,
  titulo: 'Java en 10 minutos',
  editorial: ['Siglo XXI'],
  precio: 45,
  cantidad: 1
});


// ============================================================
//  SECCIÓN 2 — Listar los índices con getIndexes()
//  Al inicio sólo existe el índice automático sobre _id.
// ============================================================

print("\n--- Índices iniciales (solo el de _id) ---");
db.libros.getIndexes();
// Esperado:
// [ { v: 2, key: { _id: 1 }, name: "_id_", ns: "base1.libros" } ]


// ============================================================
//  SECCIÓN 3 — Crear un índice y verlo aparecer
// ============================================================

print("\n--- Creando índice sobre 'autor' ---");
db.libros.createIndex({ autor: 1 });

print("\n--- Índices luego de crear el de 'autor' ---");
db.libros.getIndexes();
// Ahora aparecen DOS:
//   _id_       (sobre _id)
//   autor_1    (sobre autor)


// ============================================================
//  SECCIÓN 4 — Eliminar un índice por NOMBRE
//  dropIndex('<nombre>') usa el name autogenerado.
// ============================================================

print("\n--- Eliminando 'autor_1' por nombre ---");
db.libros.dropIndex('autor_1');
// Esperado: { nIndexesWas: 2, ok: 1 }

print("\n--- Índices luego del dropIndex ---");
db.libros.getIndexes();
// Volvió a estar solo _id_


// ============================================================
//  SECCIÓN 5 — Eliminar un índice por ESPECIFICACIÓN
//  dropIndex({...}) acepta el mismo objeto que createIndex.
// ============================================================

print("\n--- Creando nuevamente índice sobre 'titulo' ---");
db.libros.createIndex({ titulo: 1 });

print("\n--- Índices con 'titulo_1' presente ---");
db.libros.getIndexes();

print("\n--- Eliminando por especificación { titulo: 1 } ---");
db.libros.dropIndex({ titulo: 1 });

print("\n--- Índices luego del dropIndex por spec ---");
db.libros.getIndexes();


// ============================================================
//  SECCIÓN 6 — El índice sobre _id NO se puede eliminar
// ============================================================

print("\n--- Intentando eliminar el índice de _id (debe fallar) ---");
try {
  db.libros.dropIndex('_id_');
} catch (e) {
  print("Error esperado: " + e.message);
}
// MongoDB rechaza la operación porque _id_ es obligatorio.


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — Listar
// Mostrá por consola la lista de índices que tiene actualmente la
// colección 'libros'. ¿Cuántos hay y cómo se llaman?
// TU CÓDIGO:
//


// EJERCICIO 2 — Crear y eliminar por nombre
// Creá un índice sobre 'precio'. Luego usá getIndexes() para averiguar
// el nombre autogenerado y eliminalo con dropIndex(<nombre>).
// TU CÓDIGO:
//


// EJERCICIO 3 — Crear y eliminar por especificación
// Creá un índice sobre 'cantidad'. Sin llamar a getIndexes(), eliminalo
// pasando el mismo objeto que usaste en createIndex.
// TU CÓDIGO:
//


// EJERCICIO 4 — Índice compuesto
// Creá un índice compuesto sobre (autor asc, titulo asc).
// Verificá su nombre autogenerado con getIndexes() y luego eliminalo.
// TU CÓDIGO:
//


// EJERCICIO 5 — Limpieza total (excepto _id_)
// Creá tres índices distintos sobre 'libros': uno simple, uno compuesto
// y uno sobre el array 'editorial'. Luego escribí un bloque que recorra
// el resultado de getIndexes() y elimine TODOS los índices excepto el
// índice obligatorio sobre _id.
// PISTA: podés iterar getIndexes() y filtrar los que tengan
// name !== "_id_".
// TU CÓDIGO:
//


// EJERCICIO 6 — Reflexión
// ¿Qué pasa si la app está usando un índice y lo eliminás en producción?
// ¿Qué herramienta vista en unidades anteriores usarías para confirmar
// que un índice se usa antes de eliminarlo?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
