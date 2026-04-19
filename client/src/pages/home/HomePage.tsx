import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AchievementsBoard } from '@/widgets/AchievementsBoard';
import { HabitTrackerWidget } from '@/widgets/HabitTrackerWidget';
import { AppHeader } from '@/widgets/layout/AppHeader';
import { useAuthStore } from '@/entities/user';
import { useSync } from '@/features/sync-data';
import { fetchWithAuth } from '@/shared/api';

export const HomePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isPulling, isPushing } = useSync();

  const handleLogout = async () => {
    try {
      await fetchWithAuth<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } catch (error) {
      // noop
    }

    logout();
    navigate('/auth');
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pb-12">
      <AppHeader
        isSyncing={isPulling || isPushing}
        onLogout={handleLogout}
        username={user.username}
      />
      <HabitTrackerWidget />
      <div className="mt-12">
        <AchievementsBoard />
      </div>
    </div>
  );
};
