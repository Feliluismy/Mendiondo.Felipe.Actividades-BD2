// ============================================================
//  PRÁCTICA MongoDB — Arreglos de Documentos Embebidos
//  Consultas con notación de punto e índice de arreglo
//  Basado en apuntes UTN Avellaneda — Páginas 54 a 60
// ============================================================
// Para ejecutar: abrí mongosh y corré: load("practica_arreglos_embebidos.js")
// ============================================================


// ------------------------------------------------------------
// SECCIÓN 1: COLECCIÓN "posts" — arreglo de comentarios (docs embebidos)
// ------------------------------------------------------------

use("base1");
db.posts.drop();

db.posts.insertOne({
  _id: 1,
  titulo: 'Lenguaje Java',
  contenido: 'Uno de los lenguajes más utilizados es ...',
  comentarios: [
    { autor: 'Marcos Paz',       mail: 'pazm@gmail.com',       contenido: 'Me parece un buen...'    },
    { autor: 'Ana Martinez',     mail: 'martineza@gmail.com',  contenido: 'Todo ha cambiado en...'  },
    { autor: 'Luiz Blanco',      mail: 'blancol@outlook.com',  contenido: 'Afirmo que es...'        }
  ]
});

db.posts.insertOne({
  _id: 2,
  titulo: 'Lenguaje C#',
  contenido: 'Microsoft desarrolla el lenguaje C# con el objetivo ...',
  comentarios: [
    { autor: 'Pablo Rodriguez',  mail: 'rodriguezp@gmail.com',  contenido: 'Correcta idea.'         },
    { autor: 'Maria Contreras',  mail: 'contrerasm@gmail.com',  contenido: 'Buen punto de vista...' }
  ]
});


// -- Ejemplo 1: Ver todos los posts formateados
print("\n--- Todos los posts ---");
db.posts.find().pretty();

// -- Ejemplo 2: Projection sobre subcampo del arreglo
//    Recuperar título de cada post y autores de sus comentarios (sin _id)
print("\n--- Títulos y autores de comentarios ---");
db.posts.find(
  {},
  { _id: 0, titulo: 1, 'comentarios.autor': 1 }
).pretty();

// -- Ejemplo 3: Filtrar por valor en cualquier posición del arreglo
//    Posts donde algún comentario fue de 'Pablo Rodriguez'
print("\n--- Posts comentados por Pablo Rodriguez (cualquier posición) ---");
db.posts.find({ 'comentarios.autor': 'Pablo Rodriguez' }).pretty();

// -- Ejemplo 4: Filtrar por posición específica en el arreglo
//    Posts donde el PRIMER comentario (índice 0) fue de 'Pablo Rodriguez'
print("\n--- Posts donde el primer comentario es de Pablo Rodriguez ---");
db.posts.find({ 'comentarios.0.autor': 'Pablo Rodriguez' }).pretty();


// ------------------------------------------------------------
// SECCIÓN 2: COLECCIÓN "series" — anidamiento de múltiples niveles
//            (Problemas propuestos 1.10)
// ------------------------------------------------------------

db.series.drop();

db.series.insertOne({
  _id: 1,
  titulo: 'The big bang theory',
  productor: 'Chuck Lorre',
  actores: ['Johnny Galecki','Jim Parsons','Kaley Cuoco','Kunal Nayyar','Simon Helberg','Mayim Bialik','Melissa Rauch'],
  temporada1: [
    { capitulo1: { titulo: 'Piloto',                           audiencia: 8300000  } },
    { capitulo2: { titulo: 'La hipótesis del Gran Cerebro',    audiencia: 8700000  } },
    { capitulo3: { titulo: 'El Corolario de el Gato con Botas', audiencia: 9200000 } }
  ],
  temporada2: [
    { capitulo1: { titulo: 'El paradigma del pescado malo',    audiencia: 10000000 } },
    { capitulo2: { titulo: 'La topología de la bragueta',      audiencia: 11000000 } }
  ]
});

db.series.insertOne({
  _id: 2,
  titulo: 'The Walking Dead',
  productor: 'Robert Kirkman',
  actores: ['Andrew Lincoln','Jon Bernthal','Sarah Wayne Callies','Laurie Holden','Jeffrey DeMunn','Steven Yeun'],
  temporada1: [
    { capitulo1: { titulo: 'TS 19',                 audiencia: 7000000  } },
    { capitulo2: { titulo: 'Wildfire',              audiencia: 8200000  } },
    { capitulo3: { titulo: 'Díselo a las ranas',    audiencia: 9100000  } }
  ],
  temporada2: [
    { capitulo1: { titulo: 'Lo que queda por delante', audiencia: 12000000 } },
    { capitulo2: { titulo: 'Sangría',                  audiencia: 13000000 } }
  ]
});


// ============================================================
//  EJERCICIOS PROPUESTOS (1.10) — Resolvé vos cada uno
//  Trabajar sobre la colección "series" de la Sección 2
// ============================================================

// EJERCICIO 2:
// Imprimir todos los documentos de la colección 'series'.
// TU RESPUESTA:
// db.series.find( ___ ).pretty();


// EJERCICIO 3:
// Imprimir los datos de todas las temporadas de 'The big bang theory'.
// Pista: filtrá por titulo y usá projection para mostrar temporada1 y temporada2.
// TU RESPUESTA:
// db.series.find(
//   { ___ },
//   { ___ }
// ).pretty();


// EJERCICIO 4:
// Imprimir los datos de TODOS los capítulos de la primer temporada de 'The big bang theory'.
// Pista: similar al anterior pero proyectá solo temporada1 (y opcionalmente titulo).
// TU RESPUESTA:
// db.series.find(
//   { ___ },
//   { ___ }
// ).pretty();


// EJERCICIO 5:
// Imprimir solo el primer capítulo de la primer temporada de 'The Walking Dead'.
// Pista: usá la notación de índice 'temporada1.0' en la projection.
// TU RESPUESTA:
// db.series.find(
//   { ___ },
//   { ___ }
// ).pretty();


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
