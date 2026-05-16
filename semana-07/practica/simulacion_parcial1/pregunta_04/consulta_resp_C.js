// Respuesta C
use tienda_online;

var resultado = db.productos.remove({
  $and: [
    { stock: { $lte: 15 } },
    { precio: { $gt: 10000 } }
  ]
});

print("Documentos eliminados: " + resultado.nRemoved);

// Verificar productos restantes
print("\nProductos restantes:");
db.productos.find({}, { nombre: 1, stock: 1, precio: 1 }).pretty();