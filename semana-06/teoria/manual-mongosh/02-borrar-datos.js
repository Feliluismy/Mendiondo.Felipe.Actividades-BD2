// Seleccionar la base de datos
use base1;

// Borrar todos los documentos de la colección 'libros'
db.libros.deleteMany({});

// Mostrar las colecciones existentes (la colección 'libros' aún existe pero está vacía)
show collections;

// Eliminar la colección 'libros' completamente
db.libros.drop();

// Mostrar las colecciones de nuevo para verificar que fue eliminada
show collections;

// --- Borrar una base de datos ---
// Mostrar todas las bases de datos
show dbs;

// Seleccionar la base de datos a eliminar
use base1;

// Eliminar la base de datos activa ('base1')
db.dropDatabase();

// Mostrar las bases de datos restantes para verificar la eliminación
show dbs;