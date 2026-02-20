import {
  Button,
  Card,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconBuilding, IconLogout } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { useAuthStore } from '@/stores/authStore';
import { useWorkspaces, useSwitchWorkspace } from '@/hooks/useWorkspaces';

export default function ProfilePage() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { data: workspaces, isLoading } = useWorkspaces();
  const switchMutation = useSwitchWorkspace();

  const currentWorkspace = workspaces?.[0];

  const workspaceOptions = (workspaces ?? []).map((ws) => ({
    value: ws.id,
    label: ws.name,
  }));

  const handleSwitchWorkspace = (id: string | null) => {
    if (id) {
      switchMutation.mutate(id);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <>
      <PageHeader title="Meu Perfil" />

      <Stack gap="md">
        <Card withBorder radius="md" p="lg">
          <Group gap="sm" mb="md">
            <IconBuilding size={20} />
            <Title order={4}>Workspace</Title>
          </Group>
          {isLoading ? (
            <Group justify="center" p="md">
              <Loader size="sm" />
            </Group>
          ) : (
            <Stack gap="md">
              <div>
                <Text size="xs" c="dimmed">
                  Workspace atual
                </Text>
                <Text size="sm" fw={500}>
                  {currentWorkspace?.name ?? '-'}
                </Text>
              </div>
              {workspaceOptions.length > 1 && (
                <Select
                  label="Trocar Workspace"
                  data={workspaceOptions}
                  value={currentWorkspace?.id ?? null}
                  onChange={handleSwitchWorkspace}
                  disabled={switchMutation.isPending}
                />
              )}
            </Stack>
          )}
        </Card>

        <Card withBorder radius="md" p="lg">
          <Button
            color="red"
            variant="light"
            leftSection={<IconLogout size={16} />}
            onClick={handleLogout}
          >
            Sair da conta
          </Button>
        </Card>
      </Stack>
    </>
  );
}
