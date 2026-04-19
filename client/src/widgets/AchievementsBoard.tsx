import { useMemo } from 'react';
import { useHabitStore } from '@/entities/habit';

export const AchievementsBoard = () => {
  const { habits } = useHabitStore();

  const achievements = useMemo(() => {
    const list = [];
    
    // First Blood: Has at least one habit
    if (habits.length > 0) {
      list.push({ id: 'first-blood', name: 'Перша кров', desc: 'Створена перша звичка', icon: 'icon-first-blood' });
    }

    // 3 Days Streak: Any habit has 3 completed dates
    const has3Days = habits.some(h => h.completedDates.length >= 3);
    if (has3Days) {
      list.push({ id: 'streak-3', name: 'Стабільність', desc: 'Виконано 3 рази', icon: 'icon-streak-3' });
    }

    // 7 Days Streak: Any habit has 7 completed dates
    const has7Days = habits.some(h => h.completedDates.length >= 7);
    if (has7Days) {
      list.push({ id: 'streak-7', name: 'Чемпіон', desc: 'Виконано 7 разів', icon: 'icon-cup' });
    }

    return list;
  }, [habits]);

  return (
    <div className="max-w-md mx-auto p-5">
      <h2 className="text-xl font-bold mb-4">Мої Ачівки</h2>
      {achievements.length === 0 ? (
        <p className="text-gray-500">Поки що немає досягнень. Продовжуйте працювати!</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {achievements.map(ach => (
            <div key={ach.id} className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm text-center">
              <svg className="w-12 h-12 text-warning mb-2">
                <use href={`/sprite.svg#${ach.icon}`} />
              </svg>
              <div className="text-sm font-bold text-dark leading-tight">{ach.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
