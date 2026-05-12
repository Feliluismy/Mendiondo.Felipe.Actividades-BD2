// --- Almacenar fecha y hora actual ---
use base1;
db.autos.drop();

db.autos.insertOne({
  patente: 'aaa111',
  fechahora: new Date()
});

db.autos.insertOne({
  patente: 'bbb222',
  fechahora: new Date()
});

db.autos.insertOne({
  patente: 'ccc333',
  fechahora: new Date()
});

db.autos.find().pretty();

// --- Almacenar una fecha específica ---
use base1;
db.empleados.drop();

db.empleados.insertOne({
  _id: 20456234,
  nombre: 'Rodriguez Pablo',
  fechaingreso: new Date(2010, 0, 31) // Meses son 0-11, 0 es Enero
});

db.empleados.insertOne({
  _id: 17488834,
  nombre: 'Gomez Ana',
  fechaingreso: new Date(2001, 11, 1) // 11 es Diciembre
});

db.empleados.insertOne({
  _id: 23463564,
  nombre: 'Juarez Carla',
  fechaingreso: new Date(2005, 3, 14) // 3 es Abril
});

db.empleados.find().pretty();

// Recuperar ordenado por fecha
db.empleados.find().pretty().sort({ fechaingreso: 1 });

