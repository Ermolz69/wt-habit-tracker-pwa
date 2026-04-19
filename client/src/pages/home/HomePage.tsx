import { useEffect } from 'react';
import { HabitTrackerWidget } from '@/widgets/HabitTrackerWidget';
import { AchievementsBoard } from '@/widgets/AchievementsBoard';
import { useAuthStore } from '@/entities/user';
import { useNavigate } from 'react-router-dom';
import { useSync } from '@/features/sync-data';

export const HomePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isPulling, isPushing } = useSync();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <header className="bg-white p-4 shadow-sm mb-6 sticky top-0 z-10 flex justify-between items-center">
        <div className="font-bold text-lg">Привіт, {user.username}!</div>
        <div className="flex gap-4 items-center">
          {(isPulling || isPushing) && <span className="text-xs text-gray-400">Синхронізація...</span>}
          <button 
            onClick={logout}
            className="text-sm text-danger hover:underline"
          >
            Вийти
          </button>
        </div>
      </header>

      <HabitTrackerWidget />
      
      <div className="mt-10">
        <AchievementsBoard />
      </div>
    </div>
  );
};
