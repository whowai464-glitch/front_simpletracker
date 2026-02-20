import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  getLeadEvents,
} from '@/api/leads';
import type { LeadCreate } from '@/types';
import type { AxiosError } from 'axios';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ detail?: string }>;
  return axiosError.response?.data?.detail || 'Ocorreu um erro inesperado';
}

export function useLeads(page: number, pageSize: number) {
  return useQuery({
    queryKey: ['leads', page, pageSize],
    queryFn: () => listLeads(page, pageSize),
  });
}

export function useLead(leadId: string | null | undefined) {
  return useQuery({
    queryKey: ['leads', leadId],
    queryFn: () => getLead(leadId!),
    enabled: !!leadId,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LeadCreate) => createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      notifications.show({
        title: 'Lead criado',
        message: 'O lead foi criado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar lead',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, data }: { leadId: string; data: Partial<LeadCreate> }) =>
      updateLead(leadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      notifications.show({
        title: 'Lead atualizado',
        message: 'O lead foi atualizado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar lead',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      notifications.show({
        title: 'Lead excluido',
        message: 'O lead foi removido com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir lead',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useLeadEvents(leadId: string | null | undefined, limit?: number) {
  return useQuery({
    queryKey: ['lead-events', leadId],
    queryFn: () => getLeadEvents(leadId!, limit),
    enabled: !!leadId,
  });
}
