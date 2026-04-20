export interface HabitSyncPayload {
  id: string;
  title: string;
  completedDates: string[];
  updatedAt?: number;
  deletedAt?: number | null;
}

export interface HabitDto {
  id: string;
  title: string;
  completedDates: string[];
  updatedAt: number;
  deletedAt: number | null;
}
