import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import HotelesManager from "../controllers/hotelController.js";
import uploader from '../utils/multer.js';
const hotelService = new HotelesManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await hotelService.getAllHoteles();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/:hid", async (req, res) => {
    const { hid } = req.params;
    try {
        const result = await hotelService.getHotelById(hid);
        if (!result) {
            return res.status(404).send({ status: "error", error: "Hotel no encontrado" });
        }

        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/", passport.authenticate('jwt', { session: false }), authorization("admin", 'premium'), uploader.single('hotel'), async (req, res) => {
    const { name, location, description, stars, nightPrice, price, breakfastIncluded, numberOfNights } = req.body;
    const file = req.file;
    try {

        // Obtener el usuario autenticado
        const userEmail = req.user.email;
        const userRole = req.user.role;

        // Solo se pasa el owner si viene del req.user
        const owner = userRole === 'premium' ? userEmail : 'admin';

        const imagePath = file ? file.originalname : null;

        const result = await hotelService.createHotel({ numberOfNights, image: imagePath, name, location, description, stars, nightPrice, price, breakfastIncluded ,owner});
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put("/:hid", passport.authenticate('jwt', { session: false }), authorization("admin", 'premium'), uploader.single('hotel'), async (req, res) => {
    const { hid } = req.params;
    const updated = req.body;

    // Si hay una imagen, añadimos el nombre de la imagen al objeto actualizado
    if (req.file) {
        updated.image = req.file.originalname;  // Asumimos que se guarda solo el nombre de la imagen
    }

    try {
        const result = await hotelService.updatedHotel(hid, updated);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.delete("/:hid", passport.authenticate('jwt', { session: false }), authorization("admin", 'premium'), async (req, res) => {
    const { hid } = req.params;

    try {
        const result = await hotelService.deleteHotel(hid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;
