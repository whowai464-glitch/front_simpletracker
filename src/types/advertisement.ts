export type TrafficSource =
  | 'meta_ads'
  | 'google_ads'
  | 'tiktok_ads'
  | 'organic'
  | 'direct'
  | 'referral'
  | (string & {});

export interface Advertisement {
  id: string;
  workspace_id: string;
  business_id: string;
  campaign_id?: string;
  tag_id?: string;
  name: string;
  observation?: string;
  slug: string;
  traffic_source: TrafficSource;
  base_url?: string;
  url_params?: string;
  business?: { id: string; name: string };
  campaign?: { id: string; name: string };
  tag?: { id: string; name: string; slug: string };
  created_at: string;
  updated_at: string;
}

export interface AdvertisementCreate {
  business_id: string;
  campaign_id?: string;
  tag_id?: string;
  name: string;
  observation?: string;
  traffic_source: TrafficSource;
}

export interface AdvertisementUpdate {
  campaign_id?: string;
  tag_id?: string;
  name?: string;
  observation?: string;
}
