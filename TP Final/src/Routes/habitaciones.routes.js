const express = require('express');
const router = express.Router();
const habitacionesController = require('../Controllers/habitacionesController');

router.get('/', habitacionesController.getAllHabitaciones);
router.get('/tipo/:tipo', habitacionesController.getHabitacionPorTipo);
router.get('/numero/:numero', habitacionesController.getHabitacionPorNumero);
router.get('/disponibles', habitacionesController.consultarDisponibilidad);

module.exports = router;
