import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listTags,
  getTag,
  createTag,
  updateTag,
  deleteTag,
  addTagPixel,
  removeTagPixel,
  listCustomParams,
  createCustomParam,
  updateCustomParam,
  deleteCustomParam,
  getTagScript,
} from '@/api/tags';
import type { TagUpdate } from '@/types';
import { getErrorMessage } from '@/lib/errors';


export function useTags(businessId: string | null, domainId?: string) {
  return useQuery({
    queryKey: ['tags', businessId, domainId],
    queryFn: () => listTags(businessId!, domainId),
    enabled: !!businessId,
  });
}

export function useTag(id: string | null) {
  return useQuery({
    queryKey: ['tags', 'detail', id],
    queryFn: () => getTag(id!),
    enabled: !!id,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Tag criada',
        message: 'A tag foi criada com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar tag',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TagUpdate }) =>
      updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Tag atualizada',
        message: 'A tag foi atualizada com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar tag',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Tag excluida',
        message: 'A tag foi excluida com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir tag',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

// Tag Pixels
export function useAddTagPixel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, pixelId }: { tagId: string; pixelId: string }) =>
      addTagPixel(tagId, pixelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Pixel vinculado',
        message: 'O pixel foi vinculado a tag',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao vincular pixel',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useRemoveTagPixel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, pixelId }: { tagId: string; pixelId: string }) =>
      removeTagPixel(tagId, pixelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Pixel removido',
        message: 'O pixel foi removido da tag',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao remover pixel',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

// Custom Params
export function useCustomParams(tagId: string | null) {
  return useQuery({
    queryKey: ['tags', tagId, 'custom-params'],
    queryFn: () => listCustomParams(tagId!),
    enabled: !!tagId,
  });
}

export function useCreateCustomParam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tagId,
      data,
    }: {
      tagId: string;
      data: { param_key: string; param_value: string };
    }) => createCustomParam(tagId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Parametro criado',
        message: 'O parametro foi adicionado',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao criar parametro',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateCustomParam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tagId,
      paramId,
      data,
    }: {
      tagId: string;
      paramId: string;
      data: { param_key?: string; param_value?: string };
    }) => updateCustomParam(tagId, paramId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Parametro atualizado',
        message: 'O parametro foi atualizado',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar parametro',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteCustomParam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tagId, paramId }: { tagId: string; paramId: string }) =>
      deleteCustomParam(tagId, paramId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      notifications.show({
        title: 'Parametro excluido',
        message: 'O parametro foi removido',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao excluir parametro',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

// Script
export function useTagScript(slug: string | null) {
  return useQuery({
    queryKey: ['tags', 'script', slug],
    queryFn: () => getTagScript(slug!),
    enabled: !!slug,
  });
}
