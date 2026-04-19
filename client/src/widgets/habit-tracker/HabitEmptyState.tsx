import { Card } from '@/shared/ui';

export const HabitEmptyState = () => {
  return (
    <Card className="border-dashed border-white/80 bg-white/55 px-6 py-14 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-primary/15 to-accent/20 text-2xl text-primary">
        +
      </div>
      <p className="font-display text-2xl text-dark">No habits yet</p>
      <p className="mx-auto mt-3 max-w-sm text-muted">
        Start with one small ritual and let the streak build from there.
      </p>
    </Card>
  );
};
