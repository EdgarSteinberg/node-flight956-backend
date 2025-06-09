import { Router } from 'express';

import VuelosManager from '../controllers/vuelosController.js';
const vuelosService = new VuelosManager();
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';

const router = Router();

// Obtener todos los vuelos
router.get('/', async (req, res) => {
    try {
        const result = await vuelosService.getAllVuelos();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get('/buscar', async (req, res) => {
    const { origen, destino, vuelo_ida, vuelo_vuelta } = req.query;
    try {
        const result = await vuelosService.buscarVuelosFiltrados({ origen, destino, vuelo_ida, vuelo_vuelta });
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get('/buscarProvincia', async (req, res) => {
    const { nombreProvincia } = req.query;

    try {
        const result = await vuelosService.buscarVueloProvincia(nombreProvincia);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

// Obtener un vuelo por ID
router.get('/:vid', async (req, res) => {
    const { vid } = req.params;
    try {
        const result = await vuelosService.getVuelosById(vid);
        if (!result) {
            return res.status(404).send({
                status: "error",
                error: `No se encontró el vuelo con ID ${vid}`
            });
        }
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// Crear un vuelo
router.post("/", passport.authenticate('jwt', { session: false }), authorization('admin', 'premium'), async (req, res) => {
    const { empresa, origen, destino, vuelo_ida, vuelo_vuelta, precio, duracion, clase, asientos_disponibles, incluye_equipaje, pasajeros } = req.body;

    try {
        const result = await vuelosService.createVuelos({ empresa, origen, destino, vuelo_ida, vuelo_vuelta, precio, duracion, clase, asientos_disponibles, incluye_equipaje, pasajeros });
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// Actualizar un vuelo
router.put("/:vid",passport.authenticate('jwt', {session: false}), authorization('admin', 'premium'), async (req, res) => {
    const { vid } = req.params;
    const updated = req.body;
    try {
        const result = await vuelosService.updatedVuelos(vid, updated);
        res.status(200).send({ status: "success", payload: result }); // Cambié el status a 200
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

// Eliminar un vuelo
router.delete("/:vid",passport.authenticate('jwt', {session: false}), authorization('admin', 'premium') ,async (req, res) => {
    const { vid } = req.params;
    try {
        const result = await vuelosService.deleteVuelos(vid);
        res.status(200).send({ status: "success", message: "Vuelo eliminado" }); // Cambié el status a 204
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;
