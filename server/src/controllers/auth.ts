import { Response } from 'express';
import { AuthRequest } from '../common/types/auth';
import { AuthService } from '../services/auth.service';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: AuthRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const { user, token } = await this.authService.register(username, password);
    setTokenCookie(res, token);
    res.status(201).json({ user, token });
  };

  login = async (req: AuthRequest, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const { user, token } = await this.authService.login(username, password);
    setTokenCookie(res, token);
    res.status(200).json({ user, token });
  };

  logout = async (_req: AuthRequest, res: Response): Promise<void> => {
    res.clearCookie('token');
    res.json({ success: true });
  };

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const user = await this.authService.getProfile(req.userId!);
    res.json(user);
  };
}
