import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';

import UserManager from "../controllers/userController.js";
import uploader from '../utils/multer.js';
const userController = new UserManager();

const router = Router();

//Enviar email de recuperacion de contrasenia
router.post('/sendEmail', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({ status: 'error', error: 'El email es obligatorio.' });
    }
    try {
        const result = await userController.sendEmail(email);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.post('/reset-password', async (req, res) => {
   
    const{ token, newPassword} = req.body;
 
    if (!token || !newPassword) {
        return res.status(400).send({ status: "error", message: "Token o nueva contraseña no proporcionada" });
    }

    try {
        const result = await userController.resetPassword(token, newPassword);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

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

        // Obtener el usuario logueado
        const user = await userController.getUserByEmail(email);

        const now = new Date();
        await userController.updateLastConnection(user._id, now)

        res.cookie("secretCookieToken", token, {
            maxAge: 60 * 60 * 1000, // 1 hora
            httpOnly: true,         // 🚨 Protege contra XSS
            secure: true,           // Solo por HTTPS en producción
            sameSite: 'lax'         // Controla el envío en cross-site
        }).send(
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

router.post('/logout', (req, res) => {
    res.clearCookie('secretCookieToken', {
        httpOnly: true,
        sameSite: 'None',
        secure: true
    });
    res.status(200).send({ message: 'Logout exitoso' });
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

router.put('/:uid', passport.authenticate('jwt', { session: false }), authorization("admin"), async (req, res) => {
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

router.post('/documents/:uid', uploader.array('docs', 2), async (req, res) => {
    const { uid } = req.params;
    const files = req.files; // <- importante: es un array

    if (!files || files.length === 0) {
        return res.status(400).send({ status: 'error', message: 'No se subieron archivos.' });
    }

    const docs = files.map(file => ({
        name: file.originalname,
        reference: `/image/docs/${file.filename}`
    }));

    try {
        const result = await userController.uploadDocs(uid, docs);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete('/', passport.authenticate('jwt', { session: false }), authorization("admin"), async (req, res) => {
    try {
        const result = await userController.deleteUserLastConnection();
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});

router.delete('/:uid', passport.authenticate('jwt', { session: false }), authorization("admin"), async (req, res) => {
    const { uid } = req.params;

    try {
        const result = await userController.deleteUser(uid);
        res.status(200).send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
});



export default router;

