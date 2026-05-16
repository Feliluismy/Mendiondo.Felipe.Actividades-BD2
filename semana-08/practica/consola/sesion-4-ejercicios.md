# Sesión 4 — El shell es JavaScript + cargar scripts (unidades 25–26)

> **Tema:** `mongosh` como intérprete JS, funciones, `for` para poblar datos, `load()`, `print` / `printjson`, `db.getSiblingDB(...)`.
>
> **Material teórico:** `unidad-25/mongodb_teoria_shell_javascript.md` y `unidad-26/mongodb_teoria_cargar_archivos_js.md`.
>
> **Cómo arrancar:**
>
> ```js
> use semana8_scripts
> ```

---

## Ejercicio 1 — JavaScript puro en el shell (simple)

Escribir en `mongosh` (no en un archivo):

1. Una variable `x = 7` y mostrar `x * x`.
2. Una llamada a `Math.pow(2, 10)`.
3. Una variable `hoy = new Date()` y mostrar `hoy.toISOString()`.

> Pista: `mongosh` evalúa cualquier expresión JS. No hace falta `print` cuando lo escribís a mano — el valor se muestra solo.

---

## Ejercicio 2 — Función reutilizable (simple)

Definir en el shell una función `clasificarSueldo(s)` que reciba un sueldo (número) y devuelva:

- `"bajo"` si `s < 700000`
- `"medio"` si `700000 <= s < 1100000`
- `"alto"` si `s >= 1100000`

Probarla con `clasificarSueldo(500000)`, `clasificarSueldo(900000)` y `clasificarSueldo(1500000)`.

> Pista: la función queda viva durante toda la sesión de `mongosh`. Si cerrás y volvés a abrir el shell, hay que volver a declararla.

---

## Ejercicio 3 — Poblar una colección con un `for` (simple)

Vaciar la colección `articulos` (si existe) y poblarla con **20 artículos** usando un `for`. Cada artículo debe tener:

- `_id`: del 1 al 20
- `nombre`: `"articulo" + i`
- `precio`: un número aleatorio entre 100 y 1000 (usá `Math.floor(Math.random() * 901) + 100`)
- `stock`: el `i` (para tener stocks distintos)

Después hacer `db.articulos.find().limit(5)` para ver los primeros 5.

> Pista: usar `db.articulos.drop()` antes del `for` para empezar limpio. Adentro del `for`, llamar `db.articulos.insertOne({...})` por cada `i`.

---

## Ejercicio 4 — Escribir un archivo `creacion.js` y cargarlo (avanzado)

Crear un archivo de texto llamado **`creacion.js`** en la misma carpeta desde la que abrieron `mongosh` (o usar un path absoluto). El archivo debe:

1. Cambiar a la base `semana8_scripts` con la forma equivalente a `use` para scripts.
2. Vaciar la colección `productos`.
3. Insertar 100 productos con un `for`, donde cada producto tenga `_id: i`, `codigo: "P" + i`, `categoria: i % 2 === 0 ? "par" : "impar"` y `precio: i * 10`.
4. Imprimir cuántos productos quedaron en la colección al final.

Después, desde `mongosh`, cargarlo con:

```js
load("creacion.js")
```

> Pista: dentro de un script, `use base1` no funciona — hay que usar `db = db.getSiblingDB('semana8_scripts')`. Para imprimir el conteo final usá `print()` (no es interactivo, no se muestra solo).

---

## Ejercicio 5 — Ver el código fuente de un método (simple)

En el shell, escribir el nombre de un método **sin paréntesis** y observar la salida:

```js
db.articulos.insertOne
```

¿Qué muestra MongoDB? ¿Por qué pasa eso? ¿Qué cambia si lo escribís **con** paréntesis y un argumento?

> Pista: en JS, una función sin invocar es un valor (un objeto `Function`). El shell, cuando le pasás un valor, lo imprime. Esto sirve para curiosear cómo está implementado un método.
