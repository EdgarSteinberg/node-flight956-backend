import { Router } from 'express';
import passport from 'passport';
import { authorization } from '../middlewares/authorization.js';
import TicketManager from '../controllers/ticketController.js';
const ticketService = new TicketManager();

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await ticketService.getAllTicket();
        res.status(200).send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})

router.get('/:tid', async (req, res) => {
    const { tid } = req.params;
    try {
        const result = await ticketService.getTicketById(tid);
        res.status(200).send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})


router.post('/', async (req, res) => {
    const { cartId, userId } = req.body;
    try {
        const result = await ticketService.createTicket({ cartId, userId });
        res.status(200).send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})

router.delete('/:tid', passport.authenticate('jwt', { session: false }), authorization("admin"), async (req, res) => {
    const { tid } = req.params;
    try {
        const result = await ticketService.deleteTicket(tid);
        res.status(200).send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})

export default router;