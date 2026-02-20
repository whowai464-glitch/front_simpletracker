export interface Business {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessCreate {
  name: string;
  description?: string;
}

export interface BusinessUpdate {
  name: string;
  description?: string;
  is_active?: boolean;
}
