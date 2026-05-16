// ============================================================
//  PRÁCTICA MongoDB — Tipo de dato BinData (Datos Binarios)
//  Basado en apuntes UTN Avellaneda — Páginas 68 a 69
// ============================================================
// Para ejecutar: abrí mongosh y corré: load("practica_bindata.js")
//
// NOTA: Este capítulo es principalmente conceptual.
// El script incluye el ejemplo del apunte y experimentos guiados
// con preguntas de reflexión al final.
// ============================================================


// ------------------------------------------------------------
// SECCIÓN 1: COLECCIÓN "usuarios" — campo de tipo BinData
// ------------------------------------------------------------

use("base1");
db.usuarios.drop();

// Paso 1: asignar el dato binario a una variable.
// BinData(subtipo, datos_en_base64)
//   subtipo 0 = datos binarios genéricos
//   El segundo argumento es el contenido en codificación Base64.
var datobinario = BinData(0, 'e8MEnzZoFyMmD7WSHdNrFJyEk8M=');

// Paso 2: insertar el documento usando la variable
db.usuarios.insertOne({
  nombre: 'marcos',
  clave: 'abc123',
  fotoperfil: datobinario    // ← campo BinData
});

print("\n--- Usuario con campo BinData ---");
db.usuarios.find().pretty();
// Observá que fotoperfil aparece como: BinData(0, "e8MEnzZo...")
// No es un string normal: es un tipo de dato binario especializado.


// ------------------------------------------------------------
// SECCIÓN 2: Estrategia alternativa — URL en lugar de BinData
// Cuando el archivo supera 16 MB, se guarda solo la referencia.
// ------------------------------------------------------------

db.peliculas.drop();

db.peliculas.insertOne({
  _id: 1,
  titulo: 'Interstellar',
  anio: 2014,
  // En lugar de almacenar el mp4 (varios GB), se guarda la URL:
  urlVideo: 'https://storage.ejemplo.com/peliculas/interstellar.mp4',
  urlPortada: 'https://storage.ejemplo.com/posters/interstellar.jpg'
});

db.peliculas.insertOne({
  _id: 2,
  titulo: 'The Matrix',
  anio: 1999,
  urlVideo: 'https://storage.ejemplo.com/peliculas/matrix.mp4',
  urlPortada: 'https://storage.ejemplo.com/posters/matrix.jpg'
});

print("\n--- Películas con referencia por URL (archivos grandes) ---");
db.peliculas.find({}, { titulo: 1, urlPortada: 1 }).pretty();


// ------------------------------------------------------------
// SECCIÓN 3: Comparación de estrategias
// ------------------------------------------------------------

// Resumen de las tres estrategias para archivos:
//
// ESTRATEGIA 1 — BinData directo (archivo < 16 MB):
//   var img = BinData(0, '<contenido_base64>');
//   db.usuarios.insertOne({ nombre: 'Ana', foto: img });
//   VENTAJA: todo en un solo documento, sin dependencias externas.
//
// ESTRATEGIA 2 — URL de referencia (archivo > 16 MB):
//   db.peliculas.insertOne({ titulo: 'X', urlVideo: 'https://...' });
//   VENTAJA: el documento queda liviano, el archivo vive en otro servidor.
//   DESVENTAJA: dependencia de un sistema externo.
//
// ESTRATEGIA 3 — GridFS (archivos muy grandes):
//   MongoDB trocea el archivo en múltiples documentos de 255 KB.
//   Se maneja con herramientas específicas (mongofiles, drivers).
//   Ver: https://www.mongodb.com/docs/manual/core/gridfs/


// ============================================================
//  PREGUNTAS DE REFLEXIÓN — Respondé en los comentarios
// ============================================================

// PREGUNTA 1:
// ¿Cuál es el límite de tamaño de un documento en MongoDB?
// ¿Afecta solo a los campos BinData o a todo el documento?
// TU RESPUESTA:
//


// PREGUNTA 2:
// Tenés que diseñar una app donde los usuarios suben fotos de perfil
// (promedio: 200 KB) y videos de presentación (promedio: 80 MB).
// ¿Qué estrategia usarías para cada uno? ¿Por qué?
// TU RESPUESTA:
//


// PREGUNTA 3:
// ¿Por qué en el mundo real no se carga BinData desde el shell
// sino desde un lenguaje de programación como Node.js o Python?
// TU RESPUESTA:
//


// PREGUNTA 4:
// Mencioná dos ventajas concretas de guardar una imagen dentro
// del documento MongoDB en lugar de en un servidor de archivos separado.
// TU RESPUESTA:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
