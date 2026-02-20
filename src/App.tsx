import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '@/components/common/AuthGuard';
import PublicRoute from '@/components/common/PublicRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import AppShellLayout from '@/components/layout/AppShellLayout';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import TrackingPage from '@/pages/TrackingPage';
import LeadsPage from '@/pages/crm/LeadsPage';
import LeadDetailPage from '@/pages/crm/LeadDetailPage';
import AutomationsPage from '@/pages/AutomationsPage';
import DomainsPage from '@/pages/settings/DomainsPage';
import PixelsPage from '@/pages/settings/PixelsPage';
import WebhooksPage from '@/pages/settings/WebhooksPage';
import AccountPage from '@/pages/settings/AccountPage';
import ProfilePage from '@/pages/ProfilePage';

export default function App() {
  return (
    <ErrorBoundary>
    <Routes>
      {/* Public routes — redirect to dashboard if already authenticated */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes wrapped in AppShell */}
      <Route element={<AuthGuard />}>
        <Route element={<AppShellLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/crm/leads" element={<LeadsPage />} />
          <Route path="/crm/leads/:id" element={<LeadDetailPage />} />
          <Route path="/automations" element={<AutomationsPage />} />
          <Route path="/settings/domains" element={<DomainsPage />} />
          <Route path="/settings/pixels" element={<PixelsPage />} />
          <Route path="/settings/webhooks" element={<WebhooksPage />} />
          <Route path="/settings/account" element={<AccountPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </ErrorBoundary>
  );
}
