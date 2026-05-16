"Imprimir todos los documentos de la colección 'articulos'."
db.articulos.find()
"Modificar el precio del mouse 'LOGITECH M90'."
db.articulos.updateMany({nombre : 'LOGITECH M90'},{$set:{precio: 567}})
"Fijar el stock en 0 del artículo cuyo _id es 6"
db.articulos.updateMany({_id: 6},{$set:{stock: 0}})
"Agregar el campo proveedores con el array ['Martinez','Gutierrez'] para el"
"artículo cuyo _id es 6."
db.articulos.updateMany({_id: 6},{$set:{proveedores:['Martinez','Gutierrez']}})
"Eliminar el campo proveedores para el artículo cuyo _id es 6."
db.articulos.updateMany({_id: 6},{$unset:{proveedores:[]}})

"actividad-5"
db.libros.find()
"Imprimir los libros cuyo autor es de nacionalidad Argentina."
db.libros.find({'autor.nacionalidad': {$eq: 'Argentina'}})
"Imprimir los libros cuyo autor se llama Borges."
db.libros.find({'autor.nombre': {$eq: 'Borges'}})
"Imprimir los libros cuyo autor es de nacionalidad Española y el precio es 45."
db.libros.find({$and: [{'autor.nacionalidad': {$eq: 'Española'}}, {'precio': {$eq: 45}}]})

"actividad-6"
"Imprimir todas las series."
db.series.find()
db.series.find({titulo: {$eq : 'The big bang theory'}})
db.series.find({titulo: 'The big bang theory'},{temporada1: 1})
"Imprimir el nombre del primer capítulo de la primera temporada de la serie 'The Walking Dead'."
db.series.find({titulo: 'The Walking Dead'},{_id:0, temporada1: {capitulo1:1}})

"actividad-7"
db.alumnos.find()
"Imprimir el apellido y la fecha de nacimiento de todos los alumnos."
db.alumnos.find({},{_id:0,apellido:1,fechanacimiento:1})
"Imprimir el nombre y el apellido de los alumnos ordenados por fecha de nacimiento de forma descendente."
db.alumnos.find().sort({fechanacimiento: -1})
db.alumnos.find({fechanacimiento: {$gte: new Date('1970-01-01')}})