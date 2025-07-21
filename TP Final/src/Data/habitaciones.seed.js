const mongoose = require("mongoose")
const Habitacion = require("../Models/habitacionesModels")

async function seedHabitaciones() {
  try {
    await mongoose.connect("mongodb://localhost:27017/TPfinal", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    await Habitacion.deleteMany({})

    const habitaciones = [
      {
        numero: "101",
        tipo: "Suite",
        capacidad: 4,
        precioPorNoche: 150.0,
        amenidades: ["WiFi", "TV", "Minibar", "Balcón"],
        disponible: true,
      },
      {
        numero: "102",
        tipo: "Suite",
        capacidad: 4,
        precioPorNoche: 150.0,
        amenidades: ["WiFi", "TV", "Minibar", "Balcón"],
        disponible: true,
      },
      {
        numero: "103",
        tipo: "Suite",
        capacidad: 4,
        precioPorNoche: 150.0,
        amenidades: ["WiFi", "TV", "Minibar", "Balcón"],
        disponible: true,
      },
      {
        numero: "201",
        tipo: "Doble",
        capacidad: 2,
        precioPorNoche: 80.0,
        amenidades: ["WiFi", "TV", "Minibar"],
        disponible: true,
      },
      {
        numero: "202",
        tipo: "Doble",
        capacidad: 2,
        precioPorNoche: 80.0,
        amenidades: ["WiFi", "TV", "Minibar"],
        disponible: true,
      },
      {
        numero: "203",
        tipo: "Doble",
        capacidad: 2,
        precioPorNoche: 80.0,
        amenidades: ["WiFi", "TV", "Minibar"],
        disponible: true,
      },
      {
        numero: "301",
        tipo: "Individual",
        capacidad: 1,
        precioPorNoche: 60.0,
        amenidades: ["WiFi", "TV"],
        disponible: true,
      },
      {
        numero: "302",
        tipo: "Individual",
        capacidad: 1,
        precioPorNoche: 60.0,
        amenidades: ["WiFi", "TV"],
        disponible: true,
      },
      {
        numero: "303",
        tipo: "Individual",
        capacidad: 1,
        precioPorNoche: 60.0,
        amenidades: ["WiFi", "TV"],
        disponible: true,
      },
    ]

    const habitacionesInsertadas = await Habitacion.insertMany(habitaciones)
    console.log("Habitaciones insertadas exitosamente")
    console.log(`Total: ${habitacionesInsertadas.length} habitaciones`)

    const fs = require("fs")
    const path = require("path")
    const seedsDir = path.join(__dirname, "../../seeds")
    if (!fs.existsSync(seedsDir)) {
      fs.mkdirSync(seedsDir, { recursive: true })
    }

    fs.writeFileSync(
      path.join(seedsDir, "habitacionesIds.json"),
      JSON.stringify(
        habitacionesInsertadas.map((h) => ({
          _id: h._id.toString(),
          numero: h.numero,
          tipo: h.tipo,
        })),
        null,
        2,
      ),
    )

    await mongoose.disconnect()
    console.log("Desconectado de MongoDB")
  } catch (error) {
    console.error("Error en seed habitaciones:", error)
    process.exit(1)
  }
}

seedHabitaciones()

