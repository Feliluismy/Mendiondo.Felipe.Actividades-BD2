// Respuesta D
use tienda_online;

db.productos.aggregate([
  { $group: { _id: "$categoria", total: { $sum: "$stock" } } },
  { $sort: { total: -1 } },
  { $project: { categoria: "$_id", total_productos: "$total", _id: 0 } }
]);