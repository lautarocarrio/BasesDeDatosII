const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  habitacionId: { 
    type: mongoose.Schema.Types.ObjectId, //Hace referencia a una habitación
    ref: 'Habitacion',
    required: true
  },
  huesped: {
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    telefono: { type: String, required: true }
  },
  fechaEntrada: { type: Date, required: true },
  fechaSalida: { type: Date, required: true },
  noches: { type: Number, required: true },
  precioTotal: { type: Number, required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'confirmada', 'cancelada'], 
    default: 'pendiente'
  },
  fechaReserva: { type: Date, default: Date.now }
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;
