

Aunque los **Replica Sets** en MongoDB ofrecen muchas ventajas (como alta disponibilidad y tolerancia a fallos), también tienen algunas **limitaciones** importantes que conviene conocer, especialmente para entender cuándo usarlos y qué esperar de ellos.


### ❌ Limitaciones principales de un **Replica Set** en MongoDB

#### 1. **Solo un nodo puede escribir a la vez (el Primary)**
- Aunque tengas 3, 5 o 7 servidores, **solo el nodo Primary** acepta operaciones de escritura (insertar, actualizar, borrar).
- Los secundarios solo leen y replican datos.
- ✅ Esto garantiza consistencia, pero ❌ puede ser un cuello de botella si tenés muchas escrituras.

> 🔁 Si el Primary se cae, otro nodo se convierte en Primary… pero durante ese tiempo (30 seg aprox), **no se pueden hacer escrituras**.

---

#### 2. **Lecturas pueden estar desactualizadas (por defecto)**
- Por defecto, las lecturas van al **Primary**, pero si configurás tu app para leer de los **Secondary**, podrías ver datos **viejos** (porque aún no terminaron de replicar).
- Esto se llama **consistencia eventual**.

> 🕒 Ejemplo: Insertás un dato → el Primary lo guarda, pero el Secondary aún no lo tiene → si leés del Secondary, no lo ves.

---

#### 3. **Cantidad máxima recomendada de nodos: 7**
- MongoDB permite hasta **50 nodos** en un Replica Set, pero **solo 7 pueden votar** (ser elegibles como Primary).
- Los demás pueden ser **nodos de respaldo o observadores** (no votan).
- Esto es por eficiencia: demasiados votos ralentizan las elecciones.

---

#### 4. **No escala escrituras horizontalmente**
- A diferencia de los **sharded clusters**, un Replica Set **no distribuye las escrituras**.
- Si tu app crece mucho, el Primary puede saturarse.
- ✅ Solución: pasar a **sharding**, pero es más complejo.

---

#### 5. **Requiere red estable y baja latencia**
- Todos los nodos se comunican constantemente.
- Si la red es lenta o inestable, la replicación se atrasa, y puede haber problemas con las elecciones o el estado del conjunto.

> 🌍 No es ideal tener nodos en continentes muy lejanos sin configuración especial.

---

#### 6. **No es un respaldo (backup) completo por sí solo**
- Aunque tengas copias en varios servidores, si alguien borra datos por error, ¡ese borrado también se replica!
- ❌ Un Replica Set **no protege contra errores humanos** o datos corruptos.

> ✅ Solución: igual necesitás **backups periódicos** (con `mongodump`, snapshots, etc.).

---

#### 7. **Configuración más compleja que un servidor único**
- Requiere planificación: número impar de nodos, configuración de red, autenticación, etc.
- Si no se hace bien, puede haber problemas de elección, partición de red ("split-brain"), o caídas innecesarias.

---

### ✅ ¿Entonces para qué sirve un Replica Set?
👉 Para **alta disponibilidad**, no para escalar escrituras ni reemplazar backups.

Es ideal cuando:
- No querés que tu base de datos se caiga si falla un servidor.
- Tu carga de lectura es alta (podés leer de secundarios).
- Tu aplicación necesita estar siempre disponible.

---

### 📝 Resumen en una tabla:

| Limitación | Explicación breve |
|----------|-------------------|
| ✍️ Un solo Primary | Solo un nodo puede escribir |
| ⏳ Datos desactualizados | Los secundarios pueden tener retraso |
| 🗳️ Máximo 7 nodos votantes | Aunque puedas tener más, solo 7 eligen al Primary |
| 📈 No escala escrituras | No sirve para distribuir cargas altas de escritura |
| 🌐 Requiere buena red | Latencia alta = problemas de sincronización |
| 💣 No protege contra errores humanos | Si se borra algo, se replica a todos |
| ⚙️ Configuración más compleja | Requiere más planificación que un servidor simple |

---

¿Querés que lo convierta en una diapositiva o ficha para entregar a los alumnos? Puedo armarlo en formato simple.