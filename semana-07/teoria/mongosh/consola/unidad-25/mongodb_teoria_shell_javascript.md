# MongoDB en Consola — Shell y JavaScript

> **Fuente:** Apuntes UTN Avellaneda — Páginas 87 a 91

---

## 25. MongoDB Shell y JavaScript

Hasta ahora hemos usado `mongosh` (el shell de MongoDB) como un intérprete de comandos para hablar con el servidor. Pero **el shell es, en realidad, un entorno de JavaScript**: cualquier expresión, función o estructura del lenguaje puede ejecutarse directamente en él.

Esto abre dos posibilidades muy importantes:

1. **Automatizar tareas administrativas y de carga de datos** con código.
2. **Inspeccionar la implementación interna** de los métodos de MongoDB.

---

## El shell es un intérprete de JavaScript

Podemos ejecutar código JS estándar como en cualquier consola:

```js
x = 1;
x++;        // x ahora vale 2
x;          // imprime 2

cubo = Math.pow(x, 3);   // 2^3
cubo;       // imprime 8
```

Todo lo que sabemos de JavaScript funciona:

- Variables (`var`, `let`, `const`)
- Operadores (`+`, `++`, `===`, ...)
- Estructuras de control (`if`, `for`, `while`)
- Objetos `Math`, `Date`, `JSON`, etc.
- Funciones definidas por el usuario

### Definir y llamar funciones

```js
function mayor(x1, x2) {
  if (x1 > x2)
    return x1;
  else
    return x2;
}

mayor(10, 3);    // 10
mayor(6, 34);    // 34
```

Las funciones quedan disponibles **durante toda la sesión** del shell.

---

## Personalización del prompt

El shell expone una variable global llamada **`prompt`** que define lo que se muestra al inicio de cada línea. Podemos asignarle una **función** que devuelva un string, y será evaluada antes de cada línea.

### Ejemplo 1 — Mostrar la fecha y hora actuales

```js
prompt = function() {
  return (new Date()) + "> ";
};
```

Resultado:

```
Mon Jan 21 2019 12:55:34 GMT-0300>
```

### Ejemplo 2 — Mostrar la base de datos activa (más útil)

```js
prompt = function() {
  return db + "> ";
};
```

Resultado al cambiar de base:

```
test> use base1
switched to db base1
base1>
```

> **Nota:** las versiones modernas de `mongosh` ya muestran la base activa por defecto. Aún así, asignarle una función a `prompt` sigue siendo válido para personalizarlo.

---

## Poblar una colección con datos de prueba (loop JavaScript)

Una de las aplicaciones más útiles del shell-como-JS es **generar datos sintéticos** para probar consultas, índices y rendimiento.

### Ejemplo del apunte — 10 artículos

```js
use base1
db.articulos.drop();

for (i = 1; i <= 10; i++) {
  db.articulos.insertOne({
    _id: i,
    nombre: 'nombre' + i
  });
}

db.articulos.find().pretty();
```

Resultado:

```js
{ "_id" : 1,  "nombre" : "nombre1"  }
{ "_id" : 2,  "nombre" : "nombre2"  }
{ "_id" : 3,  "nombre" : "nombre3"  }
...
{ "_id" : 10, "nombre" : "nombre10" }
```

### Por qué es útil

- Probar **rendimiento** con miles o millones de documentos.
- Verificar el efecto de un **índice** comparando `explain()` antes/después.
- Generar datasets controlados para reproducir bugs.
- Sembrar datos iniciales en entornos de desarrollo.

---

## Desplegar el código JavaScript de los métodos de MongoDB

Si escribimos el nombre de un método **sin paréntesis**, el shell **muestra su implementación**:

```js
use base1
db.articulos.insertOne     // sin paréntesis
```

Devuelve la función completa de `insertOne`:

```js
function (document, options) {
    var opts = Object.extend({}, options || {});

    // Add _id ObjectId if needed
    document = this.addIdIfNeeded(document);

    // Get the write concern
    var writeConcern = this._createWriteConcern(opts);

    // Result
    var result = { acknowledged: (writeConcern && writeConcern.w == 0) ? false : true };

    // Use bulk operation API already in the shell
    var bulk = this.initializeOrderedBulkOp();
    bulk.insert(document);

    try {
        bulk.execute(writeConcern);
    } catch (err) {
        if (err instanceof BulkWriteError) {
            if (err.hasWriteErrors())  { throw err.getWriteErrorAt(0); }
            if (err.hasWriteConcernError()) { throw err.getWriteConcernError(); }
        }
        throw err;
    }

    if (!result.acknowledged) return result;

    result.insertedId = document._id;
    return result;
}
```

### Diferencia clave

| Sintaxis | Qué hace |
|---|---|
| `db.articulos.insertOne(...)` | **Ejecuta** el método con argumentos |
| `db.articulos.insertOne` | **Muestra** el código fuente del método |

Esta característica viene de JavaScript: una función sin invocar es un valor (un objeto `Function`), y al evaluarlo en el shell se imprime su código.

> Es muy útil para entender **qué hace internamente** un método o para descubrir opciones no documentadas.

---

## Resumen de la unidad

| Concepto | Cómo se aplica |
|---|---|
| El shell es JS | `x = 1; x++; Math.pow(x, 3)` corre directo en `mongosh` |
| Funciones de usuario | Se declaran con `function nombre(...) { ... }` y quedan disponibles toda la sesión |
| Prompt personalizado | `prompt = function() { return ... }` |
| Carga masiva | `for (...)` con `db.coleccion.insertOne(...)` |
| Ver código fuente | Escribir el método **sin paréntesis**: `db.articulos.insertOne` |

### Comandos clave

```js
// Ejecutar JavaScript arbitrario
Math.pow(2, 10)

// Definir una función reutilizable
function saludo(nombre) { return 'Hola ' + nombre; }
saludo('Ana')

// Personalizar el prompt
prompt = function() { return db + "> "; };

// Poblar con datos sintéticos
for (i = 1; i <= 1000; i++) {
  db.articulos.insertOne({ _id: i, nombre: 'nombre' + i });
}

// Ver implementación de un método (sin paréntesis)
db.articulos.insertOne
```
