# Guía para ejecutar scripts JavaScript en MongoDB (mongosh)

## Introducción

MongoDB Shell (mongosh) permite ejecutar scripts JavaScript para automatizar tareas como inserción de datos, consultas complejas y configuraciones. Esta guía te ayudará a ejecutar cualquier archivo `.js` en diferentes colecciones.

## Métodos de ejecución

### 1. **Método directo - Copiar y pegar**
```bash
# Conectar a MongoDB
mongosh

# Seleccionar/crear la base de datos
use nombre_de_tu_base_datos

# Copiar y pegar todo el contenido del script directamente
```

### 2. **Método con archivo externo**
```bash
# Guardar tu script como 'mi_script.js'
# Ejecutar desde terminal (método recomendado):
mongosh nombre_base_datos mi_script.js

# O ejecutar con URI completa:
mongosh "mongodb://localhost:27017/nombre_base_datos" mi_script.js

# Para MongoDB Atlas o conexiones remotas:
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/nombre_base_datos" mi_script.js
```

### 3. **Método load() desde mongosh**
```bash
# Primera opción: especificar base de datos al conectar
mongosh "mongodb://localhost:27017/nombre_base_datos"

# Segunda opción: conectar y luego seleccionar
mongosh
use nombre_base_datos

# Cargar el archivo usando load()
load("ruta/completa/al/archivo/mi_script.js")

# En Windows:
load("C:\\ruta\\al\\archivo\\mi_script.js")

# En Linux/Mac:
load("/home/usuario/scripts/mi_script.js")
```

# Comparativo: MongoDB Shell vs JavaScript para archivos .js

Tenemos el siguiente cuadro comparativo entre las diferencias de usar MongoDB Shell directamente y poder cargar todo desde un archivo JS. Teniendo en cuenta lo siguiente, vamos a poder crear un archivo JS que se puede ejecutar dentro de mongosh:

| MongoDB Shell | JavaScript Equivalente | Descripción |
|---------------|------------------------|-------------|
| `use base1` | `db = db.getSiblingDB('base1')` | Cambia a la base de datos especificada |
| `show dbs`, `show databases` | `db.adminCommand('listDatabases')` | Muestra todas las bases de datos disponibles |
| `show collections` | `db.getCollectionNames()` | Lista todas las colecciones de la base de datos actual |
| `show users` | `db.getUsers()` | Muestra todos los usuarios de la base de datos actual |
| `show roles` | `db.getRoles()` | Lista todos los roles definidos en la base de datos actual |
| `show log` | `db.adminCommand({ getLog: '' })` | Muestra el log general del servidor MongoDB |
| `show logs` | `db.adminCommand({ getLog: '*' })` | Muestra todos los tipos de logs disponibles |
| `it` | `cursor = db.collection.find(); while (cursor.hasNext()) { printjson(cursor.next()); }` | Itera y muestra los siguientes resultados de un cursor |

## Ventajas de usar archivos JavaScript

- **Reutilización**: Los scripts pueden ejecutarse múltiples veces
- **Versionado**: Se pueden guardar en sistemas de control de versiones
- **Automatización**: Facilita la ejecución de operaciones complejas
- **Portabilidad**: Los archivos pueden compartirse entre diferentes entornos








## Estructura recomendada para scripts

### Script básico de inserción
```javascript
// Ejemplo: insertar_productos.js
try {
  // Verificar que estamos en la base de datos correcta
  print("Base de datos actual: " + db.getName());
  
  // Limpiar colección si es necesario (opcional)
  // db.productos.drop();
  
  // Insertar documentos
  const resultado = db.productos.insertMany([
    {
      nombre: "Producto 1",
      precio: 100,
      categoria: "Electrónicos"
    },
    {
      nombre: "Producto 2",
      precio: 200,
      categoria: "Hogar"
    }
    // ... más documentos
  ]);
  
  print(`✅ Insertados ${resultado.insertedIds.length} documentos exitosamente`);
  print("IDs insertados:", resultado.insertedIds);
  
} catch (error) {
  print("❌ Error durante la inserción:", error);
}
```

