import { Paper } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function LeadsPage() {
  return (
    <>
      <PageHeader title="Leads" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Nenhum lead encontrado"
          icon={<IconUsers size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
