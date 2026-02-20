import { useQuery } from '@tanstack/react-query';
import { getEventVolumeByHour } from '@/api/reports';

export function useEventVolumeByHour(from?: string, to?: string) {
  return useQuery({
    queryKey: ['reports', 'volume-by-hour', from, to],
    queryFn: () => getEventVolumeByHour(from, to),
  });
}
