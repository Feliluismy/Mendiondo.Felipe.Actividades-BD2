# MongoDB en Consola — El campo `_id` y la clase `ObjectId`

> **Fuente:** Apuntes UTN Avellaneda — Páginas 61 a 63

---

## 18. Campo `_id` generado por MongoDB

### Dos formas de manejar el `_id`

En todos los documentos de MongoDB existe **siempre** un campo `_id` que actúa como clave primaria. Hay dos formas de definirlo:

| Modo | Descripción |
|---|---|
| **Manual** | El desarrollador asigna el valor: `_id: 1`, `_id: 'isbn-001'`, etc. No puede repetirse. |
| **Automático** | Si se omite `_id` al insertar, MongoDB lo genera automáticamente usando la clase `ObjectId`. |

### Ejemplo — inserción sin `_id` manual

```js
db.libros.insertOne({
  titulo: 'El aleph',
  autor: 'Borges',
  editorial: ['Siglo XXI', 'Planeta'],
  precio: 20,
  cantidad: 50
})
// MongoDB asigna automáticamente:
// _id: ObjectId("5c39e2c7687b2322fe53eba6")
```

---

## La clase `ObjectId`

### ¿Qué es?

`ObjectId` es el tipo de dato que MongoDB utiliza para generar identificadores únicos de forma automática. Su característica clave es que **garantiza unicidad incluso en entornos distribuidos con múltiples servidores**, sin necesidad de comunicación entre ellos.

### ¿Por qué no se usa un número autoincremental?

En bases de datos relacionales (MySQL, Oracle, SQL Server) el `_id` suele ser un número que se incrementa con cada inserción. En MongoDB esto **no es posible** en entornos distribuidos porque:

- Requeriría sincronización constante entre todos los servidores.
- Generaría cuellos de botella y tráfico excesivo de red.
- Rompería el modelo de escalabilidad horizontal de MongoDB.

> MongoDB fue diseñado desde su origen para ser una **base de datos distribuida**. El `ObjectId` resuelve el problema de unicidad sin coordinación entre servidores.

---

## Estructura interna del `ObjectId` (12 bytes)

Un `ObjectId` ocupa exactamente **12 bytes**, organizados de la siguiente manera:

```
┌──────────────────────────────────────────────┐
│              ObjectId  (12 bytes)            │
├────────────┬───────────┬──────────┬──────────┤
│  4 bytes   │  3 bytes  │ 2 bytes  │ 3 bytes  │
│ Timestamp  │  ID Máq.  │ ID Proc. │ Contador │
└────────────┴───────────┴──────────┴──────────┘
```

### Detalle de cada segmento

**Bytes 1–4 → Timestamp (segundos desde época Unix)**
- Almacenan los segundos transcurridos desde el 1° de enero de 1970.
- Consecuencia práctica: al ordenar documentos por `_id`, quedan **ordenados cronológicamente** según su fecha de inserción.

**Bytes 5–7 → Identificador de máquina**
- Valor único por servidor/máquina.
- Garantiza que dos servidores distintos **nunca generarán el mismo ObjectId**.

**Bytes 8–9 → Identificador de proceso**
- Generado con el ID del proceso que ejecutó la inserción.
- Evita colisiones entre múltiples procesos corriendo en **el mismo servidor**.

**Bytes 10–12 → Contador incremental**
- Contador que se incrementa por cada ObjectId generado dentro del mismo proceso en el mismo segundo.
- Permite generar hasta **16.777.216 ObjectIds únicos por proceso por segundo**.

---

## Resumen de garantías del `ObjectId`

| Segmento | Bytes | Garantiza unicidad entre... |
|---|---|---|
| Timestamp | 4 | Inserciones en distintos momentos |
| ID de máquina | 3 | Distintos servidores |
| ID de proceso | 2 | Distintos procesos en el mismo servidor |
| Contador | 3 | Múltiples inserciones en el mismo segundo y proceso |

> Los primeros **9 bytes** (timestamp + máquina + proceso) garantizan unicidad en todas las máquinas y procesos durante un segundo completo. Los últimos **3 bytes** (contador) extienden esa unicidad a millones de operaciones dentro de ese segundo.

---

## Diagrama conceptual — MongoDB distribuido

```
  Servidor A              Servidor B              Servidor C
  ──────────              ──────────              ──────────
  ObjectId(...)           ObjectId(...)           ObjectId(...)
    timestamp: igual        timestamp: igual        timestamp: igual
    máquina:   AAA  ←──── máquina:   BBB  ←──── máquina:   CCC
    proceso:   001          proceso:   001          proceso:   001
    contador:  000001       contador:  000001       contador:  000001

  Resultado: los tres ObjectIds son DISTINTOS gracias al ID de máquina
  Sin necesidad de sincronización entre servidores ✓
```
