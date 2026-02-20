import { Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '@/components/common/AuthGuard';
import PublicRoute from '@/components/common/PublicRoute';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

function Placeholder({ title }: { title: string }) {
  return <div style={{ padding: 24 }}>{title}</div>;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes — redirect to dashboard if already authenticated */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
        <Route path="/tracking" element={<Placeholder title="Tracking" />} />
        <Route path="/crm/leads" element={<Placeholder title="Leads" />} />
        <Route path="/crm/leads/:id" element={<Placeholder title="Lead Detail" />} />
        <Route path="/automations" element={<Placeholder title="Automacoes" />} />
        <Route path="/settings/domains" element={<Placeholder title="Dominios" />} />
        <Route path="/settings/pixels" element={<Placeholder title="Pixels" />} />
        <Route path="/settings/webhooks" element={<Placeholder title="Webhooks" />} />
        <Route path="/settings/account" element={<Placeholder title="Conta" />} />
        <Route path="/profile" element={<Placeholder title="Perfil" />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
