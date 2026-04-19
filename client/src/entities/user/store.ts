import { create } from 'zustand';

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isChecking: boolean;
  setUser: (user: User | null) => void;
  setChecking: (isChecking: boolean) => void;
  logout: () => void;
}

const savedUser = localStorage.getItem('user');

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  isChecking: true,
  setUser: (user) => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
    set({ user });
  },
  setChecking: (isChecking) => set({ isChecking }),
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  }
}));
