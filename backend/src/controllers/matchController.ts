import { Response } from 'express';
import matchService from '../services/matchService';
import { AuthRequest } from '../middlewares/auth';

export class MatchController {
  async createMatch(req: AuthRequest, res: Response) {
    try {
      const match = await matchService.createMatch(req.user!.id, req.body);
      return res.status(201).json(match);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getMatches(req: AuthRequest, res: Response) {
    try {
      const filters = {
        sport: req.query.sport as any,
        status: req.query.status as any,
        latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
        longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
        radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
      };

      const matches = await matchService.getMatches(filters);
      return res.status(200).json(matches);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getMatchById(req: AuthRequest, res: Response) {
    try {
      const match = await matchService.getMatchById(req.params.id);
      return res.status(200).json(match);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async joinMatch(req: AuthRequest, res: Response) {
    try {
      const result = await matchService.joinMatch(req.params.id, req.user!.id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async leaveMatch(req: AuthRequest, res: Response) {
    try {
      const result = await matchService.leaveMatch(req.params.id, req.user!.id);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async updateMatchStats(req: AuthRequest, res: Response) {
    try {
      const { matchId, playerId } = req.params;
      const stats = await matchService.updateMatchStats(matchId, playerId, req.body);
      return res.status(200).json(stats);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async finishMatch(req: AuthRequest, res: Response) {
    try {
      const match = await matchService.finishMatch(req.params.id, req.user!.id);
      return res.status(200).json(match);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new MatchController();
