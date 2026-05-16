// ============================================================
//  PRÁCTICA MongoDB — find con filtros básicos
//  Basado en apuntes UTN Avellaneda — Páginas 12 a 14
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_find_filtros_basicos.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: base 'base1' y la colección 'libros' del PDF
// ============================================================

db = db.getSiblingDB('base1');
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
//  SECCIÓN 2 — find() sin filtro: devuelve TODO
// ============================================================

print("\n--- find() sin filtro: 4 documentos ---");
db.libros.find().forEach(printjson);


// ============================================================
//  SECCIÓN 3 — Filtro por _id (clave primaria)
// ============================================================

print("\n--- find({ _id: 1 }) ---");
db.libros.find({ _id: 1 }).forEach(printjson);

print("\n--- find({ _id: 999 }): _id que no existe → nada ---");
print("Total:", db.libros.find({ _id: 999 }).count());   // 0


// ============================================================
//  SECCIÓN 4 — Filtro por otro campo
//  Puede devolver MÁS de un documento.
// ============================================================

print("\n--- find({ precio: 50 }): debería traer 2 libros ---");
db.libros.find({ precio: 50 }).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — AND implícito con varios campos
// ============================================================

print("\n--- find({ precio: 50, cantidad: 20 }): solo Aprenda PHP ---");
db.libros.find({ precio: 50, cantidad: 20 }).forEach(printjson);


// ============================================================
//  SECCIÓN 6 — Detalles: case-sensitive y type-sensitive
// ============================================================

print("\n--- find({ autor: 'Borges' }) → encuentra ---");
db.libros.find({ autor: 'Borges' }).forEach(printjson);

print("\n--- find({ autor: 'borges' }) → vacio (case-sensitive) ---");
print("Total:", db.libros.find({ autor: 'borges' }).count());

print("\n--- find({ precio: 50 }) → encuentra ---");
print("Total:", db.libros.find({ precio: 50 }).count());

print("\n--- find({ precio: '50' }) → vacio (string vs numero) ---");
print("Total:", db.libros.find({ precio: '50' }).count());


// ============================================================
//  SECCIÓN 7 — Pertenencia en array: igualdad sobre un campo array
// ============================================================

print("\n--- find({ editorial: 'Planeta' }): libros que tienen Planeta dentro del array ---");
db.libros.find({ editorial: 'Planeta' }).forEach(printjson);
// _id: 1 (El aleph) y _id: 3 (Aprenda PHP)


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — Por _id
// Recuperá el libro cuyo _id sea 4.
// TU CÓDIGO:
//


// EJERCICIO 2 — Por autor
// Recuperá todos los libros del autor 'Mario Molina'.
// TU CÓDIGO:
//


// EJERCICIO 3 — Por precio puntual
// Recuperá los libros que cuestan exactamente 45.
// TU CÓDIGO:
//


// EJERCICIO 4 — AND de dos campos
// Recuperá los libros con precio 50 Y cantidad menor que la del 'Aprenda PHP'.
// (Pista: esta unidad solo cubre igualdad. Probá primero con cantidad: 12.)
// TU CÓDIGO:
//


// EJERCICIO 5 — Sin coincidencia
// Hacé una consulta que NO devuelva ningún documento (por ejemplo
// autor 'Cervantes', que no está en la colección). Verificá con count()
// que el resultado es 0.
// TU CÓDIGO:
//


// EJERCICIO 6 — Pertenencia en array
// Encontrá todos los libros publicados por 'Siglo XXI'.
// ¿Cuántos son? ¿Por qué da ese número?
// TU CÓDIGO:
//


// EJERCICIO 7 — Igualdad exacta de array
// Encontrá los libros cuyo campo editorial sea EXACTAMENTE
// el array ['Siglo XXI'] (sin más editoriales).
// (Pista: db.libros.find({ editorial: ['Siglo XXI'] }))
// ¿Qué diferencia hay con el ejercicio 6?
// TU CÓDIGO:
//


// EJERCICIO 8 — Reflexión (case y tipo)
// (a) ¿Por qué find({ autor: 'borges' }) no devuelve nada?
// (b) ¿Por qué find({ precio: '50' }) no devuelve nada?
// (c) Si la app permite búsqueda libre por nombre, ¿qué cuidados hay
//     que tener para no perder coincidencias?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
