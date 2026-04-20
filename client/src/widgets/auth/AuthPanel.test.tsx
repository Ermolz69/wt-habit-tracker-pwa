import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthPanel } from './AuthPanel';

describe('AuthPanel', () => {
  const baseProps = {
    error: '',
    isLogin: true,
    isSubmitting: false,
    password: '',
    username: '',
    onPasswordChange: vi.fn(),
    onSubmit: vi.fn(),
    onToggleMode: vi.fn(),
    onUsernameChange: vi.fn(),
  };

  it('renders login form and forwards input changes', () => {
    const onUsernameChange = vi.fn();
    const onPasswordChange = vi.fn();
    render(
      <AuthPanel
        {...baseProps}
        onPasswordChange={onPasswordChange}
        onUsernameChange={onUsernameChange}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('e.g. johndoe'), { target: { value: 'demo' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), { target: { value: 'secret' } });

    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(onUsernameChange).toHaveBeenCalledWith('demo');
    expect(onPasswordChange).toHaveBeenCalledWith('secret');
  });

  it('renders register mode and error state', () => {
    render(<AuthPanel {...baseProps} error="Invalid input" isLogin={false} />);

    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByText('Invalid input')).toBeInTheDocument();
  });

  it('disables submit while submitting', () => {
    render(<AuthPanel {...baseProps} isSubmitting />);

    expect(screen.getByRole('button', { name: 'Please wait...' })).toBeDisabled();
  });
});
