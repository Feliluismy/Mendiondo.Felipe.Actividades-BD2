// ============================================================
//  PRÁCTICA MongoDB — Operaciones CRUD (resumen)
//  Basado en apuntes UTN Avellaneda — Páginas 33 a 34
// ============================================================
// Para ejecutar: abrí mongosh y corré:
//   load("mongodb_practica_operaciones_crud.js")
// ============================================================


// ============================================================
//  SECCIÓN 1 — Setup: 'usuarios' (la colección de los ejemplos)
// ============================================================

db = db.getSiblingDB('base1');
db.usuarios.drop();


// ============================================================
//  SECCIÓN 2 — CREATE: insertOne e insertMany
// ============================================================

print("\n--- insertOne ---");
db.usuarios.insertOne({
  _id: 1,
  nombre:   'Carlos',
  apellido: 'Lopez',
  rol:      'admin',
  active:   true
});

print("\n--- insertMany ---");
db.usuarios.insertMany([
  { _id: 2, nombre: 'Ana',    apellido: 'Garcia',    rol: 'gerente',  active: true  },
  { _id: 3, nombre: 'Pedro',  apellido: 'Martinez',  rol: 'usuario',  active: false },
  { _id: 4, nombre: 'Maria',  apellido: 'Fernandez', rol: 'admin',    active: true  },
  { _id: 5, nombre: 'Luis',   apellido: 'Rodriguez', rol: 'usuario',  active: false }
]);

print("\n--- Estado inicial ---");
db.usuarios.find().forEach(printjson);


// ============================================================
//  SECCIÓN 3 — READ: find con filtro y con proyección
// ============================================================

print("\n--- find con todos los documentos ---");
db.usuarios.find().forEach(printjson);

print("\n--- find con filtro: rol $in ['admin','gerente'] ---");
db.usuarios.find(
  { rol: { $in: ['admin', 'gerente'] } }
).forEach(printjson);

print("\n--- find con filtro Y proyección (solo nombre) ---");
db.usuarios.find(
  { rol: { $in: ['admin', 'gerente'] } },
  { nombre: 1 }
).forEach(printjson);
// Notar que también aparece _id por defecto.


// ============================================================
//  SECCIÓN 4 — UPDATE: updateOne, updateMany, replaceOne
// ============================================================

// 4.1 updateOne: cambiar SOLO el campo 'active' del usuario _id 1
print("\n--- updateOne: cambiar active a false en _id 1 ---");
db.usuarios.updateOne(
  { _id: { $eq: 1 } },
  { $set: { active: false } }
);
db.usuarios.find({ _id: 1 }).forEach(printjson);

// 4.2 updateMany: marcar inactivos a todos los usuarios con rol 'usuario'
print("\n--- updateMany: active = false para rol 'usuario' ---");
db.usuarios.updateMany(
  { rol: 'usuario' },
  { $set: { active: false } }
);
db.usuarios.find().forEach(printjson);

// 4.3 replaceOne: REEMPLAZAR ENTERO el documento _id 4
print("\n--- replaceOne: pisar el documento _id 4 con uno nuevo ---");
db.usuarios.replaceOne(
  { _id: 4 },
  {
    nombre:   'Maria',
    apellido: 'Fernandez',
    rol:      'super-admin',
    active:   true
    // Notar: NO está el campo 'edad' (no existía); tampoco va _id, lo conserva.
  }
);
db.usuarios.find({ _id: 4 }).forEach(printjson);


// ============================================================
//  SECCIÓN 5 — Diferencia clave: updateOne vs replaceOne
//  updateOne con $set deja los demás campos intactos.
//  replaceOne pisa todo lo que no aparece en el documento nuevo.
// ============================================================

db.usuarios.drop();
db.usuarios.insertOne({
  _id: 100,
  nombre:   'Pepe',
  apellido: 'Test',
  rol:      'admin',
  active:   true,
  email:    'pepe@test.com'
});

print("\n--- Antes ---");
db.usuarios.find({ _id: 100 }).forEach(printjson);

