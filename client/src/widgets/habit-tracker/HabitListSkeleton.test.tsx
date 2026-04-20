import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HabitListSkeleton } from './HabitListSkeleton';

describe('HabitListSkeleton', () => {
  it('renders placeholder cards while habits are loading', () => {
    const { container } = render(<HabitListSkeleton />);

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(3);
  });
});
