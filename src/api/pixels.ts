import client from './client';
import type { Pixel, PixelCreate, PixelUpdate, PixelType } from '@/types';

export function listPixels(businessId: string, pixelType?: PixelType) {
  return client
    .get<Pixel[]>('/pixels', {
      params: { business_id: businessId, ...(pixelType ? { pixel_type: pixelType } : {}) },
    })
    .then((r) => r.data);
}

export function getPixel(id: string) {
  return client.get<Pixel>(`/pixels/${id}`).then((r) => r.data);
}

export function createPixel(data: PixelCreate & { business_id: string }) {
  const { business_id, ...body } = data;
  return client.post<Pixel>('/pixels', body, { params: { business_id } }).then((r) => r.data);
}

export function updatePixel(id: string, data: PixelUpdate) {
  return client.patch<Pixel>(`/pixels/${id}`, data).then((r) => r.data);
}

export function deletePixel(id: string) {
  return client.delete(`/pixels/${id}`).then((r) => r.data);
}

export function searchPixels(businessId: string, query: string) {
  return client
    .get<Pixel[]>('/pixels/search', {
      params: { business_id: businessId, q: query },
    })
    .then((r) => r.data);
}
