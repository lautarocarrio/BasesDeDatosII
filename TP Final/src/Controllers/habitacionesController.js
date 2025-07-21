const Habitacion = require('../Models/habitacionesModels');
const Reserva = require('../Models/reservasModels');

const habitacionesController = {
    getAllHabitaciones: async (req, res) => {
        try {
        const habitaciones = await Habitacion.find();
        res.json(habitaciones);
        } catch (error) {
        res.status(500).json({ error: 'Error al obtener las habitaciones' });
        }
    },
    getHabitacionPorTipo: async (req, res) => {
        const tipo = req.params.tipo;
        try {
        const habitaciones = await Habitacion.find({ tipo });
        res.json(habitaciones);
        } catch (error) {
        res.status(500).json({ error: 'Error al obtener las habitaciones por tipo' });
        }
    },
    getHabitacionPorNumero: async (req, res) => {
        const numero = Number(req.params.numero); 
        if (isNaN(numero)) {
            return res.status(400).json({ error: 'Numero de habitación inválido' });
        }
        try {
            const habitacion = await Habitacion.findOne({ numero });
            if (!habitacion) {
                return res.status(404).json({ error: 'Habitacion no encontrada' });
            }
            res.json(habitacion);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener la habitacion por numero' });
        }
    },
    consultarDisponibilidad: async (req, res) => {
        const { fechaEntrada, fechaSalida, tipo } = req.query;
        try {
            const habitaciones = await Habitacion.find({ tipo, disponible: true });

            const reservasOcupadas = await Reserva.find({
                habitacionId: { $in: habitaciones.map(h => h._id) },
                estado: { $in: ['pendiente', 'confirmada'] },
                $or: [
                    {
                        fechaEntrada: { $lte: new Date(fechaSalida) },
                        fechaSalida: { $gte: new Date(fechaEntrada) }
                    }
                ]
            });

            const habitacionesOcupadas = reservasOcupadas.map(r => r.habitacionId.toString());
            const habitacionesDisponibles = habitaciones.filter(
                h => !habitacionesOcupadas.includes(h._id.toString())
            );

            res.json(habitacionesDisponibles);
        } catch (error) {
            res.status(500).json({ error: 'Error al consultar disponibilidad' });
        }
    }
};

module.exports = habitacionesController;