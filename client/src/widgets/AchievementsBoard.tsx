import { useMemo } from 'react';
import { useHabitStore } from '@/entities/habit';

export const AchievementsBoard = () => {
  const { habits } = useHabitStore();

  const achievements = useMemo(() => {
    const list = [];
    
    // First Blood: Has at least one habit
    if (habits.length > 0) {
      list.push({ id: 'first-blood', name: 'First Blood', desc: 'Created first habit', icon: 'icon-first-blood' });
    }

    // 3 Days Streak: Any habit has 3 completed dates
    const has3Days = habits.some(h => h.completedDates.length >= 3);
    if (has3Days) {
      list.push({ id: 'streak-3', name: 'Consistency', desc: 'Completed 3 times', icon: 'icon-streak-3' });
    }

    // 7 Days Streak: Any habit has 7 completed dates
    const has7Days = habits.some(h => h.completedDates.length >= 7);
    if (has7Days) {
      list.push({ id: 'streak-7', name: 'Champion', desc: 'Completed 7 times', icon: 'icon-cup' });
    }

    return list;
  }, [habits]);

  return (
    <div className="max-w-md mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-6 text-dark flex items-center gap-2">
        🏆 My Achievements
      </h2>
      {achievements.length === 0 ? (
        <div className="py-8 px-4 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200">
          <p className="text-gray-500 font-medium">No achievements yet. Keep tracking your habits!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {achievements.map(ach => (
            <div key={ach.id} className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-soft border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group">
              <svg className="w-14 h-14 text-warning mb-3 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                <use href={`/sprite.svg#${ach.icon}`} />
              </svg>
              <div className="text-sm font-bold text-dark leading-tight mb-1">{ach.name}</div>
              <div className="text-[10px] text-gray-500">{ach.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
