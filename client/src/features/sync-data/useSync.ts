import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/shared/api';
import { useHabitStore } from '@/entities/habit';
import { useAuthStore } from '@/entities/user';
import { useNetworkStatus } from '@/shared/lib';

export const useSync = () => {
  const { user } = useAuthStore();
  const { habits, clearSyncedDeletedHabits, markSynced, markSyncError, setHabits } = useHabitStore();
  const isOnline = useNetworkStatus();

  const pushMutation = useMutation({
    mutationFn: async () => {
      if (!user || !isOnline) return;
      return fetchWithAuth<{ success: boolean; message: string }>('/sync/push', {
        method: 'POST',
        body: JSON.stringify({ habits }),
      });
    },
    onError: (error) => {
      markSyncError(error instanceof Error ? error.message : 'Sync failed');
    },
    onSuccess: () => {
      markSynced();
      clearSyncedDeletedHabits();
    },
  });

  const pullQuery = useQuery({
    queryKey: ['sync-pull'],
    queryFn: async () => {
      if (!user || !isOnline) return null;
      const data = await fetchWithAuth<{ habits: typeof habits }>('/sync/pull');
      if (data.habits) {
        setHabits(data.habits);
        clearSyncedDeletedHabits();
      }
      return data;
    },
    enabled: false,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const syncNow = async () => {
    if (!user) return;
    if (!isOnline) {
      markSyncError('You are offline. Changes are saved locally and will sync when connection returns.');
      return;
    }

    try {
      await pushMutation.mutateAsync();
      await pullQuery.refetch();
      clearSyncedDeletedHabits();
      markSynced();
    } catch (error) {
      markSyncError(error instanceof Error ? error.message : 'Sync failed');
    }
  };

  return {
    pullHabits: pullQuery.refetch,
    pushHabits: pushMutation.mutate,
    syncNow,
    isPushing: pushMutation.isPending,
    isPulling: pullQuery.isFetching,
  };
};
