import { Paper } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';

export default function PixelsPage() {
  return (
    <>
      <PageHeader title="Pixels" />
      <Paper withBorder p="xl" radius="md">
        <EmptyState
          message="Nenhum pixel encontrado"
          icon={<IconCode size={48} color="gray" />}
        />
      </Paper>
    </>
  );
}
