import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from '@/api/campaigns';
import type { CampaignUpdate } from '@/types';
import type { AxiosError } from 'axios';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ detail?: string }>;
  return axiosError.response?.data?.detail || 'Ocorreu um erro inesperado';
}

export function useCampaigns(businessId: string | null) {
  return useQuery({
    queryKey: ['campaigns', businessId],
    queryFn: () => listCampaigns(businessId!),
    enabled: !!businessId,
  });
}

export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: ['campaigns', 'detail', id],
    queryFn: () => getCampaign(id!),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      notifications.show({
        title: 'Campanha criada',
        message: 'A campanha foi criada com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar campanha',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CampaignUpdate }) =>
      updateCampaign(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      notifications.show({
        title: 'Campanha atualizada',
        message: 'A campanha foi atualizada com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar campanha',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      notifications.show({
        title: 'Campanha excluida',
        message: 'A campanha foi excluida com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir campanha',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
