import client from './client';
import type {
  Tag,
  TagCreate,
  TagUpdate,
  TagCustomParam,
  TagScript,
} from '@/types';

export function listTags(businessId: string, domainId?: string) {
  return client
    .get<Tag[]>('/tags', {
      params: { business_id: businessId, ...(domainId ? { domain_id: domainId } : {}) },
    })
    .then((r) => r.data);
}

export function getTag(id: string) {
  return client.get<Tag>(`/tags/${id}`).then((r) => r.data);
}

export function createTag(data: TagCreate) {
  return client.post<Tag>('/tags', data).then((r) => r.data);
}

export function updateTag(id: string, data: TagUpdate) {
  return client.patch<Tag>(`/tags/${id}`, data).then((r) => r.data);
}

export function deleteTag(id: string) {
  return client.delete(`/tags/${id}`).then((r) => r.data);
}

// Tag Pixels
export function addTagPixel(tagId: string, pixelId: string) {
  return client
    .post(`/tags/${tagId}/pixels`, { pixel_id: pixelId })
    .then((r) => r.data);
}

export function removeTagPixel(tagId: string, pixelId: string) {
  return client
    .delete(`/tags/${tagId}/pixels/${pixelId}`)
    .then((r) => r.data);
}

// Custom Params
export function listCustomParams(tagId: string) {
  return client
    .get<TagCustomParam[]>(`/tags/${tagId}/custom-params`)
    .then((r) => r.data);
}

export function createCustomParam(
  tagId: string,
  data: { field: string; value: string },
) {
  return client
    .post<TagCustomParam>(`/tags/${tagId}/custom-params`, data)
    .then((r) => r.data);
}

export function updateCustomParam(
  tagId: string,
  paramId: string,
  data: { field?: string; value?: string },
) {
  return client
    .patch<TagCustomParam>(`/tags/${tagId}/custom-params/${paramId}`, data)
    .then((r) => r.data);
}

export function deleteCustomParam(tagId: string, paramId: string) {
  return client
    .delete(`/tags/${tagId}/custom-params/${paramId}`)
    .then((r) => r.data);
}

// Script
export function getTagScript(slug: string) {
  return client
    .get<TagScript>(`/tags/script/${slug}.js`)
    .then((r) => r.data);
}
