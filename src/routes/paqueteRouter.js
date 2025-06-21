import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import PaqueteManager from "../controllers/paqueteController.js";
import uploader from '../utils/multer.js';
const paqueteService = new PaqueteManager();

const router = Router();


router.get("/", async (req, res) => {
    try {
        const result = await paqueteService.getAllPaquete();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get('/buscarProvincia', async (req, res) => {
    const { nombreProvincia } = req.query;

    try {
        const result = await paqueteService.buscarPaquetePorProvincia(nombreProvincia);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', payload: error.message })
    }
});

router.get("/buscar", async (req, res) => {
    const { destino, desde_fecha, hasta_fecha } = req.query;

    try {
        const result = await paqueteService.buscarPaquetesFiltrados({ destino, desde_fecha, hasta_fecha });
        res.status(201).send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await paqueteService.getPaqueteById(pid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/", passport.authenticate('jwt', { session: false }), authorization("admin", 'premium'), uploader.single('image'), async (req, res) => {
    const { vuelo, hotel, destino, desde_fecha, hasta_fecha, owner } = req.body
    try {
        // Obtener el usuario autenticado
        const userEmail = req.user.email;
        const userRole = req.user.role;

        // Solo se pasa el owner si viene del req.user
        const owner = userRole === 'premium' ? userEmail : 'admin';
        
        const result = await paqueteService.createPaquete({ vuelo, hotel, destino, desde_fecha, hasta_fecha, owner });
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.put("/:pid", passport.authenticate('jwt', { session: false }), authorization("admin", 'premium'), uploader.single('image'), async (req, res) => {
    const { pid } = req.params;
    const updated = req.body;

    // Si hay una imagen, añadimos el nombre de la imagen al objeto actualizado
    if (req.file) {
        updated.image = req.file.originalname;  // Asumimos que se guarda solo el nombre de la imagen
    }

    try {
        const result = await paqueteService.updatedPaquete(pid, updated);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete("/:pid", passport.authenticate('jwt', { session: false }), authorization("admin", 'premium'), async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await paqueteService.deletePaquete(pid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


export default router;