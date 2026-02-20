import client from './client';
import type { Campaign, CampaignUpdate } from '@/types';

export function listCampaigns(businessId: string) {
  return client
    .get<Campaign[]>('/campaigns', {
      params: { business_id: businessId },
    })
    .then((r) => r.data);
}

export function getCampaign(id: string) {
  return client.get<Campaign>(`/campaigns/${id}`).then((r) => r.data);
}

export function createCampaign(data: {
  name: string;
  description?: string;
  tag_id?: string;
  business_id: string;
}) {
  return client.post<Campaign>('/campaigns', data).then((r) => r.data);
}

export function updateCampaign(id: string, data: CampaignUpdate) {
  return client.put<Campaign>(`/campaigns/${id}`, data).then((r) => r.data);
}

export function deleteCampaign(id: string) {
  return client.delete(`/campaigns/${id}`).then((r) => r.data);
}
