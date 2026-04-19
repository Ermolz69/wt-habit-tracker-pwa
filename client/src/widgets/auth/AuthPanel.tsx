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
    <Card className="max-w-sm w-full z-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-500 mb-4 shadow-glow">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-dark tracking-tight">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500 text-sm mt-2">
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

      <p className="mt-8 text-center text-sm text-gray-500 font-medium">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          className="text-primary font-bold hover:text-indigo-600 transition-colors"
          onClick={onToggleMode}
        >
          {isLogin ? 'Create one' : 'Sign in'}
        </button>
      </p>
    </Card>
  );
};
