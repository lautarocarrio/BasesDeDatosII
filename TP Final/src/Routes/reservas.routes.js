const express = require("express")
const router = express.Router()
const reservasController = require("../Controllers/reservasController")

router.post("/", reservasController.crearReserva) 
router.get("/", reservasController.getAllReservas)
router.get("/reporte/ocupacion/:mes/:anio", reservasController.reporteOcupacion)
router.get("/:id", reservasController.getReservaPorId)
router.get("/huesped/:email", reservasController.getReservasPorHuesped)
router.get("/estado/:estado", reservasController.getReservasPorEstado)
router.put("/:id", reservasController.actualizarReserva)
router.delete("/:id", reservasController.borrarReserva)
router.put("/:id/cancelar", reservasController.cancelarReserva)
router.put("/:id/check-in", reservasController.checkIn)

module.exports = router
