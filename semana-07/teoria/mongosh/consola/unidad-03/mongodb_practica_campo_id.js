// ============================================================
//  PRÁCTICA MongoDB — Campo obligatorio _id
//  Basado en apuntes UTN Avellaneda — Páginas 6 a 8
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_campo_id.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Activar la base 'base1' y resetear 'clientes'
// ============================================================

db = db.getSiblingDB('base1');
db.clientes.drop();


// ============================================================
//  SECCIÓN 2 — Insert exitoso con _id manual
//  Resultado: { acknowledged: true, insertedId: 1 }
// ============================================================

print("\n--- Insert con _id: 1 ---");
var r1 = db.clientes.insertOne({
  _id: 1,
  nombre: 'Lopez Marcos',
  domicilio: 'Colon 111',
  provincia: 'Cordoba'
});
printjson(r1);


// ============================================================
//  SECCIÓN 3 — Intento con _id duplicado
//  Resultado: WriteError E11000 (duplicate key)
//  El documento NO se inserta.
// ============================================================

print("\n--- Insert con _id: 1 (DUPLICADO, debe fallar) ---");
try {
  db.clientes.insertOne({
    _id: 1,                       // ← ya existe
    nombre: 'Perez Ana',
    domicilio: 'San Martin 222',
    provincia: 'Santa Fe'
  });
} catch (e) {
  print("Error capturado:");
  print("  code:   " + e.code);    // 11000
  print("  errmsg: " + e.errmsg);
}


// ============================================================
//  SECCIÓN 4 — Verificar que solo quedó el primer documento
// ============================================================

print("\n--- Estado de 'clientes' (debe haber 1 solo documento) ---");
db.clientes.find().forEach(printjson);
print("Total:", db.clientes.countDocuments());


// ============================================================
//  SECCIÓN 5 — Diferentes TIPOS válidos para _id
// ============================================================

db.identificadores.drop();

print("\n--- _id como número ---");
db.identificadores.insertOne({ _id: 100, info: 'numerico' });

print("--- _id como string ---");
db.identificadores.insertOne({ _id: 'cli-001', info: 'string' });

print("--- _id sin especificar (ObjectId autogenerado) ---");
db.identificadores.insertOne({ info: 'objectid auto' });

print("--- _id como documento (clave compuesta) ---");
db.identificadores.insertOne({
  _id: { tipo: 'A', codigo: 7 },
  info: 'compuesto'
});

print("\n--- Estado final de 'identificadores' ---");
db.identificadores.find().forEach(printjson);


// ============================================================
//  PROBLEMAS PROPUESTOS (1.1) — del apunte UTN
// ============================================================

// PROBLEMA 1 — Insertar 2 documentos en 'clientes' con _id no repetidos
// (Aprovechá los datos del PDF: agregá 2 clientes nuevos con _id 2 y 3.)
// TU CÓDIGO:
//


// PROBLEMA 2 — Intentar insertar OTRO documento con clave repetida.
// Capturá el error y mostrá el código 11000.
// TU CÓDIGO:
//


// PROBLEMA 3 — Mostrar todos los documentos de la colección 'clientes'.
// (Atención: el apunte dice "libros" pero por el contexto se refiere a
//  la colección 'clientes' que venimos usando.)
// TU CÓDIGO:
//


// ============================================================
//  EJERCICIOS EXTRA — Para profundizar
// ============================================================

// EJERCICIO 4 — _id sin pasar
// Insertá 3 documentos en una colección 'mensajes' SIN especificar _id.
// Listá los documentos y observá los ObjectId autogenerados.
// ¿Qué tienen en común los primeros caracteres de cada ObjectId?
// (PISTA: los primeros 4 bytes son un timestamp.)
// TU CÓDIGO:
//


// EJERCICIO 5 — _id con string descriptivo
// Creá una colección 'paises' con 5 documentos cuyo _id sea el código
// ISO de país (por ejemplo 'AR', 'BR', 'CL', 'UY', 'PE').
// Después intentá insertar un sexto con _id: 'AR' y capturá el error.
// TU CÓDIGO:
//


// EJERCICIO 6 — Reflexión
// (a) ¿Qué ventajas tiene usar el ObjectId autogenerado vs un _id manual?
// (b) ¿Cuándo conviene usar un _id manual (ej. el DNI o el ISBN)?
// (c) ¿Por qué MongoDB obliga a que TODO documento tenga _id?
// TU RESPUESTA:
//


// EJERCICIO 7 — _id en insertMany (desafío)
// Hacé un insertMany con 4 documentos donde los dos primeros tengan
// _id válidos, el tercero un _id repetido respecto al primero, y el
// cuarto un _id válido. Capturá el error.
// ¿Cuántos documentos quedaron insertados? ¿Por qué se cortó ahí?
// (PISTA: los inserts son "ordered" por defecto.)
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
