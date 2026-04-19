import { Button, Input } from '@/shared/ui';

interface HabitFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const HabitForm = ({ value, onChange, onSubmit }: HabitFormProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-8 flex flex-col gap-3 sm:flex-row">
      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What do you want to build next?"
        aria-label="New habit name"
        className="shadow-soft sm:flex-1"
      />
      <Button type="submit" aria-label="Add habit" className="px-6 text-base sm:min-w-[10rem]">
        Add habit
      </Button>
    </form>
  );
};
