import { Paper } from '@mantine/core';
import { IconRobot } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function AutomationsPage() {
  return (
    <>
      <PageHeader title="Automacoes" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Em breve"
          icon={<IconRobot size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
