// Respuesta C
use tienda_online;

db.productos.aggregate([
  { $group: { _id: "$categoria", total_productos: { $count: {} } } },
  { $sort: { total_productos: -1 } }
]);