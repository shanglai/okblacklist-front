'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getManualEntities, createManualEntity, deleteManualEntity } from '@/lib/api-client';

export function useManualEntities() {
  return useQuery({
    queryKey: ['manualEntities'],
    queryFn: getManualEntities,
  });
}

export function useCreateManualEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManualEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualEntities'] });
    },
  });
}

export function useDeleteManualEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteManualEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manualEntities'] });
    },
  });
}
