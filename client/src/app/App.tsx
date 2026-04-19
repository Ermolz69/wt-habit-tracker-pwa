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
  const { user, isChecking, setUser, setChecking, logout } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await fetchWithAuth<{ id: string; username: string }>('/auth/me');
        setUser(data);
      } catch (e) {
        logout();
      } finally {
        setChecking(false);
      }
    };
    checkAuth();
  }, [setUser, logout, setChecking]);

  if (isChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse text-gray-500 font-medium">Checking authentication...</div></div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
