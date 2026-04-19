import { useEffect } from 'react';
import { HabitTrackerWidget } from '@/widgets/HabitTrackerWidget';
import { AchievementsBoard } from '@/widgets/AchievementsBoard';
import { useAuthStore } from '@/entities/user';
import { useNavigate } from 'react-router-dom';
import { useSync } from '@/features/sync-data';
import { fetchWithAuth } from '@/shared/api';

export const HomePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { isPulling, isPushing } = useSync();
  const handleLogout = async () => {
    try {
      await fetchWithAuth('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
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
      <header className="bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm mb-10 sticky top-0 z-50 flex justify-between items-center border-b border-gray-100">
        <div className="font-extrabold text-xl text-dark">
          Hello, <span className="text-primary">{user.username}</span>!
        </div>
        <div className="flex gap-6 items-center">
          {(isPulling || isPushing) && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-gray-500">Syncing...</span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-500 hover:text-danger transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </header>

      <HabitTrackerWidget />
      
      <div className="mt-12">
        <AchievementsBoard />
      </div>
    </div>
  );
};
