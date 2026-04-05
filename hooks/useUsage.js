'use client';

import { useQuery } from '@tanstack/react-query';
import { getUsage } from '@/lib/api-client';

export function useUsage() {
  return useQuery({
    queryKey: ['usage'],
    queryFn: getUsage,
    refetchInterval: 60000, // Refresh every minute
  });
}
