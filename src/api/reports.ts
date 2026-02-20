import client from './client';
import type { EventVolumeReport } from '@/types';

export function getEventVolumeByHour(from?: string, to?: string) {
  return client
    .get<EventVolumeReport>('/reports/events/volume-by-hour', {
      params: { from, to },
    })
    .then((r) => r.data);
}
