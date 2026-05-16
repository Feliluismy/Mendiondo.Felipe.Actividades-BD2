// Script para insertar universidades de prueba en MongoDB
// Ejecutar en mongosh:
//   load("data-universities.js")
//
// Pensado para el ejemplo de $unwind de la teoría de agregaciones (Parte 2):
//   semana-07/teoria/mongosh/agregaciones/02-mongodb_teoria_group_unwind.md
//
// Cada universidad tiene un array `students` con un documento por año
// (cantidad de alumnos en ese año). El primer documento (USAL de Salamanca)
// reproduce exactamente el ejemplo del PDF; los otros dos amplían el dataset
// para que se pueda comparar el resultado de $unwind con varias universidades.

const universities = [
  {
    _id: 1,
    country: "Spain",
    city: "Salamanca",
    name: "USAL",
    students: [
      { year: 2014, number: 24774 },
      { year: 2015, number: 23166 },
      { year: 2016, number: 21913 },
      { year: 2017, number: 21715 },
    ],
  },
  {
    _id: 2,
    country: "Argentina",
    city: "Buenos Aires",
    name: "UBA",
    students: [
      { year: 2014, number: 320000 },
      { year: 2015, number: 325000 },
      { year: 2016, number: 332000 },
      { year: 2017, number: 340000 },
    ],
  },
  {
    _id: 3,
    country: "Argentina",
    city: "Avellaneda",
    name: "UTN-FRA",
    students: [
      { year: 2014, number: 5800 },
      { year: 2015, number: 6100 },
      { year: 2016, number: 6450 },
      { year: 2017, number: 6700 },
    ],
  },
];

const name_collection = "universities";

try {
  db[name_collection].drop();
  const resultado = db[name_collection].insertMany(universities);

  print("=== INSERCIÓN COMPLETADA ===");
  print(`Total de universidades insertadas: ${resultado.insertedIds.length}`);

  const count = db[name_collection].countDocuments();
  print(`Total de documentos en la colección: ${count}`);

  print("\n=== EJEMPLO DEL PDF — $unwind sobre USAL ===");
  print(`db.${name_collection}.aggregate([`);
  print(`  { $match:   { name: 'USAL' } },`);
  print(`  { $unwind:  '$students' },`);
  print(`  { $project: { _id: 0, 'students.year': 1, 'students.number': 1 } },`);
  print(`  { $sort:    { 'students.number': -1 } }`);
  print(`])`);
} catch (error) {
  print("Error al insertar los datos:", error);
}
