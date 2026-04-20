import { Button } from '@/shared/ui';

interface AppHeaderProps {
  isSyncing: boolean;
  onLogout: () => Promise<void>;
  username: string;
}

export const AppHeader = ({ isSyncing, onLogout, username }: AppHeaderProps) => {
  return (
    <header className="glass-panel sticky top-4 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-[1.8rem] border border-white/80 px-4 py-4 shadow-panel sm:px-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-muted">
          Daily rhythm dashboard
        </div>
        <div className="mt-1 font-display text-2xl text-dark">
          Hello, <span className="text-primary">{username}</span>
        </div>
      </div>
      <div className="flex gap-4 items-center">
        {isSyncing && (
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 shadow-soft">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-semibold text-muted">Syncing...</span>
          </div>
        )}
        <Button type="button" variant="ghost" onClick={() => void onLogout()}>
          Logout
        </Button>
      </div>
    </header>
  );
};
