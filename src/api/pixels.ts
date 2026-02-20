import client from './client';
import type { Pixel, PixelCreate, PixelUpdate, PixelType } from '@/types';

export function listPixels(businessId: string, pixelType?: PixelType) {
  return client
    .get<{ data: Pixel[] }>('/pixels', {
      params: { business_id: businessId, ...(pixelType ? { pixel_type: pixelType } : {}) },
    })
    .then((r) => r.data.data);
}

export function getPixel(id: string) {
  return client.get<Pixel>(`/pixels/${id}`).then((r) => r.data);
}

export function createPixel(data: PixelCreate & { business_id: string }) {
  return client.post<Pixel>('/pixels', data).then((r) => r.data);
}

export function updatePixel(id: string, data: PixelUpdate) {
  return client.put<Pixel>(`/pixels/${id}`, data).then((r) => r.data);
}

export function deletePixel(id: string) {
  return client.delete(`/pixels/${id}`).then((r) => r.data);
}

export function searchPixels(businessId: string, query: string) {
  return client
    .get<{ data: Pixel[] }>('/pixels/search', {
      params: { business_id: businessId, q: query },
    })
    .then((r) => r.data.data);
}
