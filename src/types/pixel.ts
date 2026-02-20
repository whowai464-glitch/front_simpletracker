export type PixelType =
  | 'facebook'
  | 'tiktok'
  | 'google'
  | 'snapchat'
  | 'pinterest'
  | 'twitter'
  | 'linkedin';

export interface Pixel {
  id: string;
  workspace_id: string;
  business_id: string;
  name: string;
  pixel_type: PixelType;
  pixel_id: string;
  access_token: string;
  test_event_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PixelCreate {
  name: string;
  pixel_type: PixelType;
  pixel_id: string;
  access_token: string;
  test_event_code?: string;
}

export interface PixelUpdate {
  name?: string;
  access_token?: string;
  test_event_code?: string;
  is_active?: boolean;
}
