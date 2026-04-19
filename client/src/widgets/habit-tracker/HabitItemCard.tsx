import { Button, Card } from '@/shared/ui';
import type { Habit } from '@/entities/habit';

interface HabitItemCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  last7Days: string[];
  today: string;
  onDelete: (habitId: string) => void;
  onToggle: (habitId: string, date: string) => void;
}

export const HabitItemCard = ({
  habit,
  isCompletedToday,
  last7Days,
  today,
  onDelete,
  onToggle,
}: HabitItemCardProps) => {
  return (
    <Card className="p-5 bg-card border-gray-100 group">
      <Button
        type="button"
        variant="danger"
        onClick={() => onDelete(habit.id)}
        className="absolute top-4 right-4 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 text-sm"
        title="Delete"
        aria-label="Delete habit"
      >
        x
      </Button>

      <h3 className="m-0 mb-4 pr-6 text-lg font-semibold text-dark">{habit.title}</h3>

      <div className="flex justify-between items-end mt-2 gap-4">
        <div>
          <div className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">
            Last 7 days
          </div>
          <div className="flex gap-2">
            {last7Days.map((date) => {
              const isDone = habit.completedDates.includes(date);
              return (
                <div
                  key={date}
                  title={date}
                  className={`w-5 h-5 rounded-full border-2 transition-colors duration-300 ${
                    isDone ? 'bg-success border-success' : 'bg-gray-100 border-gray-200'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <Button
          type="button"
          onClick={() => onToggle(habit.id, today)}
          className={
            isCompletedToday
              ? 'px-5 py-2.5 rounded-xl text-success border border-success/20 bg-success/10 shadow-none text-base'
              : 'px-5 py-2.5 rounded-xl text-base'
          }
        >
          {isCompletedToday ? 'Completed' : 'Check-in'}
        </Button>
      </div>
    </Card>
  );
};
