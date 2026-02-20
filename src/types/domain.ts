import type { Business } from './business';

export type HostnameStatus =
  | 'active'
  | 'pending'
  | 'moved'
  | 'deleted'
  | 'active_redeploying'
  | 'blocked'
  | 'test_pending'
  | 'test_active'
  | 'test_active_apex'
  | 'test_blocked'
  | 'test_failed';

export type CertificateStatus =
  | 'active'
  | 'pending_validation'
  | 'initializing'
  | 'pending_issuance'
  | 'pending_deployment'
  | 'pending_deletion'
  | 'deactivating'
  | 'inactive'
  | 'expired'
  | 'error'
  | 'issuance_failed'
  | 'deployment_failed'
  | 'deletion_failed'
  | 'validation_timed_out';

export interface Domain {
  id: string;
  domain: string;
  subdomain?: string;
  business_id: string;
  workspace_id: string;
  hostname_status: HostnameStatus;
  certificate_status: CertificateStatus;
  txt_name?: string;
  txt_value?: string;
  full_hostname: string;
  verification_errors?: string | null;
  last_synced_at?: string;
  business?: Business;
  created_at: string;
  updated_at: string;
}

export interface DomainCreate {
  domain: string;
  subdomain?: string;
  business_id: string;
}
