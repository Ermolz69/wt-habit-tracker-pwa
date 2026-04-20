import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HabitEmptyState } from './HabitEmptyState';

describe('HabitEmptyState', () => {
  it('explains how to start tracking', () => {
    render(<HabitEmptyState />);

    expect(screen.getByText('No habits yet')).toBeInTheDocument();
    expect(screen.getByText(/Start with one small ritual/)).toBeInTheDocument();
  });
});
