db.libros.find({
  $and: [{ precio: { $gt: 20 } }, { precio: { $lt: 100 } }],
});
