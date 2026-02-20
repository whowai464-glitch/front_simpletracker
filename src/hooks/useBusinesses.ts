import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
} from '@/api/businesses';
import type { BusinessUpdate } from '@/types';
import { getErrorMessage } from '@/lib/errors';


export function useBusinesses() {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: listBusinesses,
  });
}

export function useBusiness(id: string | null) {
  return useQuery({
    queryKey: ['businesses', id],
    queryFn: () => getBusiness(id!),
    enabled: !!id,
  });
}

export function useCreateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      notifications.show({
        title: 'Negocio criado',
        message: 'O negocio foi criado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar negocio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BusinessUpdate }) =>
      updateBusiness(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      notifications.show({
        title: 'Negocio atualizado',
        message: 'O negocio foi atualizado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar negocio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBusiness,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
      notifications.show({
        title: 'Negocio excluido',
        message: 'O negocio foi excluido com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir negocio',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
