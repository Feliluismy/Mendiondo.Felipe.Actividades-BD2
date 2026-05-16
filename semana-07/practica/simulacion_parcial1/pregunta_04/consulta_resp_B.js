// Respuesta B
use tienda_online;

var resultado = db.productos.deleteMany({
  stock: { $lte: 15 },
  precio: { $gt: 10000 }
});

print("Documentos eliminados: " + resultado.deletedCount);

// Verificar productos restantes
print("\nProductos restantes:");
db.productos.find({}, { nombre: 1, stock: 1, precio: 1 }).pretty();