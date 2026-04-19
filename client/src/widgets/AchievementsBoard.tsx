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
    <div className="max-w-md mx-auto p-6 font-sans">
      <h2 className="text-2xl font-bold mb-6 text-dark">My Achievements</h2>
      {achievements.length === 0 ? (
        <Card className="py-8 px-4 text-center border-gray-200 bg-white/50">
          <p className="text-gray-500 font-medium">No achievements yet. Keep tracking your habits!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
};
