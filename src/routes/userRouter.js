import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';

import UserManager from "../controllers/userController.js";
const userController = new UserManager();

const router = Router();


router.get("/", async (req, res) => {
    try {
        const result = await userController.getAllUsers();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.post('/register', async (req, res) => {
    const { first_name, last_name, age, email, password } = req.body;
    if (!email || !password || !first_name || !last_name || !age) {
        return res.status(400).send({ status: 'error', error: 'Todo los campos son obligatorios' });
    }
    try {
        const result = await userController.registerUser({ first_name, last_name, age, email, password });
        res.status(201).send({ status: 'success', payload: result });
    } catch (error) {
       
        res.status(500).send({ error: "error", error: `${error.message}` });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Email y password son obligatorios' });
    }
    try {
        const token = await userController.loginUser(email, password);
        res.cookie("secretCookieToken", token, { maxAge: 60 * 60 * 1000 }).send(
            {
                status: 'success',
                token
            });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.get('/current', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        res.status(200).send({ status: 'success', user: req.user });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.get("/:uid", async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userController.getUserById(uid);
        if (!result) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }

        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const updated = req.body;

    try {
        const result = await userController.updatedUser(uid, updated);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.put('/premium/:uid', passport.authenticate('jwt', { session: false }), authorization("admin"), async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userController.updatedRole(uid);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userController.deleteUser(uid);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})
export default router;

