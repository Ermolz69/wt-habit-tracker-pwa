import { SyncController } from '../controllers/sync';
import { HabitRepository } from '../repositories/habit.repository';
import { SyncService } from '../services/sync.service';

const habitRepository = new HabitRepository();
const syncService = new SyncService(habitRepository);

export const syncController = new SyncController(syncService);
export { syncService, habitRepository };
