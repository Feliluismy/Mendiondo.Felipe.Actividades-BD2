# MongoDB en Consola — Tipo de dato `BinData` (Datos Binarios)

> **Fuente:** Apuntes UTN Avellaneda — Páginas 68 a 69
> **Nota:** El título del apunte dice "Tipo de dato Date" pero el contenido corresponde al tipo `BinData`.

---

## 20. Datos Binarios (`BinData`) en MongoDB

### ¿Qué es `BinData`?

MongoDB permite almacenar **datos binarios** directamente dentro de un campo de un documento. Esto incluye archivos de imagen (`.jpg`, `.png`), documentos (`.pdf`), audio, etc.

El tipo de dato correspondiente en MongoDB se llama **`BinData`** y en el shell se crea con la función `BinData(subtipo, datos_base64)`.

---

## Cómo usar `BinData` desde el shell

Como el shell tiene limitaciones para cargar archivos del sistema operativo, se trabaja con variables intermedias:

```js
// Paso 1: crear una variable con el dato binario en Base64
var datobinario = BinData(0, 'e8MEnzZoFyMmD7WSHdNrFJyEk8M=')

// Paso 2: usar la variable en el insertOne
db.usuarios.insertOne({
  nombre: 'marcos',
  clave: 'abc123',
  fotoperfil: datobinario   // ← campo de tipo BinData
})
```

Al hacer `find()`, el campo se muestra como:
```
"fotoperfil" : BinData(0, "e8MEnzZoFyMmD7WSHdNrFJyEk8M=")
```

### Parámetros de `BinData(subtipo, datos)`

| Parámetro | Descripción |
|---|---|
| `subtipo` | Número que indica el tipo binario. `0` es el genérico (datos binarios genéricos). |
| `datos` | Cadena codificada en **Base64** que representa el contenido binario. |

---

## Límite de tamaño: 16 MB

> ⚠️ Un documento en MongoDB **no puede superar los 16 MB**. Esto aplica al documento completo, incluyendo todos sus campos binarios.

### ¿Qué hacer con archivos más grandes?

| Tamaño del archivo | Estrategia recomendada |
|---|---|
| Menor a 16 MB | Almacenarlo directamente como `BinData` en el documento |
| Mayor a 16 MB | Guardar solo la **URL** de referencia al archivo externo |
| Muy grande (ej: película mp4) | Usar **GridFS** (técnica de troceo en múltiples documentos — ver docs oficiales de MongoDB) |

---

## En la práctica real: uso desde lenguajes de programación

Desde el shell la carga de binarios es limitada. En aplicaciones reales se usan los **drivers oficiales de MongoDB**, disponibles para:

`C` · `C++` · `C#` · `Go` · `Java` · `Node.js` · `Perl` · `PHP` · `Python` · `Ruby` · `Scala`

Estos drivers permiten leer un archivo del sistema operativo y enviarlo directamente al campo `BinData` del documento sin necesidad de codificarlo manualmente en Base64.

---

## Ventajas de almacenar datos binarios en MongoDB

Tener el archivo dentro del mismo documento (en lugar de en un servidor de archivos externo) aporta:

**Alta disponibilidad y replicación:** el motor replica los datos binarios junto con el resto del documento de forma transparente.

**Arquitectura más simple:** todos los datos de una entidad (metadatos + archivo) están centralizados en un único lugar. No hay que coordinar dos sistemas distintos.

**Distribución geográfica automática:** en réplicas distribuidas geográficamente, MongoDB propaga los datos binarios a todos los centros de datos sin configuración adicional.

**Seguridad integrada:** los datos binarios heredan automáticamente los mecanismos de autenticación y control de acceso de MongoDB.

**Mejor rendimiento de lectura:** al acceder a un documento se obtienen todos sus datos de una sola vez, sin referencias a otras ubicaciones.

---

## Diagrama de decisión — ¿Cómo almacenar un archivo?

```
¿Cuál es el tamaño del archivo?
         │
         ├── Menor a 16 MB ──────→ BinData dentro del documento ✓
         │
         ├── Mayor a 16 MB ──────→ Guardar URL como campo String
         │                          (el archivo vive en servidor externo)
         │
         └── Muy grande            GridFS: trocear en múltiples documentos
             (ej: video HD)        (consultar docs oficiales de MongoDB)
```

---

## Tabla resumen — Tipos de datos en MongoDB (completa)

| Tipo | Ejemplo de uso |
|---|---|
| `String` | Nombres, descripciones |
| `Integer32` / `Integer64` | Cantidades, precios enteros |
| `Double` | Precios con decimales |
| `Boolean` | Flags activo/inactivo |
| `Array` | Listas de editoriales, actores |
| `Object` | Subdocumentos (dirección, autor) |
| `Date` | Fechas de ingreso, nacimiento |
| **`BinData`** | **Imágenes, PDFs, archivos** |
| `ObjectId` | Identificador único automático (`_id`) |
