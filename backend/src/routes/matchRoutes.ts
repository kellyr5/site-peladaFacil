import { Router } from 'express';
import matchController from '../controllers/matchController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', matchController.createMatch);
router.get('/', matchController.getMatches);
router.get('/:id', matchController.getMatchById);
router.post('/:id/join', matchController.joinMatch);
router.post('/:id/leave', matchController.leaveMatch);
router.put('/:matchId/players/:playerId/stats', matchController.updateMatchStats);
router.post('/:id/finish', matchController.finishMatch);

export default router;
