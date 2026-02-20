import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listAdvertisements,
  getAdvertisement,
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
} from '@/api/advertisements';
import type { AdvertisementUpdate } from '@/types';
import type { AxiosError } from 'axios';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ detail?: string }>;
  return axiosError.response?.data?.detail || 'Ocorreu um erro inesperado';
}

export function useAdvertisements(businessId: string | null) {
  return useQuery({
    queryKey: ['advertisements', businessId],
    queryFn: () => listAdvertisements(businessId!),
    enabled: !!businessId,
  });
}

export function useAdvertisement(id: string | null) {
  return useQuery({
    queryKey: ['advertisements', 'detail', id],
    queryFn: () => getAdvertisement(id!),
    enabled: !!id,
  });
}

export function useCreateAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      notifications.show({
        title: 'Anuncio criado',
        message: 'O anuncio foi criado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar anuncio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdvertisementUpdate }) =>
      updateAdvertisement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      notifications.show({
        title: 'Anuncio atualizado',
        message: 'O anuncio foi atualizado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar anuncio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteAdvertisement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdvertisement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisements'] });
      notifications.show({
        title: 'Anuncio excluido',
        message: 'O anuncio foi excluido com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir anuncio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
