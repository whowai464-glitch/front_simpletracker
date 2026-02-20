export interface Campaign {
  id: string;
  workspace_id: string;
  business_id: string;
  name: string;
  description?: string;
  business?: { id: string; name: string };
  created_at: string;
  updated_at: string;
}

export interface CampaignCreate {
  business_id: string;
  name: string;
  description?: string;
}

export interface CampaignUpdate {
  name?: string;
  description?: string;
}
