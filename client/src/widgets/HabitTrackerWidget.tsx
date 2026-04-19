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
    <div className="max-w-md mx-auto p-6 font-sans">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
        My Habit Tracker
      </h2>
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
    </div>
  );
};
