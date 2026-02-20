import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import {
  listWorkspaces,
  switchWorkspace,
  listMembers,
  removeMember,
  listInvitations,
  createInvitation,
  getInvitationInfo,
  acceptInvitation,
  deleteInvitation,
  updateWorkspace,
} from '@/api/workspaces';
import { useAuthStore } from '@/stores/authStore';
import type { WorkspaceRole } from '@/types';
import { getErrorMessage } from '@/lib/errors';


export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: listWorkspaces,
  });
}

export function useSwitchWorkspace() {
  const setTokens = useAuthStore((s) => s.setTokens);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: switchWorkspace,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      queryClient.invalidateQueries();
      notifications.show({
        title: 'Workspace alterado',
        message: `Agora voce esta no workspace "${data.workspace.name}"`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao trocar workspace',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useMembers(workspaceId: string | null) {
  return useQuery({
    queryKey: ['workspaces', 'members'],
    queryFn: () => listMembers(),
    enabled: !!workspaceId,
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId }: { userId: string }) => removeMember(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      notifications.show({
        title: 'Membro removido',
        message: 'O membro foi removido do workspace',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao remover membro',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useInvitations(workspaceId: string | null) {
  return useQuery({
    queryKey: ['workspaces', 'invitations'],
    queryFn: () => listInvitations(),
    enabled: !!workspaceId,
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
      role,
    }: {
      email: string;
      role: WorkspaceRole;
    }) => createInvitation({ email, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      notifications.show({
        title: 'Convite enviado',
        message: 'O convite foi enviado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao enviar convite',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useInvitationInfo(token: string | null) {
  return useQuery({
    queryKey: ['invitation', token],
    queryFn: () => getInvitationInfo(token!),
    enabled: !!token,
  });
}

export function useAcceptInvitation() {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: acceptInvitation,
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      notifications.show({
        title: 'Convite aceito',
        message: `Voce entrou no workspace "${data.workspace.name}"`,
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao aceitar convite',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useDeleteInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invitationId }: { invitationId: string }) =>
      deleteInvitation(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      notifications.show({
        title: 'Convite cancelado',
        message: 'O convite foi cancelado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao cancelar convite',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: { name?: string } }) =>
      updateWorkspace(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      notifications.show({
        title: 'Workspace atualizado',
        message: 'O workspace foi atualizado com sucesso',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Erro ao atualizar workspace',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
}
