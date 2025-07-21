# Proyecto 5: Sistema de Reservas de Hotel
## Autor
 - Carrio Biagetti Lautaro
## Descripción
Plataforma para gestionar habitaciones, huéspedes y reservas de un hotel.

## Requerimientos
- Catálogo de habitaciones con diferentes tipos y precios
- Sistema de reservas con fechas de entrada y salida
- Gestión de huéspedes y su historial
- Control de disponibilidad de habitaciones

## Funciones a Implementar
1) consultarDisponibilidad(fechaEntrada, fechaSalida, tipo) - Ver habitaciones disponibles
2) crearReserva(reserva) - Crear nueva reserva
    El formato para hacer la consulta es: 
                {   "habitacionId": "id de la habitación", //se copia el id de /seeds/habitacionesIds.json
                    "huesped": {
                        "nombre": "ejemplo",
                        "email": "ejemplo@gmail.com",
                        "telefono": "1223456"
                    },
                    "fechaEntrada":"fecha de ingreso",
                    "fechaSalida":"fecha de egreso",
                    "noches": cantidad de noches,
                    "precioTotal": precio
                }

3) cancelarReserva(reservaId) - Cancelar reserva existente
4) checkIn(reservaId) - Registrar entrada del huésped
5) reporteOcupacion(mes, año) - Reporte de ocupación mensual

## Instalación

1. Instala las dependencias: `npm install` o `npm i`
2. Configura la conexión a la base de datos en el archivo `.env`
3. Levantar la base de datos con: `mongod` y `mongosh` utilizando la terminal
4. Llenar la base de datos: `npm run seed:habitaciones` y `npm run seed:reservas`
5. Inicia el servidor: `npm start` o `npm run dev`
6. Accede a la aplicación en: `http://localhost:3000`
7. Probar rutas con Postman 

## Datos para .env
- MONGO_URI=mongodb://localhost:27017/TPfinal
- PORT=3000
- NODE_ENV=development