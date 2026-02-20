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

export function switchWorkspace(workspaceId: string) {
  return client
    .post<SwitchWorkspaceResponse>('/workspaces/switch', { workspace_id: workspaceId })
    .then((r) => r.data);
}

export function listMembers() {
  return client
    .get<{ members: WorkspaceMember[] }>('/workspaces/members')
    .then((r) => r.data.members);
}

export function removeMember(userId: string) {
  return client
    .delete(`/workspaces/members/${userId}`)
    .then((r) => r.data);
}

export function listInvitations() {
  return client
    .get<{ invitations: Invitation[] }>('/workspaces/invitations')
    .then((r) => r.data.invitations);
}

export function createInvitation(data: { email: string; role: WorkspaceRole }) {
  return client
    .post<Invitation>('/workspaces/invitations', data)
    .then((r) => r.data);
}

export function getInvitationInfo(token: string) {
  return client
    .get<Invitation>(`/workspaces/invitations/${token}`)
    .then((r) => r.data);
}

export function acceptInvitation(token: string) {
  return client
    .post<SwitchWorkspaceResponse>('/workspaces/invitations/accept', { token })
    .then((r) => r.data);
}

export function deleteInvitation(invitationId: string) {
  return client
    .post('/workspaces/invitations/revoke', { invitation_id: invitationId })
    .then((r) => r.data);
}

export function updateWorkspace(data: { name?: string }) {
  return client
    .patch<Workspace>('/workspaces', data)
    .then((r) => r.data);
}
