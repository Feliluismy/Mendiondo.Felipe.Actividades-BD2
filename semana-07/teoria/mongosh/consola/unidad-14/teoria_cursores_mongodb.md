# Cursores y sus métodos en MongoDB

Cada vez que llamamos al método `find` de una colección, este no devuelve los datos crudos, sino que retorna un objeto de la clase Cursor[cite: 5]. Si en el shell de MongoDB no asignamos el valor de este cursor a una variable, se muestran los documentos recuperados y la consola nos pedirá que confirmemos cada vez que se muestran 20 registros[cite: 6].

Podemos encadenar la llamada al método `find` con varios métodos de la clase Cursor para modificar cómo se devuelven los resultados[cite: 7]. 

## Métodos Principales del Cursor

### 1. Método `sort()`
A partir del cursor que retorna `find`, llamamos a `sort` indicando como condición el campo por el que queremos ordenar[cite: 54].
* Si pasamos un `1`, se ordena de forma ascendente[cite: 54].
* Si pasamos un `-1` (deducido del texto, aunque menciona 1 dos veces por error tipográfico del apunte original), se ordena de forma descendente[cite: 54].
* **Ejemplo:** `db.libros.find().sort({titulo:1})`[cite: 49].

### 2. Método `pretty()`
Este método nos ayuda cuando ejecutamos comandos desde el shell, ya que tiene por objetivo mostrarnos los datos del cursor en forma más legible (formateada)[cite: 70].
* **Ejemplo:** `db.libros.find().pretty()`[cite: 71].

### 3. Método `limit()`
Tiene por objetivo limitar a un determinado número la cantidad de documentos a recuperar del Cursor[cite: 117].
* Si una consulta retorna 4 documentos, podemos aplicar `limit(2)` para que recupere solo los dos primeros[cite: 118].
* **Ejemplo:** `db.libros.find().limit(2)`[cite: 122].

### 4. Método `skip()`
Permite saltear una determinada cantidad de documentos desde el principio del cursor[cite: 133].
* Si usamos `skip(1)`, indicamos que la consulta comience a devolver datos a partir del segundo documento hasta el final[cite: 135].
* **Ejemplo:** `db.libros.find().skip(1)`[cite: 134].

## Encadenamiento de Métodos
Los métodos se pueden combinar para lograr consultas más complejas. Por ejemplo, podemos saltear documentos, limitar la cantidad de resultados y mostrarlos de forma legible:
* **Ejemplo combinado:** `db.libros.find().skip(2).limit(2).pretty()`[cite: 149, 150].
* Esta instrucción recupera 2 documentos a partir del tercer documento del Cursor y los muestra en una forma legible[cite: 151].
