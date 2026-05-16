// Script de inicialización - Ejecutar primero
use tienda_online

db.productos.drop()

db.productos.insertMany([
  { nombre: "Laptop HP", precio: 12500, categoria: "Computadoras", stock: 15 },
  { nombre: "Mouse Logitech", precio: 850, categoria: "Periféricos", stock: 50 },
  { nombre: "Teclado Mecánico", precio: 6800, categoria: "Periféricos", stock: 30 },
  { nombre: "Monitor Samsung 24'", precio: 18500, categoria: "Monitores", stock: 20 },
  { nombre: "SSD 1TB", precio: 9200, categoria: "Almacenamiento", stock: 25 },
  { nombre: "RAM 16GB", precio: 7500, categoria: "Componentes", stock: 40 },
  { nombre: "Webcam HD", precio: 4500, categoria: "Periféricos", stock: 35 },
  { nombre: "Auriculares Bluetooth", precio: 5800, categoria: "Audio", stock: 45 },
  { nombre: "Impresora Multifunción", precio: 13200, categoria: "Impresoras", stock: 12 },
  { nombre: "Tablet Android", precio: 11000, categoria: "Tablets", stock: 18 }
])


print("✅ Base de datos inicializada correctamente")
print("Total de productos insertados: " + db.productos.countDocuments())


