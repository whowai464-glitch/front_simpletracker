import client from './client';
import type { Lead, LeadCreate, LeadEvent, PaginatedLeads } from '@/types';

export function listLeads(page?: number, pageSize?: number) {
  return client
    .get<PaginatedLeads>('/leads', {
      params: { page, page_size: pageSize },
    })
    .then((r) => r.data);
}

export function getLead(leadId: string) {
  return client.get<Lead>(`/leads/${leadId}`).then((r) => r.data);
}

export function createLead(data: LeadCreate) {
  return client.post<Lead>('/leads', data).then((r) => r.data);
}

export function updateLead(leadId: string, data: Partial<LeadCreate>) {
  return client.patch<Lead>(`/leads/${leadId}`, data).then((r) => r.data);
}

export function deleteLead(leadId: string) {
  return client.delete(`/leads/${leadId}`).then((r) => r.data);
}

export function getLeadEvents(leadId: string, limit?: number) {
  return client
    .get<{ events: LeadEvent[]; total: number }>(`/leads/${leadId}/events`, {
      params: { limit },
    })
    .then((r) => r.data);
}
