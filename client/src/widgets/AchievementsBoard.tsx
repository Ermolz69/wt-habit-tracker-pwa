import { useMemo } from 'react';
import { useHabitStore } from '@/entities/habit';
import { Card } from '@/shared/ui';
import { AchievementCard } from '@/widgets/achievements/AchievementCard';

export const AchievementsBoard = () => {
  const { habits } = useHabitStore();

  const achievements = useMemo(() => {
    const list = [];

    if (habits.length > 0) {
      list.push({
        id: 'first-blood',
        name: 'First Blood',
        desc: 'Created first habit',
        icon: 'icon-first-blood',
      });
    }

    if (habits.some((habit) => habit.completedDates.length >= 3)) {
      list.push({
        id: 'streak-3',
        name: 'Consistency',
        desc: 'Completed 3 times',
        icon: 'icon-streak-3',
      });
    }

    if (habits.some((habit) => habit.completedDates.length >= 7)) {
      list.push({
        id: 'streak-7',
        name: 'Champion',
        desc: 'Completed 7 times',
        icon: 'icon-cup',
      });
    }

    return list;
  }, [habits]);

  return (
    <section className="glass-panel rounded-[2rem] border border-white/80 p-6 shadow-panel sm:p-7">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-[0.32em] font-bold text-muted">
          Achievements
        </div>
        <h2 className="section-title mt-2 text-3xl sm:text-4xl">Momentum trophies</h2>
      </div>
      {achievements.length === 0 ? (
        <Card className="border-white/80 bg-white/55 px-4 py-10 text-center">
          <p className="font-semibold text-muted">No achievements yet. Keep tracking your habits!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {achievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              description={achievement.desc}
              icon={achievement.icon}
              name={achievement.name}
            />
          ))}
        </div>
      )}
    </section>
  );
};
