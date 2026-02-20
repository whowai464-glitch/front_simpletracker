import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listDomains,
  getDomain,
  createDomain,
  deleteDomain,
  syncDomain,
} from '@/api/domains';
import type { AxiosError } from 'axios';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ detail?: string }>;
  return axiosError.response?.data?.detail || 'Ocorreu um erro inesperado';
}

export function useDomains(businessId: string | null) {
  return useQuery({
    queryKey: ['domains', businessId],
    queryFn: () => listDomains(businessId!),
    enabled: !!businessId,
  });
}

export function useDomain(id: string | null) {
  return useQuery({
    queryKey: ['domains', 'detail', id],
    queryFn: () => getDomain(id!),
    enabled: !!id,
  });
}

export function useCreateDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        title: 'Dominio criado',
        message: 'O dominio foi adicionado. Configure o DNS para ativa-lo.',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar dominio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        title: 'Dominio excluido',
        message: 'O dominio foi removido com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir dominio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useSyncDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      notifications.show({
        title: 'Sincronizacao concluida',
        message: 'O status do dominio foi atualizado',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao sincronizar',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
