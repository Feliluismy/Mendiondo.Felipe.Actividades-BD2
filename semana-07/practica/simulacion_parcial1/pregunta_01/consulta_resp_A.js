// Respuesta A
use tienda_online

db.productos.find(
  { precio: { $gt: 5000, $lt: 15000 } },
  { nombre: 1, precio: 1, _id: 0 }
).sort({ precio: -1 }).limit(5)