import type { Pixel } from './pixel';

export interface Tag {
  id: string;
  workspace_id: string;
  business_id: string;
  domain_id?: string;
  name: string;
  description?: string;
  slug: string;
  is_active: boolean;
  pixels: Pixel[];
  created_at: string;
  updated_at: string;
}

export interface TagCreate {
  business_id: string;
  domain_id?: string;
  name: string;
  description?: string;
  slug?: string;
}

export interface TagUpdate {
  name?: string;
  description?: string;
  slug?: string;
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
