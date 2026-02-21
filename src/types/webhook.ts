export interface Webhook {
  id: string;
  name: string;
  workspace_id: string;
  provider: string;
  webhook_token: string;
  url: string;
  is_active: boolean;
  business?: { id: string; name: string };
  tag?: { id: string; name: string; slug: string; is_active: boolean };
  created_at: string;
  updated_at: string;
}

export interface WebhookCreate {
  name: string;
  business_id: string;
  tag_id: string;
  provider: 'hotmart';
}

export interface WebhookUpdate {
  name?: string;
  business_id?: string;
  tag_id?: string;
  is_active?: boolean;
}
