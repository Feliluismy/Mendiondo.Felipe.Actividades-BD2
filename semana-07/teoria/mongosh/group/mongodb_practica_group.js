// ============================================================
//  PRÁCTICA MongoDB — $group paso a paso
//  Basado en apuntes UTN Avellaneda — Yanina Scudero
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_group.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: 'estudiantes' (los 4 documentos del PDF)
// ============================================================

db = db.getSiblingDB('base1');
db.estudiantes.drop();

db.estudiantes.insertMany([
  { nombre: "Ana",   edad: 17, curso: "A" },
  { nombre: "Juan",  edad: 18, curso: "A" },
  { nombre: "Luis",  edad: 17, curso: "B" },
  { nombre: "Maria", edad: 19, curso: "B" }
]);


// ============================================================
//  SECCIÓN 2 — Ejemplo 1: agrupar por edad y CONTAR
// ============================================================

print("\n--- Ejemplo 1: agrupar por edad y contar cuántos hay ---");
db.estudiantes.aggregate([
  {
    $group: {
      _id: "$edad",
      cantidad: { $sum: 1 }
    }
  }
]).forEach(printjson);
// Esperado:
//   { _id: 17, cantidad: 2 }
//   { _id: 18, cantidad: 1 }
//   { _id: 19, cantidad: 1 }


// ============================================================
//  SECCIÓN 3 — Ejemplo 2: agrupar por curso y LISTAR los nombres
// ============================================================

print("\n--- Ejemplo 2: agrupar por curso, juntar nombres en un array ---");
db.estudiantes.aggregate([
  {
    $group: {
      _id: "$curso",
      alumnos: { $push: "$nombre" }
    }
  }
]).forEach(printjson);
// Esperado:
//   { _id: "A", alumnos: ["Ana", "Juan"] }
//   { _id: "B", alumnos: ["Luis", "Maria"] }


// ============================================================
//  SECCIÓN 4 — Ejemplo 3: agrupar menores y mayores de 18
//  El _id es el resultado de una EXPRESIÓN (true/false)
// ============================================================

print("\n--- Ejemplo 3: agrupar por (edad < 18) ---");
db.estudiantes.aggregate([
  {
    $group: {
      _id: { $lt: ["$edad", 18] },
      estudiantes: {
        $push: { nombre: "$nombre", edad: "$edad" }
      }
    }
  }
]).forEach(printjson);
// Esperado:
//   { _id: true,  estudiantes: [ {Ana,17}, {Luis,17} ] }
//   { _id: false, estudiantes: [ {Juan,18}, {Maria,19} ] }


// ============================================================
//  SECCIÓN 5 — Por qué el "$": literal vs valor del campo
// ============================================================

print("\n--- Con '$edad' (CON $): agrupa por el VALOR del campo ---");
db.estudiantes.aggregate([
  { $group: { _id: "$edad", cantidad: { $sum: 1 } } }
]).forEach(printjson);
// Hay 3 grupos (uno por cada edad distinta).

print("\n--- Con 'edad' (SIN $): el _id es el STRING literal 'edad' ---");
db.estudiantes.aggregate([
  { $group: { _id: "edad", cantidad: { $sum: 1 } } }
]).forEach(printjson);
// Hay 1 solo grupo: { _id: "edad", cantidad: 4 }
// Porque MongoDB nunca leyó el campo: tomó la cadena tal cual.


// ============================================================
//  SECCIÓN 6 — Operadores extra: $avg, $min, $max
// ============================================================

print("\n--- Por curso: edad promedio, mínima y máxima ---");
db.estudiantes.aggregate([
  {
    $group: {
      _id: "$curso",
      edadProm: { $avg: "$edad" },
      edadMin:  { $min: "$edad" },
      edadMax:  { $max: "$edad" },
      cantidad: { $sum: 1 }
    }
  }
]).forEach(printjson);


// ============================================================
//  SECCIÓN 7 — _id: null  → totalizar TODO en un solo grupo
// ============================================================

print("\n--- _id: null  : promedio de edad de TODOS los estudiantes ---");
db.estudiantes.aggregate([
  {
    $group: {
      _id: null,
      promedioGeneral: { $avg: "$edad" },
      total: { $sum: 1 }
    }
  }
]).forEach(printjson);


// ============================================================
//  EJERCICIOS PROPUESTOS
//  Resolvelos aplicando lo visto en la teoría.
// ============================================================

// EJERCICIO 1
// Agrupar a los estudiantes por CURSO y contar cuántos hay en cada uno.
// (Pista: $group con _id: "$curso" y { $sum: 1 }.)
// TU CÓDIGO:
//


// EJERCICIO 2
// Agrupar por EDAD y guardar los NOMBRES de los estudiantes de cada edad
// en un array "alumnos".
// TU CÓDIGO:
//


// EJERCICIO 3
// Calcular la SUMA total de las edades de todos los estudiantes
// (un solo número como resultado).
// (Pista: _id: null  +  { $sum: "$edad" }.)
// TU CÓDIGO:
//


// EJERCICIO 4
// Para cada CURSO, mostrar la edad PROMEDIO de sus alumnos.
// El campo calculado debe llamarse "promedioEdad".
// TU CÓDIGO:
//


// EJERCICIO 5
// Para cada CURSO, mostrar la edad MÍNIMA y la edad MÁXIMA.
// (Pista: $min y $max sobre "$edad".)
// TU CÓDIGO:
//


// EJERCICIO 6
// Agrupar por la condición "es mayor o igual a 18".
// El _id debe ser true o false. Para cada grupo guardar la cantidad
// de estudiantes y la lista de nombres.
// (Pista: _id: { $gte: ["$edad", 18] } )
// TU CÓDIGO:
//


// EJERCICIO 7 — Atrapamoscas del "$"
// (a) Escribí un $group que use _id: "curso"  (SIN el "$") y observá
//     cuántos grupos resultan. Explicá por qué.
// (b) Escribí ahora _id: "$curso"  (CON el "$") y compará el resultado.
// TU CÓDIGO Y RESPUESTA:
//


// EJERCICIO 8 — Totales generales
// En UN SOLO pipeline calcular y mostrar:
//   - cantidad total de estudiantes
//   - edad promedio
//   - edad mínima
//   - edad máxima
// (Pista: _id: null  +  varios campos calculados.)
// TU CÓDIGO:
//


// EJERCICIO 9
// Agregá nuevos estudiantes a la colección y comprobá que tus resultados
// del Ejercicio 1 cambian:
//
//   db.estudiantes.insertMany([
//     { nombre: "Pablo",  edad: 20, curso: "A" },
//     { nombre: "Sofia",  edad: 17, curso: "C" },
//     { nombre: "Carlos", edad: 18, curso: "B" }
//   ]);
//
// TU CÓDIGO (volvé a correr el Ejercicio 1 y verificá):
//


// EJERCICIO 10 — Reflexión
// (a) ¿Por qué $group SIEMPRE necesita _id?
// (b) ¿Qué diferencia hay entre $sum: 1 y $sum: "$edad"?
// (c) ¿Cuándo usarías $push y cuándo $addToSet?
//     (Pista: probá agregar un estudiante repetido y compará.)
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
