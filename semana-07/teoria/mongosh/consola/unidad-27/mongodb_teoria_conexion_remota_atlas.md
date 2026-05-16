# MongoDB en Consola — Conexión a un servidor remoto (MongoDB Atlas)

> **Fuente:** Apuntes UTN Avellaneda — Páginas 96 a 100

---

## 27. Conectarnos a un servidor remoto desde el shell

Hasta ahora trabajamos contra un servidor MongoDB **instalado localmente** (en `localhost:27017`). En esta unidad damos el salto a un **servidor remoto** alojado en la nube usando **MongoDB Atlas**, el servicio gestionado de la propia empresa que desarrolla MongoDB.

> **Idea clave:** una vez conectados, **todo lo que aprendimos sigue funcionando igual** — `use`, `db.coleccion.insertOne`, `find`, índices, `explain`, scripts, etc. Lo único que cambia es **a dónde se conecta el shell**.

---

## ¿Qué es MongoDB Atlas?

Atlas es una plataforma **DBaaS** (Database as a Service) que ofrece MongoDB en la nube:

- Hospedado sobre **AWS, Azure o Google Cloud**.
- Incluye un **tier gratuito (M0)** ideal para aprender y experimentar.
- Provee replicación, backups, monitoreo y autenticación administrados.
- Se accede por la misma URL que cualquier deployment MongoDB, usando el shell de siempre.

---

## Pasos para crear y conectarse a un servidor en Atlas

### 1. Registrarse en MongoDB Atlas

- Ir a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
- Crear una cuenta (Start Free).

### 2. Crear un Cluster

- Elegir proveedor de nube: **AWS**, **GCP** o **Azure**.
- Elegir una región (preferiblemente una que tenga **FREE TIER AVAILABLE**, como `N. Virginia (us-east-1)` o `Frankfurt (eu-central-1)`).
- Confirmar **M0 Sandbox** para usar el tier gratuito.
- Presionar **Create Cluster** (la primera vez puede tardar unos minutos).

### 3. Crear un usuario de base de datos

En la sección **Database Access** se da de alta el usuario que va a conectarse:

- **Username:** ej. `diegomoisset`
- **Password:** clave fuerte (Atlas puede autogenerarla).
- **User Privileges:** seleccionar **Read and write to any database** (para los ejemplos del curso).

> **No confundir** el usuario de Atlas (cuenta web del panel) con el **usuario de base de datos** (el que se usa al conectarse desde `mongosh`). Son cuentas distintas.

### 4. Permitir el acceso desde tu IP

En **Network Access**: agregar la IP desde la que te vas a conectar (o `0.0.0.0/0` para permitir desde cualquier lado — **solo para pruebas**).

### 5. Obtener la cadena de conexión

En el cluster → botón **Connect** → **Connect with the Mongo Shell** (o **Connect with mongosh** en la UI moderna).

Atlas muestra una cadena de conexión con dos formatos:

| Formato | Usa |
|---|---|
| **Short SRV connection string** | `mongodb+srv://...` (shell 3.6+) — **recomendado** |
| **Standard connection string** | `mongodb://nodo1,nodo2,nodo3/...` (shell 3.4+) |

Ejemplo de cadena SRV:

```
mongodb+srv://cluster0-azrix.mongodb.net/test
```

---

## Conectarse desde la consola

Una vez con la cadena en el portapapeles, abrimos una terminal y ejecutamos:

```bash
mongo "mongodb+srv://cluster0-azrix.mongodb.net/test" --username diegomoisset
```

(En versiones modernas el binario se llama `mongosh` en lugar de `mongo`.)

El shell pedirá la **clave** del usuario:

```
Enter password: ********
```

Una vez autenticados, vemos un prompt distinto al local:

```
MongoDB Enterprise Cluster0-shard-0:PRIMARY>
```

Eso significa:

- **Cluster0-shard-0** → estamos en el shard 0 del cluster.
- **PRIMARY** → estamos conectados al nodo primario del replica set (el que acepta escrituras).

---

## Anatomía de la cadena de conexión SRV

```
mongodb+srv://<usuario>:<clave>@<host>/<base>?<opciones>
```

| Parte | Significado |
|---|---|
| `mongodb+srv://` | Protocolo con descubrimiento DNS automático |
| `<usuario>:<clave>` | Credenciales (opcional si se pasan por flags) |
| `<host>` | Hostname del cluster en Atlas |
| `<base>` | Base por defecto (la del `use` inicial) |
| `<opciones>` | Parámetros: `retryWrites=true`, `w=majority`, etc. |

### Cómo NO compartir la clave

- **No commitees** una cadena con clave embebida.
- Pasala por **flag** (`--username` + prompt) o por **variable de entorno**.
- Para automatización segura: usá `mongosh "$MONGO_URI"` con `MONGO_URI` en un archivo `.env` no versionado.

---

## Una vez conectados: todo funciona igual

Atlas no cambia la API: las mismas operaciones que ya conocemos funcionan idénticas. Por ejemplo:

```js
show dbs

use base1
db.libros.drop()

db.libros.insertOne({
  _id: 1,
  titulo: 'El aleph',
  autor: 'Borges',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
})

db.libros.insertOne({
  _id: 2,
  titulo: 'Martin Fierro',
  autor: 'Jose Hernandez',
  editorial: ['Siglo XXI'],
  precio: 50,
  cantidad: 12
})

show collections
db.libros.find()
```

Las únicas diferencias con un servidor local son operativas:

- **Latencia mayor** (vamos por internet).
- **Cuotas** del tier M0 (512 MB de almacenamiento, conexiones limitadas).
- **Auditoría/monitoreo** disponibles en el panel web.
- **No hay acceso al filesystem del servidor** ni al shell del SO.

---

## Diferencias entre conexión local y Atlas

| Aspecto | Local | Atlas |
|---|---|---|
| URI típico | `mongodb://localhost:27017` | `mongodb+srv://cluster.../base` |
| Autenticación | Suele estar deshabilitada por defecto | **Obligatoria** (usuario + clave) |
| Encriptado en tránsito | Generalmente no | **TLS/SSL siempre activo** |
| Topología | Stand-alone | **Replica set** de 3 nodos |
| Prompt | `>` | `MongoDB Enterprise Cluster0-shard-0:PRIMARY>` |
| Acceso | Solo desde la máquina | Desde donde lo permita Network Access |

---

## Resumen de la unidad

| Paso | Qué hacer |
|---|---|
| 1 | Registrarse en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) |
| 2 | Crear un Cluster M0 (free tier) en una región disponible |
| 3 | Crear un usuario de base de datos con clave |
| 4 | Permitir tu IP en **Network Access** |
| 5 | Copiar la **cadena de conexión SRV** desde **Connect** |
| 6 | Conectarse: `mongosh "<cadena>" --username <usuario>` |
| 7 | Trabajar igual que en local: `show dbs`, `use ...`, `db.coleccion.insertOne(...)`, etc. |

> **En una frase:** Atlas te da un MongoDB en la nube, y `mongosh` se conecta a él exactamente igual que a uno local — solo cambian la URL, las credenciales y el prompt.
