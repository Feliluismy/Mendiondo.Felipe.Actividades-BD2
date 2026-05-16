// Script para insertar 25 empleados de prueba en MongoDB
// Ejecutar en mongosh
//
// Pensado para los ejercicios de $lookup de la semana 7.
// Se usa en conjunto con data-departamentos.js (cargar primero los dos
// archivos y después armar los pipelines de agregación con $lookup).
//
// El campo `idDepto` referencia al `_id` de la colección `departamentos`.
// Hay un empleado con idDepto: 99 (departamento inexistente) y un departamento
// (id 7 — "Investigación") sin empleados, para ejercicios de matching parcial.

// Cambiar a la base de datos deseada (opcional)
// use mi_empresa;

// Array de datos de prueba
const empleados = [
  {
    _id: 1,
    nombre: "Juan",
    apellido: "Pérez",
    edad: 34,
    sueldo: 850000,
    idDepto: 1,
    fecha_ingreso: 2018,
    skills: ["liderazgo", "selección", "capacitación"],
    activo: true,
  },
  {
    _id: 2,
    nombre: "Ana",
    apellido: "López",
    edad: 29,
    sueldo: 720000,
    idDepto: 1,
    fecha_ingreso: 2020,
    skills: ["onboarding", "comunicación"],
    activo: true,
  },
  {
    _id: 3,
    nombre: "Pedro",
    apellido: "Gómez",
    edad: 41,
    sueldo: 1200000,
    idDepto: 2,
    fecha_ingreso: 2015,
    skills: ["contabilidad", "auditoría", "Excel"],
    activo: true,
  },
  {
    _id: 4,
    nombre: "María",
    apellido: "Díaz",
    edad: 38,
    sueldo: 1100000,
    idDepto: 2,
    fecha_ingreso: 2017,
    skills: ["finanzas", "presupuesto"],
    activo: true,
  },
  {
    _id: 5,
    nombre: "Carla",
    apellido: "Suárez",
    edad: 26,
    sueldo: 680000,
    idDepto: 2,
    fecha_ingreso: 2022,
    skills: ["Excel", "SAP"],
    activo: true,
  },
  {
    _id: 6,
    nombre: "Felipe",
    apellido: "Romero",
    edad: 32,
    sueldo: 1350000,
    idDepto: 3,
    fecha_ingreso: 2019,
    skills: ["JavaScript", "Node.js", "MongoDB"],
    activo: true,
  },
  {
    _id: 7,
    nombre: "Lucía",
    apellido: "Fernández",
    edad: 28,
    sueldo: 1250000,
    idDepto: 3,
    fecha_ingreso: 2021,
    skills: ["Python", "SQL", "Docker"],
    activo: true,
  },
  {
    _id: 8,
    nombre: "Joaquín",
    apellido: "Giménez",
    edad: 24,
    sueldo: 950000,
    idDepto: 3,
    fecha_ingreso: 2023,
    skills: ["React", "TypeScript"],
    activo: true,
  },
  {
    _id: 9,
    nombre: "Sofía",
    apellido: "Vega",
    edad: 36,
    sueldo: 1500000,
    idDepto: 3,
    fecha_ingreso: 2016,
    skills: ["arquitectura", "Java", "AWS"],
    activo: true,
  },
  {
    _id: 10,
    nombre: "Tomás",
    apellido: "Acosta",
    edad: 30,
    sueldo: 1100000,
    idDepto: 3,
    fecha_ingreso: 2020,
    skills: ["DevOps", "Kubernetes", "Linux"],
    activo: true,
  },
  {
    _id: 11,
    nombre: "Valentina",
    apellido: "Castro",
    edad: 27,
    sueldo: 780000,
    idDepto: 4,
    fecha_ingreso: 2021,
    skills: ["redes sociales", "diseño", "SEO"],
    activo: true,
  },
  {
    _id: 12,
    nombre: "Martín",
    apellido: "Ríos",
    edad: 33,
    sueldo: 920000,
    idDepto: 4,
    fecha_ingreso: 2018,
    skills: ["analytics", "Google Ads"],
    activo: true,
  },
  {
    _id: 13,
    nombre: "Camila",
    apellido: "Molina",
    edad: 25,
    sueldo: 670000,
    idDepto: 4,
    fecha_ingreso: 2023,
    skills: ["copywriting", "redes sociales"],
    activo: true,
  },
  {
    _id: 14,
    nombre: "Diego",
    apellido: "Paredes",
    edad: 45,
    sueldo: 1050000,
    idDepto: 5,
    fecha_ingreso: 2014,
    skills: ["logística", "stock", "negociación"],
    activo: true,
  },
  {
    _id: 15,
    nombre: "Romina",
    apellido: "Herrera",
    edad: 39,
    sueldo: 880000,
    idDepto: 5,
    fecha_ingreso: 2017,
    skills: ["distribución", "transporte"],
    activo: true,
  },
  {
    _id: 16,
    nombre: "Gonzalo",
    apellido: "Méndez",
    edad: 31,
    sueldo: 750000,
    idDepto: 5,
    fecha_ingreso: 2020,
    skills: ["depósito", "stock"],
    activo: true,
  },
  {
    _id: 17,
    nombre: "Mariana",
    apellido: "Torres",
    edad: 22,
    sueldo: 580000,
    idDepto: 6,
    fecha_ingreso: 2024,
    skills: ["atención telefónica", "empatía"],
    activo: true,
  },
  {
    _id: 18,
    nombre: "Sebastián",
    apellido: "Quiroga",
    edad: 28,
    sueldo: 690000,
    idDepto: 6,
    fecha_ingreso: 2022,
    skills: ["chat", "soporte", "CRM"],
    activo: true,
  },
  {
    _id: 19,
    nombre: "Florencia",
    apellido: "Navarro",
    edad: 35,
    sueldo: 820000,
    idDepto: 6,
    fecha_ingreso: 2018,
    skills: ["liderazgo", "atención al cliente"],
    activo: true,
  },
  {
    _id: 20,
    nombre: "Hernán",
    apellido: "Ledesma",
    edad: 50,
    sueldo: 1700000,
    idDepto: 1,
    fecha_ingreso: 2010,
    skills: ["liderazgo", "selección", "estrategia"],
    activo: true,
  },
  {
    _id: 21,
    nombre: "Paula",
    apellido: "Aguirre",
    edad: 29,
    sueldo: 1300000,
    idDepto: 3,
    fecha_ingreso: 2019,
    skills: ["MongoDB", "Node.js", "Docker"],
    activo: true,
  },
  {
    _id: 22,
    nombre: "Nicolás",
    apellido: "Sosa",
    edad: 42,
    sueldo: 1450000,
    idDepto: 2,
    fecha_ingreso: 2013,
    skills: ["finanzas", "presupuesto", "auditoría"],
    activo: false,
  },
  {
    _id: 23,
    nombre: "Agustina",
    apellido: "Rivero",
    edad: 27,
    sueldo: 720000,
    idDepto: 4,
    fecha_ingreso: 2022,
    skills: ["diseño", "branding"],
    activo: true,
  },
  {
    _id: 24,
    nombre: "Bruno",
    apellido: "Maldonado",
    edad: 37,
    sueldo: 1600000,
    idDepto: 3,
    fecha_ingreso: 2014,
    skills: ["arquitectura", "Java", "Spring"],
    activo: true,
  },
  {
    _id: 25,
    nombre: "Esteban",
    apellido: "Ortiz",
    edad: 33,
    sueldo: 950000,
    idDepto: 99,
    fecha_ingreso: 2020,
    skills: ["consultoría externa"],
    activo: true,
  },
];