### Script con múltiples colecciones
```javascript
// Ejemplo: setup_tienda.js
try {
  print("=== Configurando base de datos de tienda ===");
  
  // Insertar productos
  db.productos.insertMany([...]);
  print("✅ Productos insertados");
  
  // Insertar categorías
  db.categorias.insertMany([...]);
  print("✅ Categorías insertadas");
  
  // Insertar usuarios
  db.usuarios.insertMany([...]);
  print("✅ Usuarios insertados");
  
  // Crear índices
  db.productos.createIndex({ "nombre": 1 });
  db.productos.createIndex({ "precio": 1 });
  print("✅ Índices creados");
  
} catch (error) {
  print("❌ Error en la configuración:", error);
}
```

## Paso a paso detallado

### 1. **Preparar tu script**
- Crear archivo `.js` con el código JavaScript
- Incluir manejo de errores con `try-catch`
- Usar `print()` para mostrar mensajes informativos

### 2. **Conectar a MongoDB**
```bash
# Conexión local
mongosh "mongodb://localhost:27017"

# Conexión con autenticación
mongosh "mongodb://usuario:password@localhost:27017/mi_base_datos"

# Conexión a MongoDB Atlas
mongosh "mongodb+srv://usuario:password@cluster.mongodb.net/"
```

### 3. **Seleccionar base de datos**
```javascript
// Desde mongosh
use mi_base_datos_ejemplo

// O especificar en la conexión
mongosh "mongodb://localhost:27017/mi_base_datos_ejemplo"
```

### 4. **Ejecutar el script**
```bash
# Método recomendado (desde terminal)
mongosh mi_base_datos_ejemplo mi_script.js

# Método alternativo (desde mongosh)
load("mi_script.js")
```

### 5. **Verificar la ejecución**
```javascript
// Contar documentos insertados
db.mi_coleccion.countDocuments()

// Ver algunos documentos
db.mi_coleccion.find().limit(3)

// Verificar índices (si se crearon)
db.mi_coleccion.getIndexes()
```

## Ejemplos de scripts para diferentes casos

### Script de inicialización de datos
```javascript
// init_escuela.js - Para sistema escolar
try {
  print("🏫 Inicializando base de datos escolar...");
  
  // Estudiantes
  db.estudiantes.insertMany([...]);
  
  // Profesores  
  db.profesores.insertMany([...]);
  
  // Materias
  db.materias.insertMany([...]);
  
  print("✅ Base de datos escolar inicializada");
} catch (error) {
  print("❌ Error:", error);
}
```

### Script de consultas y reportes
```javascript
// reportes.js - Generar reportes
try {
  print("📊 Generando reportes...");
  
  // Reporte de ventas
  const ventasPorMes = db.ventas.aggregate([
    { $group: { _id: "$mes", total: { $sum: "$monto" } } }
  ]).toArray();
  
  print("Ventas por mes:", ventasPorMes);
  
} catch (error) {
  print("❌ Error en reportes:", error);
}
```

## Consejos y buenas prácticas

### ✅ **Recomendaciones:**
- Usar `try-catch` para manejo de errores
- Incluir mensajes informativos con `print()`
- Verificar la base de datos actual con `db.getName()`
- Hacer backup antes de ejecutar scripts que modifiquen datos
- Usar rutas absolutas en `load()` para evitar problemas

### ⚠️ **Precauciones:**
- Probar scripts en entorno de desarrollo primero
- Tener cuidado con `drop()` - elimina toda la colección
- Verificar conexión a la base de datos correcta
- No hardcodear credenciales en los scripts

### 🔧 **Comandos útiles para verificación:**
```javascript
// Ver bases de datos disponibles
show dbs

// Ver colecciones en la base actual
show collections

// Verificar base de datos actual
db.getName()

// Contar documentos en una colección
db.nombre_coleccion.countDocuments()

// Ver estructura de un documento
db.nombre_coleccion.findOne()
```

## Ejemplos de ejecución por terminal

```bash
# Para diferentes sistemas operativos:

# Windows (PowerShell/CMD)
mongosh "mongodb://localhost:27017/mi_tienda" "C:\scripts\productos.js"

# Linux/Mac
mongosh "mongodb://localhost:27017/mi_tienda" "/home/usuario/scripts/productos.js"

# Con variables de entorno
mongosh $MONGO_URI mi_script.js

# Ejecutar múltiples scripts
mongosh mi_base_datos script1.js
mongosh mi_base_datos script2.js
mongosh mi_base_datos script3.js
```





