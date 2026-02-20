export interface Webhook {
  id: string;
  business_id: string;
  event_type: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookCreate {
  business_id: string;
  event_type: string;
  url: string;
  is_active?: boolean;
}

export interface WebhookUpdate {
  event_type?: string;
  url?: string;
  is_active?: boolean;
}
