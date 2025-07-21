Crear usuario con rol de "readWrite"
db.createUser({ user: "admin", pwd: "clave", roles: ["readWrite", "dbAdmin"] })

Generar copia de seguridad
mongodump --db DB_EJEMPLO --out /backup/

Restauracion de la base de datos
mongorestore --db DB_EJEMPLO --out /backup/DB_EJEMPLO