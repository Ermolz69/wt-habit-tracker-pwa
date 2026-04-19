import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../common/errors/app-error';
import { AuthRequest } from '../common/types/auth';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    next(new AppError('Authentication required', 401));
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key-123') as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
};
