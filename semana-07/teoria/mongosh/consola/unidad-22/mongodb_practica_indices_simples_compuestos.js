// ============================================================
//  PRÁCTICA MongoDB — Índices Simples y Compuestos
//  Basado en apuntes UTN Avellaneda — Páginas 72 a 80
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_indices_simples_compuestos.js")
// ============================================================


use("base1");


// ============================================================
//  SECCIÓN 1 — Índice SIMPLE
//  createIndex sobre UN solo campo del documento.
// ============================================================

db.libros.drop();

db.libros.insertOne({
  _id: 1,
  titulo: 'El aleph',
  autor: 'Borges',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
});

db.libros.insertOne({
  _id: 2,
  titulo: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editorial: ['Siglo XXI'],
  precio: 50,
  cantidad: 12
});

db.libros.insertOne({
  _id: 3,
  titulo: 'Aprenda PHP',
  autor: 'Mario Molina',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 50,
  cantidad: 20
});

db.libros.insertOne({
  _id: 4,
  titulo: 'Java en 10 minutos',
  editorial: ['Siglo XXI'],
  precio: 45,
  cantidad: 1
});

// Crear índice ASCENDENTE por titulo (1 = A → Z)
print("\n--- Creando índice simple ASCENDENTE sobre 'titulo' ---");
db.libros.createIndex({ titulo: 1 });
// El resultado muestra:
//   numIndexesBefore: 1   (solo estaba el de _id)
//   numIndexesAfter:  2   (ahora también el de titulo)

// Consulta que aprovecha el índice para ordenar
print("\n--- Listado de títulos ordenados (sort usando el índice) ---");
db.libros.find({}, { titulo: 1 }).sort({ titulo: 1 }).pretty();

// Reemplazar el índice por uno DESCENDENTE (Z → A)
print("\n--- Reemplazando por índice DESCENDENTE sobre 'titulo' ---");
db.libros.dropIndex({ titulo: 1 });
db.libros.createIndex({ titulo: -1 });
db.libros.find({}, { titulo: 1 }).sort({ titulo: -1 }).pretty();


// ============================================================
//  SECCIÓN 2 — Índice COMPUESTO
//  createIndex sobre DOS o más campos del documento.
// ============================================================

db.libros.drop();

db.libros.insertOne({
  _id: 1,
  titulo: 'El aleph',
  autor: 'Borges',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
});

db.libros.insertOne({
  _id: 2,
  titulo: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editorial: ['Siglo XXI'],
  precio: 50,
  cantidad: 12
});

db.libros.insertOne({
  _id: 3,
  titulo: 'Aprenda PHP',
  autor: 'Mario Molina',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 50,
  cantidad: 20
});

db.libros.insertOne({
  _id: 4,
  titulo: 'Java en 10 minutos',
  editorial: ['Siglo XXI'],
  precio: 45,
  cantidad: 1
});

print("\n--- Creando índice COMPUESTO sobre (titulo, autor) ---");
db.libros.createIndex({ titulo: 1, autor: 1 });

// Consulta que filtra por LOS DOS campos del índice → casi instantánea
print("\n--- find por titulo + autor (usa el índice compuesto) ---");
db.libros.find({ titulo: 'Aprenda PHP', autor: 'Mario Molina' }).pretty();


// ============================================================
//  SECCIÓN 3 — Acceso solo a los datos del índice (Covered Query)
//  Si filtramos y proyectamos SOLO campos indexados,
//  MongoDB no abre los documentos: responde desde el índice.
// ============================================================

db.articulos.drop();

db.articulos.insertOne({ _id: 1, nombre: 'MULTIFUNCION HP DESKJET 2675',         rubro: 'impresora', precio: 3000,  stock: 20 });
db.articulos.insertOne({ _id: 2, nombre: 'MULTIFUNCION EPSON EXPRESSION XP241',  rubro: 'impresora', precio: 3700,  stock: 5  });
db.articulos.insertOne({ _id: 3, nombre: 'LED 19 PHILIPS',                       rubro: 'monitor',   precio: 4500,  stock: 2  });
db.articulos.insertOne({ _id: 4, nombre: 'LED 22 PHILIPS',                       rubro: 'monitor',   precio: 5700,  stock: 4  });
db.articulos.insertOne({ _id: 5, nombre: 'LED 27 PHILIPS',                       rubro: 'monitor',   precio: 12000, stock: 1  });
db.articulos.insertOne({ _id: 6, nombre: 'LOGITECH M90',                         rubro: 'mouse',     precio: 300,   stock: 4  });

print("\n--- Creando índice compuesto sobre (rubro, _id) ---");
db.articulos.createIndex({ rubro: 1, _id: 1 });

// Filtra por 'rubro' y proyecta SOLO campos del índice (rubro y _id)
print("\n--- Covered query: find sólo con campos indexados ---");
db.articulos.find({ rubro: 'monitor' }, { rubro: 1, _id: 1 });


// ============================================================
//  SECCIÓN 4 — Estadísticas de la consulta con explain()
//  Permite ver el plan de ejecución y verificar si se usó el índice.
// ============================================================

