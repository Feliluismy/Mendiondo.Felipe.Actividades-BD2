// ============================================================
//  PRÁCTICA MongoDB — Shell y JavaScript
//  Basado en apuntes UTN Avellaneda — Páginas 87 a 91
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_shell_javascript.js")
// ============================================================


use("base1");


// ============================================================
//  SECCIÓN 1 — JavaScript puro en el shell
//  El shell de MongoDB ES un intérprete de JavaScript.
// ============================================================

print("\n--- Variables y operadores básicos ---");
x = 1;
x++;
print("x =", x);              // 2

cubo = Math.pow(x, 3);
print("cubo =", cubo);         // 8

print("\n--- Otras funciones del objeto Math ---");
print("Math.PI       =", Math.PI);
print("Math.sqrt(81) =", Math.sqrt(81));
print("Math.max(...) =", Math.max(3, 7, 2, 19, 5));


// ============================================================
//  SECCIÓN 2 — Funciones definidas por el usuario
//  Quedan disponibles durante toda la sesión del shell.
// ============================================================

function mayor(x1, x2) {
  if (x1 > x2)
    return x1;
  else
    return x2;
}

print("\n--- Función mayor(x1, x2) ---");
print("mayor(10, 3) =", mayor(10, 3));   // 10
print("mayor(6, 34) =", mayor(6, 34));   // 34


// ============================================================
//  SECCIÓN 3 — Personalización del prompt
//  prompt es una variable global del shell.
//  Asignarle una función la convierte en el prompt activo.
// ============================================================

// Estos cambios afectan al shell INTERACTIVO.
// Los dejamos comentados para que cargar este script no modifique
// el prompt sin pedirlo. Descomentá para probarlos.

// // Variante 1 — fecha y hora actuales
// prompt = function() {
//   return (new Date()) + "> ";
// };

// // Variante 2 — base de datos activa
// prompt = function() {
//   return db + "> ";
// };

// // Variante 3 — base + cantidad de documentos en una colección clave
// prompt = function() {
//   return db + " (" + db.articulos.countDocuments() + " articulos)> ";
// };


// ============================================================
//  SECCIÓN 4 — Poblar una colección con un loop JavaScript
//  Caso de uso clásico: generar datos de prueba a granel.
// ============================================================

db.articulos.drop();

print("\n--- Insertando 10 artículos con un for ---");
for (i = 1; i <= 10; i++) {
  db.articulos.insertOne({
    _id: i,
    nombre: 'nombre' + i
  });
}

print("\n--- Resultado ---");
db.articulos.find().pretty();
print("Total:", db.articulos.countDocuments());


// ============================================================
//  SECCIÓN 5 — Desplegar el CÓDIGO de un método de MongoDB
//  Escribir el método SIN paréntesis devuelve su implementación.
// ============================================================

print("\n--- Código fuente de db.articulos.insertOne (sin paréntesis) ---");
// Esta línea, al evaluarse, imprime la función completa.
db.articulos.insertOne;

print("\n--- Otros métodos cuyo código se puede inspeccionar ---");
// Descomentá para verlos:
// db.articulos.find;
// db.articulos.updateOne;
// db.articulos.deleteOne;
// db.articulos.createIndex;


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — JavaScript básico
// Escribí un bloque que calcule la suma de los números del 1 al 100
// usando un for, y que imprima el resultado con print().
// TU CÓDIGO:
//


// EJERCICIO 2 — Función reutilizable
// Definí una función esPrimo(n) que devuelva true si n es primo y
// false si no lo es. Probala con esPrimo(7), esPrimo(10), esPrimo(13).
// TU CÓDIGO:
//


// EJERCICIO 3 — Prompt personalizado
// Asigná a prompt una función que muestre la base de datos activa,
// la hora actual (HH:mm:ss) y el símbolo ">". Ejemplo:
//   base1 [14:32:07]>
// TU CÓDIGO (descomentar para probar en shell interactivo):
//


// EJERCICIO 4 — Poblar masivamente
// Vacía la colección 'articulos' y cargala con 1000 documentos
// con la forma: { _id: i, nombre: 'art'+i, precio: <aleatorio entre 100 y 10000>, stock: <aleatorio entre 0 y 50> }.
// PISTA: usá Math.floor(Math.random() * (max - min + 1)) + min.
// TU CÓDIGO:
//


// EJERCICIO 5 — Medir el efecto de un índice (con datos sintéticos)
// Sobre la colección 'articulos' del ejercicio anterior:
//   1. Ejecutá db.articulos.find({ precio: 5000 }).explain('executionStats')
//      y anotá totalDocsExamined.
//   2. Creá un índice sobre 'precio'.
//   3. Volvé a ejecutar el explain y compará totalDocsExamined.
// ¿En cuánto bajó? ¿Cambió el stage del winningPlan?
// TU CÓDIGO:
//


// EJERCICIO 6 — Carga con datos aleatorios variados
// Creá una colección 'usuarios' con 500 documentos:
//   { _id: i,
//     nombre: 'usuario'+i,
//     activo: <true o false al azar>,
//     edad: <entre 18 y 80>,
//     ciudad: <una de ['CABA','Cordoba','Rosario','Mendoza','La Plata']> }
// Después contá cuántos están activos con countDocuments({ activo: true }).
// TU CÓDIGO:
//


// EJERCICIO 7 — Inspeccionar implementación
// Escribí (sin paréntesis) las siguientes expresiones y comentá lo que
// te llamó la atención de cada implementación:
//   db.articulos.find
//   db.articulos.updateOne
//   db.articulos.aggregate
// TU RESPUESTA:
//


// EJERCICIO 8 — Bonus
// Escribí una función poblarColeccion(nombre, cantidad) que:
//   - Borre la colección si existe.
//   - Inserte 'cantidad' documentos con _id incremental y nombre dinámico.
// Después llamala con poblarColeccion('clientes', 200).
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
