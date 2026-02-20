import client from './client';
import type { Business, BusinessCreate, BusinessUpdate } from '@/types';

export function listBusinesses() {
  return client
    .get<{ data: Business[] }>('/businesses')
    .then((r) => r.data.data);
}

export function getBusiness(id: string) {
  return client.get<Business>(`/businesses/${id}`).then((r) => r.data);
}

export function createBusiness(data: BusinessCreate) {
  return client.post<Business>('/businesses', data).then((r) => r.data);
}

export function updateBusiness(id: string, data: BusinessUpdate) {
  return client.put<Business>(`/businesses/${id}`, data).then((r) => r.data);
}

export function deleteBusiness(id: string) {
  return client.delete(`/businesses/${id}`).then((r) => r.data);
}
