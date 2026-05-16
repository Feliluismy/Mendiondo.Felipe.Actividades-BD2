// Respuesta B
use tienda_online

db.productos.find(
  { precio: { $gte: 5000, $lte: 15000 } },
  { nombre: 1, precio: 1 }
).sort({ precio: -1 }).limit(5)