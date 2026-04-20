import { Alert, Button, Card, Input } from '@/shared/ui';

interface AuthPanelProps {
  error: string;
  isLogin: boolean;
  isSubmitting: boolean;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => Promise<void>;
  onToggleMode: () => void;
  onUsernameChange: (value: string) => void;
  password: string;
  username: string;
}

export const AuthPanel = ({
  error,
  isLogin,
  isSubmitting,
  onPasswordChange,
  onSubmit,
  onToggleMode,
  onUsernameChange,
  password,
  username,
}: AuthPanelProps) => {
  return (
    <Card className="max-w-md w-full z-10 px-8 py-9 sm:px-10">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-primary/12 via-accent/12 to-transparent"></div>
      <div className="relative text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-[1.6rem] bg-gradient-to-br from-primary to-accent mb-5 shadow-glow animate-float">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-[11px] uppercase tracking-[0.35em] text-muted font-bold mb-3">
          Offline-first routine space
        </div>
        <h2 className="font-display text-4xl sm:text-[2.65rem] font-bold text-dark tracking-tight text-balance">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-muted text-sm mt-3 max-w-xs mx-auto leading-6">
          {isLogin ? 'Sign in to track your habits' : 'Join us and build better habits'}
        </p>
      </div>

      {error && <Alert className="mb-6">{error}</Alert>}

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <Input
          label="Username"
          type="text"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          placeholder="e.g. johndoe"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          placeholder="Enter your password"
          required
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted font-medium">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          className="text-primary font-bold hover:text-dark transition-colors"
          onClick={onToggleMode}
        >
          {isLogin ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </Card>
  );
};
