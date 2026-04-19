import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchWithAuth } from '@/shared/api';
import { useHabitStore } from '@/entities/habit';
import { useAuthStore } from '@/entities/user';

export const useSync = () => {
  const { token } = useAuthStore();
  const { habits, setHabits } = useHabitStore();

  const pushMutation = useMutation({
    mutationFn: async () => {
      if (!token) return;
      return fetchWithAuth('/sync/push', {
        method: 'POST',
        body: JSON.stringify({ habits }),
      });
    },
  });

  const pullQuery = useQuery({
    queryKey: ['sync-pull'],
    queryFn: async () => {
      if (!token) return null;
      const data = await fetchWithAuth('/sync/pull');
      if (data.habits) {
        setHabits(data.habits);
      }
      return data;
    },
    enabled: !!token,
  });

  return {
    pushHabits: pushMutation.mutate,
    isPushing: pushMutation.isPending,
    isPulling: pullQuery.isLoading,
  };
};
