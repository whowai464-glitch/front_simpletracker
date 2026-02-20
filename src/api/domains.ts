import client from './client';
import type { Domain, DomainCreate } from '@/types';

export function listDomains(businessId: string) {
  return client
    .get<Domain[]>('/domains', {
      params: { business_id: businessId },
    })
    .then((r) => r.data);
}

export function getDomain(id: string) {
  return client.get<Domain>(`/domains/${id}`).then((r) => r.data);
}

export function createDomain(data: DomainCreate) {
  return client.post<Domain>('/domains', data).then((r) => r.data);
}

export function deleteDomain(id: string) {
  return client.delete(`/domains/${id}`).then((r) => r.data);
}

export function syncDomain(id: string) {
  return client.post<Domain>(`/domains/${id}/sync`).then((r) => r.data);
}
