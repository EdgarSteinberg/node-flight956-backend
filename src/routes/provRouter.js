import { Router } from 'express';
import ProvManager from '../controllers/provController.js';
import uploader from '../utils/multer.js';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
const provService = new ProvManager();

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await provService.getAllProv();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await provService.getProvById(pid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post("/", passport.authenticate('jwt', { session: false }), authorization('admin', 'premium'), uploader.single('provincia'), async (req, res) => {
    const { name, country } = req.body;
    const file = req.file; // ⚠️ Aquí está la imagen cargada por Multer

    try {
        const imagePath = file ? file.originalname : null;

        const result = await provService.createProv({ name, country, image: imagePath });

        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});


router.put("/:pid", passport.authenticate('jwt', { session: false }), authorization('admin', 'premium'), async (req, res) => {
    const { pid } = req.params;
    const updated = req.body;
    try {
        const result = await provService.updatedProv(pid, updated);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete("/:pid", passport.authenticate('jwt', { session: false }), authorization('admin', 'premium'), async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await provService.deleteProv(pid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

export default router;
