export interface HabitSyncPayload {
  id: string;
  title: string;
  completedDates: string[];
  updatedAt?: number;
}
