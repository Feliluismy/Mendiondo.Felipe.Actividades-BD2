// ============================================================
//  PRÁCTICA MongoDB — Expresiones Regulares
//  Basado en apuntes UTN Avellaneda — "Expresiones Regulares"
//  (Yanina Scudero)
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_expresiones_regulares.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: colección 'estudiantes'
//  Datos de prueba pensados para ejercitar TODAS las regex del PDF.
// ============================================================

db = db.getSiblingDB('base1');
db.estudiantes.drop();

db.estudiantes.insertMany([
  { _id: 1,  nombre: 'Jose',     apellido: 'Perez',     edad: 21, ciudad: 'Avellaneda' },
  { _id: 2,  nombre: 'Joaquin',  apellido: 'Lopez',     edad: 19, ciudad: 'Lanus'      },
  { _id: 3,  nombre: 'Joana',    apellido: 'Martinez',  edad: 22, ciudad: 'Quilmes'    },
  { _id: 4,  nombre: 'Maria',    apellido: 'Gomez',     edad: 20, ciudad: 'Avellaneda' },
  { _id: 5,  nombre: 'Carla',    apellido: 'Diaz',      edad: 23, ciudad: 'Lomas'      },
  { _id: 6,  nombre: 'Felipe',   apellido: 'Suarez',    edad: 24, ciudad: 'Avellaneda' },
  { _id: 7,  nombre: 'Carolina', apellido: 'Rodriguez', edad: 25, ciudad: 'Lanus'      },
  { _id: 8,  nombre: 'Lila',     apellido: 'Fernandez', edad: 19, ciudad: 'Quilmes'    },
  { _id: 9,  nombre: 'Camila',   apellido: 'Gimenez',   edad: 21, ciudad: 'Avellaneda' },
  { _id: 10, nombre: 'LILA',     apellido: 'Romero',    edad: 28, ciudad: 'Lomas'      },
  { _id: 11, nombre: 'Pedro',    apellido: 'Lima',      edad: 30, ciudad: 'Lanus'      },
  { _id: 12, nombre: 'Ana',      apellido: 'Vega',      edad: 18, ciudad: 'Avellaneda' }
]);


// ============================================================
//  SECCIÓN 2 — /^patron/   Búsqueda por INICIO de cadena
// ============================================================

print("\n--- /^Jo/  : nombres que EMPIEZAN con 'Jo' ---");
// Esperado: Jose, Joaquin, Joana
db.estudiantes.find({ "nombre": /^Jo/ }).forEach(printjson);

print("\n--- Mismo resultado, escrito con $regex ---");
db.estudiantes.find({ "nombre": { $regex: /^Jo/ } }).forEach(printjson);


// ============================================================
//  SECCIÓN 3 — /patron$/   Búsqueda por FIN de cadena
// ============================================================

print("\n--- /a$/   : nombres que TERMINAN en 'a' ---");
// Esperado: Joana, Maria, Carla, Lila, Camila, Ana
db.estudiantes.find({ "nombre": /a$/ }).forEach(printjson);


// ============================================================
//  SECCIÓN 4 — /patron/   Búsqueda en CUALQUIER POSICIÓN
// ============================================================

print("\n--- /li/   : nombres que CONTIENEN 'li' (case-sensitive) ---");
// Esperado: Felipe, Carolina, Lila (la minúscula), Camila
// NO trae 'LILA' porque está en mayúsculas.
db.estudiantes.find({ "nombre": /li/ }).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — /patron/i   Búsqueda INSENSIBLE a mayús/minús
// ============================================================

print("\n--- /LI/i  : contiene 'li' SIN distinguir mayús/minús ---");
// Esperado: Felipe, Carolina, Lila, Camila, LILA
db.estudiantes.find({ "nombre": /LI/i }).forEach(printjson);


// ============================================================
//  SECCIÓN 6 — Combinando anclajes y modificador
// ============================================================

print("\n--- /^jo/i : EMPIEZA con 'jo' SIN distinguir mayús/minús ---");
db.estudiantes.find({ "nombre": /^jo/i }).forEach(printjson);

print("\n--- /A$/i  : TERMINA en 'a' o 'A' (todas) ---");
db.estudiantes.find({ "nombre": /A$/i }).forEach(printjson);


// ============================================================
//  EJERCICIOS PROPUESTOS
//  Resolvelos aplicando lo visto en la teoría.
// ============================================================

// EJERCICIO 1
// Mostrar los estudiantes cuyo APELLIDO empiece con la letra "G".
// (Pista: /^G/ sobre el campo apellido.)
// TU CÓDIGO:
//


// EJERCICIO 2
// Mostrar los estudiantes cuyo APELLIDO termine en "ez"
// (Lopez, Martinez, Gomez, Suarez, Rodriguez, Fernandez, Gimenez, ...).
// (Pista: /ez$/ )
// TU CÓDIGO:
//


// EJERCICIO 3
// Mostrar los estudiantes cuyo NOMBRE contenga la subcadena "ar"
// en cualquier posición (Maria, Carla, Carolina, ...).
// TU CÓDIGO:
//


// EJERCICIO 4
// Mostrar los estudiantes cuya CIUDAD empiece con "L"
// pero SIN distinguir mayúsculas y minúsculas (Lanus, Lomas, lanus, ...).
// TU CÓDIGO:
//


// EJERCICIO 5
// Mostrar los estudiantes cuyo NOMBRE EMPIECE con "C"
// y termine en "a" a la vez.
// (Pista: una sola regex con anclajes en los dos extremos: /^C.*a$/ )
// TU CÓDIGO:
//


// EJERCICIO 6
// Buscar los estudiantes cuyo NOMBRE contenga la letra "a"
// (sin importar si es mayúscula o minúscula).
// ¿Cuántos hay? Ayudate con .count() o .countDocuments().
// TU CÓDIGO:
//


// EJERCICIO 7
// Mostrar los estudiantes cuyo APELLIDO contenga "ria" en cualquier
// posición (Marrias, Maria, ...). Probá con la colección actual.
// TU CÓDIGO:
//


// EJERCICIO 8 — Combinando con otros operadores
// Mostrar los estudiantes cuya CIUDAD empiece con "A" Y cuya EDAD
// sea menor o igual a 21.
// (Pista: AND implícito + regex en un mismo find.)
// TU CÓDIGO:
//


// EJERCICIO 9 — update con regex
// Agregar el campo { activo: true } a TODOS los estudiantes cuyo
// NOMBRE empiece con "J" (Jose, Joaquin, Joana).
// (Pista: updateMany con filtro /^J/ y $set.)
// TU CÓDIGO:
//


// EJERCICIO 10 — delete con regex
// Eliminar los estudiantes cuyo APELLIDO termine en "z"
// (Perez, Lopez, Martinez, Gomez, Diaz, Suarez, Rodriguez, Fernandez, Gimenez).
// ¡Cuidado!: si lo corrés vas a borrar muchos documentos.
// (Pista: deleteMany con /z$/ )
// TU CÓDIGO:
//


// EJERCICIO 11 — Reflexión
// (a) ¿Qué diferencia hay entre /jo/ y /^jo/ ?
// (b) ¿Por qué /li/ NO encuentra 'LILA' pero /li/i SÍ?
// (c) ¿Cuál de las dos formas es más eficiente cuando hay un índice
//     sobre el campo: /^Jo/ o /jo/i ? ¿Por qué?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
