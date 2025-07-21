const mongoose = require("mongoose")
const Reserva = require("../Models/reservasModels")
const fs = require("fs")
const path = require("path")

async function seedReservas() {
  try {
    await mongoose.connect("mongodb://localhost:27017/TPfinal", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    await Reserva.deleteMany({})

    const habitacionesIdsPath = path.join(__dirname, "../../seeds/habitacionesIds.json")
    if (!fs.existsSync(habitacionesIdsPath)) {
      console.error("No se encontro el archivo habitacionesIds.json. Ejecuta primero el seed de habitaciones.")
      process.exit(1)
    }

    const habitacionesIds = JSON.parse(fs.readFileSync(habitacionesIdsPath, "utf-8"))

    const reservas = [
      {
        habitacionId: new mongoose.Types.ObjectId(habitacionesIds[0]._id),
        huesped: {
          nombre: "Leo Messi",
          email: "leonel@email.com",
          telefono: "+1234567890",
        },
        fechaEntrada: new Date("2025-02-01"),
        fechaSalida: new Date("2025-02-04"),
        noches: 3,
        precioTotal: 450.0,
        estado: "confirmada",
        fechaReserva: new Date(),
      },
      {
        habitacionId: new mongoose.Types.ObjectId(habitacionesIds[3]._id),
        huesped: {
          nombre: "Paola Biagetti",
          email: "paola@email.com",
          telefono: "+9876543210",
        },
        fechaEntrada: new Date("2025-02-05"),
        fechaSalida: new Date("2025-02-07"),
        noches: 2,
        precioTotal: 160.0,
        estado: "pendiente",
        fechaReserva: new Date(),
      },
      {
        habitacionId: new mongoose.Types.ObjectId(habitacionesIds[1]._id),
        huesped: {
          nombre: "Carrio Lautaro",
          email: "lautaro@email.com",
          telefono: "+1234567890",
        },
        fechaEntrada: new Date("2025-01-15"),
        fechaSalida: new Date("2025-01-18"),
        noches: 3,
        precioTotal: 450.0,
        estado: "cancelada",
        fechaReserva: new Date(),
      },
      {
        habitacionId: new mongoose.Types.ObjectId(habitacionesIds[6]._id), 
        huesped: {
          nombre: "Adamini Luana",
          email: "luana@email.com",
          telefono: "+1234567890",
        },
        fechaEntrada: new Date("2025-02-10"),
        fechaSalida: new Date("2025-02-13"),
        noches: 3,
        precioTotal: 180.0,
        estado: "pendiente",
        fechaReserva: new Date(),
      },
    ]

    const reservasInsertadas = await Reserva.insertMany(reservas)
    console.log("Reservas insertadas exitosamente")
    console.log(`Total: ${reservasInsertadas.length} reservas`)

    await mongoose.disconnect()
    console.log("Desconectado de MongoDB")
  } catch (error) {
    console.error("Error en seed reservas:", error)
    process.exit(1)
  }
}

seedReservas()

