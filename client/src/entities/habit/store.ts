import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

export interface Habit {
  id: string;
  title: string;
  completedDates: string[]; // YYYY-MM-DD
  updatedAt: number; // timestamp
}

interface HabitState {
  habits: Habit[];
  isLoaded: boolean;
  setLoaded: () => void;
  addHabit: (title: string) => void;
  deleteHabit: (id: string) => void;
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
      setLoaded: () => set({ isLoaded: true }),
      addHabit: (title) => set((state) => ({
        habits: [{ id: crypto.randomUUID(), title, completedDates: [], updatedAt: Date.now() }, ...state.habits]
      })),
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),
      toggleHabitDate: (id, date) => set((state) => {
        const newHabits = state.habits.map(habit => {
          if (habit.id === id) {
            const hasDate = habit.completedDates.includes(date);
            return {
              ...habit,
              completedDates: hasDate 
                ? habit.completedDates.filter(d => d !== date)
                : [...habit.completedDates, date],
              updatedAt: Date.now()
            };
          }
          return habit;
        });
        return { habits: newHabits };
      }),
      setHabits: (serverHabits) => set((state) => {
        // Implement LWW on client side too when receiving from server
        // If a server habit is newer, replace local. If local is newer, keep local.
        const merged = [...state.habits];
        for (const sHabit of serverHabits) {
          const idx = merged.findIndex(h => h.id === sHabit.id);
          if (idx >= 0) {
            if (sHabit.updatedAt > merged[idx].updatedAt) {
              merged[idx] = sHabit;
            }
          } else {
            merged.push(sHabit);
          }
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
