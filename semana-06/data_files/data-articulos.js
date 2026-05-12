const articulos = [
  {
    _id: 1,
    nombre: "Mouse Gamer",
    rubro: "Electrónica",
    precio: 3500,
    stock: 25,
    etiqueta: ["gaming", "usb", "led"],
    nombre_url: "mouse-gamer",
    puntuacion: 8
  },
  {
    _id: 2,
    nombre: "Teclado Mecánico",
    rubro: "Electrónica",
    precio: 7800,
    stock: 15,
    etiqueta: ["gaming", "rgb", "mecánico"],
    nombre_url: "teclado-mecanico",
    puntuacion: 9
  },
  {
    _id: 3,
    nombre: "Auriculares Bluetooth",
    rubro: "Audio",
    precio: 4200,
    stock: 30,
    etiqueta: ["inalámbrico", "bluetooth", "audio"],
    nombre_url: "auriculares-bluetooth",
    puntuacion: 7
  },
  {
    _id: 4,
    nombre: "Monitor 24 pulgadas",
    rubro: "Electrónica",
    precio: 25000,
    stock: 10,
    etiqueta: ["monitor", "fullhd", "led"],
    nombre_url: "monitor-24",
    puntuacion: 8
  },
  {
    _id: 5,
    nombre: "Impresora Multifunción",
    rubro: "Oficina",
    precio: 18000,
    stock: 8,
    etiqueta: ["impresora", "wifi", "multifunción"],
    nombre_url: "impresora-multifuncion",
    puntuacion: 7
  },
  {
    _id: 6,
    nombre: "Silla Ergonómica",
    rubro: "Oficina",
    precio: 12000,
    stock: 12,
    etiqueta: ["silla", "ergonómica", "oficina"],
    nombre_url: "silla-ergonomica",
    puntuacion: 9
  },
  {
    _id: 7,
    nombre: "Notebook 15\"",
    rubro: "Computación",
    precio: 95000,
    stock: 5,
    etiqueta: ["notebook", "windows", "ssd"],
    nombre_url: "notebook-15",
    puntuacion: 8
  },
  {
    _id: 8,
    nombre: "Tablet 10\"",
    rubro: "Electrónica",
    precio: 32000,
    stock: 7,
    etiqueta: ["tablet", "android", "wifi"],
    nombre_url: "tablet-10",
    puntuacion: 7
  },
  {
    _id: 9,
    nombre: "Smartphone 128GB",
    rubro: "Telefonía",
    precio: 60000,
    stock: 20,
    etiqueta: ["smartphone", "android", "128gb"],
    nombre_url: "smartphone-128gb",
    puntuacion: 8
  },
  {
    _id: 10,
    nombre: "Cámara Web HD",
    rubro: "Electrónica",
    precio: 3500,
    stock: 18,
    etiqueta: ["cámara", "hd", "usb"],
    nombre_url: "camara-web-hd",
    puntuacion: 6
  },
  {
    _id: 11,
    nombre: "Disco Externo 1TB",
    rubro: "Almacenamiento",
    precio: 15000,
    stock: 14,
    etiqueta: ["disco", "externo", "usb"],
    nombre_url: "disco-externo-1tb",
    puntuacion: 9
  },
  {
    _id: 12,
    nombre: "Pendrive 32GB",
    rubro: "Almacenamiento",
    precio: 1800,
    stock: 40,
    etiqueta: ["pendrive", "usb", "32gb"],
    nombre_url: "pendrive-32gb",
    puntuacion: 7
  },
  {
    _id: 13,
    nombre: "Router WiFi",
    rubro: "Redes",
    precio: 6500,
    stock: 16,
    etiqueta: ["router", "wifi", "internet"],
    nombre_url: "router-wifi",
    puntuacion: 8
  },
  {
    _id: 14,
    nombre: "Switch 8 Puertos",
    rubro: "Redes",
    precio: 5200,
    stock: 9,
    etiqueta: ["switch", "redes", "8-puertos"],
    nombre_url: "switch-8p",
    puntuacion: 7
  },
  {
    _id: 15,
    nombre: "Cargador Universal",
    rubro: "Accesorios",
    precio: 1200,
    stock: 35,
    etiqueta: ["cargador", "universal", "usb"],
    nombre_url: "cargador-universal",
    puntuacion: 6
  },
  {
    _id: 16,
    nombre: "Cable HDMI",
    rubro: "Accesorios",
    precio: 900,
    stock: 50,
    etiqueta: ["cable", "hdmi", "video"],
    nombre_url: "cable-hdmi",
    puntuacion: 8
  },
  {
    _id: 17,
    nombre: "Soporte Celular",
    rubro: "Accesorios",
    precio: 700,
    stock: 60,
    etiqueta: ["soporte", "celular", "auto"],
    nombre_url: "soporte-celular",
    puntuacion: 7
  },
  {
    _id: 18,
    nombre: "Power Bank 10000mAh",
    rubro: "Accesorios",
    precio: 3500,
    stock: 22,
    etiqueta: ["powerbank", "batería", "usb"],
    nombre_url: "powerbank-10000",
    puntuacion: 9
  },
  {
    _id: 19,
    nombre: "Parlante Bluetooth",
    rubro: "Audio",
    precio: 4200,
    stock: 27,
    etiqueta: ["parlante", "bluetooth", "audio"],
    nombre_url: "parlante-bluetooth",
    puntuacion: 8
  },
  {
    _id: 20,
    nombre: "Micro SD 64GB",
    rubro: "Almacenamiento",
    precio: 2500,
    stock: 33,
    etiqueta: ["micro-sd", "64gb", "memoria"],
    nombre_url: "micro-sd-64gb",
    puntuacion: 7
  },
  {
    _id: 21,
    nombre: "Estabilizador",
    rubro: "Electrónica",
    precio: 4800,
    stock: 11,
    etiqueta: ["estabilizador", "corriente", "protección"],
    nombre_url: "estabilizador",
    puntuacion: 8
  },
  {
    _id: 22,
    nombre: "Lámpara LED",
    rubro: "Iluminación",
    precio: 1500,
    stock: 28,
    etiqueta: ["lámpara", "led", "iluminación"],
    nombre_url: "lampara-led",
    puntuacion: 7
  },
  {
    _id: 23,
    nombre: "Kit Herramientas PC",
    rubro: "Accesorios",
    precio: 3200,
    stock: 13,
    etiqueta: ["herramientas", "pc", "kit"],
    nombre_url: "kit-herramientas-pc",
    puntuacion: 8
  },
  {
    _id: 24,
    nombre: "Cooler CPU",
    rubro: "Electrónica",
    precio: 2700,
    stock: 19,
    etiqueta: ["cooler", "cpu", "ventilador"],
    nombre_url: "cooler-cpu",
    puntuacion: 7
  },
  {
    _id: 25,
    nombre: "Fuente ATX 600W",
    rubro: "Electrónica",
    precio: 8500,
    stock: 6,
    etiqueta: ["fuente", "atx", "600w"],
    nombre_url: "fuente-atx-600w",
    puntuacion: 8
  },
  {
    _id: 26,
    nombre: "Joystick USB",
    rubro: "Gaming",
    precio: 3900,
    stock: 17,
    etiqueta: ["joystick", "usb", "gaming"],
    nombre_url: "joystick-usb",
    puntuacion: 7
  },
  {
    _id: 27,
    nombre: "Webcam Full HD",
    rubro: "Electrónica",
    precio: 4800,
    stock: 14,
    etiqueta: ["webcam", "fullhd", "usb"],
    nombre_url: "webcam-fullhd",
    puntuacion: 8
  },
  {
    _id: 28,
    nombre: "Mouse Pad XL",
    rubro: "Accesorios",
    precio: 1100,
    stock: 38,
    etiqueta: ["mousepad", "xl", "gaming"],
    nombre_url: "mousepad-xl",
    puntuacion: 7
  },
  {
    _id: 29,
    nombre: "Cámara Deportiva",
    rubro: "Electrónica",
    precio: 9500,
    stock: 9,
    etiqueta: ["cámara", "deportiva", "video"],
    nombre_url: "camara-deportiva",
    puntuacion: 8
  },
  {
    _id: 30,
    nombre: "Micrófono USB",
    rubro: "Audio",
    precio: 3200,
    stock: 21,
    etiqueta: ["micrófono", "usb", "audio"],
    nombre_url: "microfono-usb",
    puntuacion: 9
  }
];



const name_collection = "articulos_pepe";

// Insertar los documentos en la colección 'articulos'
try {
  const resultado = db[name_collection].insertMany(articulos);


  print("=== INSERCIÓN COMPLETADA ===");
  print(`Total de artículos insertados: ${resultado.insertedIds.length}`);
  print("IDs insertados:", JSON.stringify(Object.values(resultado.insertedIds)));
  
  // Verificar la inserción
  const count = db[name_collection].countDocuments();
  print(`Total de documentos en la colección: ${count}`);
  
  print("\n=== EJEMPLOS DE CONSULTAS ===");
  print("Para ver todos los libros:");
  print(`db.${name_collection}.find().pretty()`);
  print("\nPara buscar por autor:");
  print(`db.${name_collection}.find({autor: "Gabriel García Márquez"}).pretty()`);
  print("\nPara buscar libros disponibles:");
  print(`db.${name_collection}.find({disponible: true}).pretty()`);
    print("\nPara buscar libros por género:");
  print(`db.${name_collection}.find({genero: "Novela psicológica"}).pretty()`);
} catch (error) {
  print("Error al insertar los datos:", error);
}