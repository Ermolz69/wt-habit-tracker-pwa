import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

export interface Habit {
  id: string;
  title: string;
  completedDates: string[]; // YYYY-MM-DD
  updatedAt: number; // timestamp
  deletedAt?: number | null;
}

interface HabitState {
  habits: Habit[];
  isLoaded: boolean;
  lastSyncedAt: number | null;
  hasPendingChanges: boolean;
  syncError: string | null;
  setLoaded: () => void;
  addHabit: (title: string) => void;
  deleteHabit: (id: string) => void;
  clearSyncedDeletedHabits: () => void;
  clearSyncError: () => void;
  markSynced: () => void;
  markSyncError: (message: string) => void;
  toggleHabitDate: (id: string, date: string) => void;
  setHabits: (habits: Habit[]) => void;
}

// Custom storage for localforage
const storage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await localforage.getItem(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await localforage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await localforage.removeItem(name);
  },
};

export const useHabitStore = create<HabitState>()(
  persist(
    (set) => ({
      habits: [],
      isLoaded: false,
      lastSyncedAt: null,
      hasPendingChanges: false,
      syncError: null,
      setLoaded: () => set({ isLoaded: true }),
      addHabit: (title) => set((state) => ({
        habits: [{ id: crypto.randomUUID(), title, completedDates: [], updatedAt: Date.now(), deletedAt: null }, ...state.habits],
        hasPendingChanges: true,
        syncError: null,
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.map((habit) =>
          habit.id === id
            ? { ...habit, deletedAt: Date.now(), updatedAt: Date.now() }
            : habit
        ),
        hasPendingChanges: true,
        syncError: null,
      })),
      clearSyncedDeletedHabits: () => set((state) => ({
        habits: state.habits.filter((habit) => !habit.deletedAt),
      })),
      clearSyncError: () => set({ syncError: null }),
      markSynced: () => set({ hasPendingChanges: false, lastSyncedAt: Date.now(), syncError: null }),
      markSyncError: (message) => set({ syncError: message }),
      toggleHabitDate: (id, date) => set((state) => {
        const newHabits = state.habits.map(habit => {
          if (habit.id === id) {
            const hasDate = habit.completedDates.includes(date);
            return {
              ...habit,
              completedDates: hasDate 
                ? habit.completedDates.filter(d => d !== date)
                : [...habit.completedDates, date],
              updatedAt: Date.now(),
              deletedAt: habit.deletedAt ?? null,
            };
          }
          return habit;
        });
        return { habits: newHabits, hasPendingChanges: true, syncError: null };
      }),
      setHabits: (serverHabits) => set((state) => {
        const merged = [...state.habits];
        let hasChanges = false;

        for (const sHabit of serverHabits) {
          const idx = merged.findIndex(h => h.id === sHabit.id);
          if (idx >= 0) {
            if (sHabit.updatedAt > merged[idx].updatedAt) {
              merged[idx] = sHabit;
              hasChanges = true;
            }
          } else {
            merged.push(sHabit);
            hasChanges = true;
          }
        }

        if (!hasChanges && merged.length === state.habits.length) {
          return state;
        }

        return { habits: merged };
      })
    }),
    {
      name: 'habits-storage',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setLoaded();
      }
    }
  )
);
