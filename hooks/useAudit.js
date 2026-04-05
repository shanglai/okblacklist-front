'use client';

import { useQuery } from '@tanstack/react-query';
import { getAuditHistory } from '@/lib/api-client';

export function useAuditHistory(params = {}) {
  return useQuery({
    queryKey: ['audit', params],
    queryFn: () => getAuditHistory(params),
  });
}