print("\n--- explain('executionStats') de una COVERED QUERY ---");
db.articulos.find({ rubro: 'monitor' }, { rubro: 1, _id: 1 })
  .explain('executionStats');
// Mirá en el resultado:
//   winningPlan.stage           → "PROJECTION" / "IXSCAN"
//   indexName                   → "rubro_1__id_1"
//   nReturned                   → 3
//   totalKeysExamined           → 3
//   totalDocsExamined           → 0   ← ¡no se abrió ningún documento!


print("\n--- explain() pidiendo TAMBIÉN un campo NO indexado (precio) ---");
db.articulos.find({ rubro: 'monitor' }, { rubro: 1, _id: 1, precio: 1 })
  .explain('executionStats');
// Ahora:
//   totalDocsExamined           → 3   ← MongoDB tuvo que abrir los documentos


// ============================================================
//  SECCIÓN 5 — Índices ÚNICOS
//  Aseguran que un campo no tenga valores repetidos
//  (equivalente a UNIQUE de SQL).
// ============================================================

db.clientes.drop();

db.clientes.insertOne({
  _id: 1,
  nombre: 'Perez Ana',
  dni: '20439455',
  domicilio: 'San Martin 222',
  provincia: 'Santa Fe'
});

db.clientes.insertOne({
  _id: 2,
  nombre: 'Garcia Juan',
  dni: '21495834',
  domicilio: 'Rivadavia 333',
  provincia: 'Buenos Aires'
});

db.clientes.insertOne({
  _id: 3,
  nombre: 'Perez Luis',
  dni: '20888722',
  domicilio: 'Sarmiento 444',
  provincia: 'Buenos Aires'
});

print("\n--- Creando índice ÚNICO sobre 'dni' ---");
db.clientes.createIndex({ dni: 1 }, { unique: true });

print("\n--- Estado actual de la colección clientes ---");
db.clientes.find();

// Intentar insertar un dni duplicado → debe fallar con E11000
print("\n--- Intentando insertar un cliente con DNI duplicado (debe fallar) ---");
try {
  db.clientes.insertOne({
    _id: 4,
    nombre: 'Peña Lucas',
    dni: '20888722',                  // ← ya existe (cliente _id: 3)
    domicilio: 'General Paz 323',
    provincia: 'Buenos Aires'
  });
} catch (e) {
  print("Error esperado (E11000): " + e.message);
}


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — Índice simple
// Sobre la colección 'libros', creá un índice ASCENDENTE por el campo
// 'precio' y mostrá los libros ordenados de menor a mayor precio.
// TU CÓDIGO:
//


// EJERCICIO 2 — Índice descendente
// Eliminá el índice del ejercicio anterior y creá un índice DESCENDENTE
// también sobre 'precio'. Mostrá los libros ordenados de mayor a menor.
// TU CÓDIGO:
//


// EJERCICIO 3 — Índice compuesto
// Sobre la colección 'articulos', creá un índice compuesto por
// (rubro ascendente, precio ascendente) y luego ejecutá:
//   db.articulos.find({ rubro: 'monitor' }).sort({ precio: 1 })
// El sort debería resolverse usando el índice (sin ordenar en memoria).
// TU CÓDIGO:
//


// EJERCICIO 4 — Covered query
// Sobre 'articulos', diseñá una consulta que devuelva sólo el 'rubro'
// y el '_id' de los productos cuyo rubro sea 'impresora'.
// La consulta debe ser COVERED: totalDocsExamined debe dar 0.
// Verificalo con explain('executionStats').
// TU CÓDIGO:
//


// EJERCICIO 5 — explain comparativo
// Insertá 1000 documentos artificiales en una colección 'prueba' con un
// campo 'codigo' (numérico). Ejecutá:
//   db.prueba.find({ codigo: 500 }).explain('executionStats')
// Anotá totalDocsExamined y executionTimeMillis.
// Después creá db.prueba.createIndex({ codigo: 1 }) y volvé a ejecutar
// el explain. Compará ambos resultados.
// TU CÓDIGO:
//


// EJERCICIO 6 — Índice único
// Creá una colección 'usuarios' con campos { _id, email, nombre }.
// Insertá 2 usuarios con emails distintos. Creá un índice único sobre
// 'email' y comprobá que NO se puede insertar un tercer usuario con
// un email ya existente.
// TU CÓDIGO:
//


// EJERCICIO 7 — Índice único compuesto (desafío)
// Sobre una colección 'inscripciones' con campos { alumno, materia, anio },
// creá un índice ÚNICO compuesto por (alumno, materia, anio) que impida
// que un mismo alumno se inscriba dos veces a la misma materia en el
// mismo año (pero sí pueda inscribirse en años distintos).
// TU CÓDIGO:
//


// EJERCICIO 8 — Diagnóstico
// Ejecutá db.libros.find({ autor: 'Borges' }).explain('executionStats').
// ¿La etapa fue COLLSCAN o IXSCAN? ¿Por qué?
// ¿Qué índice habría que crear para que pasara a IXSCAN?
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
