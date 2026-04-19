import { Button, Input } from '@/shared/ui';

interface HabitFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const HabitForm = ({ value, onChange, onSubmit }: HabitFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2 mb-8">
      <Input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="What do you want to build?"
        aria-label="New habit name"
        className="shadow-soft"
      />
      <Button type="submit" aria-label="Add habit" className="px-6 text-xl">
        +
      </Button>
    </form>
  );
};