print("\n--- updateOne con $set: cambia solo 'rol' ---");
db.usuarios.updateOne(
  { _id: 100 },
  { $set: { rol: 'gerente' } }
);
db.usuarios.find({ _id: 100 }).forEach(printjson);
// nombre, apellido, active y email SIGUEN ahí.

print("\n--- replaceOne: pisa todo el documento ---");
db.usuarios.replaceOne(
  { _id: 100 },
  {
    nombre: 'Pepe',
    rol:    'gerente'
    // No incluyo apellido, active ni email → DESAPARECEN
  }
);
db.usuarios.find({ _id: 100 }).forEach(printjson);
// Quedan SOLO _id, nombre y rol.


// ============================================================
//  SECCIÓN 6 — DELETE: deleteOne y deleteMany
// ============================================================

// Recargamos la colección
db.usuarios.drop();
db.usuarios.insertMany([
  { _id: 1, nombre: 'Carlos', active: true  },
  { _id: 2, nombre: 'Ana',    active: false },
  { _id: 3, nombre: 'Pedro',  active: false },
  { _id: 4, nombre: 'Maria',  active: true  },
  { _id: 5, nombre: 'Luis',   active: false }
]);

print("\n--- deleteOne: borrar el primer 'active: false' ---");
db.usuarios.deleteOne({ active: false });
db.usuarios.find().forEach(printjson);

print("\n--- deleteMany: borrar TODOS los 'active: false' restantes ---");
db.usuarios.deleteMany({ active: { $eq: false } });
db.usuarios.find().forEach(printjson);


// ============================================================
//  EJERCICIOS PROPUESTOS — Resolvelos modificando este script
// ============================================================

// EJERCICIO 1 — CRUD completo sobre 'productos'
// (a) Insertá 5 productos con campos { _id, nombre, precio, stock, activo }.
// (b) Listá todos.
// (c) Listá los activos cuyo precio sea > 1000.
// (d) Cambiá el precio del producto _id 3 (con $set).
// (e) Marcá como inactivos a los que tengan stock 0 (con updateMany).
// (f) Borrá los productos inactivos.
// TU CÓDIGO:
//


// EJERCICIO 2 — replaceOne consciente
// Sobre 'productos', usá replaceOne para "pisar" el _id 1 con un
// documento NUEVO que tenga otra estructura ({ _id: 1, codigo: 'X-1',
// descripcion: '...', precioBruto: 999 }).
// Después listá ese documento — ¿quedaron los campos viejos?
// TU CÓDIGO:
//


// EJERCICIO 3 — find con proyección
// Listá nombre y precio (sin _id) de todos los productos.
// (Pista: la proyección { _id: 0, nombre: 1, precio: 1 } omite _id.)
// TU CÓDIGO:
//


// EJERCICIO 4 — Reflexión: updateOne vs replaceOne
// Tenés un documento con 10 campos. Querés:
//   (a) cambiar solo 1 campo
//   (b) reemplazar el documento por uno con otra estructura
// ¿Qué método usás en cada caso? ¿Por qué replaceOne sería peligroso
// si solo querés cambiar un campo?
// TU RESPUESTA:
//


// EJERCICIO 5 — CRUD sobre 'pedidos' (desafío)
// Definí una colección 'pedidos' con la forma:
//   { _id, cliente, fecha, items: [ { producto, cantidad } ], total, estado }
// (a) Insertá 3 pedidos con varios items.
// (b) Para el pedido _id 1, agregá un item al array items con $push.
// (c) Cambiá el estado a 'enviado' en el pedido _id 2 con $set.
// (d) Borrá los pedidos cuyo total sea menor a 500.
// TU CÓDIGO:
//


// EJERCICIO 6 — Tabla CRUD para tu propio dominio
// Pensá un dominio que conozcas (alumnos, peliculas, autos, etc.) y
// escribí, como comentarios, los 5-6 comandos CRUD más típicos que
// usaría una app real para ese dominio.
// TU CÓDIGO:
//


// ============================================================
//  FIN DEL SCRIPT
// ============================================================
