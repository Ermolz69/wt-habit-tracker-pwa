import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HabitItemCard } from './HabitItemCard';

const habit = {
  id: 'habit-1',
  title: 'Read',
  completedDates: ['2026-04-20'],
  updatedAt: 1,
  deletedAt: null,
};

describe('HabitItemCard', () => {
  it('renders habit progress and handles actions', () => {
    const onDelete = vi.fn();
    const onToggle = vi.fn();

    render(
      <HabitItemCard
        habit={habit}
        isCompletedToday
        last7Days={['2026-04-19', '2026-04-20']}
        today="2026-04-20"
        onDelete={onDelete}
        onToggle={onToggle}
      />
    );

    expect(screen.getByText('Read')).toBeInTheDocument();
    expect(screen.getByTitle('2026-04-20')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Delete habit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Completed' }));

    expect(onDelete).toHaveBeenCalledWith('habit-1');
    expect(onToggle).toHaveBeenCalledWith('habit-1', '2026-04-20');
  });

  it('shows check-in action when not completed today', () => {
    render(
      <HabitItemCard
        habit={habit}
        isCompletedToday={false}
        last7Days={[]}
        today="2026-04-21"
        onDelete={vi.fn()}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Check-in' })).toBeInTheDocument();
  });
});
