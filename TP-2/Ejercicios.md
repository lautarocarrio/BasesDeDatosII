Ejercicio 1:

1- use empresa

2- db.empleados.insertMany([
  {Nombre: "Gabriel Garcia", Edad:25, puesto:"DevOPS"},
  {Nombre: "Fernando Fernandez", Edad:30, Puesto:"Fullstack Developer"},
  {Nombre: "Ramiro Ramirez", Edad:28, Puesto:"Pasante"}
])

3- db.empleados.updateOne(
  { Nombre: "Gabriel Garcia"},
  { $set: { Edad: 27} }
)

4- db.empleados.deleteOne({Puesto: "Pasante"})

Ejercicio 2:

db.empleados.find({$and: [{Edad: {$gte: 25 }}, {Edad:{ $lte: 40 }}]})

Ejercicio 3:

db.empleados.find({}, {_id: 0, Nombre: 1, Puesto: 1})

la query es {} vacio hace que devuelva todo el documento. Y {_id: 0, Nombre: 1, Puesto: 1} es la proyeccion que es lo que va a mostrar

Ejercicio 4:

db.empleados.updateMany({}, {$set: {direccion: {calle: "11 de Abril 461",ciudad: "Bahia Blanca",codigo_postal: "8000"}}})

Ejercicio 5:

db.ventas.aggregate([
  { $group: {
      _id: "$producto", 
      totalVentas: { $sum: { $multiply: ["$cantidad", "$precio_unitario"] } }
    }
  }
])

Ejercicio 6:

db.empleados.CreateIndex({ nombre: "Fabian", Apellido: "fernandez" })

Ejercicio 7:

db.cursos.insertMany([
  { _id: 1, nombre: "Programacion 3", profesor: "Ramoscelli" },
  { _id: 2, nombre: "Base de datos 2", profesor: "Ramoscelli" },
  { _id: 3, nombre: "Ingles 2", profesor: "Cortalezzi" }
])

db.alumnos.insertMany([
    {Nombre: "Gabriel Garcia", id_curso: [2, 3] },
    {Nombre: "Fernando Fernandez", id_curso: [ 2] },
    {Nombre: "Ramiro Ramirez", id_curso: [ 1, 3]}
])

db.alumnos.updateOne([
    {Nombre: "Gabriel Garcia"},
    {$set: {id_curso: [1, 2 ,3]}}
])

db.alumnos.updateOne([
    {Nombre: "Fernando Fernandez"},
    {$set: {id_curso: [2 ,3]}}
])

db.alumnos.updateOne([
    {Nombre: "Ramiro Ramirez"},
    {$set: {id_curso: [ 1]}}
])

Ejercicio 8:

db.alumnos.aggregate([
    { $lookup: {
        from:"cursos",
        localField: "id_curso",
        foreignField: "_id",
        as: "inscripciones"
    }}
])

Ejercicio 9:

En la replicacion hay un nodo primarios y muchos secundarios en los que se replican los datos de los primarios. Cuando falla el nodo primario un nodo secundario pasa a ser primario asi la base de datos puede seguir funcionando sin interrupciones. Al haber tantas copias asegura que no se pierdan los datos en casos fatales de algun nodo.

El Sharding es la distribucion de datos horizontalmente para escalabilidad, esto quiere decir que los datos se distribuyen en muchos servidores para que se pueda manejar un gran volumen de consultas y datos sin que se sobrecargue un servidor individual. 
Mejora el rendimiento y facilita la gestion de datos.

Ejercicio 10:

Crear usuario con rol de "readWrite"
db.createUser({ user: "admin", pwd: "clave", roles: ["readWrite", "dbAdmin"] })

Generar copia de seguridad
mongodump --db DB_EJEMPLO --out /backup/

Restauracion de la base de datos
mongorestore --db DB_EJEMPLO --out /backup/DB_EJEMPLO