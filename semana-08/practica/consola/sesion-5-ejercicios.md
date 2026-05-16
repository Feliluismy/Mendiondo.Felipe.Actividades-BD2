# Sesión 5 — Arreglos de documentos embebidos (unidad 17)

> **Tema:** arreglos cuyos elementos son **documentos completos** (con sus propios subcampos), consultas con notación de punto sobre el arreglo, acceso por posición (`'arreglo.N.subcampo'`).
>
> **Material teórico:** `semana-07/teoria/mongosh/consola/unidad-17/mongodb_teoria_arreglos_embebidos.md`.
>
> **Cómo arrancar:**
>
> ```js
> use semana8_arreglos_embebidos
> ```

---

## Ejercicio 1 — Insertar un post con varios comentarios (simple)

Insertar en la colección `posts` este documento. El campo `comentarios` es un **arreglo de subdocumentos** (cada comentario es un documento con `autor`, `mail` y `contenido`):

```js
db.posts.insertOne({
  _id: 1,
  titulo: 'Lenguaje Java',
  contenido: 'Uno de los lenguajes mas utilizados es...',
  comentarios: [
    { autor: 'Marcos Paz',    mail: 'pazm@gmail.com',      contenido: 'Me parece un buen articulo'   },
    { autor: 'Ana Martinez',  mail: 'martineza@gmail.com', contenido: 'Todo ha cambiado en Java'     },
    { autor: 'Pablo Rodriguez', mail: 'pablor@outlook.com',  contenido: 'Coincido con el autor'        }
  ]
})

db.posts.insertOne({
  _id: 2,
  titulo: 'Lenguaje Python',
  contenido: 'Python es un lenguaje versátil...',
  comentarios: [
    { autor: 'Pablo Rodriguez', mail: 'pablor@outlook.com',  contenido: 'Excelente intro'             },
    { autor: 'Luiz Blanco',   mail: 'blancol@outlook.com', contenido: 'Falta mencionar pandas'      }
  ]
})

db.posts.insertOne({
  _id: 3,
  titulo: 'Lenguaje Go',
  contenido: 'Go es un lenguaje compilado moderno...',
  comentarios: [
    { autor: 'Ana Martinez',  mail: 'martineza@gmail.com', contenido: 'Muy claro' }
  ]
})
```

Verificar con `db.posts.find().pretty()` que los posts se insertaron correctamente y que `comentarios` aparece como un arreglo de documentos.

---

## Ejercicio 2 — Proyección sobre un subcampo del arreglo (simple)

Recuperar **todos los posts**, mostrando solo:

- el `titulo` del post
- el campo `autor` de cada uno de sus `comentarios` (omitir `mail` y `contenido`)

Sin `_id`.

> Pista: proyección con notación de punto sobre el arreglo:
>
> ```js
> { _id: 0, titulo: 1, 'comentarios.autor': 1 }
> ```

---

## Ejercicio 3 — Filtrar por un subcampo dentro del arreglo (simple)

Recuperar los posts donde **alguno** de los comentarios fue hecho por el autor `"Pablo Rodriguez"`. Mostrar todos los campos.

> Pista: cuando aplicás la notación de punto sobre un arreglo, MongoDB busca si **algún** elemento del arreglo cumple la condición:
>
> ```js
> { 'comentarios.autor': 'Pablo Rodriguez' }
> ```

---

## Ejercicio 4 — Filtrar por posición específica en el arreglo (avanzado)

Recuperar los posts donde el **primer comentario** (índice `0`) fue hecho por `"Pablo Rodriguez"`.

> Pista: `'comentarios.0.autor'` apunta al subcampo `autor` del elemento que está en la posición `0` del arreglo.

---

## Ejercicio 5 — Reflexión sobre embeber vs separar (avanzado)

Para cada uno de los siguientes casos, decidir si conviene **embeber** el dato como arreglo de subdocumentos dentro del documento principal, o **separarlo** en otra colección. Justificar en una línea:

1. Los **comentarios** de un post de blog (típicamente entre 0 y 50 por post).
2. Las **transacciones bancarias** de un cliente a lo largo de su vida (pueden ser millones).
3. Los **ítems** de una factura (entre 1 y 30 por factura, no cambian después de emitida).
4. Los **mensajes** de un chat entre dos usuarios (pueden ser decenas de miles).
5. Las **direcciones de envío** que un usuario guardó en su cuenta de e-commerce (típicamente 1 a 5).

> Pista: la regla del apunte dice que si el arreglo puede crecer "potencialmente a millones", hay que separar. Si es **acotado y razonable**, embeber suele ser la mejor opción. Considerar también el **límite de 16 MB** por documento.
