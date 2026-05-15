// ============================================================
//  CORRECCIONES - Felipe Mendiondo
//  Semana 06 - Práctica MongoDB
//  (mismas respuestas del archivo "respuesta" + feedback en // )
// ============================================================


// ============================================================
//  ACTIVIDAD 01 — Operadores relacionales (Problemas Propuestos 1.3)
//  Colección: articulos
// ============================================================
"actividad-01"

// Problema 2 — Imprimir todos los documentos
db.articulos.find()
// OK

// Problema 3 — Artículos que NO son impresoras
db.articulos.find({rubro:{$ne:"impresora"}})
// OK. También se podía resolver con $nin: { rubro: { $nin: ['impresora'] } }

// Problema 4 — Artículos de rubro 'mouse'
db.articulos.find({rubro:{$eq:"mouse"}})
// OK. Tip: { $eq: "mouse" } es equivalente a la forma corta { rubro: "mouse" }.
// Las dos sintaxis son válidas y dan el mismo resultado.

// Problema 5 — Artículos con precio >= 5000
db.articulos.find({precio:{$gte:5000}})
// OK

// Problema 6 — Impresoras con precio >= 3500
db.articulos.find({
    $and:[
        {rubro:{$eq:"impresora"}},
        {precio:{$gte:3500}}
    ]
})
// OK. Tip: cuando son condiciones sobre campos DISTINTOS podés usar
// AND implícito (es más limpio de leer):
//   db.articulos.find({ rubro: "impresora", precio: { $gte: 3500 } })
// El $and explícito conviene reservarlo para dos condiciones sobre el
// MISMO campo (ver siguiente problema).

// Problema 7 — Artículos con stock entre 0 y 4
db.articulos.find({
    $and:[
        {stock:{$gte:0}},
        {stock:{$lte:4}}
    ]
})
// OK. Para un RANGO sobre el mismo campo, MongoDB acepta la forma
// compacta dentro del mismo objeto:
//   db.articulos.find({ stock: { $gte: 0, $lte: 4 } })
// Las dos formas son equivalentes; la compacta es la más usada.


// ============================================================
//  ACTIVIDAD 02 — deleteOne / deleteMany (Problemas Propuestos 1.4)
//  Colección: articulos
// ============================================================
"actividad-02"

// Problema 3 — Borrar las impresoras
db.articulos.deleteMany({rubro:'impresora'})
// OK con la sintaxis IMPLÍCITA, pero la consigna pedía resolverlo con
// LAS DOS SINTAXIS (acordate de recargar la colección entre una y otra).
// Te faltó la versión con $eq explícito:
//   db.articulos.deleteMany({ rubro: { $eq: 'impresora' } })

// Problema 4 — Borrar artículos con _id >= 5
db.articulos.deleteMany({_id:{$gte:5}})
// OK


// ============================================================
//  ACTIVIDAD 03 — updateOne (Problemas Propuestos 1.5)
//  Colección: articulos
// ============================================================
"actividad-03"

// Problema 2 — Imprimir todos los documentos
db.articulos.find()
// OK

// Problema 3 — Modificar el precio del mouse 'LOGITECH M90'
db.articulos.updateOne({$and:[
    {rubro:{$eq:"mouse"}},
    {nombre:{$eq: "LOGITECH M90"}}
]},{$set:{precio:4500}}
)
// OK, devuelve el resultado correcto, pero el filtro está sobre-construido.
// El _id ya es único, así que con _id:6 alcanzaba:
//   db.articulos.updateOne({ _id: 6 }, { $set: { precio: 4500 } })
// O bien, si querés filtrar por el nombre, no hace falta el $and ni el $eq:
//   db.articulos.updateOne({ nombre: "LOGITECH M90" }, { $set: { precio: 4500 } })

// ⚠️ FALTA — Problema 4: "Fijar el stock en 0 del artículo cuyo _id es 6"
//   db.articulos.updateOne({ _id: 6 }, { $set: { stock: 0 } })

// Problema 5 — Agregar 'proveedores' al artículo _id 6
db.articulos.updateMany({_id:6},{$set:{preovedores:["Martinez","Gutierrez"]}})
// ⚠️ TYPO en el nombre del campo: "preovedores" → debería ser "proveedores".
//    En MongoDB esto NO da error: directamente te crea un campo nuevo con
//    el nombre mal escrito y queda así en la base. Por eso conviene mirar
//    siempre con find() después de un update.
// ⚠️ Si el filtro es por _id (único), usá updateOne en vez de updateMany.
//    Lo correcto sería:
//      db.articulos.updateOne(
//        { _id: 6 },
//        { $set: { proveedores: ["Martinez", "Gutierrez"] } }
//      )

// Problema 6 — Eliminar el campo 'proveedores' del _id 6
db.articulos.updateMany({_id:6},{$unset:{preovedores:[]}})
// ⚠️ Mismo typo "preovedores" arrastrado del problema anterior. Si quedó
//    bien escrito en la base (proveedores), este $unset NO borra nada
//    porque el campo "preovedores" no existe.
// ⚠️ Por convención, el valor de $unset es string vacío '' (no [] ni true),
//    aunque MongoDB acepta cualquier valor (ignora el contenido).
// ⚠️ Otra vez: updateOne, no updateMany.
// Forma correcta:
//   db.articulos.updateOne({ _id: 6 }, { $unset: { proveedores: '' } })


// ============================================================
//  ACTIVIDAD 04 — updateMany (Problemas Propuestos 1.6)
//  Colección: articulos
// ============================================================
"actividad-04"

