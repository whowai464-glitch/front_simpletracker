import client from './client';
import type { Webhook, WebhookCreate, WebhookUpdate } from '@/types';

export function listWebhooks(businessId?: string) {
  return client
    .get<Webhook[]>('/webhooks', {
      params: { business_id: businessId },
    })
    .then((r) => r.data);
}

export function getWebhook(id: string) {
  return client.get<Webhook>(`/webhooks/${id}`).then((r) => r.data);
}

export function createWebhook(data: WebhookCreate) {
  return client.post<Webhook>('/webhooks', data).then((r) => r.data);
}

export function updateWebhook(id: string, data: WebhookUpdate) {
  return client.patch<Webhook>(`/webhooks/${id}`, data).then((r) => r.data);
}

export function deleteWebhook(id: string) {
  return client.delete(`/webhooks/${id}`).then((r) => r.data);
}
