export type WorkspaceRole = 'owner' | 'admin' | 'analyst' | 'viewer';

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceMember {
  user_id: string;
  name: string;
  email: string;
  role: WorkspaceRole;
}

export interface Invitation {
  id: string;
  email: string;
  workspace_name: string;
  invited_by_name: string;
  role: WorkspaceRole;
  is_valid: boolean;
  user_exists?: boolean;
  token?: string;
  created_at: string;
}

export interface SwitchWorkspaceResponse {
  access_token: string;
  refresh_token: string;
  workspace_id: string;
  workspace_name: string;
}
