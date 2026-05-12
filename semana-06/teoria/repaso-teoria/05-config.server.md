## Config Servers

Los **Config Servers** son como el **"cerebro"** o **"directorio telefónico"** del cluster de sharding en MongoDB.

## ¿Qué hacen exactamente?

### **Metadatos Críticos que Almacenan:**
```javascript
// Config servers saben cosas como:
{
  "database": "ecommerce",
  "collection": "productos", 
  "shard_key": {"categoria": 1},
  "chunks": [
    {"min": {"categoria": "A"}, "max": {"categoria": "H"}, "shard": "shard1"},
    {"min": {"categoria": "I"}, "max": {"categoria": "P"}, "shard": "shard2"},
    {"min": {"categoria": "Q"}, "max": {"categoria": "Z"}, "shard": "shard3"}
  ]
}
```

### **Analogía Simple:**
Imagina un gran centro comercial con muchas tiendas:

```
🏬 CENTRO COMERCIAL (Cluster Sharding)
├── 📋 DIRECTORIO (Config Servers)
│   ├── "Electrónicos: Piso 1, Local A-H"
│   ├── "Ropa: Piso 2, Local I-P" 
│   └── "Libros: Piso 3, Local Q-Z"
├── 🚪 INFORMACIÓN (mongos router)
└── 🏪 TIENDAS (shards con datos reales)
```

## Flujo de Trabajo:

```
1. [APLICACIÓN] → "Busco laptops"
                    ↓
2. [MONGOS] → "¿Dónde están las laptops?"
                    ↓
3. [CONFIG SERVER] → "Las laptops están en shard2"
                    ↓
4. [MONGOS] → va directo al [SHARD 2]
                    ↓
5. [SHARD 2] → devuelve resultados de laptops
```

## Información que Guardan:

### **1. Mapeo de Chunks (Fragmentos):**
- Qué rangos de datos están en cada shard
- Cuándo se dividieron los chunks
- Cuándo se movieron entre shards

### **2. Configuración del Cluster:**
- Lista de shards disponibles
- Estado de cada shard (activo/inactivo)
- Configuración de balanceador

### **3. Historial de Operaciones:**
- Migraciones de datos entre shards
- Cambios en la configuración
- Splits de chunks

## Características Importantes:

### **Alta Disponibilidad:**
```
Config Server Replica Set (recomendado):
[Config Primary] ←→ [Config Secondary 1] ←→ [Config Secondary 2]
```
- Mínimo 3 config servers en producción
- Si se caen los config servers = cluster no funciona

### **Consistencia Crítica:**
- **Sin config servers** = mongos no sabe dónde buscar datos
- **Config servers corruptos** = datos perdidos o inconsistentes
- **Backup crítico** = siempre respaldar config servers

## Ejemplo Práctico:

```javascript
// Consulta: db.productos.find({categoria: "laptops", precio: {$lt: 1000}})

// 1. mongos pregunta a config server:
"¿Dónde están los documentos con categoria: 'laptops'?"

// 2. Config server responde:
"categoria: 'laptops' está en shard2, chunks del rango I-P"

// 3. mongos va solo a shard2, no busca en shard1 ni shard3
// Resultado: consulta 3x más rápida
```

## Resumen:

**Config Servers = GPS del Sharding**
- Te dicen **dónde** está cada dato
- **Sin ellos** = cluster paralizado  
- **Con ellos** = consultas inteligentes y eficientes
- **Siempre** deben estar disponibles y respaldados

Son pequeños en tamaño pero **críticos** para el funcionamiento de todo el cluster sharding.