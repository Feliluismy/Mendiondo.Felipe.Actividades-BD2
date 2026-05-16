// Script para insertar departamentos de prueba en MongoDB
// Ejecutar en mongosh
//
// Pensado para los ejercicios de $lookup de la semana 7.
// Se usa en conjunto con data-empleados.js (cargar primero los dos archivos
// y después armar los pipelines de agregación con $lookup).

// Cambiar a la base de datos deseada (opcional)
// use mi_empresa;

// Array de datos de prueba
const departamentos = [
  {
    _id: 1,
    nombre: "RRHH",
    sede: "Buenos Aires",
    presupuesto: 1500000,
    activo: true,
  },
  {
    _id: 2,
    nombre: "Finanzas",
    sede: "Buenos Aires",
    presupuesto: 4200000,
    activo: true,
  },
  {
    _id: 3,
    nombre: "Sistemas",
    sede: "Avellaneda",
    presupuesto: 8500000,
    activo: true,
  },
  {
    _id: 4,
    nombre: "Marketing",
    sede: "Buenos Aires",
    presupuesto: 2800000,
    activo: true,
  },
  {
    _id: 5,
    nombre: "Logística",
    sede: "Avellaneda",
    presupuesto: 3500000,
    activo: true,
  },
  {
    _id: 6,
    nombre: "Atención al Cliente",
    sede: "Córdoba",
    presupuesto: 1900000,
    activo: true,
  },
  {
    _id: 7,
    nombre: "Investigación",
    sede: "Avellaneda",
    presupuesto: 6000000,
    activo: false,
  },
];

// defino el nombre de la coleccion

const name_collection = "departamentos";

// Insertar los documentos en la colección 'departamentos'
try {
  const resultado = db[name_collection].insertMany(departamentos);

  print("=== INSERCIÓN COMPLETADA ===");
  print(`Total de departamentos insertados: ${resultado.insertedIds.length}`);
  print(
    "IDs insertados:",
    JSON.stringify(Object.values(resultado.insertedIds)),
  );

  // Verificar la inserción
  const count = db[name_collection].countDocuments();
  print(`Total de documentos en la colección: ${count}`);

  print("\n=== EJEMPLOS DE CONSULTAS ===");
  print("Para ver todos los departamentos:");
  print(`db.${name_collection}.find().pretty()`);
  print("\nPara buscar por sede:");
  print(`db.${name_collection}.find({sede: "Avellaneda"}).pretty()`);
  print("\nPara buscar departamentos activos:");
  print(`db.${name_collection}.find({activo: true}).pretty()`);
  print("\nEjemplo de $lookup (departamento + empleados):");
  print(
    `db.${name_collection}.aggregate([
       { $lookup: { from: "empleados", localField: "_id",
                    foreignField: "idDepto", as: "empleados" } }
     ])`,
  );
} catch (error) {
  print("Error al insertar los datos:", error);
}
