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

  if (!isLoaded) return <div className="p-4 text-center">Завантаження...</div>;

  return (
    <div className="max-w-md mx-auto p-5 font-sans">
      <h2 className="text-2xl font-bold text-center mb-6 text-dark">Мій трекер звичок</h2>
      
      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Нова звичка..."
          aria-label="Назва нової звички"
          className="flex-grow p-3 rounded-xl border border-gray-300 outline-none text-base focus:border-primary"
        />
        <button 
          type="submit" 
          aria-label="Додати звичку"
          className="p-3 px-5 rounded-xl bg-primary text-white font-bold text-lg hover:bg-blue-600 transition"
        >
          +
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {habits.map(habit => {
          const isCompletedToday = habit.completedDates.includes(today);
          
          return (
            <div key={habit.id} className="p-4 rounded-2xl bg-white shadow-md relative group">
              <button 
                onClick={() => { if(window.confirm('Точно видалити?')) deleteHabit(habit.id); }}
                className="absolute top-3 right-3 text-danger opacity-0 group-hover:opacity-100 transition"
                title="Видалити"
                aria-label="Видалити звичку"
              >
                ✕
              </button>

              <h3 className="m-0 mb-4 pr-6 text-lg font-semibold text-dark">
                {habit.title}
              </h3>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-gray-500 mb-2">Останні 7 днів:</div>
                  <div className="flex gap-1.5">
                    {last7Days.map(date => {
                      const isDone = habit.completedDates.includes(date);
                      return (
                        <div 
                          key={date} 
                          title={date}
                          className={`w-4 h-4 rounded-full border ${isDone ? 'bg-success border-success' : 'bg-gray-200 border-gray-300'}`}
                        />
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => toggleHabitDate(habit.id, today)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all shadow-sm ${
                    isCompletedToday 
                      ? 'bg-gray-100 text-gray-500 shadow-none' 
                      : 'bg-success text-white shadow-success/30 hover:bg-green-600'
                  }`}
                >
                  {isCompletedToday ? '✓ Виконано' : 'Відмітити'}
                </button>
              </div>
            </div>
          );
        })}
        {habits.length === 0 && <p className="text-gray-400 text-center">Немає звичок. Додайте першу!</p>}
      </div>
    </div>
  );
};