// Problema 2 — Imprimir todos los documentos
db.articulos.find()
// OK

// Problema 3 — Stock en 0 para TODOS los monitores
db.articulos.updateMany({rubro:"monitor"},{$set:{stock:0}})
// OK

// Problema 4 — Agregar 'pedir: true' a TODOS los artículos con stock == 0
db.articulos.updateMany({stock:0},{$set:{pedir:true}})
// OK

// Problema 5 — Eliminar el campo 'pedir' de TODOS los documentos
db.articulos.updateMany({pedir:true},{$unset:{pedir:true}})
// ⚠️ La consigna pide eliminar el campo "pedir" de TODOS los documentos,
//    no solo de los que tienen pedir:true. Aunque en este dataset el
//    resultado coincide (porque pedir solo existe donde es true), la
//    intención de la consigna es usar filtro vacío {} para alcanzar a
//    todos los documentos. Forma correcta:
//      db.articulos.updateMany({}, { $unset: { pedir: '' } })
// ⚠️ Convención: el valor del $unset es '' (string vacío), no true.


// ============================================================
//  ACTIVIDAD 05 — Operadores lógicos (Problemas Propuestos 1.7/1.8)
//  Colección: medicamentos
// ============================================================
"actividad-5"

// Problema 2 — Imprimir todos los documentos
db.medicamentos.find()
// OK

"and"
// Problema 3 — Laboratorio 'Roche' Y precio menor a 5
db.medicamentos.find({$and:[{laboratorio:{$eq:'Roche'}},{precio:{$lte:5}}]})
// ⚠️ ATENCIÓN AL OPERADOR: la consigna dice "precio MENOR a 5", que es
//    estrictamente menor → $lt (no $lte). $lte incluye al 5, $lt lo excluye.
//    Con $lte estás trayendo el "Sertal" (precio 5.20) NO lo trae igual
//    porque 5.20 > 5, pero si hubiera un medicamento con precio = 5 lo
//    incluiría y la consigna no lo quiere.
//    Forma correcta:
//      db.medicamentos.find({ laboratorio: 'Roche', precio: { $lt: 5 } })
//    (acá AND implícito queda más limpio que $and explícito)

"Recupere los medicamentos cuyo laboratorio sea 'Roche' o cuyo"
"precio sea menor a 5."
// Problema 4 — Laboratorio 'Roche' O precio menor a 5
db.medicamentos.find({$or:[{laboratorio:{$eq:'Roche'}},{precio:{$lte:5}}]})
// ⚠️ Mismo error que arriba: "menor a 5" → $lt:5 (no $lte:5).
// El $or sí está bien planteado.

"Muestre todos los medicamentos cuyo laboratorio NO sea Bayer"
// Problema 5
db.medicamentos.find({laboratorio:{$ne:"Bayer"}})
// OK

"Muestre todos los medicamentos cuyo laboratorio sea Bayer y cuya"
"cantidad NO sea=100"
// Problema 6
db.medicamentos.find({$and:[{laboratorio:{$eq:"Bayer"}},{cantidad:{$ne:100}}]})
// OK. También se podía escribir como AND implícito:
//   db.medicamentos.find({ laboratorio: "Bayer", cantidad: { $ne: 100 } })

"Elimine todos los documentos de la colección medicamentos cuyo"
"laboratorio sea igual a Bayer y su precio sea mayor a 10"
// Problema 7
db.medicamentos.deleteMany({$and:[{laboratorio:{$eq:"Bayer"}},{precio:{$gt:10}}]})
// OK. $gt está bien usado ("mayor a 10" es estricto).

"Cambie la cantidad por 200, a todos los medicamentos de Roche"
"cuyo precio sea mayor a 5"
// Problema 8
db.medicamentos.updateMany({$and:[{laboratorio:{$eq:"Roche"}},{precio:{$gt:5}}]},{$set:{cantidad:200}})
// OK. Buen uso de updateMany y $gt (estricto).

"Borre los medicamentos cuyo laboratorio sea Bayer o cuyo precio"
"sea menor a 3"
// Problema 9
db.medicamentos.deleteMany({$or:[{laboratorio:{$eq:"Bayer"}},{precio:{$lt:3}}]})
// OK. Buen uso de $or y $lt.


// ============================================================
//  RESUMEN GENERAL DE LA CORRECCIÓN
// ============================================================
//
// Aciertos:
// - Comprendiste bien la lógica de find/delete/update.
// - Usás correctamente $and y $or.
// - Buen patrón de hacer find() antes de un update/delete para verificar.
//
// A mejorar:
// 1) "$lt" vs "$lte" → cuando la consigna dice "menor a X" es ESTRICTO ($lt).
//    "Menor o igual a X" es $lte. Misma lógica para $gt/$gte.
// 2) updateOne vs updateMany → si filtrás por _id (que es único),
//    usá updateOne. updateMany es para varios documentos a la vez.
// 3) Cuidado con los typos en nombres de campo ("preovedores").
//    MongoDB no te avisa: crea el campo mal escrito sin error.
// 4) AND implícito vs explícito:
//    - Campos distintos → AND implícito (más limpio): { a: 1, b: 2 }
//    - Mismo campo dos veces → $and explícito o forma compacta { a: { $gte:.., $lte:.. } }
// 5) Faltan entregas:
//    - Sintaxis con $eq explícito en actividad-02 (problema 3 con las dos formas).
//    - Problema 4 de actividad-03 (stock = 0 al _id 6).
// 6) En $unset el valor por convención es '' (string vacío).
//
// ============================================================
