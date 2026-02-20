export interface Lead {
  id: string;
  workspace_id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  document?: string;
  business_document?: string;
  birthday?: string;
  gender?: string;
  country?: string;
  city?: string;
  state?: string;
  external_id?: string;
  first_campaign?: string;
  campaign?: string;
  first_advertisement?: string;
  advertisement?: string;
  first_tag?: string;
  tag?: string;
  first_utm_source?: string;
  utm_source?: string;
  first_utm_medium?: string;
  utm_medium?: string;
  first_utm_campaign?: string;
  utm_campaign?: string;
  first_utm_term?: string;
  utm_term?: string;
  first_utm_content?: string;
  utm_content?: string;
  merged_lead_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface LeadCreate {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  document?: string;
  birthday?: string;
  gender?: string;
  external_id?: string;
}

export interface LeadEvent {
  id: string;
  lead_id: string;
  event_name: string;
  event_data?: Record<string, unknown>;
  created_at: string;
}

export interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  page_size: number;
}
