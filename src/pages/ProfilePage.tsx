import { Paper } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Meu Perfil" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Perfil em desenvolvimento"
          icon={<IconUser size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
