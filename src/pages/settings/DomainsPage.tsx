import { Paper } from '@mantine/core';
import { IconWorld } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function DomainsPage() {
  return (
    <>
      <PageHeader title="Dominios" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Nenhum dominio encontrado"
          icon={<IconWorld size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
