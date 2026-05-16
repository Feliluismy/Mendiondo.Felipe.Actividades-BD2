// Respuesta B
use tienda_online;

db.productos.updateMany(
  { nombre: { $regex: "Bluetooth", $options: "i" } },
  [{ $set: { precio_descuento: { $multiply: ["$precio", 0.9] } } }]
);

// Verificar
db.productos.find({ nombre: /Bluetooth/i });