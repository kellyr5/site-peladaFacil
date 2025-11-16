import { Response } from 'express';
import marketService from '../services/marketService';
import { AuthRequest } from '../middlewares/auth';

export class MarketController {
  async createRequest(req: AuthRequest, res: Response) {
    try {
      const request = await marketService.createRequest(req.user!.id, req.body);
      return res.status(201).json(request);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async findAvailablePlayers(req: AuthRequest, res: Response) {
    try {
      const filters = {
        sport: req.query.sport as any,
        position: req.query.position as any,
        latitude: parseFloat(req.query.latitude as string),
        longitude: parseFloat(req.query.longitude as string),
        radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
        minRating: req.query.minRating ? parseFloat(req.query.minRating as string) : undefined,
      };

      const players = await marketService.findAvailablePlayers(filters);
      return res.status(200).json(players);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async invitePlayer(req: AuthRequest, res: Response) {
    try {
      const { requestId, playerId } = req.params;
      const request = await marketService.invitePlayer(requestId, playerId, req.user!.id);
      return res.status(200).json(request);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getOpenRequests(req: AuthRequest, res: Response) {
    try {
      const filters = {
        sport: req.query.sport as any,
        latitude: req.query.latitude ? parseFloat(req.query.latitude as string) : undefined,
        longitude: req.query.longitude ? parseFloat(req.query.longitude as string) : undefined,
        radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
      };

      const requests = await marketService.getOpenRequests(filters);
      return res.status(200).json(requests);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async cancelRequest(req: AuthRequest, res: Response) {
    try {
      const request = await marketService.cancelRequest(req.params.id, req.user!.id);
      return res.status(200).json(request);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new MarketController();
