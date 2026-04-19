import { useAuthForm } from '@/features/auth';
import { AuthPanel } from '@/widgets/auth/AuthPanel';

export const AuthPage = () => {
  const {
    error,
    handleSubmit,
    isLogin,
    isSubmitting,
    password,
    setPassword,
    setUsername,
    toggleMode,
    username,
  } = useAuthForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
      <AuthPanel
        error={error}
        isLogin={isLogin}
        isSubmitting={isSubmitting}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleMode={toggleMode}
        onUsernameChange={setUsername}
        password={password}
        username={username}
      />
    </div>
  );
};
