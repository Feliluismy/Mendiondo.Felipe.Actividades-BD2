// ============================================================
//  PRÁCTICA MongoDB — Cargar y ejecutar archivos JavaScript
//  Basado en apuntes UTN Avellaneda — Páginas 92 a 95
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_cargar_archivos_js.js")
//
// Si te parás dentro de esta carpeta (mongosh/unidad-26/) antes de
// abrir mongosh, alcanza con el nombre relativo. Si no, pasá el
// path absoluto:
//   Linux/Mac : load("/var/www/html/.../unidad-26/mongodb_practica_cargar_archivos_js.js")
//   Windows   : load("c:\\path\\al\\archivo.js")     (¡doble barra!)
// ============================================================


// ============================================================
//  SECCIÓN 1 — Cambiar de base de datos DENTRO de un script
//  En el shell interactivo se usaría: use base1
//  En un script hay que escribir:
// ============================================================

db = db.getSiblingDB('base1');


// ============================================================
//  SECCIÓN 2 — Listar bases del servidor (equivalente a 'show dbs')
//  En un script NO se muestra el valor automáticamente:
//  hay que usar print() o printjson().
// ============================================================

print("\n--- Bases de datos del servidor ---");
printjson(db.adminCommand('listDatabases'));


// ============================================================
//  SECCIÓN 3 — Listar colecciones de la base activa
//  Equivalente al comando interactivo 'show collections'.
// ============================================================

print("\n--- Colecciones de la base 'base1' ---");
print(db.getCollectionNames());


// ============================================================
//  SECCIÓN 4 — Reproducir el script 'creacion.js' del apunte
//  Vacía 'articulos' y la puebla con 10 documentos sintéticos.
// ============================================================

db.articulos.drop();

for (i = 1; i <= 10; i++) {
  db.articulos.insertOne({
    _id: i,
    nombre: 'nombre' + i
  });
}

print("\n--- Documentos cargados en 'articulos' ---");
print("Cantidad:", db.articulos.countDocuments());


// ============================================================
//  SECCIÓN 5 — Recorrer un cursor MANUALMENTE
//  En un script no existe el atajo 'it' del shell interactivo.
//  Hay que iterar con hasNext() y next().
// ============================================================

print("\n--- Recorriendo el cursor con hasNext()/next() ---");
cursor = db.articulos.find();
while (cursor.hasNext()) {
  printjson(cursor.next());
}


// ============================================================
//  SECCIÓN 6 — Diferencia entre print() y printjson()
// ============================================================

print("\n--- print() vs printjson() sobre el mismo objeto ---");
var ejemplo = { a: 1, b: [10, 20, 30], c: { x: true } };

print("print(...) →");
print(ejemplo);          // muestra una representación corta y compacta

print("\nprintjson(...) →");
printjson(ejemplo);      // muestra el objeto formateado como JSON


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — Tu primer script externo
// Creá en TU sistema un archivo nuevo llamado 'creacion.js' con el
// contenido del apunte (drop + for de 10 articulos).
// Después abrí mongosh y cargalo con load("ruta/creacion.js").
// Verificá con db.articulos.countDocuments() que se cargaron 10.
// TU CÓDIGO (qué pondrías en creacion.js):
//


// EJERCICIO 2 — Path absoluto vs relativo
// (a) Cargá un script usando un path ABSOLUTO.
// (b) Movete con `cd` en la terminal a la carpeta del script,
//     volvé a abrir mongosh y cargalo con path RELATIVO.
// ¿Qué diferencia hay?
// TU RESPUESTA:
//


// EJERCICIO 3 — Equivalentes de comandos interactivos
// Reescribí, en formato apto para script, los siguientes comandos
// que normalmente se usan en el shell interactivo:
//   - use base1
//   - show dbs
//   - show collections
//   - show users
// TU CÓDIGO:
//


// EJERCICIO 4 — Iteración de cursor
// Insertá 50 documentos en una colección 'numeros' con la forma
// { _id: i, valor: i * i }. Después recorré el cursor con
// hasNext()/next() e imprimí solo aquellos documentos cuyo
// 'valor' sea mayor a 1000.
// TU CÓDIGO:
//


// EJERCICIO 5 — print vs printjson
// Probá los siguientes 4 casos y anotá qué salida produce cada uno:
//   print(123)
//   printjson(123)
//   print({ x: 1, y: 2 })
//   printjson({ x: 1, y: 2 })
// ¿En qué casos se nota la diferencia?
// TU RESPUESTA:
//


// EJERCICIO 6 — Script reutilizable
// Escribí un archivo 'reset_articulos.js' que:
//   1. Imprima la cantidad actual de documentos en articulos.
//   2. Borre la colección.
//   3. Vuelva a cargarla con N documentos (N tomado de una variable
//      al inicio del archivo).
//   4. Imprima los primeros 5 documentos con printjson.
// Despues cargalo con load() y comprobá que funciona con N = 25.
// TU CÓDIGO:
//


// EJERCICIO 7 — Reporte rápido (desafío)
// Escribí un script que genere un reporte de la base activa:
//   - Nombre de la base.
//   - Lista de colecciones.
//   - Por cada colección, cantidad de documentos.
// Usá print() y printjson() para mostrar el reporte ordenado.
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
