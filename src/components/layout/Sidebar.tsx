import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Divider, NavLink, Stack, Text } from '@mantine/core';
import {
  IconDashboard,
  IconTag,
  IconSpeakerphone,
  IconAdCircle,
  IconUsers,
  IconRobot,
  IconWorld,
  IconCode,
  IconWebhook,
  IconSettings,
  IconUser,
  IconLogout,
} from '@tabler/icons-react';
import { useAuthStore } from '@/stores/authStore';

const iconSize = 18;

const mainLinks = [
  { label: 'Dashboard', icon: IconDashboard, to: '/dashboard' },
];

const trackingLinks = [
  { label: 'Tags', icon: IconTag, to: '/tracking?tab=tags' },
  { label: 'Campanhas', icon: IconSpeakerphone, to: '/tracking?tab=campaigns' },
  { label: 'Anuncios', icon: IconAdCircle, to: '/tracking?tab=ads' },
];

const crmLinks = [
  { label: 'Leads', icon: IconUsers, to: '/crm/leads' },
];

const automationLinks = [
  { label: 'Automacoes', icon: IconRobot, to: '/automations' },
];

const settingsLinks = [
  { label: 'Dominios', icon: IconWorld, to: '/settings/domains' },
  { label: 'Pixels', icon: IconCode, to: '/settings/pixels' },
  { label: 'Webhooks', icon: IconWebhook, to: '/settings/webhooks' },
  { label: 'Conta', icon: IconSettings, to: '/settings/account' },
];

function isActive(currentPath: string, currentSearch: string, to: string) {
  const [path, search] = to.split('?');
  if (search) {
    return currentPath === path && currentSearch.includes(search);
  }
  return currentPath === path;
}

interface SidebarProps {
  onNavClick?: () => void;
}

export default function Sidebar({ onNavClick }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleNav = (to: string) => {
    navigate(to);
    onNavClick?.();
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const renderLinks = (links: typeof mainLinks) =>
    links.map((link) => (
      <NavLink
        key={link.to}
        label={link.label}
        leftSection={<link.icon size={iconSize} />}
        active={isActive(location.pathname, location.search, link.to)}
        onClick={() => handleNav(link.to)}
        variant="light"
      />
    ));

  return (
    <Stack justify="space-between" h="100%">
      <Box>
        {renderLinks(mainLinks)}

        <Divider my="xs" />
        {renderLinks(trackingLinks)}

        <Divider my="xs" />
        <Text size="xs" fw={500} c="dimmed" px="sm" py={4}>
          CRM
        </Text>
        {renderLinks(crmLinks)}

        <Divider my="xs" />
        {renderLinks(automationLinks)}

        <Divider my="xs" />
        <Text size="xs" fw={500} c="dimmed" px="sm" py={4}>
          Configuracoes
        </Text>
        {renderLinks(settingsLinks)}
      </Box>

      <Box pb="md">
        <Divider mb="xs" />
        <NavLink
          label="Meu Perfil"
          leftSection={<IconUser size={iconSize} />}
          active={location.pathname === '/profile'}
          onClick={() => handleNav('/profile')}
          variant="light"
        />
        <NavLink
          label="Sair"
          leftSection={<IconLogout size={iconSize} />}
          onClick={handleLogout}
          variant="light"
          c="red"
        />
      </Box>
    </Stack>
  );
}
