// ============================================================
//  PRÁCTICA MongoDB — Tipo de dato Date
//  Basado en apuntes UTN Avellaneda — Páginas 64 a 67
// ============================================================
// Para ejecutar: abrí mongosh y corré: load("practica_date.js")
//
// ⚠️  RECORDATORIO CLAVE — El mes en new Date() va de 0 a 11:
//      0=Enero, 1=Febrero, ..., 11=Diciembre
// ============================================================


// ------------------------------------------------------------
// SECCIÓN 1: COLECCIÓN "autos" — fecha y hora actual con new Date()
// ------------------------------------------------------------

use("base1");
db.autos.drop();

// new Date() sin argumentos captura el instante exacto de la inserción.
// Cada vez que ejecutes este script, las fechas serán distintas.
db.autos.insertOne({ patente: 'aaa111', fechahora: new Date() });
db.autos.insertOne({ patente: 'bbb222', fechahora: new Date() });
db.autos.insertOne({ patente: 'ccc333', fechahora: new Date() });

print("\n--- Autos con fecha/hora de ingreso automática (ISODate) ---");
db.autos.find().pretty();
// Observá que el campo fechahora aparece como ISODate("...Z")
// El formato es ISO 8601: YYYY-MM-DDTHH:MM:SS.mmmZ


// ------------------------------------------------------------
// SECCIÓN 2: COLECCIÓN "empleados" — fecha específica con new Date(año, mes, día)
// ------------------------------------------------------------

db.empleados.drop();

// ⚠️  mes 0  = Enero   → new Date(2010, 0, 31)  = 31 de ENERO de 2010
// ⚠️  mes 11 = Diciembre → new Date(2001, 11, 1) = 1 de DICIEMBRE de 2001
// ⚠️  mes 3  = Abril   → new Date(2005, 3, 14)  = 14 de ABRIL de 2005
db.empleados.insertOne({ _id: 20456234, nombre: 'Rodriguez Pablo', fechaingreso: new Date(2010, 0,  31) });
db.empleados.insertOne({ _id: 17488834, nombre: 'Gomez Ana',       fechaingreso: new Date(2001, 11,  1) });
db.empleados.insertOne({ _id: 23463564, nombre: 'Juarez Carla',    fechaingreso: new Date(2005, 3,  14) });

print("\n--- Empleados con fecha de ingreso específica ---");
db.empleados.find().pretty();
// La parte horaria aparece en 0: ISODate("2010-01-31T03:00:00Z")

// -- Ejemplo: ordenar por fecha (ascendente = más antiguo primero)
print("\n--- Empleados ordenados por fecha de ingreso (más antiguo primero) ---");
db.empleados.find().sort({ fechaingreso: 1 }).pretty();

// -- Ejemplo: filtrar empleados que ingresaron a partir de 2005
print("\n--- Empleados con fecha de ingreso >= 2005 ---");
db.empleados.find({ fechaingreso: { $gte: new Date(2005, 0, 1) } }).pretty();


// ------------------------------------------------------------
// SECCIÓN 3: COLECCIÓN "alumnos" — datos de prueba (Problemas 1.11)
// ------------------------------------------------------------

db.alumnos.drop();

// mes 7 = Agosto    → new Date(1990, 7, 15) = 15 de AGOSTO de 1990
// mes 0 = Enero     → new Date(1964, 0,  1) = 1  de ENERO  de 1964
// mes 3 = Abril     → new Date(1972, 3,  2) = 2  de ABRIL  de 1972
db.alumnos.insertOne({ _id: 20456123, apellido: 'Gonzalez', nombre: 'Ana',      domicilio: 'Colon 123',            fechanacimiento: new Date(1990, 7, 15) });
db.alumnos.insertOne({ _id: 45123845, apellido: 'Juarez',   nombre: 'Bernardo', domicilio: 'Sucre 456',            fechanacimiento: new Date(1964, 0,  1) });
db.alumnos.insertOne({ _id: 16567512, apellido: 'Perez',    nombre: 'Laura',    domicilio: '21 de Septiembre 3233', fechanacimiento: new Date(1972, 3,  2) });

print("\n--- Todos los alumnos ---");
db.alumnos.find().pretty();


// ============================================================
//  EJERCICIOS PROPUESTOS (1.11) — Resolvé vos cada uno
//  Trabajar sobre la colección "alumnos" de la Sección 3
// ============================================================

// EJERCICIO 2:
// Imprimir todos los documentos de la colección alumnos.
// TU RESPUESTA:
// db.alumnos.find( ___ ).pretty();


// EJERCICIO 3:
// Imprimir solo el apellido y la fecha de nacimiento (sin mostrar _id, nombre ni domicilio).
// Pista: usá projection con los campos que querés mostrar, y excluí el _id si querés.
// TU RESPUESTA:
// db.alumnos.find( ___ , ___ ).pretty();


// EJERCICIO 4:
// Imprimir todos los datos ordenados por fecha de nacimiento de MAYOR a MENOR
// (el más joven primero, es decir fecha más reciente primero → orden descendente).
// Pista: sort con -1
// TU RESPUESTA:
// db.alumnos.find().sort( ___ ).pretty();


// EJERCICIO 5:
// Imprimir todos los alumnos que nacieron A PARTIR de 1970 (incluido).
// Pista: usá $gte con new Date(1970, 0, 1)
// TU RESPUESTA:
// db.alumnos.find({ fechanacimiento: ___ }).pretty();


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
