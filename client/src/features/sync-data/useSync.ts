import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/shared/api';
import { useHabitStore } from '@/entities/habit';
import { useAuthStore } from '@/entities/user';

export const useSync = () => {
  const { user } = useAuthStore();
  const { habits, setHabits } = useHabitStore();

  const queryClient = useQueryClient();

  const pushMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      return fetchWithAuth('/sync/push', {
        method: 'POST',
        body: JSON.stringify({ habits }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-pull'] });
    }
  });

  const pullQuery = useQuery({
    queryKey: ['sync-pull'],
    queryFn: async () => {
      if (!user) return null;
      const data = await fetchWithAuth('/sync/pull');
      if (data.habits) {
        setHabits(data.habits);
      }
      return data;
    },
    enabled: !!user,
  });

  return {
    pushHabits: pushMutation.mutate,
    isPushing: pushMutation.isPending,
    isPulling: pullQuery.isLoading,
  };
};
