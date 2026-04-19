import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { syncService } from '../services/sync.service';

export const pushHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habits } = req.body;
    
    const result = await syncService.pushHabits(userId, habits);
    res.json(result);
  } catch (error: any) {
    if (error.message === 'Habits must be an array') {
      res.status(400).json({ error: error.message });
      return;
    }
    console.error('Sync push error:', error);
    res.status(500).json({ error: 'Server error during sync push' });
  }
};

export const pullHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const formattedHabits = await syncService.pullHabits(userId);
    res.json({ habits: formattedHabits });
  } catch (error) {
    console.error('Sync pull error:', error);
    res.status(500).json({ error: 'Server error during sync pull' });
  }
};
