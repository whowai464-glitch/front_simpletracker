import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listPixels,
  getPixel,
  createPixel,
  updatePixel,
  deletePixel,
  searchPixels,
} from '@/api/pixels';
import type { PixelUpdate, PixelType } from '@/types';
import type { AxiosError } from 'axios';

function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ detail?: string }>;
  return axiosError.response?.data?.detail || 'Ocorreu um erro inesperado';
}

export function usePixels(businessId: string | null, pixelType?: PixelType) {
  return useQuery({
    queryKey: ['pixels', businessId, pixelType],
    queryFn: () => listPixels(businessId!, pixelType),
    enabled: !!businessId,
  });
}

export function usePixel(id: string | null) {
  return useQuery({
    queryKey: ['pixels', 'detail', id],
    queryFn: () => getPixel(id!),
    enabled: !!id,
  });
}

export function useCreatePixel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPixel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixels'] });
      notifications.show({
        title: 'Pixel criado',
        message: 'O pixel foi criado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar pixel',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdatePixel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PixelUpdate }) =>
      updatePixel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixels'] });
      notifications.show({
        title: 'Pixel atualizado',
        message: 'O pixel foi atualizado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar pixel',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeletePixel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePixel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pixels'] });
      notifications.show({
        title: 'Pixel excluido',
        message: 'O pixel foi excluido com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir pixel',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useSearchPixels(businessId: string | null, query: string) {
  return useQuery({
    queryKey: ['pixels', 'search', businessId, query],
    queryFn: () => searchPixels(businessId!, query),
    enabled: !!businessId && query.length > 0,
  });
}
