'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { searchEntities, getEntityDetail, submitDecision } from '@/lib/api-client';

export function useSearch() {
  const queryClient = useQueryClient();

  const searchMutation = useMutation({
    mutationFn: searchEntities,
    onSuccess: (data) => {
      // Cache the search results
      queryClient.setQueryData(['searchResults'], data);
    },
  });

  return {
    search: searchMutation.mutate,
    searchAsync: searchMutation.mutateAsync,
    results: searchMutation.data,
    isLoading: searchMutation.isPending,
    error: searchMutation.error,
    reset: searchMutation.reset,
  };
}

export function useEntityDetail(id) {
  return useQuery({
    queryKey: ['entity', id],
    queryFn: () => getEntityDetail(id),
    enabled: !!id,
  });
}

export function useSubmitDecision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitDecision,
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['searchResults'] });
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
    },
  });
}
