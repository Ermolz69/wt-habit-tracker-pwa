import { Button } from '@/shared/ui';

interface AppHeaderProps {
  isSyncing: boolean;
  onLogout: () => Promise<void>;
  username: string;
}

export const AppHeader = ({ isSyncing, onLogout, username }: AppHeaderProps) => {
  return (
    <header className="bg-white/80 backdrop-blur-md px-6 py-4 shadow-sm mb-10 sticky top-0 z-50 flex justify-between items-center border-b border-gray-100">
      <div className="font-extrabold text-xl text-dark">
        Hello, <span className="text-primary">{username}</span>!
      </div>
      <div className="flex gap-6 items-center">
        {isSyncing && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-gray-500">Syncing...</span>
          </div>
        )}
        <Button type="button" variant="ghost" onClick={() => void onLogout()}>
          Logout
        </Button>
      </div>
    </header>
  );
};
