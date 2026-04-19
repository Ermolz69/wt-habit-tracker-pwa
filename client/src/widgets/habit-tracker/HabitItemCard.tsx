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
    <Card className="group border-white/70 bg-white/88 p-5 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-primary/8 via-accent/8 to-transparent"></div>
      <Button
        type="button"
        variant="danger"
        onClick={() => onDelete(habit.id)}
        className="absolute top-4 right-4 h-9 w-9 rounded-full p-0 opacity-0 text-sm group-hover:opacity-100"
        title="Delete"
        aria-label="Delete habit"
      >
        x
      </Button>

      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.28em] font-bold text-muted">
          Habit
        </div>
        <h3 className="m-0 mt-2 mb-5 pr-10 text-xl font-bold text-dark">{habit.title}</h3>
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-muted">
            Last 7 days
          </div>
          <div className="flex gap-2">
            {last7Days.map((date) => {
              const isDone = habit.completedDates.includes(date);
              return (
                <div
                  key={date}
                  title={date}
                  className={`h-6 w-6 rounded-full border-2 shadow-sm transition-all duration-300 ${
                    isDone ? 'bg-success border-success scale-105' : 'bg-surface border-white'
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
              ? 'px-5 py-3 rounded-[1.2rem] text-success border border-success/20 bg-success/10 shadow-none text-base'
              : 'px-5 py-3 rounded-[1.2rem] text-base'
          }
        >
          {isCompletedToday ? 'Completed' : 'Check-in'}
        </Button>
      </div>
    </Card>
  );
};
