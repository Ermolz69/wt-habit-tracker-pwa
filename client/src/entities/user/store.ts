import { create } from 'zustand';

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  setUser: (user, token) => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));
