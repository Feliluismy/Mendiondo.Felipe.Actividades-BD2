// ============================================================
//  PRÁCTICA MongoDB — Agregación (Parte 1): Pipeline básico
//  $match, $count, $project, $sort, $limit, $skip
//  Basado en apuntes UTN Avellaneda — Yanina Scudero
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("01-mongodb_practica_pipeline_basico.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: 'estudiantes'
// ============================================================

db = db.getSiblingDB('base1');
db.estudiantes.drop();

db.estudiantes.insertMany([
  { _id: 1,  nombre: 'Juan',     apellido: 'Perez',     edad: 19, programa: 'Tecnicatura' },
  { _id: 2,  nombre: 'Ana',      apellido: 'Lopez',     edad: 17, programa: 'Tecnicatura' },
  { _id: 3,  nombre: 'Pedro',    apellido: 'Gomez',     edad: 22, programa: 'Ingenieria'  },
  { _id: 4,  nombre: 'Maria',    apellido: 'Diaz',      edad: 25, programa: 'Ingenieria'  },
  { _id: 5,  nombre: 'Carla',    apellido: 'Suarez',    edad: 18, programa: 'Tecnicatura' },
  { _id: 6,  nombre: 'Felipe',   apellido: 'Romero',    edad: 30, programa: 'Posgrado'    },
  { _id: 7,  nombre: 'Lucia',    apellido: 'Fernandez', edad: 21, programa: 'Ingenieria'  },
  { _id: 8,  nombre: 'Joaquin',  apellido: 'Gimenez',   edad: 16, programa: 'Tecnicatura' },
  { _id: 9,  nombre: 'Sofia',    apellido: 'Vega',      edad: 28, programa: 'Posgrado'    },
  { _id: 10, nombre: 'Tomas',    apellido: 'Acosta',    edad: 19, programa: 'Tecnicatura' }
]);


// ============================================================
//  SECCIÓN 2 — $match: filtrar documentos
// ============================================================

print("\n--- $match: estudiantes cuyo nombre es 'Juan' ---");
db.estudiantes.aggregate([
  { $match: { nombre: 'Juan' } }
]).forEach(printjson);

print("\n--- $match con operador: edad < 20 ---");
db.estudiantes.aggregate([
  { $match: { edad: { $lt: 20 } } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 3 — $count: contar documentos en la etapa
// ============================================================

print("\n--- $count: cuántos estudiantes hay en total ---");
db.estudiantes.aggregate([
  { $count: "totalEstudiantes" }
]).forEach(printjson);

print("\n--- $match + $count: cuántos estudiantes son menores a 20 años ---");
db.estudiantes.aggregate([
  { $match: { edad: { $lt: 20 } } },
  { $count: "Estudiantes menores a 20 años" }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 4 — $project: inclusión / exclusión de campos
// ============================================================

print("\n--- $project: sólo nombre (ocultando _id) ---");
db.estudiantes.aggregate([
  { $project: { nombre: 1, _id: 0 } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — $project: alias para los campos
// ============================================================

print("\n--- $project: alias Nom y Ape ---");
db.estudiantes.aggregate([
  { $project: { _id: 0, Nom: "$nombre", Ape: "$apellido" } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 6 — $project: operador de string $concat
// ============================================================

print("\n--- $project: nombre_Completo = nombre + ' ' + apellido ---");
db.estudiantes.aggregate([
  { $project: {
      _id: 0,
      nombre_Completo: { $concat: [ "$nombre", " ", "$apellido" ] }
  }}
]).forEach(printjson);


// ============================================================
//  SECCIÓN 7 — $sort: ordenar
// ============================================================

print("\n--- $sort: ordenado por edad ASC ---");
db.estudiantes.aggregate([
  { $project: { nombre: 1, edad: 1, _id: 0 } },
  { $sort:    { edad: 1 } }
]).forEach(printjson);

print("\n--- $sort: ordenado por edad DESC ---");
db.estudiantes.aggregate([
  { $project: { nombre: 1, edad: 1, _id: 0 } },
  { $sort:    { edad: -1 } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 8 — $limit: limitar el resultado
// ============================================================

print("\n--- $limit: 3 más jóvenes ---");
db.estudiantes.aggregate([
  { $project: { nombre: 1, edad: 1, _id: 0 } },
  { $sort:    { edad: 1 } },
  { $limit:   3 }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 9 — $skip: saltar documentos (paginación)
// ============================================================

print("\n--- $skip(2) + $limit(3): página 'del medio' ordenada por edad ---");
db.estudiantes.aggregate([
  { $project: { nombre: 1, edad: 1, _id: 0 } },
  { $sort:    { edad: 1 } },
  { $skip:    2 },
  { $limit:   3 }
]).forEach(printjson);


// ============================================================
//  EJERCICIOS PROPUESTOS
//  Resolvelos aplicando la teoría leída.
// ============================================================

// EJERCICIO 1 — $match
// Mostrar todos los estudiantes que cursen 'Ingenieria'.
// TU CÓDIGO:
//


// EJERCICIO 2 — $count
// ¿Cuántos estudiantes son mayores o iguales a 21 años?
// (Pista: $match + $count.)
// TU CÓDIGO:
//


// EJERCICIO 3 — $project con inclusión
// Mostrar SÓLO el nombre y el programa de cada estudiante,
// sin el _id.
// TU CÓDIGO:
//


// EJERCICIO 4 — $project con alias
// Mostrar cada estudiante con los campos:
//   "Estudiante" (= nombre)
//   "Carrera"    (= programa)
// y sin el _id.
// TU CÓDIGO:
//


// EJERCICIO 5 — $project con $concat
// Mostrar un campo "nombreCompleto" igual a "Apellido, Nombre"
// (con la coma y el espacio).
// (Pista: $concat: [ "$apellido", ", ", "$nombre" ].)
// TU CÓDIGO:
//


// EJERCICIO 6 — $sort
// Mostrar todos los estudiantes ordenados por apellido ASC.
// TU CÓDIGO:
//


// EJERCICIO 7 — $sort descendente
// Mostrar los estudiantes ordenados por edad DESC, mostrando
// nombre y edad solamente.
// TU CÓDIGO:
//


// EJERCICIO 8 — $limit
// Mostrar SÓLO al estudiante más viejo (1 documento, ordenado por edad DESC).
// TU CÓDIGO:
//


// EJERCICIO 9 — Paginación
// Implementar una "página 2" de tamaño 3 sobre los estudiantes
// ordenados por nombre ASC. Mostrar nombre y edad únicamente.
// (Pista: $sort + $skip(3) + $limit(3).)
// TU CÓDIGO:
//


// EJERCICIO 10 — Pipeline combinado
// De los estudiantes de 'Tecnicatura', mostrar los 2 más jóvenes,
// con el campo "nombreCompleto" (nombre + ' ' + apellido) y la edad.
// (Pista: $match → $sort → $limit → $project con $concat.)
// TU CÓDIGO:
//


// EJERCICIO 11 — Reflexión
// (a) ¿Por qué es buena práctica poner $match al principio de la tubería?
// (b) ¿Cuál es la diferencia entre poner $count antes y después de un $match?
// (c) ¿Qué pasaría si invertimos el orden de $skip y $sort?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
