import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

const setTokenCookie = (res: Response, token: string) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: 'Username and password are required' });
      return;
    }
    const { user, token } = await authService.register(username, password);
    setTokenCookie(res, token);
    res.status(201).json({ user });
  } catch (error: any) {
    if (error.message === 'Username already exists') {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.login(username, password);
    setTokenCookie(res, token);
    res.status(200).json({ user });
  } catch (error: any) {
    if (error.message === 'Invalid credentials') {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token');
  res.json({ success: true });
};

export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await authService.getProfile(req.userId);
    res.json(user);
  } catch (error: any) {
    if (error.message === 'User not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
};
