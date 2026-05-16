# MongoDB en Consola — Cargar y ejecutar archivos JavaScript

> **Fuente:** Apuntes UTN Avellaneda — Páginas 92 a 95

---

## 26. Cargar y ejecutar un archivo JavaScript `*.js`

En la unidad anterior vimos que `mongosh` es un intérprete de JavaScript. El paso lógico siguiente es **guardar los comandos en un archivo `.js`** y ejecutarlo de un solo golpe — exactamente como se hace con cualquier script.

> **Cuándo conviene:** scripts de mediana o gran complejidad, automatizaciones, datos de prueba reutilizables, despliegues, migraciones.

---

## La función `load()`

`load()` es la función del shell que **abre y ejecuta** un archivo `.js`.

### Sintaxis con path absoluto (Windows)

```js
load("c:\\scriptmongodb\\creacion.js")
```

> En Windows, las barras invertidas se duplican (`\\`) porque `\` es un carácter de escape en strings de JavaScript. En Linux/Mac se usa `/`: `load("/home/usuario/scripts/creacion.js")`.

### Sintaxis con path relativo

Si el archivo está en la **misma carpeta** desde donde se ejecutó `mongosh`, alcanza con el nombre:

```js
load("creacion.js")
```

### Resultado

`load()` devuelve `true` si el archivo se ejecutó sin errores:

```
> load("c:\\scriptmongodb\\creacion.js")
true
```

---

## Ejemplo paso a paso

### 1. Crear el archivo `creacion.js` con un editor de texto

```js
db.articulos.drop();

for (i = 1; i <= 10; i++) {
  db.articulos.insertOne({
    _id: i,
    nombre: 'nombre' + i
  });
}
```

### 2. Cargar el archivo desde el shell

```js
load("c:\\scriptmongodb\\creacion.js")
```

### 3. Verificar el resultado

```js
db.articulos.find().pretty()
```

```
{ "_id" : 1,  "nombre" : "nombre1"  }
{ "_id" : 2,  "nombre" : "nombre2"  }
...
{ "_id" : 10, "nombre" : "nombre10" }
```

---

## Ejecutar `mongo.exe` desde cualquier carpeta (Windows)

Para invocar el shell escribiendo solo `mongo` (en lugar del path completo `C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe`), hay que **agregar la carpeta `bin` a la variable de entorno `PATH`** del sistema.

A partir de ahí, el flujo típico queda:

```
C:\scriptmongodb> mongo
> load("creacion.js")
```

---

## Comandos del shell vs. scripts `*.js`

Algunos comandos del shell interactivo son **atajos** que **no funcionan** dentro de un archivo `.js`. En un script hay que reemplazarlos por sus equivalentes programáticos.

### Tabla de equivalencias

| Comando del shell | Equivalente en un script |
|---|---|
| `use base1` | `db = db.getSiblingDB('base1')` |
| `show dbs` / `show databases` | `db.adminCommand('listDatabases')` |
| `show collections` | `db.getCollectionNames()` |
| `show users` | `db.getUsers()` |
| `show roles` | `db.getRoles({ showBuiltinRoles: true })` |
| `show log` | `db.adminCommand({ getLog: '' })` |
| `show logs` | `db.adminCommand({ getLog: '*' })` |
| `it` (siguiente página de un cursor) | iterar manualmente con `hasNext()` / `next()` |

### Iteración manual de un cursor

En el shell, al ejecutar `db.coleccion.find()` y escribir `it`, MongoDB te pasa a la página siguiente. **En un script no existe `it`** — hay que hacerlo a mano:

```js
cursor = db.articulos.find();
while (cursor.hasNext()) {
  printjson(cursor.next());
}
```

---

## Salida por pantalla en scripts: `print()` y `printjson()`

Dentro de un `.js` cargado con `load()`, el "valor de retorno" de las expresiones **no se muestra automáticamente** como en el shell interactivo. Para imprimir hay que llamar funciones explícitas.

| Función | Para qué sirve |
|---|---|
| `print(x)` | Imprime un valor (string, número, etc.) en una línea |
| `printjson(obj)` | Imprime un objeto/documento con formato JSON legible |

### Ejemplos

```js
print("Hola mundo");
print(db.getCollectionNames());

printjson(db.adminCommand('listDatabases'));
printjson({ a: 1, b: [10, 20, 30] });
```

---

## Script completo de ejemplo (apunte)

```js
// Listar bases del servidor
printjson(db.adminCommand('listDatabases'));

// Cambiar a la base 'base1' (equivalente a 'use base1')
db = db.getSiblingDB('base1');

// Ver las colecciones de la base activa
print(db.getCollectionNames());

// Re-crear la colección articulos con 10 documentos
db.articulos.drop();
for (i = 1; i <= 10; i++) {
  db.articulos.insertOne({
    _id: i,
    nombre: 'nombre' + i
  });
}

// Recorrer el cursor manualmente
cursor = db.articulos.find();
while (cursor.hasNext()) {
  printjson(cursor.next());
}
```

Cargado con `load("creacion.js")`, este script:

1. Imprime las bases de datos del servidor.
2. Cambia a `base1`.
3. Muestra las colecciones que tiene `base1`.
4. Vacía y vuelve a poblar `articulos` con 10 documentos.
5. Recorre todos los documentos con un cursor.

---

## Resumen de la unidad

| Tarea | Cómo se hace |
|---|---|
| Cargar un script | `load("ruta/al/archivo.js")` |
| Path absoluto Windows | `load("c:\\scripts\\foo.js")` (doble barra) |
| Path relativo | `load("foo.js")` (relativo al cwd de mongosh) |
| Cambiar de base en script | `db = db.getSiblingDB('base1')` |
| Listar bases en script | `db.adminCommand('listDatabases')` |
| Listar colecciones | `db.getCollectionNames()` |
| Imprimir texto | `print(x)` |
| Imprimir objeto JSON | `printjson(x)` |
| Recorrer cursor | `while (cursor.hasNext()) { ... cursor.next() }` |

> **Idea para llevarte:** un archivo `.js` cargado con `load()` es una receta repetible. Lo mismo que hagas a mano puede convertirse en un script: poblar datos, crear índices, generar reportes, ejecutar migraciones controladas.
