import { Router } from 'express';
import ProvController from "../controllers/provController.js";
const provService = new ProvController();

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

router.post("/", async (req, res) => {
    const { name, country } = req.body;
    try {
        const result = await provService.createProv({ name, country });
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updated = req.body;
    try {
        const result = await provService.updatedProv(pid, updated);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await provService.deleteProv(pid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

export default router;