// defino el nombre de la coleccion

const name_collection = "empleados";

// Insertar los documentos en la colección 'empleados'
try {
  const resultado = db[name_collection].insertMany(empleados);

  print("=== INSERCIÓN COMPLETADA ===");
  print(`Total de empleados insertados: ${resultado.insertedIds.length}`);
  print(
    "IDs insertados:",
    JSON.stringify(Object.values(resultado.insertedIds)),
  );

  // Verificar la inserción
  const count = db[name_collection].countDocuments();
  print(`Total de documentos en la colección: ${count}`);

  print("\n=== EJEMPLOS DE CONSULTAS ===");
  print("Para ver todos los empleados:");
  print(`db.${name_collection}.find().pretty()`);
  print("\nPara buscar por departamento:");
  print(`db.${name_collection}.find({idDepto: 3}).pretty()`);
  print("\nPara buscar empleados activos:");
  print(`db.${name_collection}.find({activo: true}).pretty()`);
  print("\nEjemplo de $lookup (empleado + departamento):");
  print(
    `db.${name_collection}.aggregate([
       { $lookup: { from: "departamentos", localField: "idDepto",
                    foreignField: "_id", as: "depto" } },
       { $unwind: "$depto" },
       { $project: { _id: 0, nombre: 1, apellido: 1, departamento: "$depto.nombre" } }
     ])`,
  );
} catch (error) {
  print("Error al insertar los datos:", error);
}
