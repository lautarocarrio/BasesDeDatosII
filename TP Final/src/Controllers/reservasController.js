const Reserva = require("../Models/reservasModels")
const Habitacion = require("../Models/habitacionesModels")

const reservasController = {
  getAllReservas: async (req, res) => {
    try {
      const reservas = await Reserva.find().populate("habitacionId")
      res.json(reservas)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las reservas" })
    }
  },
  getReservaPorId: async (req, res) => {
    const reservaId = req.params.id
    try {
      const reserva = await Reserva.findById(reservaId).populate("habitacionId")
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" })
      }
      res.json(reserva)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la reserva" })
    }
  },
  getReservasPorHuesped: async (req, res) => {
    const huespedEmail = req.params.email
    try {
      const reservas = await Reserva.find({ "huesped.email": huespedEmail }).populate("habitacionId")
      res.json(reservas)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las reservas por huesped" })
    }
  },
  getReservasPorEstado: async (req, res) => {
    const estado = req.params.estado
    try {
      const reservas = await Reserva.find({ estado }).populate("habitacionId")
      res.json(reservas)
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las reservas por estado" })
    }
  },
  crearReserva: async (req, res) => {
    const { habitacionId, huesped, fechaEntrada, fechaSalida, noches, precioTotal } = req.body
    try {
      const habitacion = await Habitacion.findById(habitacionId)
      if (!habitacion) {
        return res.status(404).json({ error: "Habitación no encontrada" })
      }

      const reservasExistentes = await Reserva.find({
        habitacionId,
        estado: { $in: ["pendiente", "confirmada"] },
        $or: [
          {
            fechaEntrada: { $lte: new Date(fechaSalida) },
            fechaSalida: { $gte: new Date(fechaEntrada) },
          },
        ],
      })

      if (reservasExistentes.length > 0) {
        return res.status(400).json({ error: "La habitacion no esta disponible en dichas fechas" })
      }

      const nuevaReserva = new Reserva({
        habitacionId,
        huesped,
        fechaEntrada: new Date(fechaEntrada),
        fechaSalida: new Date(fechaSalida),
        noches,
        precioTotal,
      })

      await nuevaReserva.save()
      const reservaPopulada = await Reserva.findById(nuevaReserva._id).populate("habitacionId")
      res.status(201).json(reservaPopulada)
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error al crear la reserva" })
    }
  },
  actualizarReserva: async (req, res) => {
    const reservaId = req.params.id
    const { habitacionId, huesped, fechaEntrada, fechaSalida, noches, precioTotal } = req.body
    try {
      const reserva = await Reserva.findByIdAndUpdate(
        reservaId,
        {
          habitacionId,
          huesped,
          fechaEntrada: new Date(fechaEntrada),
          fechaSalida: new Date(fechaSalida),
          noches,
          precioTotal,
        },
        { new: true },
      ).populate("habitacionId")

      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" })
      }
      res.json(reserva)
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar la reserva" })
    }
  },
  borrarReserva: async (req, res) => {
    const reservaId = req.params.id
    try {
      const reserva = await Reserva.findByIdAndDelete(reservaId)
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" })
      }
      res.json({ message: "Reserva eliminada exitosamente" })
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar la reserva" })
    }
  },
  cancelarReserva: async (req, res) => {
    const reservaId = req.params.id
    try {
      const reserva = await Reserva.findById(reservaId)
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" })
      }
      reserva.estado = "cancelada"
      await reserva.save()
      const reservaPopulada = await Reserva.findById(reservaId).populate("habitacionId")
      res.json({ message: "Reserva cancelada exitosamente", reserva: reservaPopulada })
    } catch (error) {
      res.status(500).json({ error: "Error al cancelar la reserva" })
    }
  },
  checkIn: async (req, res) => {
    const reservaId = req.params.id
    try {
      const reserva = await Reserva.findById(reservaId)
      if (!reserva) {
        return res.status(404).json({ error: "Reserva no encontrada" })
      }
      reserva.estado = "confirmada"
      await reserva.save()
      const reservaPopulada = await Reserva.findById(reservaId).populate("habitacionId")
      res.json({ message: "Checkin exitoso", reserva: reservaPopulada })
    } catch (error) {
      res.status(500).json({ error: "Error al hacer checkin" })
    }
  },
  reporteOcupacion: async (req, res) => {
    const { mes, anio } = req.params 
    try {
      const fechaInicio = new Date(anio, mes - 1, 1)
      const fechaFin = new Date(anio, mes, 0, 23, 59, 59, 999)
      const reservas = await Reserva.find({
        estado: { $in: ["pendiente", "confirmada"] },
        $or: [{ fechaEntrada: { $lte: fechaFin }, fechaSalida: { $gte: fechaInicio } }],
      }).populate("habitacionId")

      let nochesOcupadas = 0
      for (const reserva of reservas) {
        const inicio = reserva.fechaEntrada < fechaInicio ? fechaInicio : reserva.fechaEntrada
        const fin = reserva.fechaSalida > fechaFin ? fechaFin : reserva.fechaSalida

        const diffTiempo = fin - inicio
        const diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24))
        nochesOcupadas += diffDias
      }

      const totalHabitaciones = await Habitacion.countDocuments()

      const diasMes = new Date(anio, mes, 0).getDate()
      const nochesTotales = totalHabitaciones * diasMes

      const porcentajeOcupacion = ((nochesOcupadas / nochesTotales) * 100).toFixed(2)

      res.json({
        mes: Number.parseInt(mes),
        año: Number.parseInt(anio),
        totalHabitaciones,
        diasMes,
        nochesOcupadas,
        porcentajeOcupacion: `${porcentajeOcupacion}%`,
        reservas: reservas.length,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error al generar el reporte de ocupacion" })
    }
  }
}

module.exports = reservasController

    
