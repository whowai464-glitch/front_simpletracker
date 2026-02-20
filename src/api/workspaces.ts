import client from './client';
import type {
  Workspace,
  WorkspaceMember,
  Invitation,
  WorkspaceRole,
  SwitchWorkspaceResponse,
} from '@/types';

export function listWorkspaces() {
  return client
    .get<{ workspaces: Array<{ workspace: Workspace; role: string; is_current: boolean }> }>('/workspaces')
    .then((r) => r.data.workspaces.map((w) => w.workspace));
}

export function switchWorkspace(id: string) {
  return client
    .post<SwitchWorkspaceResponse>(`/workspaces/${id}/switch`)
    .then((r) => r.data);
}

export function listMembers(workspaceId: string) {
  return client
    .get<WorkspaceMember[]>(`/workspaces/${workspaceId}/members`)
    .then((r) => r.data);
}

export function removeMember(workspaceId: string, memberId: string) {
  return client
    .delete(`/workspaces/${workspaceId}/members/${memberId}`)
    .then((r) => r.data);
}

export function listInvitations(workspaceId: string) {
  return client
    .get<Invitation[]>(`/workspaces/${workspaceId}/invitations`)
    .then((r) => r.data);
}

export function createInvitation(
  workspaceId: string,
  data: { email: string; role: WorkspaceRole },
) {
  return client
    .post<Invitation>(`/workspaces/${workspaceId}/invitations`, data)
    .then((r) => r.data);
}

export function getInvitationInfo(token: string) {
  return client
    .get<Invitation>(`/workspaces/invitations/${token}/info`)
    .then((r) => r.data);
}

export function acceptInvitation(token: string) {
  return client
    .post<SwitchWorkspaceResponse>(`/workspaces/invitations/${token}/accept`)
    .then((r) => r.data);
}

export function deleteInvitation(workspaceId: string, invitationId: string) {
  return client
    .delete(`/workspaces/${workspaceId}/invitations/${invitationId}`)
    .then((r) => r.data);
}

export function updateWorkspace(id: string, data: { name?: string }) {
  return client
    .put<Workspace>(`/workspaces/${id}`, data)
    .then((r) => r.data);
}
