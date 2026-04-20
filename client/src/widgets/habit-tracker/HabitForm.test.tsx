import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { HabitForm } from './HabitForm';

describe('HabitForm', () => {
  it('renders current value and forwards submit/change events', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(<HabitForm value="Read" onChange={onChange} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('New habit name'), { target: { value: 'Write' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add habit' }));

    expect(screen.getByDisplayValue('Read')).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith('Write');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
