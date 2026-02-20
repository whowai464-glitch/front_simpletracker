import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
} from '@/api/webhooks';
import type { WebhookCreate, WebhookUpdate } from '@/types';
import type { AxiosError } from 'axios';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ detail?: string }>;
  return axiosError.response?.data?.detail || 'Ocorreu um erro inesperado';
}

export function useWebhooks(businessId: string | null) {
  return useQuery({
    queryKey: ['webhooks', businessId],
    queryFn: () => listWebhooks(businessId!),
    enabled: !!businessId,
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WebhookCreate) => createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      notifications.show({
        title: 'Webhook criado',
        message: 'O webhook foi criado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar webhook',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: WebhookUpdate }) =>
      updateWebhook(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      notifications.show({
        title: 'Webhook atualizado',
        message: 'O webhook foi atualizado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar webhook',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      notifications.show({
        title: 'Webhook excluido',
        message: 'O webhook foi removido com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir webhook',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
