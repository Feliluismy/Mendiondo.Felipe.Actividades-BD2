

// ==========================================
// PREPARACIÓN DEL ENTORNO Y DATOS DE PRUEBA
// ==========================================

// Usamos la base de datos base1 y borramos la colección si existe
use base1;
db.libros.drop();

// Insertamos los documentos de prueba indicados en el apunte
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

// ==========================================
// EJEMPLOS DEL DOCUMENTO
// ==========================================

// 1. Mostrar todos los libros ordenados por título de forma ascendente
db.libros.find().sort({titulo:1});

// 2. Mostrar todos los libros con formato legible
db.libros.find().pretty();

// 3. Ordenar por título de forma ascendente y mostrar legible
db.libros.find().sort({titulo:1}).pretty();

// 4. Limitar el resultado a los primeros 2 documentos
db.libros.find().limit(2);

// 5. Saltear el primer documento y mostrar el resto
db.libros.find().skip(1);

// 6. Combinación: Saltear los 2 primeros, limitar a 2 resultados y mostrar legible
db.libros.find().skip(2).limit(2).pretty();


// ==========================================
// EJERCICIOS PROPUESTOS PARA EL ESTUDIANTE
// ==========================================

// Ejercicio 1: Escribe la consulta para encontrar todos los libros ordenados por 'precio' de forma descendente (-1) y muestra los resultados de forma legible.
// Tu código aquí:


// Ejercicio 2: Escribe la consulta para recuperar solo 3 libros, ordenados por 'cantidad' de forma ascendente.
// Tu código aquí:


// Ejercicio 3: Escribe la consulta que saltee los primeros 3 libros y muestre el resto (debería devolver solo 1 documento si no aplicas filtros adicionales).
// Tu código aquí:


// Ejercicio 4: Combina los métodos para ordenar por '_id' ascendente, saltear el primer registro, limitar el resultado a 2 libros y mostrarlo con formato bonito.
// Tu código aquí:
