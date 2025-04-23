import { Router } from 'express';

import CartManager from '../controllers/cartController.js';
const cartService = new CartManager();

const router = Router();


router.get("/", async (req, res) => {
    try {
        const result = await cartService.getAllCarts();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartService.getCartById(cid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const result = await cartService.createCart();
        res.status(201).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { referencia, quantity } = req.body;

    try {
        const result = await cartService.addProductInCart(cid, pid, referencia, quantity);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
})

router.delete("/:cid/products/:pid/", async (req, res) => {
    const { cid, pid } = req.params;
    const {referencia} = req.query;

    try {
        const result = await cartService.deleteProductInCart(cid, pid, referencia);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete("/:cid/products", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartService.clearCart(cid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await cartService.deleteCart(cid);
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;