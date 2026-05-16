// Respuesta B
use tienda_online

db.productos.aggregate([
  { $sortByCount: "$categoria" },
  { $project: { categoria: "$_id", total_productos: "$count", _id: 0 } }
])