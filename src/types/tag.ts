export type TagType = 'own_page' | 'redirect' | 'link_whats';

export interface Tag {
  id: string;
  business_id: string;
  domain_id?: string;
  tag_type: TagType;
  name: string;
  slug: string;
  description?: string;
  subdomain?: string;
  path_sufix?: string;
  destination_url?: string;
  whatsapp_number?: string;
  whatsapp_message?: string;
  enable_fingerprint: boolean;
  requires_consent: boolean;
  is_active: boolean;
  gtm_container_id?: string;
  gtm_capture_events?: string[];
  redirect_events?: string[];
  business?: { id: string; name: string };
  domain?: { id: string; domain: string; subdomain?: string; hostname_status: string; certificate_status: string; verification_errors?: string | null; full_hostname: string };
  tag_pixels?: Array<{ id: string; pixel: { id: string; name: string; pixel_type: string; pixel_id: string } }>;
  custom_params?: TagCustomParam[];
  created_at: string;
  updated_at: string;
}

export interface TagCreate {
  business_id: string;
  domain_id?: string;
  tag_type: TagType;
  name: string;
  description?: string;
  slug?: string;
  destination_url?: string;
  whatsapp_number?: string;
  whatsapp_message?: string;
}

export interface TagUpdate {
  name?: string;
  description?: string;
  slug?: string;
  destination_url?: string;
  whatsapp_number?: string;
  whatsapp_message?: string;
  is_active?: boolean;
}

export interface TagCustomParam {
  id: string;
  tag_id: string;
  field: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface TagCustomParamCreate {
  field: string;
  value: string;
}

export interface TagCustomParamUpdate {
  field?: string;
  value?: string;
}

export interface TagScript {
  script_url: string;
  script_tag: string;
}
