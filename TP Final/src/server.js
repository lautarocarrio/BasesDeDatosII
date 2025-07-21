const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDB = require("./utils/db")

const habitacionesRoutes = require("./Routes/habitaciones.routes")
const reservasRoutes = require("./Routes/reservas.routes")

dotenv.config()

connectDB()

const app = express()
// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use("/api/habitaciones", habitacionesRoutes)
app.use("/api/reservas", reservasRoutes)

app.get("/", (req, res) => {
  res.json({
    message: "La API del sistema de gestion de hotel esta funcionando",
    endpoints: {
      habitaciones: "/api/habitaciones",
      reservas: "/api/reservas",
    },
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})

