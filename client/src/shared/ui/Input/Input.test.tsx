import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders label, value and error message', () => {
    render(<Input label="Username" value="demo" error="Required" readOnly />);

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByDisplayValue('demo')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('forwards change events', () => {
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'new' } });

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
