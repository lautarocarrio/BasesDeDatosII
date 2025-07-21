const mongoose = require('mongoose');

const habitacionSchema = new mongoose.Schema({
  numero: {
    type: String, // Si es "101", "201", mejor String
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  capacidad: {
    type: Number,
    required: true
  },
  precioPorNoche: {
    type: Number,
    required: true
  },
  amenidades: {
    type: [String], //array de strings
    required: true
  },
  disponible: {
    type: Boolean,
    required: true,
    default: true
  }
});

const Habitacion = mongoose.model('Habitacion', habitacionSchema);
module.exports = Habitacion;
