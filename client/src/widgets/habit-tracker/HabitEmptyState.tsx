import { Card } from '@/shared/ui';

export const HabitEmptyState = () => {
  return (
    <Card className="py-12 px-6 text-center border-dashed border-gray-200 bg-white/50">
      <p className="text-gray-500 font-medium">No habits yet. Start by adding your first one above.</p>
    </Card>
  );
};
