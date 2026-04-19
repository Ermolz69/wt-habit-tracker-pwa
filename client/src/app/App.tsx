import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthPage } from '@/pages/auth/AuthPage';
import { HomePage } from '@/pages/home/HomePage';
import { useAuthStore } from '@/entities/user';
import { fetchWithAuth } from '@/shared/api';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  const { token, setUser, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const user = await fetchWithAuth('/auth/profile');
          setUser(user, token);
        } catch (e) {
          logout();
        }
      }
    };
    initAuth();
  }, [token, setUser, logout]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
