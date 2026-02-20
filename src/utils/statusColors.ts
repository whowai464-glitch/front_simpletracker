import type { HostnameStatus, CertificateStatus } from '@/types';

export function getHostnameStatusColor(status: HostnameStatus): string {
  switch (status) {
    case 'active':
    case 'test_active':
    case 'test_active_apex':
      return 'green';
    case 'pending':
    case 'moved':
    case 'active_redeploying':
    case 'test_pending':
      return 'yellow';
    default:
      return 'red';
  }
}

export function getCertificateStatusColor(status: CertificateStatus): string {
  switch (status) {
    case 'active':
      return 'green';
    case 'pending_validation':
    case 'initializing':
    case 'pending_issuance':
    case 'pending_deployment':
      return 'yellow';
    default:
      return 'red';
  }
}
