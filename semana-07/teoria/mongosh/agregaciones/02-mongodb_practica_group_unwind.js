// ============================================================
//  PRÁCTICA MongoDB — Agregación (Parte 2)
//  $group, $unwind, $sortByCount  (+ $sort de repaso)
//  Basado en apuntes UTN Avellaneda — Yanina Scudero
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("02-mongodb_practica_group_unwind.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: 'estudiantes' y 'universities'
// ============================================================

db = db.getSiblingDB('base1');

// 'estudiantes' (idéntica a la del archivo 01, así los resultados son consistentes)
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

// 'universities' (igual a la del PDF, con USAL y otra para enriquecer ejercicios)
db.universities.drop();
db.universities.insertMany([
  {
    country: 'Spain', city: 'Salamanca', name: 'USAL',
    location: { type: 'Point', coordinates: [-5.6722512, 40.9607792] },
    students: [
      { year: 2014, number: 24774 },
      { year: 2015, number: 23166 },
      { year: 2016, number: 21913 },
      { year: 2017, number: 21715 }
    ]
  },
  {
    country: 'Argentina', city: 'Avellaneda', name: 'UTN-FRA',
    location: { type: 'Point', coordinates: [-58.3677, -34.6608] },
    students: [
      { year: 2014, number: 5800 },
      { year: 2015, number: 6100 },
      { year: 2016, number: 6450 },
      { year: 2017, number: 6900 }
    ]
  }
]);


// ============================================================
//  SECCIÓN 2 — $group: contar por programa
// ============================================================

print("\n--- $group: cantidad de estudiantes por programa ---");
db.estudiantes.aggregate([
  { $group: { _id: "$programa", count: { $sum: 1 } } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 3 — $group: con expresión booleana en el _id
// ============================================================

print("\n--- $group: clasificar por menor de 18 (true/false), juntar edades con $push ---");
db.estudiantes.aggregate([
  { $group: {
      _id: { $lt: [ "$edad", 18 ] },
      edades: { $push: { edad: "$edad" } }
  }}
]).forEach(printjson);


// ============================================================
//  SECCIÓN 4 — $group con otros acumuladores
// ============================================================

print("\n--- $group: edad promedio, mínima y máxima por programa ---");
db.estudiantes.aggregate([
  { $group: {
      _id: "$programa",
      edadProm: { $avg: "$edad" },
      edadMin:  { $min: "$edad" },
      edadMax:  { $max: "$edad" },
      cantidad: { $sum: 1 }
  }}
]).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — $unwind: desarmar el array 'students' de USAL
// ============================================================

print("\n--- $unwind sobre 'students' de USAL, ordenado por number DESC ---");
db.universities.aggregate([
  { $match:   { name: 'USAL' } },
  { $unwind:  '$students' },
  { $project: { _id: 0, 'students.year': 1, 'students.number': 1 } },
  { $sort:    { 'students.number': -1 } }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 6 — $sortByCount: ranking
// ============================================================

print("\n--- $sortByCount: ranking de programas por cantidad de estudiantes ---");
db.estudiantes.aggregate([
  { $sortByCount: "$programa" }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 7 — $sort solito (repaso de la Parte 1)
// ============================================================

print("\n--- $sort: estudiantes por nombre DESC ---");
db.estudiantes.aggregate([
  { $sort:    { nombre: -1 } },
  { $project: { _id: 0, nombre: 1 } }
]).forEach(printjson);


// ============================================================
//  EJERCICIOS PROPUESTOS
// ============================================================

// EJERCICIO 1 — $group
// Contar cuántos estudiantes hay por cada apellido distinto.
// (En esta colección todos los apellidos son únicos, pero igualmente
// el resultado es informativo.)
// TU CÓDIGO:
//


// EJERCICIO 2 — $group con $sum
// Calcular la suma TOTAL de las edades de TODOS los estudiantes.
// (Pista: _id: null  agrupa todos en un único grupo.)
// TU CÓDIGO:
//


// EJERCICIO 3 — $group con $avg
// Calcular la edad promedio por programa, mostrando un campo
// "promedioEdad". Ordenar el resultado por promedio DESC.
// TU CÓDIGO:
//


// EJERCICIO 4 — $group con $push
// Para cada programa, listar los nombres de sus estudiantes
// en un array "alumnos".
// TU CÓDIGO:
//


// EJERCICIO 5 — $group con $addToSet
// Listar los programas DISTINTOS que existen en la colección.
// (Pista: _id: null + $addToSet: "$programa".)
// TU CÓDIGO:
//


// EJERCICIO 6 — $unwind
// Sobre 'universities', mostrar para cada universidad un documento
// por cada año, con los campos: name, country, year, number.
// (Pista: $unwind '$students' + $project con alias usando "$students.year"
//  y "$students.number".)
// TU CÓDIGO:
//


// EJERCICIO 7 — $unwind + $match
// Mostrar todos los registros (universidad, año, alumnos) cuyo
// número de alumnos sea mayor a 22000.
// TU CÓDIGO:
//


// EJERCICIO 8 — $unwind + $group
// Calcular el TOTAL de alumnos sumando todos los años de TODAS las
// universidades. Mostrar un solo documento con el campo "totalAlumnos".
// (Pista: $unwind, después $group con _id: null.)
// TU CÓDIGO:
//


// EJERCICIO 9 — $sortByCount
// Hacer un ranking de cuántos estudiantes hay por cada edad
// (cuántos tienen 19, cuántos 22, etc.), ordenado por cantidad DESC.
// TU CÓDIGO:
//


// EJERCICIO 10 — Pipeline combinado
// Para cada programa, mostrar:
//   - el nombre del programa
//   - la cantidad de estudiantes
//   - la edad promedio
// y devolver el resultado ordenado por cantidad DESC.
// TU CÓDIGO:
//


// EJERCICIO 11 — Reflexión
// (a) ¿Qué diferencia hay entre $push y $addToSet?
// (b) ¿Por qué $unwind es necesario para ordenar por un valor que está
//     dentro de un array?
// (c) ¿Qué hace { $group: { _id: null, ... } } y cuándo conviene usarlo?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
