import { Response } from 'express';
import { AuthRequest } from '../common/types/auth';
import { SyncService } from '../services/sync.service';

export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  pushHabits = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId!;
    const { habits } = req.body;

    const result = await this.syncService.pushHabits(userId, habits);
    res.json(result);
  };

  pullHabits = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId!;
    const formattedHabits = await this.syncService.pullHabits(userId);
    res.json({ habits: formattedHabits });
  };
}
