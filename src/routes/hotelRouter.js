import { Router } from 'express';
import HotelesManager from "../controllers/hotelController.js";
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

router.post("/", async (req, res) => {
    const { image, name, location, description, stars, nightPrice, price, breakfastIncluded } = req.body;
    try {
        const result = await hotelService.createHotel({ image, name, location, description, stars, nightPrice, price, breakfastIncluded });
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put("/:hid", async (req, res) => {
    const { hid } = req.params;
    const updated = req.body;

    try {
        const result = await hotelService.updatedHotel(hid, updated);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete("/:hid", async (req, res) => {
    const { hid } = req.params;

    try {
        const result = await hotelService.deleteHotel(hid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;
