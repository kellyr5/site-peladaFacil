import { Request, Response } from 'express';
import authService from '../services/authService';
import { AuthRequest } from '../middlewares/auth';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await authService.getProfile(req.user!.id);
      return res.status(200).json(profile);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await authService.updateProfile(req.user!.id, req.body);
      return res.status(200).json(profile);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
