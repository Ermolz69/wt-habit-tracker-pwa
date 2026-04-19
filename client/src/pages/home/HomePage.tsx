import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabitStore } from '@/entities/habit';
import { useAuthStore } from '@/entities/user';
import { useSync } from '@/features/sync-data';
import { fetchWithAuth } from '@/shared/api';
import { AchievementsBoard } from '@/widgets/AchievementsBoard';
import { HabitTrackerWidget } from '@/widgets/HabitTrackerWidget';
import { AppHeader } from '@/widgets/layout/AppHeader';

export const HomePage = () => {
  const { user, logout } = useAuthStore();
  const { habits } = useHabitStore();
  const navigate = useNavigate();
  const { isPulling, isPushing } = useSync();

  const completedToday = habits.filter((habit) =>
    habit.completedDates.includes(new Date().toISOString().slice(0, 10))
  ).length;
  const totalCheckins = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);

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
    <div className="min-h-screen app-shell px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <AppHeader
        isSyncing={isPulling || isPushing}
        onLogout={handleLogout}
        username={user.username}
      />

      <main className="mx-auto mt-8 max-w-6xl">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel rounded-[2rem] border border-white/80 p-7 shadow-panel">
            <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-muted">
              Progress overview
            </div>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="font-display text-4xl leading-none tracking-tight text-dark text-balance sm:text-5xl">
                  Keep your momentum steady, visible and satisfying.
                </h1>
                <p className="mt-4 max-w-xl leading-7 text-muted">
                  Your habits are stored locally, synced safely, and presented like a real dashboard instead of a raw checklist.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 md:min-w-[18rem]">
                <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-soft">
                  <div className="font-display text-3xl text-dark">{habits.length}</div>
                  <div className="mt-1 text-sm text-muted">habits</div>
                </div>
                <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-soft">
                  <div className="font-display text-3xl text-dark">{completedToday}</div>
                  <div className="mt-1 text-sm text-muted">today</div>
                </div>
                <div className="rounded-[1.5rem] bg-white/80 p-4 shadow-soft">
                  <div className="font-display text-3xl text-dark">{totalCheckins}</div>
                  <div className="mt-1 text-sm text-muted">check-ins</div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] border border-white/80 p-7 shadow-panel">
            <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-muted">
              System status
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-[1.4rem] bg-white/80 p-4 shadow-soft">
                <div className="text-sm font-bold text-dark">Offline-first storage</div>
                <div className="mt-1 text-sm text-muted">
                  Habits stay available even without a network connection.
                </div>
              </div>
              <div className="rounded-[1.4rem] bg-white/80 p-4 shadow-soft">
                <div className="text-sm font-bold text-dark">Background sync</div>
                <div className="mt-1 text-sm text-muted">
                  {isPulling || isPushing ? 'Synchronization is active right now.' : 'Everything is currently in sync.'}
                </div>
              </div>
              <div className="rounded-[1.4rem] bg-gradient-to-r from-primary to-dark p-4 text-white shadow-glow">
                <div className="text-sm font-bold">Account</div>
                <div className="mt-1 text-sm text-white/80">Signed in as {user.username}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
          <HabitTrackerWidget />
          <AchievementsBoard />
        </div>
      </main>
    </div>
  );
};
