import { Paper } from '@mantine/core';
import { IconChartBar } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Em desenvolvimento"
          icon={<IconChartBar size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
