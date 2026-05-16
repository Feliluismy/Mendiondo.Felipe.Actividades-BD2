// Respuesta A
use tienda_online;

db.productos.aggregate([
  { $group: { _id: "$categoria", total_productos: { $sum: 1 } } },
  { $sort: { total_productos: -1 } }
]);