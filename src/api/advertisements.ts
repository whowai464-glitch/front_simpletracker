import client from './client';
import type { Advertisement, AdvertisementCreate, AdvertisementUpdate } from '@/types';

export function listAdvertisements(businessId: string) {
  return client
    .get<Advertisement[]>('/advertisements', {
      params: { business_id: businessId },
    })
    .then((r) => r.data);
}

export function getAdvertisement(id: string) {
  return client
    .get<Advertisement>(`/advertisements/${id}`)
    .then((r) => r.data);
}

export function createAdvertisement(data: AdvertisementCreate) {
  return client
    .post<Advertisement>('/advertisements', data)
    .then((r) => r.data);
}

export function updateAdvertisement(id: string, data: AdvertisementUpdate) {
  return client
    .patch<Advertisement>(`/advertisements/${id}`, data)
    .then((r) => r.data);
}

export function deleteAdvertisement(id: string) {
  return client.delete(`/advertisements/${id}`).then((r) => r.data);
}
