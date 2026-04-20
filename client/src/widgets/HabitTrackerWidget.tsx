import { useEffect, useMemo, useState } from 'react';
import { useHabitStore } from '@/entities/habit';
import { useSync } from '@/features/sync-data';
import { ConfirmDialog } from '@/shared/ui';
import { getFormattedDate, getLastNDays, useNetworkStatus } from '@/shared/lib';
import { HabitEmptyState } from '@/widgets/habit-tracker/HabitEmptyState';
import { HabitForm } from '@/widgets/habit-tracker/HabitForm';
import { HabitItemCard } from '@/widgets/habit-tracker/HabitItemCard';
import { HabitListSkeleton } from '@/widgets/habit-tracker/HabitListSkeleton';

export const HabitTrackerWidget = () => {
  const {
    habits,
    hasPendingChanges,
    isLoaded,
    lastSyncedAt,
    syncError,
    addHabit,
    deleteHabit,
    toggleHabitDate,
  } = useHabitStore();
  const [newTitle, setNewTitle] = useState('');
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const { pushHabits } = useSync();
  const isOnline = useNetworkStatus();

  const today = useMemo(() => getFormattedDate(new Date()), []);
  const last7Days = useMemo(() => getLastNDays(7), []);
  const visibleHabits = useMemo(() => habits.filter((habit) => !habit.deletedAt), [habits]);

  useEffect(() => {
    if (isLoaded && isOnline && hasPendingChanges) {
      pushHabits();
    }
  }, [hasPendingChanges, isLoaded, isOnline, pushHabits]);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitle.trim()) return;

    addHabit(newTitle.trim());
    setNewTitle('');
  };

  const handleConfirmDelete = () => {
    if (!habitToDelete) return;
    deleteHabit(habitToDelete);
    setHabitToDelete(null);
  };

  const syncLabel = syncError
    ? 'Sync failed'
    : hasPendingChanges
      ? 'Saved locally'
      : lastSyncedAt
        ? `Synced ${new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(lastSyncedAt)}`
        : isOnline
          ? 'Ready to sync'
          : 'Offline mode';

  if (!isLoaded) {
    return <HabitListSkeleton />;
  }

  return (
    <section className="glass-panel rounded-[2rem] border border-white/80 p-6 shadow-panel sm:p-7">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.32em] font-bold text-muted">
            Habit tracker
          </div>
          <h2 className="section-title mt-2 text-3xl sm:text-4xl">
            Daily commitments
          </h2>
        </div>
        <div className="rounded-full bg-white/75 px-4 py-2 text-sm font-semibold text-muted shadow-soft">
          {syncLabel}
        </div>
      </div>
      {!isOnline && (
        <div className="mb-5 rounded-[1.4rem] border border-amber-200/70 bg-amber-50/85 px-4 py-3 text-sm font-semibold text-warning shadow-soft">
          Offline mode is active. New changes stay on this device and sync when the connection returns.
        </div>
      )}
      <HabitForm value={newTitle} onChange={setNewTitle} onSubmit={handleAdd} />
      <div className="flex flex-col gap-4">
        {visibleHabits.map((habit) => (
          <HabitItemCard
            key={habit.id}
            habit={habit}
            isCompletedToday={habit.completedDates.includes(today)}
            last7Days={last7Days}
            onDelete={setHabitToDelete}
            onToggle={toggleHabitDate}
            today={today}
          />
        ))}
        {visibleHabits.length === 0 && <HabitEmptyState />}
      </div>
      <ConfirmDialog
        confirmLabel="Delete"
        description="The habit will disappear from this device now and sync as a soft delete when the connection is available."
        isOpen={habitToDelete !== null}
        title="Delete this habit?"
        onCancel={() => setHabitToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};
