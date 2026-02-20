import { Paper } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function AccountPage() {
  return (
    <>
      <PageHeader title="Conta" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Configuracoes da conta em desenvolvimento"
          icon={<IconSettings size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
