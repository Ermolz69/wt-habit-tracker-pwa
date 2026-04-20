import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const ThrowingChild = () => {
  throw new Error('boom');
};

describe('ErrorBoundary', () => {
  const originalReload = window.location.reload;

  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: vi.fn() },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: originalReload },
    });
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe child</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe child')).toBeInTheDocument();
  });

  it('renders recovery UI and reload action after an error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reload app' }));
    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });
});
