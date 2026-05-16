// Script para insertar estudiantes de prueba en MongoDB
// Ejecutar en mongosh:
//   load("data-estudiantes.js")
//
// Pensado para las teorías de la semana 7:
//   - teoria/mongosh/group/mongodb_teoria_group.md           (campos: nombre, edad, curso)
//   - teoria/mongosh/expresiones.regulares/...               (campo:  nombre — ejemplos /^Jo/, /a$/, /li/, /li/i)
//   - teoria/mongosh/agregaciones/01-pipeline_basico.md      (campos: nombre, apellido, edad)
//   - teoria/mongosh/agregaciones/02-group_unwind.md         (campo:  programa)
//
// Los 4 primeros documentos son exactamente los del PDF de Yanina Scudero
// usado en la teoría de $group. Los demás amplían el dataset para que también
// sirvan los ejemplos de regex (nombres con "Jo", terminados en "a", con "li",
// con "M", etc.) y los ejemplos de agregación por programa.

const estudiantes = [
  { _id: 1,  nombre: "Ana",      apellido: "Pérez",   edad: 17, curso: "A", programa: "Tecnicatura" },
  { _id: 2,  nombre: "Juan",     apellido: "Gomez",   edad: 18, curso: "A", programa: "Tecnicatura" },
  { _id: 3,  nombre: "Luis",     apellido: "Sosa",    edad: 17, curso: "B", programa: "Ingenieria" },
  { _id: 4,  nombre: "Maria",    apellido: "Lopez",   edad: 19, curso: "B", programa: "Posgrado"    },
  { _id: 5,  nombre: "Jose",     apellido: "Diaz",    edad: 22, curso: "C", programa: "Tecnicatura" },
  { _id: 6,  nombre: "Joaquina", apellido: "Vega",    edad: 24, curso: "B", programa: "Posgrado"    },
  { _id: 7,  nombre: "Joana",    apellido: "Riva",    edad: 19, curso: "A", programa: "Ingenieria" },
  { _id: 8,  nombre: "Felipe",   apellido: "Lima",    edad: 20, curso: "A", programa: "Tecnicatura" },
  { _id: 9,  nombre: "Carolina", apellido: "Molina",  edad: 23, curso: "C", programa: "Ingenieria" },
  { _id: 10, nombre: "Lila",     apellido: "Cortes",  edad: 19, curso: "B", programa: "Tecnicatura" },
  { _id: 11, nombre: "Camila",   apellido: "Romero",  edad: 21, curso: "A", programa: "Ingenieria" },
  { _id: 12, nombre: "Martin",   apellido: "Ramos",   edad: 25, curso: "C", programa: "Posgrado"    },
];

const name_collection = "estudiantes";

try {
  db[name_collection].drop();
  const resultado = db[name_collection].insertMany(estudiantes);

  print("=== INSERCIÓN COMPLETADA ===");
  print(`Total de estudiantes insertados: ${resultado.insertedIds.length}`);
  print(
    "IDs insertados:",
    JSON.stringify(Object.values(resultado.insertedIds)),
  );

  const count = db[name_collection].countDocuments();
  print(`Total de documentos en la colección: ${count}`);

  print("\n=== EJEMPLOS DE CONSULTAS ===");
  print("Cantidad por curso ($group):");
  print(`db.${name_collection}.aggregate([{ $group: { _id: "$curso", n: { $sum: 1 } } }])`);
  print("\nNombres que empiezan con 'Jo' (regex):");
  print(`db.${name_collection}.find({ nombre: /^Jo/ })`);
  print("\nNombres que terminan con 'a' (regex):");
  print(`db.${name_collection}.find({ nombre: /a$/ })`);
  print("\nRanking de programas ($sortByCount):");
  print(`db.${name_collection}.aggregate([{ $sortByCount: "$programa" }])`);
} catch (error) {
  print("Error al insertar los datos:", error);
}
