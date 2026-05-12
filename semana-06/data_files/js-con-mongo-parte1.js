print("Bases de datos existentes:");
printjson(db.adminCommand('listDatabases'));




db = db.getSiblingDB('ARTICULOS');
print("\\nConectado a la base de datos 'ARTICULOS'.");

print("\\nColecciones en 'ARTICULOS':");
print(db.getCollectionNames());

let cursor = db.articulos.find();
print("\\nDocumentos en la colección 'articulos':");

print("\\n--- Recorriendo con forEach() ---");
cursor = db.articulos.find();
cursor.forEach(function(doc) {
    printjson(doc);
});

print("\\n--- Recorriendo con hasNext() y next() ---");
cursor = db.articulos.find();
while (cursor.hasNext()) {
    let doc = cursor.next();
    printjson(doc);
}

print("\\n--- Recorriendo con toArray() ---");
cursor = db.articulos.find();
let documentosArray = cursor.toArray();
let totalDocumentos = documentosArray.length;

print(`Se encontraron ${totalDocumentos} documentos.`);

if (totalDocumentos > 1) {
    print("\\nMostrando solo el segundo elemento (índice 1):");
    let unDocumento = documentosArray[1];
    printjson(unDocumento);
}

print("\\nRecorriendo el array completo con un bucle for:");
for (let i = 0; i < totalDocumentos; i++) {
    printjson(documentosArray[i]);
}

db = db.getSiblingDB('empresa');
db.empleados.drop();
db.empleados.insertMany([
    {
        "nombre": "Carlos Ruiz",
        "departamento": "Ingeniería",
        "proyectos": [
            { "nombre": "Proyecto A", "horas": 30 },
            { "nombre": "Proyecto B", "horas": 45 }
        ]
    },
    {
        "nombre": "Laura Gómez",
        "departamento": "Marketing",
        "proyectos": [
            { "nombre": "Proyecto C", "horas": 60 },
            { "nombre": "Proyecto D", "horas": 55 }
        ]
    },
    {
        "nombre": "Diego",
        "departamento": "Desarrollo",
        "proyectos": [
            { "nombre": "App Móvil", "horas": 60 },
            { "nombre": "Sistema Interno", "horas": 50 }
        ]
    }
]);

print("\\n==========================================================");
print("EJEMPLO CON LA COLECCIÓN 'empleados'");
print("==========================================================");

print("\\n--- Resultados del análisis de empleados (con forEach) ---");
db.empleados.find().forEach(function(empleado) {
    print("Empleado: " + empleado.nombre);
    let totalHoras = 0;

    empleado.proyectos.forEach(function(proyecto) {
        print("  - Proyecto: " + proyecto.nombre + " | Horas: " + proyecto.horas);
        totalHoras += proyecto.horas;
    });

    print("  Total de horas trabajadas: " + totalHoras);

    if (totalHoras > 100) {
        print("  --> ¡Este empleado ha trabajado más de 100 horas!");
    }
    print("---------------------------------");
});

print("\\n--- Resultados del análisis de empleados (con hasNext y next) ---");
let empleadosCursor = db.empleados.find();

while (empleadosCursor.hasNext()) {
    let empleado = empleadosCursor.next();
    print("Empleado: " + empleado.nombre);
    let totalHoras = 0;

    if (empleado.proyectos && empleado.proyectos.length > 0) {
        for (let i = 0; i < empleado.proyectos.length; i++) {
            let proyecto = empleado.proyectos[i];
            print("  - Proyecto: " + proyecto.nombre + " | Horas: " + proyecto.horas);
            totalHoras += proyecto.horas;
        }
    }

    print("  Total de horas trabajadas: " + totalHoras);

    if (totalHoras > 100) {
        print("  --> ¡Este empleado trabajó más de 100 horas!");
    }
    print("---------------------------------");
}

print("\\nFin del script.");