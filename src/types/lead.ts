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
  first_campaign?: { id: string; name: string } | null;
  campaign?: { id: string; name: string } | null;
  first_advertisement?: { id: string; name: string } | null;
  advertisement?: { id: string; name: string } | null;
  first_tag?: { id: string; name: string } | null;
  tag?: { id: string; name: string } | null;
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
  event_name: string;
  timestamp: string;
  page_location: string | null;
  page_title: string | null;
  value: number;
  currency: string | null;
  ip: string | null;
  city: string | null;
  country: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  page_size: number;
}
