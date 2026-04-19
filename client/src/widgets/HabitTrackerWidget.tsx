import { useEffect, useMemo, useState } from 'react';
import { useHabitStore } from '@/entities/habit';
import { useSync } from '@/features/sync-data';
import { getFormattedDate, getLastNDays } from '@/shared/lib';
import { HabitEmptyState } from '@/widgets/habit-tracker/HabitEmptyState';
import { HabitForm } from '@/widgets/habit-tracker/HabitForm';
import { HabitItemCard } from '@/widgets/habit-tracker/HabitItemCard';

export const HabitTrackerWidget = () => {
  const { habits, isLoaded, addHabit, deleteHabit, toggleHabitDate } = useHabitStore();
  const [newTitle, setNewTitle] = useState('');
  const { pushHabits } = useSync();

  const today = useMemo(() => getFormattedDate(new Date()), []);
  const last7Days = useMemo(() => getLastNDays(7), []);

  useEffect(() => {
    if (isLoaded) {
      pushHabits();
    }
  }, [habits, isLoaded, pushHabits]);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTitle.trim()) return;

    addHabit(newTitle.trim());
    setNewTitle('');
  };

  const handleDelete = (habitId: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habitId);
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-8 flex justify-center items-center text-gray-500 animate-pulse font-medium">
        Loading your habits...
      </div>
    );
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
          Last 7 days view
        </div>
      </div>
      <HabitForm value={newTitle} onChange={setNewTitle} onSubmit={handleAdd} />
      <div className="flex flex-col gap-4">
        {habits.map((habit) => (
          <HabitItemCard
            key={habit.id}
            habit={habit}
            isCompletedToday={habit.completedDates.includes(today)}
            last7Days={last7Days}
            onDelete={handleDelete}
            onToggle={toggleHabitDate}
            today={today}
          />
        ))}
        {habits.length === 0 && <HabitEmptyState />}
      </div>
    </section>
  );
};
