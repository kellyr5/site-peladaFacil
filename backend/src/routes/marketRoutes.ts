import { Router } from 'express';
import marketController from '../controllers/marketController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/requests', marketController.createRequest);
router.get('/players', marketController.findAvailablePlayers);
router.post('/requests/:requestId/invite/:playerId', marketController.invitePlayer);
router.get('/requests', marketController.getOpenRequests);
router.delete('/requests/:id', marketController.cancelRequest);

export default router;
