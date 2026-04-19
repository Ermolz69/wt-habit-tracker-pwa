import { useState, useMemo, useEffect } from 'react';
import { useHabitStore } from '@/entities/habit';
import { getFormattedDate, getLastNDays } from '@/shared/lib';
import { useSync } from '@/features/sync-data';

export const HabitTrackerWidget = () => {
  const { habits, isLoaded, addHabit, deleteHabit, toggleHabitDate } = useHabitStore();
  const [newTitle, setNewTitle] = useState('');
  const { pushHabits } = useSync();

  const today = useMemo(() => getFormattedDate(new Date()), []);
  const last7Days = useMemo(() => getLastNDays(7), []);

  // Sync to server when habits change (debounced or on interaction)
  useEffect(() => {
    if (isLoaded) {
      pushHabits();
    }
  }, [habits, isLoaded, pushHabits]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit(newTitle);
    setNewTitle('');
  };

  if (!isLoaded) return <div className="p-8 flex justify-center items-center text-gray-500 animate-pulse font-medium">Loading your habits...</div>;

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">My Habit Tracker</h2>
      
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What do you want to build?..."
          aria-label="New habit name"
          className="flex-grow p-4 rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm outline-none text-base focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-soft transition-all"
        />
        <button 
          type="submit" 
          aria-label="Add habit"
          className="p-4 px-6 rounded-2xl bg-gradient-to-br from-primary to-indigo-500 text-white font-bold text-xl hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          +
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {habits.map(habit => {
          const isCompletedToday = habit.completedDates.includes(today);
          
          return (
            <div key={habit.id} className="p-5 rounded-3xl bg-card shadow-soft border border-gray-100 relative group hover:shadow-lg transition-shadow duration-300">
              <button 
                onClick={() => { if(window.confirm('Are you sure you want to delete this habit?')) deleteHabit(habit.id); }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-danger opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all duration-200"
                title="Delete"
                aria-label="Delete habit"
              >
                ✕
              </button>

              <h3 className="m-0 mb-4 pr-6 text-lg font-semibold text-dark">
                {habit.title}
              </h3>
              
              <div className="flex justify-between items-end mt-2">
                <div>
                  <div className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Last 7 days</div>
                  <div className="flex gap-2">
                    {last7Days.map(date => {
                      const isDone = habit.completedDates.includes(date);
                      return (
                        <div 
                          key={date} 
                          title={date}
                          className={`w-5 h-5 rounded-full border-2 transition-colors duration-300 ${isDone ? 'bg-success border-success' : 'bg-gray-100 border-gray-200'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => toggleHabitDate(habit.id, today)}
                  className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                    isCompletedToday 
                      ? 'bg-success/10 text-success border border-success/20' 
                      : 'bg-gradient-to-r from-success to-emerald-400 text-white shadow-lg shadow-success/30 hover:-translate-y-0.5'
                  }`}
                >
                  {isCompletedToday ? '✓ Completed' : 'Check-in'}
                </button>
              </div>
            </div>
          );
        })}
        {habits.length === 0 && (
          <div className="py-12 px-6 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200 border-dashed">
            <p className="text-gray-500 font-medium">No habits yet. Start by adding your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};
