// --- Preparación de datos con arreglos de documentos embebidos ---
use base1;
db.posts.drop();

db.posts.insertOne({
  _id: 1,
  titulo: 'Lenguaje Java',
  contenido: 'Uno de los lenguajes más utilizados es...',
  comentarios: [
    {
      autor: 'Marcos Paz',
      mail: 'pazm@gmail.com',
      contenido: 'Me parece un buen...'
    },
    {
      autor: 'Ana Martinez',
      mail: 'martineza@gmail.com',
      contenido: 'Todo ha cambiado en...'
    },
    {
      autor: 'Luiz Blanco',
      mail: 'blancol@outlook.com',
      contenido: 'Afirmo que es...'
    }
  ]
});

db.posts.insertOne({
  _id: 2,
  titulo: 'Lenguaje C#',
  contenido: 'Microsoft desarrolla el lenguaje C# con el objetivo...',
  comentarios: [
    {
      autor: 'Pablo Rodriguez',
      mail: 'rodriguezp@gmail.com',
      contenido: 'Correcta idea.'
    },
    {
      autor: 'Maria Contreras',
      mail: 'contrerasm@gmail.com',
      contenido: 'Buen punto de vista...'
    }
  ]
});


// --- Consultas en arreglos de documentos embebidos ---

// Mostrar todo el post formateado
db.posts.find().pretty();

// Proyectar solo el título del post y el autor de los comentarios
db.posts.find({}, { _id: 0, titulo: 1, 'comentarios.autor': 1 }).pretty();

// Recuperar posts donde un autor específico ha comentado
db.posts.find({ 'comentarios.autor': 'Pablo Rodriguez' }).pretty();

// Recuperar posts donde un autor específico fue el primer comentarista (índice 0)
db.posts.find({ 'comentarios.0.autor': 'Pablo Rodriguez' }).pretty();

