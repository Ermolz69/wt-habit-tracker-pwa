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
    <div className="min-h-screen app-shell relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-8%] left-[-6%] w-[28rem] h-[28rem] bg-primary/18 rounded-full blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-[-12%] right-[-8%] w-[26rem] h-[26rem] bg-accent/20 rounded-full blur-3xl opacity-70 animate-blob"></div>
      </div>

      <div className="relative min-h-screen max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] items-center gap-10 px-5 py-10 sm:px-8 lg:px-12">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/65 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-muted shadow-soft">
              Habit tracker PWA
            </div>
            <h1 className="mt-6 font-display text-6xl leading-[0.95] tracking-tight text-dark text-balance">
              Build a routine that feels calm, premium and actually usable.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              Track habits offline, sync when you are back online, and keep your progress inside a dashboard that feels deliberate instead of generic.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">
              <div className="glass-panel rounded-[1.6rem] border border-white/70 p-5 shadow-soft">
                <div className="font-display text-3xl text-dark">7</div>
                <div className="mt-1 text-sm text-muted">day streak view</div>
              </div>
              <div className="glass-panel rounded-[1.6rem] border border-white/70 p-5 shadow-soft">
                <div className="font-display text-3xl text-dark">24/7</div>
                <div className="mt-1 text-sm text-muted">offline access</div>
              </div>
              <div className="glass-panel rounded-[1.6rem] border border-white/70 p-5 shadow-soft">
                <div className="font-display text-3xl text-dark">JWT</div>
                <div className="mt-1 text-sm text-muted">secure auth flow</div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex justify-center lg:justify-end">
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
        </section>
      </div>
    </div>
  );
};
